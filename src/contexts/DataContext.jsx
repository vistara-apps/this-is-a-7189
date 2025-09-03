import React, { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}

// Mock data - in real app, this would come from Airstack API
const mockPrices = [
  {
    symbol: 'ETH',
    name: 'Ethereum',
    price: '1834.20',
    change24h: 2.4,
    chain: 'Ethereum',
    bestExchange: 'Uniswap V3',
  },
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    price: '42150.00',
    change24h: -1.2,
    chain: 'Ethereum',
    bestExchange: 'SushiSwap',
  },
  {
    symbol: 'MATIC',
    name: 'Polygon',
    price: '0.85',
    change24h: 5.7,
    chain: 'Polygon',
    bestExchange: 'QuickSwap',
  },
  {
    symbol: 'ARB',
    name: 'Arbitrum',
    price: '1.23',
    change24h: -0.8,
    chain: 'Arbitrum',
    bestExchange: 'Camelot',
  },
  {
    symbol: 'OP',
    name: 'Optimism',
    price: '2.15',
    change24h: 3.2,
    chain: 'Optimism',
    bestExchange: 'Velodrome',
  },
];

const mockPools = [
  {
    poolId: '1',
    protocol: 'Uniswap V3',
    assetPair: 'ETH/USDC',
    chainId: 'Ethereum',
    liquidity: '$125.2M',
    price: '1834.20',
    apr: 12.5,
  },
  {
    poolId: '2',
    protocol: 'SushiSwap',
    assetPair: 'BTC/USDC',
    chainId: 'Ethereum',
    liquidity: '$89.7M',
    price: '42150.00',
    apr: 8.3,
  },
  {
    poolId: '3',
    protocol: 'QuickSwap',
    assetPair: 'MATIC/USDC',
    chainId: 'Polygon',
    liquidity: '$45.8M',
    price: '0.85',
    apr: 15.2,
  },
  {
    poolId: '4',
    protocol: 'Curve',
    assetPair: 'USDC/USDT',
    chainId: 'Ethereum',
    liquidity: '$234.1M',
    price: '1.0001',
    apr: 4.7,
  },
  {
    poolId: '5',
    protocol: 'Balancer',
    assetPair: 'ETH/BAL',
    chainId: 'Ethereum',
    liquidity: '$23.5M',
    price: '1835.40',
    apr: 18.9,
  },
  {
    poolId: '6',
    protocol: 'Camelot',
    assetPair: 'ARB/USDC',
    chainId: 'Arbitrum',
    liquidity: '$67.3M',
    price: '1.23',
    apr: 22.1,
  },
];

export function DataProvider({ children }) {
  const [prices, setPrices] = useState(mockPrices);
  const [pools, setPools] = useState(mockPools);
  const [isLoading, setIsLoading] = useState(false);

  const refreshPrices = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock price updates
    const updatedPrices = prices.map(price => ({
      ...price,
      price: (parseFloat(price.price) * (1 + (Math.random() - 0.5) * 0.02)).toFixed(2),
      change24h: price.change24h + (Math.random() - 0.5) * 2,
    }));
    
    setPrices(updatedPrices);
    setIsLoading(false);
  };

  const refreshPools = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isLoading) {
        const updatedPrices = prices.map(price => ({
          ...price,
          price: (parseFloat(price.price) * (1 + (Math.random() - 0.5) * 0.001)).toFixed(2),
        }));
        setPrices(updatedPrices);
      }
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [prices, isLoading]);

  return (
    <DataContext.Provider value={{
      prices,
      pools,
      isLoading,
      refreshPrices,
      refreshPools,
    }}>
      {children}
    </DataContext.Provider>
  );
}