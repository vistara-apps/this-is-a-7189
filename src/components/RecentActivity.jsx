import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const mockActivity = [
  {
    id: 1,
    type: 'swap',
    asset: 'ETH/USDC',
    amount: '2.5 ETH',
    price: '$1,834.20',
    protocol: 'Uniswap V3',
    time: '2 mins ago',
    direction: 'up'
  },
  {
    id: 2,
    type: 'add',
    asset: 'MATIC/USDC',
    amount: '1,000 MATIC',
    price: '$0.85',
    protocol: 'QuickSwap',
    time: '5 mins ago',
    direction: 'up'
  },
  {
    id: 3,
    type: 'remove',
    asset: 'BTC/USDC',
    amount: '0.1 BTC',
    price: '$42,150',
    protocol: 'SushiSwap',
    time: '12 mins ago',
    direction: 'down'
  },
];

export function RecentActivity() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10">
            <th className="text-left py-3 px-4 text-white/70 font-medium">Asset</th>
            <th className="text-left py-3 px-4 text-white/70 font-medium">Amount</th>
            <th className="text-left py-3 px-4 text-white/70 font-medium">Price</th>
            <th className="text-left py-3 px-4 text-white/70 font-medium">Protocol</th>
            <th className="text-left py-3 px-4 text-white/70 font-medium">Time</th>
            <th className="text-left py-3 px-4 text-white/70 font-medium">Action</th>
          </tr>
        </thead>
        <tbody>
          {mockActivity.map((activity) => (
            <tr key={activity.id} className="table-row border-b border-white/5 hover:bg-white/5">
              <td className="py-3 px-4">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {activity.asset.split('/')[0].slice(0, 1)}
                  </div>
                  <span className="text-white font-medium">{activity.asset}</span>
                </div>
              </td>
              <td className="py-3 px-4 text-white">{activity.amount}</td>
              <td className="py-3 px-4 text-white">{activity.price}</td>
              <td className="py-3 px-4 text-white/70">{activity.protocol}</td>
              <td className="py-3 px-4 text-white/70">{activity.time}</td>
              <td className="py-3 px-4">
                {activity.direction === 'up' ? (
                  <ArrowUpRight className="w-4 h-4 text-green-400" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-400" />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}