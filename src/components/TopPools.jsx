import React from 'react';
import { useData } from '../contexts/DataContext';
import { ExternalLink } from 'lucide-react';

export function TopPools() {
  const { pools } = useData();
  
  const topPools = pools.slice(0, 5);

  return (
    <div className="space-y-4">
      {topPools.map((pool) => (
        <div key={pool.poolId} className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
              {pool.assetPair.split('/')[0].slice(0, 2)}
            </div>
            <div>
              <p className="font-medium text-white">{pool.assetPair}</p>
              <p className="text-sm text-white/60">{pool.protocol}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-medium text-white">${pool.price}</p>
            <p className="text-sm text-white/60">{pool.liquidity}</p>
          </div>
          <ExternalLink className="w-4 h-4 text-white/60 hover:text-white cursor-pointer" />
        </div>
      ))}
    </div>
  );
}