import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  fetchTokenPrices, 
  fetchLiquidityPools, 
  calculateOptimalRoute 
} from '../services/api';

const DataContext = createContext();

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}

export function DataProvider({ children }) {
  const [prices, setPrices] = useState([]);
  const [pools, setPools] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savedPools, setSavedPools] = useState([]);
  const [optimalRoutes, setOptimalRoutes] = useState([]);

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch prices and pools in parallel
        const [pricesData, poolsData] = await Promise.all([
          fetchTokenPrices(),
          fetchLiquidityPools()
        ]);
        
        setPrices(pricesData);
        setPools(poolsData);
      } catch (err) {
        console.error('Error loading initial data:', err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadInitialData();
    
    // Load saved pools from local storage
    const loadSavedPools = () => {
      try {
        const saved = localStorage.getItem('savedPools');
        if (saved) {
          setSavedPools(JSON.parse(saved));
        }
      } catch (err) {
        console.error('Error loading saved pools:', err);
      }
    };
    
    loadSavedPools();
  }, []);

  // Refresh prices
  const refreshPrices = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const pricesData = await fetchTokenPrices({ skipCache: true });
      setPrices(pricesData);
    } catch (err) {
      console.error('Error refreshing prices:', err);
      setError('Failed to refresh prices. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh pools
  const refreshPools = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const poolsData = await fetchLiquidityPools({ skipCache: true });
      setPools(poolsData);
    } catch (err) {
      console.error('Error refreshing pools:', err);
      setError('Failed to refresh pools. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Save a pool to user's saved pools
  const savePool = (poolId) => {
    if (savedPools.includes(poolId)) return;
    
    const newSavedPools = [...savedPools, poolId];
    setSavedPools(newSavedPools);
    
    try {
      localStorage.setItem('savedPools', JSON.stringify(newSavedPools));
    } catch (err) {
      console.error('Error saving pool:', err);
    }
  };

  // Remove a pool from user's saved pools
  const removePool = (poolId) => {
    const newSavedPools = savedPools.filter(id => id !== poolId);
    setSavedPools(newSavedPools);
    
    try {
      localStorage.setItem('savedPools', JSON.stringify(newSavedPools));
    } catch (err) {
      console.error('Error removing pool:', err);
    }
  };

  // Get optimal routes for a trade
  const getOptimalRoutes = async (fromToken, toToken, amount) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const routes = await calculateOptimalRoute({ fromToken, toToken, amount });
      setOptimalRoutes(routes);
      return routes;
    } catch (err) {
      console.error('Error calculating optimal routes:', err);
      setError('Failed to calculate routes. Please try again later.');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Real-time price updates (simulated)
  useEffect(() => {
    if (prices.length === 0) return;
    
    const interval = setInterval(() => {
      if (!isLoading) {
        refreshPrices();
      }
    }, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, [prices, isLoading]);

  return (
    <DataContext.Provider value={{
      prices,
      pools,
      isLoading,
      error,
      savedPools,
      optimalRoutes,
      refreshPrices,
      refreshPools,
      savePool,
      removePool,
      getOptimalRoutes,
    }}>
      {children}
    </DataContext.Provider>
  );
}
