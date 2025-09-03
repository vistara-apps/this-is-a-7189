/**
 * @fileoverview RPC API service
 */

import { createPublicClient, http } from 'viem';
import { mainnet, polygon, optimism, arbitrum, base } from 'viem/chains';

// Map chain names to viem chain objects
const chainMap = {
  'Ethereum': mainnet,
  'Polygon': polygon,
  'Optimism': optimism,
  'Arbitrum': arbitrum,
  'Base': base,
};

/**
 * Get public client for a chain
 * @param {Object} options - Options
 * @param {string} [options.chainId='Ethereum'] - Chain ID
 * @returns {Object} - Public client
 */
const getPublicClient = ({ chainId = 'Ethereum' } = {}) => {
  const chain = chainMap[chainId] || mainnet;
  
  return createPublicClient({
    chain,
    transport: http(),
  });
};

/**
 * Get gas price
 * @param {Object} options - Options
 * @param {string} [options.chainId='Ethereum'] - Chain ID
 * @returns {Promise<Object>} - Gas price
 */
const getGasPrice = async ({ chainId = 'Ethereum' } = {}) => {
  try {
    const client = getPublicClient({ chainId });
    
    // In a real implementation, this would use the RPC client
    // For this demo, we'll return mock data
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Mock gas prices based on chain
    const mockGasPrices = {
      'Ethereum': {
        slow: 25,
        standard: 30,
        fast: 35,
        rapid: 40,
      },
      'Polygon': {
        slow: 50,
        standard: 70,
        fast: 90,
        rapid: 110,
      },
      'Optimism': {
        slow: 0.1,
        standard: 0.2,
        fast: 0.3,
        rapid: 0.4,
      },
      'Arbitrum': {
        slow: 0.1,
        standard: 0.2,
        fast: 0.3,
        rapid: 0.4,
      },
      'Base': {
        slow: 0.1,
        standard: 0.2,
        fast: 0.3,
        rapid: 0.4,
      },
    };
    
    return {
      chainId,
      prices: mockGasPrices[chainId] || mockGasPrices['Ethereum'],
      unit: 'gwei',
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error getting gas price:', error);
    throw error;
  }
};

/**
 * Get token balance
 * @param {Object} options - Options
 * @param {string} options.address - Wallet address
 * @param {string} options.token - Token address
 * @param {string} [options.chainId='Ethereum'] - Chain ID
 * @returns {Promise<Object>} - Token balance
 */
const getTokenBalance = async ({ address, token, chainId = 'Ethereum' } = {}) => {
  try {
    const client = getPublicClient({ chainId });
    
    // In a real implementation, this would use the RPC client
    // For this demo, we'll return mock data
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Mock token balances
    const mockBalance = Math.random() * 100;
    
    return {
      address,
      token,
      chainId,
      balance: mockBalance.toString(),
      formatted: mockBalance.toFixed(4),
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error getting token balance:', error);
    throw error;
  }
};

/**
 * Get block information
 * @param {Object} options - Options
 * @param {string|number} [options.blockNumber='latest'] - Block number
 * @param {string} [options.chainId='Ethereum'] - Chain ID
 * @returns {Promise<Object>} - Block information
 */
const getBlock = async ({ blockNumber = 'latest', chainId = 'Ethereum' } = {}) => {
  try {
    const client = getPublicClient({ chainId });
    
    // In a real implementation, this would use the RPC client
    // For this demo, we'll return mock data
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Mock block data
    const now = new Date();
    const timestamp = Math.floor(now.getTime() / 1000);
    
    return {
      number: blockNumber === 'latest' ? 18000000 : Number(blockNumber),
      hash: `0x${Math.random().toString(16).substring(2, 66)}`,
      timestamp,
      gasUsed: Math.floor(Math.random() * 15000000) + 5000000,
      gasLimit: 30000000,
      baseFeePerGas: Math.floor(Math.random() * 30) + 10,
      transactions: Math.floor(Math.random() * 200) + 50,
    };
  } catch (error) {
    console.error('Error getting block:', error);
    throw error;
  }
};

export default {
  getPublicClient,
  getGasPrice,
  getTokenBalance,
  getBlock,
};

