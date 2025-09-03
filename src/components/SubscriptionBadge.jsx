import React, { useState } from 'react';
import { Crown, Star } from 'lucide-react';
import { useSubscription } from '../contexts/SubscriptionContext';
import { SubscriptionModal } from './SubscriptionModal';

export function SubscriptionBadge() {
  const { subscription } = useSubscription();
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="flex items-center space-x-2">
        <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${config.className}`}>
          {Icon && <Icon className="w-3 h-3" />}
          <span>{config.text}</span>
        </div>
        
        <button
          onClick={openModal}
          className="text-xs text-white/70 hover:text-white underline"
        >
          {subscription.tier === 'free' ? 'Upgrade' : 'Manage'}
        </button>
      </div>
      
      <SubscriptionModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
}
