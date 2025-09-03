/**
 * @fileoverview Transaction utilities for wallet interactions
 */

import { parseEther, parseUnits, formatEther, formatUnits } from 'viem';

/**
 * Estimate gas for a transaction
 * @param {Object} options - Transaction options
 * @param {string} options.to - Recipient address
 * @param {string} options.value - Amount to send (in ETH)
 * @param {string} options.data - Transaction data (optional)
 * @param {Object} options.publicClient - Public client
 * @returns {Promise<bigint>} - Estimated gas
 */
const estimateGas = async ({ to, value, data = '0x', publicClient }) => {
  try {
    const gasEstimate = await publicClient.estimateGas({
      to,
      value: parseEther(value),
      data,
    });
    
    return gasEstimate;
  } catch (error) {
    console.error('Error estimating gas:', error);
    throw error;
  }
};

/**
 * Get the current gas price
 * @param {Object} publicClient - Public client
 * @returns {Promise<Object>} - Gas price information
 */
const getGasPrice = async (publicClient) => {
  try {
    const gasPrice = await publicClient.getGasPrice();
    
    return {
      value: gasPrice,
      formatted: formatUnits(gasPrice, 9), // Convert to Gwei
      unit: 'gwei',
    };
  } catch (error) {
    console.error('Error getting gas price:', error);
    throw error;
  }
};

/**
 * Sign a message
 * @param {Object} options - Options
 * @param {string} options.message - Message to sign
 * @param {Object} options.walletClient - Wallet client
 * @returns {Promise<string>} - Signature
 */
const signMessage = async ({ message, walletClient }) => {
  try {
    const signature = await walletClient.signMessage({
      message,
    });
    
    return signature;
  } catch (error) {
    console.error('Error signing message:', error);
    throw error;
  }
};

/**
 * Approve token spending
 * @param {Object} options - Options
 * @param {string} options.token - Token address
 * @param {string} options.spender - Spender address
 * @param {string} options.amount - Amount to approve
 * @param {Object} options.walletClient - Wallet client
 * @param {Object} options.publicClient - Public client
 * @returns {Promise<Object>} - Transaction receipt
 */
const approveToken = async ({ token, spender, amount, walletClient, publicClient }) => {
  try {
    // Get token decimals
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
    
    // Prepare transaction
    const data = {
      address: token,
      abi: [
        {
          inputs: [
            { name: 'spender', type: 'address' },
            { name: 'amount', type: 'uint256' },
          ],
          name: 'approve',
          outputs: [{ name: '', type: 'bool' }],
          stateMutability: 'nonpayable',
          type: 'function',
        },
      ],
      functionName: 'approve',
      args: [spender, parseUnits(amount, decimals)],
    };
    
    // Send transaction
    const hash = await walletClient.writeContract(data);
    
    // Wait for transaction to be mined
    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    
    return {
      hash,
      receipt,
      status: receipt.status === 'success' ? 'success' : 'failed',
    };
  } catch (error) {
    console.error('Error approving token:', error);
    throw error;
  }
};

/**
 * Get transaction history for an address
 * @param {Object} options - Options
 * @param {string} options.address - Address to get history for
 * @param {Object} options.publicClient - Public client
 * @returns {Promise<Array>} - Transaction history
 */
const getTransactionHistory = async ({ address, publicClient }) => {
  try {
    // In a real implementation, this would fetch transaction history from an indexer or explorer API
    // For this demo, we're returning mock data
    
    return [
      {
        hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
        from: address,
        to: '0x1234567890abcdef1234567890abcdef12345678',
        value: parseEther('0.1'),
        timestamp: Date.now() - 3600000, // 1 hour ago
        status: 'success',
      },
      {
        hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
        from: '0x1234567890abcdef1234567890abcdef12345678',
        to: address,
        value: parseEther('0.05'),
        timestamp: Date.now() - 86400000, // 1 day ago
        status: 'success',
      },
    ];
  } catch (error) {
    console.error('Error getting transaction history:', error);
    throw error;
  }
};

export const transactions = {
  estimateGas,
  getGasPrice,
  signMessage,
  approveToken,
  getTransactionHistory,
};

