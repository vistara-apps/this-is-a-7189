import React from 'react';
import { BarChart3, TrendingUp, Droplets, Zap } from 'lucide-react';
import { Card } from './Card';
import { PriceChart } from './PriceChart';
import { TopPools } from './TopPools';
import { RecentActivity } from './RecentActivity';
import { useData } from '../contexts/DataContext';

export function Dashboard() {
  const { prices, pools } = useData();

  const stats = [
    {
      title: 'Total Pools Tracked',
      value: pools.length.toLocaleString(),
      change: '+12%',
      icon: Droplets,
      color: 'text-blue-500',
    },
    {
      title: 'Best Price Found',
      value: '$1,834.20',
      change: '+2.4%',
      icon: TrendingUp,
      color: 'text-green-500',
    },
    {
      title: 'Avg Slippage Saved',
      value: '0.23%',
      change: '-0.05%',
      icon: Zap,
      color: 'text-purple-500',
    },
    {
      title: 'Active Protocols',
      value: '24',
      change: '+3',
      icon: BarChart3,
      color: 'text-orange-500',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Section */}
      <div className="text-center py-12">
        <h2 className="text-5xl font-extrabold text-white mb-4">
          Your All-in-One Hub for Seamless
        </h2>
        <p className="text-xl text-white/80 mb-8">
          Crypto Liquidity Discovery & Execution
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="btn-primary bg-gradient-to-r from-accent to-primary">
            Explore Pools
          </button>
          <button className="btn-secondary bg-white/10 text-white border border-white/20 hover:bg-white/20">
            View Analytics
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="bg-white/10 backdrop-blur-md border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm">{stat.title}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className={`text-sm ${stat.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                    {stat.change} from last week
                  </p>
                </div>
                <div className={`p-3 rounded-lg bg-white/10 ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Price Chart */}
        <div className="lg:col-span-2">
          <Card className="bg-white/10 backdrop-blur-md border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Price Trends</h3>
              <select className="bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-white text-sm">
                <option value="ETH">ETH/USDC</option>
                <option value="BTC">BTC/USDC</option>
                <option value="MATIC">MATIC/USDC</option>
              </select>
            </div>
            <PriceChart />
          </Card>
        </div>

        {/* Top Pools */}
        <div>
          <Card className="bg-white/10 backdrop-blur-md border border-white/20">
            <h3 className="text-xl font-semibold text-white mb-6">Top Pools</h3>
            <TopPools />
          </Card>
        </div>
      </div>

      {/* Recent Activity */}
      <Card className="bg-white/10 backdrop-blur-md border border-white/20">
        <h3 className="text-xl font-semibold text-white mb-6">Recent Activity</h3>
        <RecentActivity />
      </Card>
    </div>
  );
}