/**
 * @fileoverview Price model
 */

/**
 * Price class representing a token price
 */
export class Price {
  /**
   * Create a new Price
   * @param {Object} data - Price data
   * @param {string} data.priceId - Unique identifier for the price
   * @param {string} data.poolId - Pool ID associated with the price
   * @param {string} data.price - Price value
   * @param {string} data.timestamp - Timestamp of the price
   */
  constructor({ priceId, poolId, price, timestamp = new Date().toISOString() }) {
    this.priceId = priceId;
    this.poolId = poolId;
    this.price = price;
    this.timestamp = timestamp;
  }

  /**
   * Get price age in seconds
   * @returns {number} - Age in seconds
   */
  getAgeInSeconds() {
    const now = new Date();
    const priceTime = new Date(this.timestamp);
    return Math.floor((now - priceTime) / 1000);
  }

  /**
   * Check if price is fresh (less than 5 minutes old)
   * @returns {boolean} - Whether price is fresh
   */
  isFresh() {
    return this.getAgeInSeconds() < 300; // 5 minutes
  }

  /**
   * Format price for display
   * @param {number} [decimals=2] - Number of decimal places
   * @returns {string} - Formatted price
   */
  formatPrice(decimals = 2) {
    const numPrice = parseFloat(this.price);
    return numPrice.toFixed(decimals);
  }

  /**
   * Format price with currency symbol
   * @param {string} [currency='$'] - Currency symbol
   * @param {number} [decimals=2] - Number of decimal places
   * @returns {string} - Formatted price with currency symbol
   */
  formatWithCurrency(currency = '$', decimals = 2) {
    return `${currency}${this.formatPrice(decimals)}`;
  }

  /**
   * Convert price to JSON
   * @returns {Object} - JSON representation of price
   */
  toJSON() {
    return {
      priceId: this.priceId,
      poolId: this.poolId,
      price: this.price,
      timestamp: this.timestamp,
    };
  }

  /**
   * Create a price from JSON
   * @param {Object} json - JSON representation of price
   * @returns {Price} - Price instance
   */
  static fromJSON(json) {
    return new Price(json);
  }

  /**
   * Create a price history entry
   * @param {string} poolId - Pool ID
   * @param {string} price - Price value
   * @returns {Price} - Price instance
   */
  static createHistoryEntry(poolId, price) {
    const priceId = `price_${poolId}_${Date.now()}`;
    return new Price({ priceId, poolId, price });
  }

  /**
   * Save price history to local storage
   * @param {string} poolId - Pool ID
   * @param {Array<Price>} prices - Array of prices
   */
  static saveHistory(poolId, prices) {
    try {
      localStorage.setItem(
        `price_history_${poolId}`,
        JSON.stringify(prices.map(p => p.toJSON()))
      );
    } catch (error) {
      console.error('Error saving price history to local storage:', error);
    }
  }

  /**
   * Load price history from local storage
   * @param {string} poolId - Pool ID
   * @returns {Array<Price>} - Array of prices
   */
  static loadHistory(poolId) {
    try {
      const json = localStorage.getItem(`price_history_${poolId}`);
      if (!json) return [];
      return JSON.parse(json).map(Price.fromJSON);
    } catch (error) {
      console.error('Error loading price history from local storage:', error);
      return [];
    }
  }
}

