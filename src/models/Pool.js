/**
 * @fileoverview Pool model
 */

/**
 * Pool class representing a liquidity pool
 */
export class Pool {
  /**
   * Create a new Pool
   * @param {Object} data - Pool data
   * @param {string} data.poolId - Unique identifier for the pool
   * @param {string} data.protocol - Protocol name (e.g., 'Uniswap V3')
   * @param {string} data.assetPair - Trading pair (e.g., 'ETH/USDC')
   * @param {string} data.chainId - Blockchain network ID
   * @param {string} data.liquidity - Total liquidity in USD
   * @param {string} [data.price] - Current price of the trading pair
   * @param {number} [data.apr] - Annual percentage rate
   */
  constructor({ poolId, protocol, assetPair, chainId, liquidity, price, apr }) {
    this.poolId = poolId;
    this.protocol = protocol;
    this.assetPair = assetPair;
    this.chainId = chainId;
    this.liquidity = liquidity;
    this.price = price;
    this.apr = apr;
  }

  /**
   * Get the tokens in the pool
   * @returns {Array<string>} - Array of token symbols
   */
  getTokens() {
    return this.assetPair.split('/');
  }

  /**
   * Get the base token
   * @returns {string} - Base token symbol
   */
  getBaseToken() {
    return this.getTokens()[0];
  }

  /**
   * Get the quote token
   * @returns {string} - Quote token symbol
   */
  getQuoteToken() {
    return this.getTokens()[1];
  }

  /**
   * Check if pool contains a specific token
   * @param {string} token - Token symbol
   * @returns {boolean} - Whether pool contains the token
   */
  containsToken(token) {
    return this.getTokens().includes(token);
  }

  /**
   * Format liquidity for display
   * @returns {string} - Formatted liquidity
   */
  formatLiquidity() {
    return this.liquidity.startsWith('$') ? this.liquidity : `$${this.liquidity}`;
  }

  /**
   * Convert pool to JSON
   * @returns {Object} - JSON representation of pool
   */
  toJSON() {
    return {
      poolId: this.poolId,
      protocol: this.protocol,
      assetPair: this.assetPair,
      chainId: this.chainId,
      liquidity: this.liquidity,
      price: this.price,
      apr: this.apr,
    };
  }

  /**
   * Create a pool from JSON
   * @param {Object} json - JSON representation of pool
   * @returns {Pool} - Pool instance
   */
  static fromJSON(json) {
    return new Pool(json);
  }

  /**
   * Get pool contract address (mock implementation)
   * @returns {string} - Pool contract address
   */
  getContractAddress() {
    // In a real implementation, this would return the actual contract address
    return `0x${this.poolId.padStart(40, '0')}`;
  }

  /**
   * Get pool URL for external explorer
   * @returns {string} - Pool URL
   */
  getExplorerUrl() {
    const chainExplorerUrls = {
      'Ethereum': 'https://etherscan.io',
      'Polygon': 'https://polygonscan.com',
      'Arbitrum': 'https://arbiscan.io',
      'Optimism': 'https://optimistic.etherscan.io',
      'Base': 'https://basescan.org',
    };
    
    const baseUrl = chainExplorerUrls[this.chainId] || 'https://etherscan.io';
    return `${baseUrl}/address/${this.getContractAddress()}`;
  }
}

