/**
 * @fileoverview Type definitions for API services
 */

/**
 * @typedef {Object} Pool
 * @property {string} poolId - Unique identifier for the pool
 * @property {string} protocol - Protocol name (e.g., 'Uniswap V3')
 * @property {string} assetPair - Trading pair (e.g., 'ETH/USDC')
 * @property {string} chainId - Blockchain network ID
 * @property {string} liquidity - Total liquidity in USD
 * @property {string} [price] - Current price of the trading pair
 * @property {number} [apr] - Annual percentage rate
 */

/**
 * @typedef {Object} Price
 * @property {string} priceId - Unique identifier for the price
 * @property {string} poolId - Pool ID associated with the price
 * @property {string} price - Price value
 * @property {string} timestamp - Timestamp of the price
 */

/**
 * @typedef {Object} Token
 * @property {string} address - Token address
 * @property {string} chainId - Chain ID
 * @property {string} name - Token name
 * @property {string} symbol - Token symbol
 * @property {number} decimals - Token decimals
 * @property {string} totalSupply - Total supply
 * @property {number} marketCap - Market cap in USD
 * @property {number} price - Price in USD
 */

/**
 * @typedef {Object} GasPrice
 * @property {string} chainId - Chain ID
 * @property {Object} prices - Gas prices
 * @property {number} prices.slow - Slow gas price
 * @property {number} prices.standard - Standard gas price
 * @property {number} prices.fast - Fast gas price
 * @property {number} prices.rapid - Rapid gas price
 * @property {string} unit - Gas price unit (e.g., 'gwei')
 * @property {string} timestamp - Timestamp
 */

/**
 * @typedef {Object} Route
 * @property {Pool} route - Optimal route
 * @property {Array<Pool>} alternatives - Alternative routes
 * @property {number} estimatedOutput - Estimated output amount
 * @property {number} slippage - Estimated slippage percentage
 */

/**
 * @typedef {Object} Collection
 * @property {string} collection - Collection address
 * @property {string} chainId - Chain ID
 * @property {string} name - Collection name
 * @property {string} symbol - Collection symbol
 * @property {number} totalSupply - Total supply
 * @property {number} floorPrice - Floor price in ETH
 * @property {number} volume24h - 24-hour volume in ETH
 * @property {number} owners - Number of unique owners
 * @property {string} image - Collection image URL
 * @property {string} timestamp - Timestamp
 */

/**
 * @typedef {Object} NFT
 * @property {string} collection - Collection address
 * @property {string} tokenId - Token ID
 * @property {string} chainId - Chain ID
 * @property {string} name - Token name
 * @property {string} image - Token image URL
 * @property {Array<Object>} traits - Token traits
 * @property {Object} lastSale - Last sale information
 * @property {string} owner - Owner address
 * @property {string} timestamp - Timestamp
 */

/**
 * @typedef {Object} Sale
 * @property {string} id - Sale ID
 * @property {string} collection - Collection address
 * @property {string} tokenId - Token ID
 * @property {string} price - Sale price in ETH
 * @property {string} priceUsd - Sale price in USD
 * @property {string} seller - Seller address
 * @property {string} buyer - Buyer address
 * @property {string} timestamp - Timestamp
 * @property {string} marketplace - Marketplace name
 */

// Export empty object to make this a valid module
export default {};

