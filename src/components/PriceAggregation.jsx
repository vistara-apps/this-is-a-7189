import React, { useState } from 'react';
import { Search, Filter, RefreshCw } from 'lucide-react';
import { Card } from './Card';
import { useData } from '../contexts/DataContext';
import { DataTable } from './DataTable';

export function PriceAggregation() {
  const { prices, refreshPrices, isLoading } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChain, setSelectedChain] = useState('all');

  const filteredPrices = prices.filter(price => {
    const matchesSearch = price.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         price.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesChain = selectedChain === 'all' || price.chain === selectedChain;
    return matchesSearch && matchesChain;
  });

  const columns = [
    {
      header: 'Asset',
      accessorKey: 'symbol',
      cell: ({ row }) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
            {row.original.symbol.slice(0, 2)}
          </div>
          <div>
            <p className="font-medium text-white">{row.original.symbol}</p>
            <p className="text-sm text-white/60">{row.original.name}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Price',
      accessorKey: 'price',
      cell: ({ row }) => (
        <span className="font-medium text-white">${row.original.price}</span>
      ),
    },
    {
      header: '24h Change',
      accessorKey: 'change24h',
      cell: ({ row }) => (
        <span className={`font-medium ${row.original.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          {row.original.change24h >= 0 ? '+' : ''}{row.original.change24h.toFixed(2)}%
        </span>
      ),
    },
    {
      header: 'Chain',
      accessorKey: 'chain',
      cell: ({ row }) => (
        <span className="px-2 py-1 bg-white/10 rounded-full text-xs text-white/70">
          {row.original.chain}
        </span>
      ),
    },
    {
      header: 'Best Exchange',
      accessorKey: 'bestExchange',
      cell: ({ row }) => (
        <span className="text-white/70">{row.original.bestExchange}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Price Aggregation</h2>
        <p className="text-white/70">Real-time prices from multiple DEXs and protocols</p>
      </div>

      {/* Controls */}
      <Card className="bg-white/10 backdrop-blur-md border border-white/20">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
            <input
              type="text"
              placeholder="Search assets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-4">
            <select
              value={selectedChain}
              onChange={(e) => setSelectedChain(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
            >
              <option value="all">All Chains</option>
              <option value="Ethereum">Ethereum</option>
              <option value="Polygon">Polygon</option>
              <option value="Arbitrum">Arbitrum</option>
              <option value="Base">Base</option>
            </select>

            <button
              onClick={refreshPrices}
              disabled={isLoading}
              className="flex items-center space-x-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </Card>

      {/* Price Table */}
      <Card className="bg-white/10 backdrop-blur-md border border-white/20">
        <DataTable
          data={filteredPrices}
          columns={columns}
          isLoading={isLoading}
        />
      </Card>
    </div>
  );
}