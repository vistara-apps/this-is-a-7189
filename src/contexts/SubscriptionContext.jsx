import React, { createContext, useContext, useState } from 'react';

const SubscriptionContext = createContext();

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}

export function SubscriptionProvider({ children }) {
  const [subscription, setSubscription] = useState({
    tier: 'free', // 'free', 'pro', 'premium'
    features: {
      maxPools: 10,
      realTimeData: false,
      advancedAnalytics: false,
      prioritySupport: false,
    },
  });

  const upgradeSubscription = (newTier) => {
    const tierConfigs = {
      free: {
        tier: 'free',
        features: {
          maxPools: 10,
          realTimeData: false,
          advancedAnalytics: false,
          prioritySupport: false,
        },
      },
      pro: {
        tier: 'pro',
        features: {
          maxPools: 100,
          realTimeData: true,
          advancedAnalytics: false,
          prioritySupport: false,
        },
      },
      premium: {
        tier: 'premium',
        features: {
          maxPools: -1, // unlimited
          realTimeData: true,
          advancedAnalytics: true,
          prioritySupport: true,
        },
      },
    };

    setSubscription(tierConfigs[newTier]);
  };

  const hasFeature = (feature) => {
    return subscription.features[feature];
  };

  return (
    <SubscriptionContext.Provider value={{
      subscription,
      upgradeSubscription,
      hasFeature,
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
}