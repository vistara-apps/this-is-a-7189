/**
 * @fileoverview SavedPool model
 */

/**
 * SavedPool class representing a saved pool for a user
 */
export class SavedPool {
  /**
   * Create a new SavedPool
   * @param {Object} data - SavedPool data
   * @param {string} data.savedPoolId - Unique identifier for the saved pool
   * @param {string} data.userId - User ID who saved the pool
   * @param {string} data.poolId - ID of the saved pool
   */
  constructor({ savedPoolId, userId, poolId }) {
    this.savedPoolId = savedPoolId;
    this.userId = userId;
    this.poolId = poolId;
  }

  /**
   * Convert saved pool to JSON
   * @returns {Object} - JSON representation of saved pool
   */
  toJSON() {
    return {
      savedPoolId: this.savedPoolId,
      userId: this.userId,
      poolId: this.poolId,
    };
  }

  /**
   * Create a saved pool from JSON
   * @param {Object} json - JSON representation of saved pool
   * @returns {SavedPool} - SavedPool instance
   */
  static fromJSON(json) {
    return new SavedPool(json);
  }

  /**
   * Save a pool for a user
   * @param {string} userId - User ID
   * @param {string} poolId - Pool ID
   * @returns {SavedPool} - SavedPool instance
   */
  static savePoolForUser(userId, poolId) {
    const savedPoolId = `saved_${userId}_${poolId}`;
    const savedPool = new SavedPool({ savedPoolId, userId, poolId });
    
    try {
      // Get existing saved pools
      const savedPools = SavedPool.getSavedPoolsForUser(userId);
      
      // Check if pool is already saved
      if (savedPools.some(sp => sp.poolId === poolId)) {
        return savedPools.find(sp => sp.poolId === poolId);
      }
      
      // Add new saved pool
      savedPools.push(savedPool);
      
      // Save to local storage
      localStorage.setItem(
        `saved_pools_${userId}`,
        JSON.stringify(savedPools.map(sp => sp.toJSON()))
      );
    } catch (error) {
      console.error('Error saving pool for user:', error);
    }
    
    return savedPool;
  }

  /**
   * Remove a saved pool for a user
   * @param {string} userId - User ID
   * @param {string} poolId - Pool ID
   * @returns {boolean} - Whether the pool was removed
   */
  static removeSavedPoolForUser(userId, poolId) {
    try {
      // Get existing saved pools
      const savedPools = SavedPool.getSavedPoolsForUser(userId);
      
      // Filter out the pool to remove
      const filteredPools = savedPools.filter(sp => sp.poolId !== poolId);
      
      // If no pools were removed, return false
      if (filteredPools.length === savedPools.length) {
        return false;
      }
      
      // Save to local storage
      localStorage.setItem(
        `saved_pools_${userId}`,
        JSON.stringify(filteredPools.map(sp => sp.toJSON()))
      );
      
      return true;
    } catch (error) {
      console.error('Error removing saved pool for user:', error);
      return false;
    }
  }

  /**
   * Get all saved pools for a user
   * @param {string} userId - User ID
   * @returns {Array<SavedPool>} - Array of SavedPool instances
   */
  static getSavedPoolsForUser(userId) {
    try {
      const json = localStorage.getItem(`saved_pools_${userId}`);
      if (!json) return [];
      return JSON.parse(json).map(SavedPool.fromJSON);
    } catch (error) {
      console.error('Error getting saved pools for user:', error);
      return [];
    }
  }

  /**
   * Check if a pool is saved for a user
   * @param {string} userId - User ID
   * @param {string} poolId - Pool ID
   * @returns {boolean} - Whether the pool is saved
   */
  static isPoolSavedForUser(userId, poolId) {
    const savedPools = SavedPool.getSavedPoolsForUser(userId);
    return savedPools.some(sp => sp.poolId === poolId);
  }
}

