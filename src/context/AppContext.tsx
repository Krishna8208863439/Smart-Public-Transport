import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  TransitVehicle,
  TransitStop,
  TrafficSignal,
  VisionDetection,
  IoTAsset,
  WorkOrder,
  CivicComplaint,
  DigitalTicket,
  EnvironmentalData,
  EmergencySOSAlert
} from '../types';
import {
  INITIAL_VEHICLES,
  INITIAL_STOPS,
  INITIAL_SIGNALS,
  INITIAL_VISION_DETECTIONS,
  INITIAL_IOT_ASSETS,
  INITIAL_WORK_ORDERS,
  INITIAL_COMPLAINTS,
  INITIAL_TICKETS,
  INITIAL_ENVIRONMENTAL
} from '../data/mockData';
import { verifyComplaintWithAI } from '../services/aiService';

interface AppContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isSimulating: boolean;
  setIsSimulating: (sim: boolean) => void;
  
  vehicles: TransitVehicle[];
  stops: TransitStop[];
  signals: TrafficSignal[];
  visionDetections: VisionDetection[];
  iotAssets: IoTAsset[];
  workOrders: WorkOrder[];
  complaints: CivicComplaint[];
  tickets: DigitalTicket[];
  environmental: EnvironmentalData;
  emergencyAlert: EmergencySOSAlert | null;
  walletBalance: number;

  // Actions
  triggerEmergencySOS: (type: EmergencySOSAlert['type'], source: string) => void;
  clearEmergencySOS: () => void;
  addComplaint: (title: string, category: CivicComplaint['category'], description: string, address: string) => void;
  upvoteComplaint: (id: string) => void;
  toggleSignalAI: (signalId: string) => void;
  overrideSignalStatus: (signalId: string, status: TrafficSignal['status']) => void;
  buyTicket: (routeId: string, routeName: string, origin: string, destination: string, fare: number, type: TransitVehicle['type']) => boolean;
  topupWallet: (amount: number) => void;
  createWorkOrder: (assetId: string, priority: WorkOrder['priority'], description: string) => void;
  resolveWorkOrder: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userRole, setUserRole] = useState<UserRole>('citizen');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isSimulating, setIsSimulating] = useState<boolean>(true);

  const [vehicles, setVehicles] = useState<TransitVehicle[]>(INITIAL_VEHICLES);
  const [stops] = useState<TransitStop[]>(INITIAL_STOPS);
  const [signals, setSignals] = useState<TrafficSignal[]>(INITIAL_SIGNALS);
  const [visionDetections] = useState<VisionDetection[]>(INITIAL_VISION_DETECTIONS);
  const [iotAssets, setIotAssets] = useState<IoTAsset[]>(INITIAL_IOT_ASSETS);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(INITIAL_WORK_ORDERS);
  const [complaints, setComplaints] = useState<CivicComplaint[]>(INITIAL_COMPLAINTS);
  const [tickets, setTickets] = useState<DigitalTicket[]>(INITIAL_TICKETS);
  const [environmental] = useState<EnvironmentalData>(INITIAL_ENVIRONMENTAL);
  const [emergencyAlert, setEmergencyAlert] = useState<EmergencySOSAlert | null>(null);
  const [walletBalance, setWalletBalance] = useState<number>(45.50);

  // Simulation effect for smooth GPS movement and signal countdowns
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      // 1. Move vehicles slightly along heading
      setVehicles((prevVehicles) =>
        prevVehicles.map((v) => {
          const deltaLat = (Math.sin(v.heading * (Math.PI / 180)) * 0.00015);
          const deltaLng = (Math.cos(v.heading * (Math.PI / 180)) * 0.00015);
          
          // Slight passenger flux
          const flux = Math.floor(Math.random() * 3) - 1;
          const newPassengerCount = Math.max(5, Math.min(v.capacity, v.passengerCount + flux));
          const newOccupancy = Math.round((newPassengerCount / v.capacity) * 100);

          return {
            ...v,
            currentLocation: {
              lat: v.currentLocation.lat + deltaLat,
              lng: v.currentLocation.lng + deltaLng
            },
            passengerCount: newPassengerCount,
            occupancy: newOccupancy,
            batteryLevel: v.batteryLevel ? Math.max(10, v.batteryLevel - 0.05) : undefined
          };
        })
      );

      // 2. Countdown traffic signals
      setSignals((prevSignals) =>
        prevSignals.map((sig) => {
          if (sig.emergencyPriorityActive) return sig;
          const newSec = sig.timerSeconds - 1;
          if (newSec <= 0) {
            const nextStatus = sig.status === 'red' ? 'green' : sig.status === 'green' ? 'yellow' : 'red';
            return {
              ...sig,
              status: nextStatus,
              timerSeconds: nextStatus === 'yellow' ? 4 : sig.aiMode ? 35 : 25
            };
          }
          return { ...sig, timerSeconds: newSec };
        })
      );
    }, 1500);

    return () => clearInterval(interval);
  }, [isSimulating]);

  // Actions
  const triggerEmergencySOS = (type: EmergencySOSAlert['type'], source: string) => {
    const alert: EmergencySOSAlert = {
      id: `sos-${Date.now()}`,
      type,
      source,
      location: { lat: 37.7850, lng: -122.4060, address: 'Market St & 4th St Junction' },
      status: 'active',
      timestamp: new Date().toLocaleTimeString(),
      greenCorridorActive: true
    };
    setEmergencyAlert(alert);

    // Override signals to Green corridor
    setSignals((prev) =>
      prev.map((s) => ({
        ...s,
        status: 'green',
        timerSeconds: 99,
        emergencyPriorityActive: true
      }))
    );
  };

  const clearEmergencySOS = () => {
    setEmergencyAlert(null);
    setSignals((prev) =>
      prev.map((s) => ({
        ...s,
        timerSeconds: 30,
        emergencyPriorityActive: false
      }))
    );
  };

  const addComplaint = (title: string, category: CivicComplaint['category'], description: string, address: string) => {
    const aiVerification = verifyComplaintWithAI(title, category, description);
    const newComplaint: CivicComplaint = {
      id: `cmp-${Date.now()}`,
      title,
      category,
      location: { lat: 37.7790 + (Math.random() * 0.01 - 0.005), lng: -122.4150 + (Math.random() * 0.01 - 0.005) },
      address: address || 'Civic Corridor Area',
      reportedBy: 'Verified Citizen User',
      timestamp: 'Just now',
      description,
      imageUrl: category === 'pothole' 
        ? 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=60'
        : 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=600&auto=format&fit=crop&q=60',
      aiVerification,
      status: 'ai_verified',
      upvotes: 1
    };

    setComplaints((prev) => [newComplaint, ...prev]);
  };

  const upvoteComplaint = (id: string) => {
    setComplaints((prev) =>
      prev.map((c) => (c.id === id ? { ...c, upvotes: c.upvotes + 1 } : c))
    );
  };

  const toggleSignalAI = (signalId: string) => {
    setSignals((prev) =>
      prev.map((s) => (s.id === signalId ? { ...s, aiMode: !s.aiMode } : s))
    );
  };

  const overrideSignalStatus = (signalId: string, status: TrafficSignal['status']) => {
    setSignals((prev) =>
      prev.map((s) => (s.id === signalId ? { ...s, status, timerSeconds: 40 } : s))
    );
  };

  const buyTicket = (routeId: string, routeName: string, origin: string, destination: string, fare: number, type: TransitVehicle['type']): boolean => {
    if (walletBalance < fare) return false;

    setWalletBalance((prev) => prev - fare);
    const newTicket: DigitalTicket = {
      id: `tkt-${Math.floor(10000 + Math.random() * 90000)}`,
      passengerName: 'Smart Citizen',
      routeId,
      routeName,
      origin,
      destination,
      fare,
      purchaseTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      validUntil: 'Valid for 2 Hours',
      qrCodeValue: `TRANSIT-${Date.now()}-${routeId}`,
      status: 'active',
      transitType: type
    };

    setTickets((prev) => [newTicket, ...prev]);
    return true;
  };

  const topupWallet = (amount: number) => {
    setWalletBalance((prev) => prev + amount);
  };

  const createWorkOrder = (assetId: string, priority: WorkOrder['priority'], description: string) => {
    const asset = iotAssets.find((a) => a.id === assetId);
    const newWO: WorkOrder = {
      id: `wo-${Math.floor(100 + Math.random() * 900)}`,
      assetId,
      assetName: asset?.name || 'Municipal City Asset',
      category: asset?.category || 'General Infrastructure',
      priority,
      assignedTeam: 'Municipal Rapid Dispatch Unit',
      status: 'in_progress',
      createdAt: 'Just now',
      description
    };
    setWorkOrders((prev) => [newWO, ...prev]);
  };

  const resolveWorkOrder = (id: string) => {
    setWorkOrders((prev) =>
      prev.map((wo) => (wo.id === id ? { ...wo, status: 'completed' } : wo))
    );
  };

  return (
    <AppContext.Provider
      value={{
        userRole,
        setUserRole,
        activeTab,
        setActiveTab,
        isSimulating,
        setIsSimulating,
        vehicles,
        stops,
        signals,
        visionDetections,
        iotAssets,
        workOrders,
        complaints,
        tickets,
        environmental,
        emergencyAlert,
        walletBalance,
        triggerEmergencySOS,
        clearEmergencySOS,
        addComplaint,
        upvoteComplaint,
        toggleSignalAI,
        overrideSignalStatus,
        buyTicket,
        topupWallet,
        createWorkOrder,
        resolveWorkOrder
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
