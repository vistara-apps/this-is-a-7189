/**
 * @fileoverview Wallet service for handling wallet interactions
 */

import { getPublicClient, getWalletClient } from '@wagmi/core';
import { parseEther, parseUnits, formatEther, formatUnits } from 'viem';
import { transactions } from './transactions';

/**
 * Get the wallet client for the current connected wallet
 * @returns {Promise<Object>} - Wallet client
 */
const getWallet = async () => {
  try {
    const walletClient = await getWalletClient();
    if (!walletClient) {
      throw new Error('No wallet connected');
    }
    return walletClient;
  } catch (error) {
    console.error('Error getting wallet client:', error);
    throw error;
  }
};

/**
 * Get the public client for the current chain
 * @returns {Object} - Public client
 */
const getPublic = () => {
  try {
    const publicClient = getPublicClient();
    if (!publicClient) {
      throw new Error('No public client available');
    }
    return publicClient;
  } catch (error) {
    console.error('Error getting public client:', error);
    throw error;
  }
};

/**
 * Get the balance of the connected wallet
 * @param {Object} options - Options
 * @param {string} options.address - Wallet address
 * @param {string} options.token - Token address (optional, for ERC20 tokens)
 * @returns {Promise<Object>} - Balance information
 */
const getBalance = async ({ address, token }) => {
  try {
    const publicClient = getPublic();
    
    if (!token) {
      // Get native token balance
      const balance = await publicClient.getBalance({ address });
      return {
        value: balance,
        formatted: formatEther(balance),
        symbol: 'ETH', // This would be chain-dependent in a real implementation
      };
    } else {
      // Get ERC20 token balance
      const balance = await publicClient.readContract({
        address: token,
        abi: [
          {
            inputs: [{ name: 'owner', type: 'address' }],
            name: 'balanceOf',
            outputs: [{ name: 'balance', type: 'uint256' }],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [],
            name: 'decimals',
            outputs: [{ name: '', type: 'uint8' }],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [],
            name: 'symbol',
            outputs: [{ name: '', type: 'string' }],
            stateMutability: 'view',
            type: 'function',
          },
        ],
        functionName: 'balanceOf',
        args: [address],
      });
      
      const decimals = await publicClient.readContract({
        address: token,
        abi: [
          {
            inputs: [],
            name: 'decimals',
            outputs: [{ name: '', type: 'uint8' }],
            stateMutability: 'view',
            type: 'function',
          },
        ],
        functionName: 'decimals',
      });
      
      const symbol = await publicClient.readContract({
        address: token,
        abi: [
          {
            inputs: [],
            name: 'symbol',
            outputs: [{ name: '', type: 'string' }],
            stateMutability: 'view',
            type: 'function',
          },
        ],
        functionName: 'symbol',
      });
      
      return {
        value: balance,
        formatted: formatUnits(balance, decimals),
        symbol,
      };
    }
  } catch (error) {
    console.error('Error getting balance:', error);
    throw error;
  }
};

/**
 * Send a transaction
 * @param {Object} options - Transaction options
 * @param {string} options.to - Recipient address
 * @param {string} options.value - Amount to send (in ETH)
 * @param {string} options.data - Transaction data (optional)
 * @returns {Promise<Object>} - Transaction receipt
 */
const sendTransaction = async ({ to, value, data = '0x' }) => {
  try {
    const walletClient = await getWallet();
    const publicClient = getPublic();
    
    // Prepare transaction
    const tx = {
      to,
      value: parseEther(value),
      data,
    };
    
    // Send transaction
    const hash = await walletClient.sendTransaction(tx);
    
    // Wait for transaction to be mined
    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    
    return {
      hash,
      receipt,
      status: receipt.status === 'success' ? 'success' : 'failed',
    };
  } catch (error) {
    console.error('Error sending transaction:', error);
    throw error;
  }
};

/**
 * Connect to a liquidity pool
 * @param {Object} pool - Pool information
 * @returns {Promise<Object>} - Connection result
 */
const connectToPool = async (pool) => {
  try {
    // In a real implementation, this would interact with the pool contract
    // For this demo, we're just simulating a successful connection
    
    // Simulate a delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      message: `Successfully connected to ${pool.protocol} pool for ${pool.assetPair}`,
    };
  } catch (error) {
    console.error('Error connecting to pool:', error);
    throw error;
  }
};

/**
 * Swap tokens using a specific route
 * @param {Object} options - Swap options
 * @param {string} options.fromToken - Source token
 * @param {string} options.toToken - Destination token
 * @param {string} options.amount - Amount to swap
 * @param {Object} options.route - Route to use
 * @returns {Promise<Object>} - Swap result
 */
const swapTokens = async ({ fromToken, toToken, amount, route }) => {
  try {
    // In a real implementation, this would interact with the DEX contracts
    // For this demo, we're just simulating a successful swap
    
    // Simulate a delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return {
      success: true,
      message: `Successfully swapped ${amount} ${fromToken} to ${toToken} using ${route.protocol}`,
      txHash: `0x${Math.random().toString(16).substring(2, 42)}`,
    };
  } catch (error) {
    console.error('Error swapping tokens:', error);
    throw error;
  }
};

export default {
  getWallet,
  getPublic,
  getBalance,
  sendTransaction,
  connectToPool,
  swapTokens,
  ...transactions,
};

