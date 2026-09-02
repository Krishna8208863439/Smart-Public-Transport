import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ExecutiveDashboard } from './components/Dashboard/ExecutiveDashboard';
import { CityMap } from './components/Map/CityMap';
import { JourneyPlanner } from './components/JourneyPlanner/JourneyPlanner';
import { TrafficSignalController } from './components/Traffic/TrafficSignalController';
import { PredictiveMaintenance } from './components/Infrastructure/PredictiveMaintenance';
import { DigitalWallet } from './components/Ticketing/DigitalWallet';
import { ComplaintPortal } from './components/Complaints/ComplaintPortal';
import { EcoAnalytics } from './components/Environmental/EcoAnalytics';
import { EmergencyDispatcher } from './components/Emergency/EmergencyDispatcher';
import { UrbanAICopilot } from './components/AICopilot/UrbanAICopilot';

import { PaymentGatewayModal } from './components/Payment/PaymentGatewayModal';
import { AuthPortal } from './components/Auth/AuthPortal';

const MainContent: React.FC = () => {
  const { activeTab, userRole } = useApp();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <ExecutiveDashboard />;
      case 'map':
        return <CityMap />;
      case 'planner':
        return <JourneyPlanner />;
      case 'traffic':
        return <TrafficSignalController />;
      case 'infrastructure':
        return <PredictiveMaintenance />;
      case 'ticketing':
        return <DigitalWallet />;
      case 'complaints':
        return <ComplaintPortal />;
      case 'environmental':
        return <EcoAnalytics />;
      case 'emergency':
        return <EmergencyDispatcher />;
      case 'copilot':
        return <UrbanAICopilot />;
      default:
        return userRole === 'citizen' ? <JourneyPlanner /> : <ExecutiveDashboard />;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#090D16] min-h-[calc(100vh-4rem)]">
      {renderActiveView()}
    </div>
  );
};

const AppContainer: React.FC = () => {
  const { currentUser, isPaymentModalOpen, closePaymentModal, paymentModalDefaultAmount } = useApp();

  // If user is not logged in, render AuthPortal first!
  if (!currentUser) {
    return <AuthPortal />;
  }

  // Only after login are the platform features displayed!
  return (
    <div className="min-h-screen flex flex-col bg-[#090D16] text-slate-100 font-sans animate-in fade-in duration-300">
      <Header />
      <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
        <Sidebar />
        <MainContent />
      </div>

      {/* Global Top-Level Portal Payment Gateway Modal */}
      <PaymentGatewayModal
        isOpen={isPaymentModalOpen}
        onClose={closePaymentModal}
        defaultAmount={paymentModalDefaultAmount}
      />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <AppContainer />
    </AppProvider>
  );
}

export default App;
