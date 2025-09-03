import React, { useState } from 'react';
import { Calculator, TrendingDown, Route, AlertTriangle } from 'lucide-react';
import { Card } from './Card';
import { useData } from '../contexts/DataContext';

export function SlippageMinimizer() {
  const { pools } = useData();
  const [fromToken, setFromToken] = useState('ETH');
  const [toToken, setToToken] = useState('USDC');
  const [amount, setAmount] = useState('1.0');
  const [slippageTolerance, setSlippageTolerance] = useState('0.5');

  const calculateOptimalRoute = () => {
    // Mock calculation - in real app, this would use actual DEX aggregation algorithms
    const routes = [
      {
        protocol: 'Uniswap V3',
        price: 1834.20,
        slippage: 0.12,
        gasEstimate: 150000,
        path: ['ETH', 'USDC'],
      },
      {
        protocol: 'SushiSwap',
        price: 1832.85,
        slippage: 0.18,
        gasEstimate: 180000,
        path: ['ETH', 'USDC'],
      },
      {
        protocol: 'Curve',
        price: 1835.40,
        slippage: 0.08,
        gasEstimate: 200000,
        path: ['ETH', 'WETH', 'USDC'],
      },
    ];

    return routes.sort((a, b) => a.slippage - b.slippage);
  };

  const optimalRoutes = calculateOptimalRoute();
  const bestRoute = optimalRoutes[0];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Slippage Minimization Tool</h2>
        <p className="text-white/70">Find the best routes to minimize slippage on your trades</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trade Input */}
        <Card className="bg-white/10 backdrop-blur-md border border-white/20">
          <h3 className="text-xl font-semibold text-white mb-4">Trade Setup</h3>
          
          <div className="space-y-4">
            {/* From Token */}
            <div>
              <label className="block text-white/70 text-sm mb-2">From</label>
              <div className="flex space-x-2">
                <select
                  value={fromToken}
                  onChange={(e) => setFromToken(e.target.value)}
                  className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                >
                  <option value="ETH">ETH</option>
                  <option value="BTC">BTC</option>
                  <option value="MATIC">MATIC</option>
                </select>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Amount"
                  className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50"
                />
              </div>
            </div>

            {/* To Token */}
            <div>
              <label className="block text-white/70 text-sm mb-2">To</label>
              <select
                value={toToken}
                onChange={(e) => setToToken(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
              >
                <option value="USDC">USDC</option>
                <option value="USDT">USDT</option>
                <option value="DAI">DAI</option>
              </select>
            </div>

            {/* Slippage Tolerance */}
            <div>
              <label className="block text-white/70 text-sm mb-2">Slippage Tolerance</label>
              <div className="flex space-x-2">
                {['0.1', '0.5', '1.0'].map((value) => (
                  <button
                    key={value}
                    onClick={() => setSlippageTolerance(value)}
                    className={`px-3 py-1 rounded-lg text-sm ${
                      slippageTolerance === value
                        ? 'bg-accent text-white'
                        : 'bg-white/10 text-white/70 hover:bg-white/20'
                    }`}
                  >
                    {value}%
                  </button>
                ))}
                <input
                  type="number"
                  value={slippageTolerance}
                  onChange={(e) => setSlippageTolerance(e.target.value)}
                  className="flex-1 bg-white/10 border border-white/20 rounded-lg px-2 py-1 text-white text-sm"
                  step="0.1"
                />
              </div>
            </div>

            <button className="w-full btn-primary bg-gradient-to-r from-accent to-primary">
              <Calculator className="w-4 h-4 mr-2" />
              Calculate Best Route
            </button>
          </div>
        </Card>

        {/* Route Analysis */}
        <div className="lg:col-span-2 space-y-6">
          {/* Best Route Highlight */}
          <Card className="bg-gradient-to-r from-green-500/20 to-accent/20 border border-green-500/30">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">Recommended Route</h3>
              <div className="flex items-center space-x-2 text-green-400">
                <TrendingDown className="w-5 h-5" />
                <span className="font-medium">Lowest Slippage</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <p className="text-white/70 text-sm">Protocol</p>
                <p className="font-medium text-white">{bestRoute.protocol}</p>
              </div>
              <div>
                <p className="text-white/70 text-sm">Price</p>
                <p className="font-medium text-white">${bestRoute.price}</p>
              </div>
              <div>
                <p className="text-white/70 text-sm">Slippage</p>
                <p className="font-medium text-green-400">{bestRoute.slippage}%</p>
              </div>
              <div>
                <p className="text-white/70 text-sm">Gas</p>
                <p className="font-medium text-white">{bestRoute.gasEstimate.toLocaleString()}</p>
              </div>
            </div>

            <div className="mt-4 flex items-center space-x-2">
              <Route className="w-4 h-4 text-white/70" />
              <span className="text-white/70">Path: {bestRoute.path.join(' → ')}</span>
            </div>
          </Card>

          {/* All Routes Comparison */}
          <Card className="bg-white/10 backdrop-blur-md border border-white/20">
            <h3 className="text-xl font-semibold text-white mb-4">Route Comparison</h3>
            
            <div className="space-y-3">
              {optimalRoutes.map((route, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    index === 0
                      ? 'border-green-500/30 bg-green-500/10'
                      : 'border-white/20 bg-white/5'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {route.protocol.slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-medium text-white">{route.protocol}</p>
                        <p className="text-sm text-white/60">{route.path.join(' → ')}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-medium text-white">${route.price}</p>
                      <p className={`text-sm ${route.slippage <= 0.1 ? 'text-green-400' : route.slippage <= 0.2 ? 'text-yellow-400' : 'text-red-400'}`}>
                        {route.slippage}% slippage
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Slippage Warning */}
          <Card className="bg-yellow-500/20 border border-yellow-500/30">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
              <div>
                <h4 className="font-medium text-white mb-1">Slippage Notice</h4>
                <p className="text-white/70 text-sm">
                  Actual slippage may vary based on market conditions and trade size. 
                  Consider splitting large trades to minimize price impact.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}