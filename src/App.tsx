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

const MainContent: React.FC = () => {
  const { activeTab } = useApp();

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
        return <ExecutiveDashboard />;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#090D16] min-h-[calc(100vh-4rem)]">
      {renderActiveView()}
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <div className="min-h-screen flex flex-col bg-[#090D16] text-slate-100 font-sans">
        <Header />
        <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
          <Sidebar />
          <MainContent />
        </div>
      </div>
    </AppProvider>
  );
}

export default App;
