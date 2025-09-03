/**
 * @fileoverview Main API service
 */

import airstackApi from './airstack';
import rpcApi from './rpc';
import reservoirApi from './reservoir';
import storage from '../storage';

// Cache TTL in milliseconds
const CACHE_TTL = {
  SHORT: 30 * 1000, // 30 seconds
  MEDIUM: 5 * 60 * 1000, // 5 minutes
  LONG: 30 * 60 * 1000, // 30 minutes
};

/**
 * Get data from cache or fetch from API
 * @param {string} key - Cache key
 * @param {Function} fetchFn - Function to fetch data
 * @param {number} ttl - Cache TTL in milliseconds
 * @returns {Promise<any>} - Data
 */
const getWithCache = async (key, fetchFn, ttl = CACHE_TTL.MEDIUM) => {
  try {
    // Check cache
    const cached = storage.getItem(key);
    
    if (cached && cached.timestamp && cached.data) {
      const now = Date.now();
      const age = now - cached.timestamp;
      
      if (age < ttl) {
        return cached.data;
      }
    }
    
    // Fetch fresh data
    const data = await fetchFn();
    
    // Cache data
    storage.setItem(key, {
      timestamp: Date.now(),
      data,
    });
    
    return data;
  } catch (error) {
    console.error(`Error in getWithCache for key ${key}:`, error);
    throw error;
  }
};

/**
 * Get pools from Airstack
 * @param {Object} options - Options
 * @param {string} [options.chainId] - Chain ID
 * @param {string} [options.protocol] - Protocol
 * @param {string} [options.assetPair] - Asset pair
 * @param {number} [options.limit=20] - Limit
 * @returns {Promise<Array>} - Pools
 */
const getPools = async ({ chainId, protocol, assetPair, limit = 20 } = {}) => {
  const cacheKey = `pools_${chainId || 'all'}_${protocol || 'all'}_${assetPair || 'all'}_${limit}`;
  
  return getWithCache(
    cacheKey,
    () => airstackApi.getPools({ chainId, protocol, assetPair, limit }),
    CACHE_TTL.MEDIUM
  );
};

/**
 * Get prices from Airstack
 * @param {Object} options - Options
 * @param {string} [options.chainId] - Chain ID
 * @param {string} [options.protocol] - Protocol
 * @param {string} [options.assetPair] - Asset pair
 * @param {number} [options.limit=20] - Limit
 * @returns {Promise<Array>} - Prices
 */
const getPrices = async ({ chainId, protocol, assetPair, limit = 20 } = {}) => {
  const cacheKey = `prices_${chainId || 'all'}_${protocol || 'all'}_${assetPair || 'all'}_${limit}`;
  
  return getWithCache(
    cacheKey,
    () => airstackApi.getPrices({ chainId, protocol, assetPair, limit }),
    CACHE_TTL.SHORT // Prices need to be fresh
  );
};

/**
 * Get token data
 * @param {Object} options - Options
 * @param {string} options.address - Token address
 * @param {string} options.chainId - Chain ID
 * @returns {Promise<Object>} - Token data
 */
const getTokenData = async ({ address, chainId }) => {
  const cacheKey = `token_${chainId}_${address}`;
  
  return getWithCache(
    cacheKey,
    () => airstackApi.getTokenData({ address, chainId }),
    CACHE_TTL.LONG
  );
};

/**
 * Get NFT data from Reservoir
 * @param {Object} options - Options
 * @param {string} options.collection - Collection address
 * @param {string} [options.chainId] - Chain ID
 * @returns {Promise<Object>} - NFT data
 */
const getNftData = async ({ collection, chainId }) => {
  const cacheKey = `nft_${chainId || 'ethereum'}_${collection}`;
  
  return getWithCache(
    cacheKey,
    () => reservoirApi.getCollection({ collection, chainId }),
    CACHE_TTL.MEDIUM
  );
};

/**
 * Get gas price
 * @param {Object} options - Options
 * @param {string} [options.chainId] - Chain ID
 * @returns {Promise<Object>} - Gas price
 */
const getGasPrice = async ({ chainId } = {}) => {
  const cacheKey = `gas_${chainId || 'ethereum'}`;
  
  return getWithCache(
    cacheKey,
    () => rpcApi.getGasPrice({ chainId }),
    CACHE_TTL.SHORT
  );
};

/**
 * Calculate optimal route for a swap
 * @param {Object} options - Options
 * @param {string} options.fromToken - Source token
 * @param {string} options.toToken - Destination token
 * @param {string} options.amount - Amount to swap
 * @param {string} [options.chainId] - Chain ID
 * @returns {Promise<Object>} - Optimal route
 */
const calculateRoute = async ({ fromToken, toToken, amount, chainId }) => {
  try {
    // Get all pools that contain both tokens
    const pools = await getPools({
      chainId,
      limit: 50,
    });
    
    const relevantPools = pools.filter(pool => {
      const tokens = pool.assetPair.split('/');
      return (
        (tokens[0] === fromToken && tokens[1] === toToken) ||
        (tokens[0] === toToken && tokens[1] === fromToken)
      );
    });
    
    if (relevantPools.length === 0) {
      throw new Error(`No pools found for ${fromToken}/${toToken}`);
    }
    
    // Get prices for all relevant pools
    const prices = await getPrices({
      chainId,
      assetPair: `${fromToken}/${toToken}`,
    });
    
    // Calculate slippage for each pool
    const poolsWithSlippage = relevantPools.map(pool => {
      const price = prices.find(p => p.poolId === pool.poolId);
      
      if (!price) {
        return {
          ...pool,
          slippage: 100, // High slippage if no price found
        };
      }
      
      // In a real implementation, this would calculate actual slippage
      // based on pool liquidity and order size
      const slippage = (1000000 / parseFloat(pool.liquidity)) * parseFloat(amount);
      
      return {
        ...pool,
        price: price.price,
        slippage: Math.min(slippage, 100), // Cap at 100%
      };
    });
    
    // Sort by slippage (lowest first)
    poolsWithSlippage.sort((a, b) => a.slippage - b.slippage);
    
    // Return the best route
    return {
      route: poolsWithSlippage[0],
      alternatives: poolsWithSlippage.slice(1, 3),
      estimatedOutput: parseFloat(amount) / parseFloat(poolsWithSlippage[0].price),
      slippage: poolsWithSlippage[0].slippage,
    };
  } catch (error) {
    console.error('Error calculating route:', error);
    throw error;
  }
};

export default {
  getPools,
  getPrices,
  getTokenData,
  getNftData,
  getGasPrice,
  calculateRoute,
};

