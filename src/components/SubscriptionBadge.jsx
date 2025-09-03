import React from 'react';
import { Crown, Star } from 'lucide-react';
import { useSubscription } from '../contexts/SubscriptionContext';

export function SubscriptionBadge() {
  const { subscription, upgradeSubscription } = useSubscription();

  const getBadgeConfig = () => {
    switch (subscription.tier) {
      case 'premium':
        return {
          icon: Crown,
          text: 'Premium',
          className: 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white',
        };
      case 'pro':
        return {
          icon: Star,
          text: 'Pro',
          className: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
        };
      default:
        return {
          icon: null,
          text: 'Free',
          className: 'bg-gray-600 text-white',
        };
    }
  };

  const config = getBadgeConfig();
  const Icon = config.icon;

  return (
    <div className="flex items-center space-x-2">
      <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${config.className}`}>
        {Icon && <Icon className="w-3 h-3" />}
        <span>{config.text}</span>
      </div>
      
      {subscription.tier === 'free' && (
        <button
          onClick={() => upgradeSubscription('pro')}
          className="text-xs text-white/70 hover:text-white underline"
        >
          Upgrade
        </button>
      )}
    </div>
  );
}