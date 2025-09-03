/**
 * @fileoverview User model
 */

/**
 * User class representing a user in the system
 */
export class User {
  /**
   * Create a new User
   * @param {Object} data - User data
   * @param {string} data.userId - Unique identifier for the user
   * @param {string} data.email - User's email address
   * @param {string} data.subscriptionTier - Subscription tier ('free', 'pro', 'premium')
   * @param {string} data.createdAt - Account creation timestamp
   */
  constructor({ userId, email, subscriptionTier = 'free', createdAt = new Date().toISOString() }) {
    this.userId = userId;
    this.email = email;
    this.subscriptionTier = subscriptionTier;
    this.createdAt = createdAt;
  }

  /**
   * Get user's subscription tier
   * @returns {string} - Subscription tier
   */
  getSubscriptionTier() {
    return this.subscriptionTier;
  }

  /**
   * Upgrade user's subscription tier
   * @param {string} tier - New subscription tier
   */
  upgradeSubscription(tier) {
    if (!['free', 'pro', 'premium'].includes(tier)) {
      throw new Error(`Invalid subscription tier: ${tier}`);
    }
    this.subscriptionTier = tier;
  }

  /**
   * Check if user has access to a feature
   * @param {string} feature - Feature to check
   * @returns {boolean} - Whether user has access to the feature
   */
  hasFeatureAccess(feature) {
    const tierFeatures = {
      free: ['basic_price_aggregation', 'limited_pools'],
      pro: ['basic_price_aggregation', 'limited_pools', 'real_time_data', 'all_pools'],
      premium: ['basic_price_aggregation', 'limited_pools', 'real_time_data', 'all_pools', 'advanced_analytics', 'priority_support'],
    };

    return tierFeatures[this.subscriptionTier]?.includes(feature) || false;
  }

  /**
   * Convert user to JSON
   * @returns {Object} - JSON representation of user
   */
  toJSON() {
    return {
      userId: this.userId,
      email: this.email,
      subscriptionTier: this.subscriptionTier,
      createdAt: this.createdAt,
    };
  }

  /**
   * Create a user from JSON
   * @param {Object} json - JSON representation of user
   * @returns {User} - User instance
   */
  static fromJSON(json) {
    return new User(json);
  }

  /**
   * Save user to local storage
   */
  save() {
    try {
      localStorage.setItem(`user_${this.userId}`, JSON.stringify(this.toJSON()));
    } catch (error) {
      console.error('Error saving user to local storage:', error);
    }
  }

  /**
   * Load user from local storage
   * @param {string} userId - User ID
   * @returns {User|null} - User instance or null if not found
   */
  static load(userId) {
    try {
      const json = localStorage.getItem(`user_${userId}`);
      if (!json) return null;
      return User.fromJSON(JSON.parse(json));
    } catch (error) {
      console.error('Error loading user from local storage:', error);
      return null;
    }
  }
}

