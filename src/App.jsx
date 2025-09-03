import React, { useState } from 'react';
import { AppLayout } from './components/AppLayout';
import { Dashboard } from './components/Dashboard';
import { PoolExplorer } from './components/PoolExplorer';
import { PriceAggregation } from './components/PriceAggregation';
import { SlippageMinimizer } from './components/SlippageMinimizer';
import { SubscriptionProvider } from './contexts/SubscriptionContext';
import { DataProvider } from './contexts/DataContext';
import { WalletProvider } from './contexts/WalletContext';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { createConfig, WagmiConfig } from 'wagmi';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, polygon, optimism, arbitrum, base } from 'wagmi/chains';
import '@rainbow-me/rainbowkit/styles.css';

// Configure chains & providers
const config = createConfig(
  getDefaultConfig({
    appName: 'LiquiditySync',
    projectId: 'YOUR_WALLETCONNECT_PROJECT_ID', // Replace with your WalletConnect project ID
    chains: [mainnet, polygon, optimism, arbitrum, base],
    ssr: false, // Required for Next.js apps
  })
);

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'prices':
        return <PriceAggregation />;
      case 'pools':
        return <PoolExplorer />;
      case 'slippage':
        return <SlippageMinimizer />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <ErrorBoundary>
      <WagmiConfig config={config}>
        <NotificationProvider>
          <SubscriptionProvider>
            <WalletProvider>
              <AuthProvider>
                <DataProvider>
                  <AppLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                    {renderContent()}
                  </AppLayout>
                </DataProvider>
              </AuthProvider>
            </WalletProvider>
          </SubscriptionProvider>
        </NotificationProvider>
      </WagmiConfig>
    </ErrorBoundary>
  );
}

export default App;
