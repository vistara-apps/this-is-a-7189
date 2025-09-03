/**
 * @fileoverview Storage service for handling local storage operations
 */

/**
 * Check if local storage is available
 * @returns {boolean} - Whether local storage is available
 */
const isLocalStorageAvailable = () => {
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * In-memory fallback storage when localStorage is not available
 */
const memoryStorage = new Map();

/**
 * Get an item from storage
 * @param {string} key - Storage key
 * @returns {any} - Stored value or null if not found
 */
const getItem = (key) => {
  try {
    if (isLocalStorageAvailable()) {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } else {
      return memoryStorage.get(key) || null;
    }
  } catch (error) {
    console.error('Error getting item from storage:', error);
    return null;
  }
};

/**
 * Set an item in storage
 * @param {string} key - Storage key
 * @param {any} value - Value to store
 * @returns {boolean} - Whether the operation was successful
 */
const setItem = (key, value) => {
  try {
    const serializedValue = JSON.stringify(value);
    
    if (isLocalStorageAvailable()) {
      localStorage.setItem(key, serializedValue);
    } else {
      memoryStorage.set(key, value);
    }
    
    return true;
  } catch (error) {
    console.error('Error setting item in storage:', error);
    return false;
  }
};

/**
 * Remove an item from storage
 * @param {string} key - Storage key
 * @returns {boolean} - Whether the operation was successful
 */
const removeItem = (key) => {
  try {
    if (isLocalStorageAvailable()) {
      localStorage.removeItem(key);
    } else {
      memoryStorage.delete(key);
    }
    
    return true;
  } catch (error) {
    console.error('Error removing item from storage:', error);
    return false;
  }
};

/**
 * Clear all items from storage
 * @returns {boolean} - Whether the operation was successful
 */
const clear = () => {
  try {
    if (isLocalStorageAvailable()) {
      localStorage.clear();
    } else {
      memoryStorage.clear();
    }
    
    return true;
  } catch (error) {
    console.error('Error clearing storage:', error);
    return false;
  }
};

/**
 * Get all keys in storage
 * @returns {Array<string>} - Array of storage keys
 */
const getAllKeys = () => {
  try {
    if (isLocalStorageAvailable()) {
      return Object.keys(localStorage);
    } else {
      return Array.from(memoryStorage.keys());
    }
  } catch (error) {
    console.error('Error getting all keys from storage:', error);
    return [];
  }
};

/**
 * Get all items in storage with a specific prefix
 * @param {string} prefix - Key prefix
 * @returns {Object} - Object with key-value pairs
 */
const getAllWithPrefix = (prefix) => {
  try {
    const keys = getAllKeys().filter(key => key.startsWith(prefix));
    
    return keys.reduce((result, key) => {
      result[key] = getItem(key);
      return result;
    }, {});
  } catch (error) {
    console.error('Error getting items with prefix from storage:', error);
    return {};
  }
};

/**
 * Remove all items in storage with a specific prefix
 * @param {string} prefix - Key prefix
 * @returns {boolean} - Whether the operation was successful
 */
const removeAllWithPrefix = (prefix) => {
  try {
    const keys = getAllKeys().filter(key => key.startsWith(prefix));
    
    keys.forEach(key => {
      removeItem(key);
    });
    
    return true;
  } catch (error) {
    console.error('Error removing items with prefix from storage:', error);
    return false;
  }
};

export default {
  getItem,
  setItem,
  removeItem,
  clear,
  getAllKeys,
  getAllWithPrefix,
  removeAllWithPrefix,
};

