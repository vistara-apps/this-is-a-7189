import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAccount, useNetwork, useBalance } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import walletService from '../services/wallet';
import { useNotification } from './NotificationContext';

const WalletContext = createContext();

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}

export function WalletProvider({ children }) {
  const { address, isConnected, isConnecting, isDisconnected } = useAccount();
  const { chain } = useNetwork();
  const { data: balanceData } = useBalance({ address });
  const { openConnectModal } = useConnectModal();
  const { showError, showSuccess } = useNotification();
  
  const [isLoading, setIsLoading] = useState(false);
  const [walletError, setWalletError] = useState(null);
  
  // Reset error when connection state changes
  useEffect(() => {
    if (isConnected) {
      setWalletError(null);
    }
  }, [isConnected]);
  
  // Connect to wallet
  const connect = async () => {
    try {
      if (openConnectModal) {
        openConnectModal();
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setWalletError('Failed to connect wallet. Please try again.');
      showError('Failed to connect wallet. Please try again.');
    }
  };
  
  // Connect to a liquidity pool
  const connectToPool = async (pool) => {
    try {
      setIsLoading(true);
      setWalletError(null);
      
      if (!isConnected) {
        throw new Error('Wallet not connected');
      }
      
      const result = await walletService.connectToPool(pool);
      
      if (result.success) {
        showSuccess(`Connected to ${pool.protocol} pool for ${pool.assetPair}`);
        return true;
      } else {
        throw new Error(result.message || 'Failed to connect to pool');
      }
    } catch (error) {
      console.error('Error connecting to pool:', error);
      setWalletError(error.message || 'Failed to connect to pool. Please try again.');
      showError(error.message || 'Failed to connect to pool. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Swap tokens
  const swapTokens = async ({ fromToken, toToken, amount, route }) => {
    try {
      setIsLoading(true);
      setWalletError(null);
      
      if (!isConnected) {
        throw new Error('Wallet not connected');
      }
      
      const result = await walletService.swapTokens({
        fromToken,
        toToken,
        amount,
        route,
      });
      
      if (result.success) {
        showSuccess(`Successfully swapped ${amount} ${fromToken} to ${toToken}`);
        return {
          success: true,
          txHash: result.txHash,
        };
      } else {
        throw new Error(result.message || 'Failed to swap tokens');
      }
    } catch (error) {
      console.error('Error swapping tokens:', error);
      setWalletError(error.message || 'Failed to swap tokens. Please try again.');
      showError(error.message || 'Failed to swap tokens. Please try again.');
      return {
        success: false,
        error: error.message,
      };
    } finally {
      setIsLoading(false);
    }
  };
  
  // Get formatted balance
  const getFormattedBalance = () => {
    if (!balanceData) return '0.00';
    return parseFloat(balanceData.formatted).toFixed(4);
  };
  
  return (
    <WalletContext.Provider value={{
      address,
      isConnected,
      isConnecting,
      isDisconnected,
      isLoading,
      chain,
      balance: balanceData,
      formattedBalance: getFormattedBalance(),
      walletError,
      connect,
      connectToPool,
      swapTokens,
    }}>
      {children}
    </WalletContext.Provider>
  );
}

