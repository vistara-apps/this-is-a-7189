import React, { useState } from 'react';
import { AppLayout } from './components/AppLayout';
import { Dashboard } from './components/Dashboard';
import { PoolExplorer } from './components/PoolExplorer';
import { PriceAggregation } from './components/PriceAggregation';
import { SlippageMinimizer } from './components/SlippageMinimizer';
import { SubscriptionProvider } from './contexts/SubscriptionContext';
import { DataProvider } from './contexts/DataContext';

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
    <SubscriptionProvider>
      <DataProvider>
        <AppLayout activeTab={activeTab} setActiveTab={setActiveTab}>
          {renderContent()}
        </AppLayout>
      </DataProvider>
    </SubscriptionProvider>
  );
}

export default App;