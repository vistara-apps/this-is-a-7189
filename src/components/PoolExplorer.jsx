import React, { useState } from 'react';
import { Search, Filter, ExternalLink, Droplets } from 'lucide-react';
import { Card } from './Card';
import { useData } from '../contexts/DataContext';
import { DataTable } from './DataTable';

export function PoolExplorer() {
  const { pools } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProtocol, setSelectedProtocol] = useState('all');
  const [selectedChain, setSelectedChain] = useState('all');

  const filteredPools = pools.filter(pool => {
    const matchesSearch = pool.assetPair.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pool.protocol.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProtocol = selectedProtocol === 'all' || pool.protocol === selectedProtocol;
    const matchesChain = selectedChain === 'all' || pool.chainId === selectedChain;
    return matchesSearch && matchesProtocol && matchesChain;
  });

  const columns = [
    {
      header: 'Pool',
      accessorKey: 'assetPair',
      cell: ({ row }) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <Droplets className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="font-medium text-white">{row.original.assetPair}</p>
            <p className="text-sm text-white/60">{row.original.protocol}</p>
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
      header: 'Liquidity',
      accessorKey: 'liquidity',
      cell: ({ row }) => (
        <span className="text-white">{row.original.liquidity}</span>
      ),
    },
    {
      header: 'APR',
      accessorKey: 'apr',
      cell: ({ row }) => (
        <span className="text-green-400 font-medium">{row.original.apr}%</span>
      ),
    },
    {
      header: 'Chain',
      accessorKey: 'chainId',
      cell: ({ row }) => (
        <span className="px-2 py-1 bg-white/10 rounded-full text-xs text-white/70">
          {row.original.chainId}
        </span>
      ),
    },
    {
      header: 'Action',
      accessorKey: 'action',
      cell: ({ row }) => (
        <button className="flex items-center space-x-2 px-3 py-1 bg-accent/20 text-accent rounded-lg hover:bg-accent/30 transition-colors">
          <span>Connect</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      ),
    },
  ];

  const protocols = [...new Set(pools.map(pool => pool.protocol))];
  const chains = [...new Set(pools.map(pool => pool.chainId))];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Pool Explorer</h2>
        <p className="text-white/70">Discover and connect to liquidity pools across protocols</p>
      </div>

      {/* Controls */}
      <Card className="bg-white/10 backdrop-blur-md border border-white/20">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
            <input
              type="text"
              placeholder="Search pools..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <select
              value={selectedProtocol}
              onChange={(e) => setSelectedProtocol(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
            >
              <option value="all">All Protocols</option>
              {protocols.map(protocol => (
                <option key={protocol} value={protocol}>{protocol}</option>
              ))}
            </select>

            <select
              value={selectedChain}
              onChange={(e) => setSelectedChain(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
            >
              <option value="all">All Chains</option>
              {chains.map(chain => (
                <option key={chain} value={chain}>{chain}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Pool Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white/10 backdrop-blur-md border border-white/20">
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{filteredPools.length}</p>
            <p className="text-white/70">Active Pools</p>
          </div>
        </Card>
        <Card className="bg-white/10 backdrop-blur-md border border-white/20">
          <div className="text-center">
            <p className="text-2xl font-bold text-white">$2.1B</p>
            <p className="text-white/70">Total Liquidity</p>
          </div>
        </Card>
        <Card className="bg-white/10 backdrop-blur-md border border-white/20">
          <div className="text-center">
            <p className="text-2xl font-bold text-white">24</p>
            <p className="text-white/70">Protocols</p>
          </div>
        </Card>
      </div>

      {/* Pools Table */}
      <Card className="bg-white/10 backdrop-blur-md border border-white/20">
        <DataTable
          data={filteredPools}
          columns={columns}
        />
      </Card>
    </div>
  );
}