/**
 * @fileoverview Reservoir API service
 */

import axios from 'axios';

// Create Reservoir API client
const client = axios.create({
  baseURL: 'https://api.reservoir.tools',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': process.env.RESERVOIR_API_KEY || 'YOUR_RESERVOIR_API_KEY', // Replace with your API key
  },
});

/**
 * Get collection data
 * @param {Object} options - Options
 * @param {string} options.collection - Collection address
 * @param {string} [options.chainId='ethereum'] - Chain ID
 * @returns {Promise<Object>} - Collection data
 */
const getCollection = async ({ collection, chainId = 'ethereum' } = {}) => {
  try {
    // In a real implementation, this would use the Reservoir API
    // For this demo, we'll return mock data
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // Mock collection data
    const mockCollections = {
      'bayc': {
        name: 'Bored Ape Yacht Club',
        symbol: 'BAYC',
        totalSupply: 10000,
        floorPrice: 30.5,
        volume24h: 250.75,
        owners: 6000,
        image: 'https://i.seadn.io/gae/Ju9CkWtV-1Okvf45wo8UctR-M9He2PjILP0oOvxE89AyiPPGtrR3gysu1Zgy0hjd2xKIgjJJtWIc0ybj4Vd7wv8t3pxDGHoJBzDB?auto=format&w=1000',
      },
      'punk': {
        name: 'CryptoPunks',
        symbol: 'PUNK',
        totalSupply: 10000,
        floorPrice: 45.2,
        volume24h: 320.1,
        owners: 3500,
        image: 'https://i.seadn.io/gae/BdxvLseXcfl57BiuQcQYdJ64v-aI8din7WPk0Pgo3qQFhAUH-B6i-dCqqc_mCkRIzULmwzwecnohLhrcH8A9mpWIZqA7ygc52Sr81hE?auto=format&w=1000',
      },
      'azuki': {
        name: 'Azuki',
        symbol: 'AZUKI',
        totalSupply: 10000,
        floorPrice: 10.8,
        volume24h: 150.3,
        owners: 5200,
        image: 'https://i.seadn.io/gae/H8jOCJuQokNqGBpkBN5wk1oZwO7LM8bNnrHCaekV2nKjnCqw6UB5oaH8XyNeBDj6bA_n1mjejzhFQUP3O1NfjFLHr3FOaeHcTOOT?auto=format&w=1000',
      },
      'doodles': {
        name: 'Doodles',
        symbol: 'DOODLE',
        totalSupply: 10000,
        floorPrice: 5.2,
        volume24h: 80.5,
        owners: 4800,
        image: 'https://i.seadn.io/gae/7B0qai02OdHA8P_EOVK672qUliyjQdQDGNrACxs7WnTgZAkJa_wWURnIFKeOh5VTf8cfTqW3wQpozGedaC9mteKphEOtztls02RlWQ?auto=format&w=1000',
      },
    };
    
    // Determine which mock collection to return
    let mockData;
    if (collection.toLowerCase().includes('bayc') || collection.toLowerCase().includes('ape')) {
      mockData = mockCollections.bayc;
    } else if (collection.toLowerCase().includes('punk')) {
      mockData = mockCollections.punk;
    } else if (collection.toLowerCase().includes('azuki')) {
      mockData = mockCollections.azuki;
    } else if (collection.toLowerCase().includes('doodle')) {
      mockData = mockCollections.doodles;
    } else {
      // Default to a random collection
      const keys = Object.keys(mockCollections);
      mockData = mockCollections[keys[Math.floor(Math.random() * keys.length)]];
    }
    
    return {
      collection,
      chainId,
      ...mockData,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error getting collection from Reservoir:', error);
    throw error;
  }
};

/**
 * Get token data
 * @param {Object} options - Options
 * @param {string} options.collection - Collection address
 * @param {string} options.tokenId - Token ID
 * @param {string} [options.chainId='ethereum'] - Chain ID
 * @returns {Promise<Object>} - Token data
 */
const getToken = async ({ collection, tokenId, chainId = 'ethereum' } = {}) => {
  try {
    // In a real implementation, this would use the Reservoir API
    // For this demo, we'll return mock data
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Get collection data first
    const collectionData = await getCollection({ collection, chainId });
    
    // Mock token data
    return {
      collection,
      tokenId,
      chainId,
      name: `${collectionData.name} #${tokenId}`,
      image: collectionData.image,
      traits: [
        { trait_type: 'Background', value: 'Blue' },
        { trait_type: 'Eyes', value: 'Sleepy' },
        { trait_type: 'Mouth', value: 'Grin' },
        { trait_type: 'Clothes', value: 'Striped Shirt' },
      ],
      lastSale: {
        price: (Math.random() * 20 + collectionData.floorPrice * 0.8).toFixed(2),
        timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
      owner: `0x${Math.random().toString(16).substring(2, 42)}`,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error getting token from Reservoir:', error);
    throw error;
  }
};

/**
 * Get sales
 * @param {Object} options - Options
 * @param {string} [options.collection] - Collection address
 * @param {string} [options.chainId='ethereum'] - Chain ID
 * @param {number} [options.limit=20] - Limit
 * @returns {Promise<Array>} - Sales
 */
const getSales = async ({ collection, chainId = 'ethereum', limit = 20 } = {}) => {
  try {
    // In a real implementation, this would use the Reservoir API
    // For this demo, we'll return mock data
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Get collection data if provided
    let collectionData;
    if (collection) {
      collectionData = await getCollection({ collection, chainId });
    }
    
    // Generate mock sales
    return Array.from({ length: limit }, (_, i) => {
      const price = collectionData
        ? (Math.random() * 10 + collectionData.floorPrice * 0.7).toFixed(2)
        : (Math.random() * 30 + 5).toFixed(2);
      
      const timestamp = new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString();
      
      return {
        id: `sale_${i}_${Date.now()}`,
        collection: collection || `0x${Math.random().toString(16).substring(2, 42)}`,
        tokenId: Math.floor(Math.random() * 10000).toString(),
        price,
        priceUsd: (parseFloat(price) * 4000).toFixed(2), // Assuming ETH price of $4000
        seller: `0x${Math.random().toString(16).substring(2, 42)}`,
        buyer: `0x${Math.random().toString(16).substring(2, 42)}`,
        timestamp,
        marketplace: ['OpenSea', 'Blur', 'X2Y2', 'LooksRare'][Math.floor(Math.random() * 4)],
      };
    });
  } catch (error) {
    console.error('Error getting sales from Reservoir:', error);
    throw error;
  }
};

export default {
  getCollection,
  getToken,
  getSales,
};

