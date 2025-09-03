import React, { useState } from 'react';
import { X, Check, AlertTriangle } from 'lucide-react';
import { useSubscription } from '../contexts/SubscriptionContext';
import { useAuth } from '../contexts/AuthContext';

export function SubscriptionModal({ isOpen, onClose }) {
  const { subscription } = useSubscription();
  const { upgradeSubscription } = useAuth();
  const [selectedTier, setSelectedTier] = useState(subscription.tier);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  if (!isOpen) return null;
  
  const tiers = [
    {
      id: 'free',
      name: 'Free',
      price: '$0/month',
      features: [
        'Basic price aggregation',
        'Up to 10 pools',
        'Daily data updates',
      ],
      limitations: [
        'No real-time data',
        'Limited pool access',
        'No advanced analytics',
      ],
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$15/month',
      features: [
        'All Free features',
        'Real-time data updates',
        'Unlimited pools',
        'Priority data refresh',
      ],
      limitations: [
        'No advanced analytics',
        'Standard support',
      ],
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '$49/month',
      features: [
        'All Pro features',
        'Advanced analytics',
        'Priority support',
        'Custom alerts',
        'API access',
      ],
      limitations: [],
    },
  ];
  
  const handleUpgrade = async () => {
    if (selectedTier === subscription.tier) {
      onClose();
      return;
    }
    
    setIsProcessing(true);
    setError(null);
    setSuccess(false);
    
    try {
      // In a real app, this would handle payment processing
      // For this demo, we'll just update the subscription tier
      
      const result = await upgradeSubscription(selectedTier);
      
      if (result) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setError('Failed to upgrade subscription. Please try again.');
      }
    } catch (err) {
      console.error('Error upgrading subscription:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 rounded-lg shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-xl font-bold text-white">Upgrade Subscription</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-white/70 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6">
          {/* Success message */}
          {success && (
            <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg flex items-center space-x-3">
              <Check className="w-5 h-5 text-green-400" />
              <p className="text-white">Subscription upgraded successfully!</p>
            </div>
          )}
          
          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center space-x-3">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <p className="text-white">{error}</p>
            </div>
          )}
          
          {/* Subscription tiers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tiers.map((tier) => (
              <div
                key={tier.id}
                className={`p-4 rounded-lg border ${
                  selectedTier === tier.id
                    ? 'border-accent bg-accent/10'
                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                } cursor-pointer transition-colors`}
                onClick={() => setSelectedTier(tier.id)}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">{tier.name}</h3>
                  <div className={`w-4 h-4 rounded-full ${
                    selectedTier === tier.id ? 'bg-accent' : 'bg-white/20'
                  }`} />
                </div>
                
                <p className="text-2xl font-bold text-white mb-4">{tier.price}</p>
                
                <div className="space-y-4">
                  {tier.features.length > 0 && (
                    <div>
                      <p className="text-white/70 text-sm mb-2">Features:</p>
                      <ul className="space-y-2">
                        {tier.features.map((feature, index) => (
                          <li key={index} className="flex items-center space-x-2 text-white">
                            <Check className="w-4 h-4 text-green-400" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {tier.limitations.length > 0 && (
                    <div>
                      <p className="text-white/70 text-sm mb-2">Limitations:</p>
                      <ul className="space-y-2">
                        {tier.limitations.map((limitation, index) => (
                          <li key={index} className="flex items-center space-x-2 text-white/70">
                            <X className="w-4 h-4 text-red-400" />
                            <span>{limitation}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                
                {subscription.tier === tier.id && (
                  <div className="mt-4 py-1 px-3 bg-accent/20 text-accent text-sm rounded-full inline-block">
                    Current Plan
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-end p-4 border-t border-white/10 space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
          >
            Cancel
          </button>
          
          <button
            onClick={handleUpgrade}
            disabled={isProcessing || selectedTier === subscription.tier}
            className="px-4 py-2 bg-accent hover:bg-accent/80 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? 'Processing...' : selectedTier === subscription.tier ? 'Current Plan' : 'Upgrade'}
          </button>
        </div>
      </div>
    </div>
  );
}

