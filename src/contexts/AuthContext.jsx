import React, { createContext, useContext, useState, useEffect } from 'react';
import { useWallet } from './WalletContext';
import { User } from '../models/User';
import storage from '../services/storage';

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const { address, isConnected } = useWallet();
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState(null);
  
  // Load user from storage when wallet is connected
  useEffect(() => {
    if (isConnected && address) {
      loadUser(address);
    } else {
      setUser(null);
      setIsAuthenticated(false);
    }
  }, [isConnected, address]);
  
  // Load user from storage
  const loadUser = async (address) => {
    try {
      setAuthError(null);
      
      // Check if user exists in storage
      const storedUser = storage.getItem(`user_${address}`);
      
      if (storedUser) {
        // User exists, load from storage
        setUser(User.fromJSON(storedUser));
        setIsAuthenticated(true);
      } else {
        // User doesn't exist, create new user
        const newUser = new User({
          userId: address,
          email: '', // Email will be set later
          subscriptionTier: 'free',
          createdAt: new Date().toISOString(),
        });
        
        // Save user to storage
        storage.setItem(`user_${address}`, newUser.toJSON());
        
        setUser(newUser);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error loading user:', error);
      setAuthError('Failed to load user. Please try again.');
      setUser(null);
      setIsAuthenticated(false);
    }
  };
  
  // Update user profile
  const updateProfile = async (profileData) => {
    try {
      if (!user) {
        throw new Error('No user is authenticated');
      }
      
      // Update user data
      const updatedUser = new User({
        ...user,
        ...profileData,
      });
      
      // Save to storage
      storage.setItem(`user_${updatedUser.userId}`, updatedUser.toJSON());
      
      setUser(updatedUser);
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      setAuthError('Failed to update profile. Please try again.');
      return false;
    }
  };
  
  // Upgrade subscription
  const upgradeSubscription = async (tier) => {
    try {
      if (!user) {
        throw new Error('No user is authenticated');
      }
      
      // In a real app, this would handle payment processing
      // For this demo, we'll just update the user's subscription tier
      
      // Update user data
      const updatedUser = new User({
        ...user,
        subscriptionTier: tier,
      });
      
      // Save to storage
      storage.setItem(`user_${updatedUser.userId}`, updatedUser.toJSON());
      
      setUser(updatedUser);
      return true;
    } catch (error) {
      console.error('Error upgrading subscription:', error);
      setAuthError('Failed to upgrade subscription. Please try again.');
      return false;
    }
  };
  
  // Sign out
  const signOut = () => {
    setUser(null);
    setIsAuthenticated(false);
    setAuthError(null);
  };
  
  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      authError,
      updateProfile,
      upgradeSubscription,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

