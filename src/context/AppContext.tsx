import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  AuthUser,
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

export const ROLE_PERMISSIONS: Record<UserRole, { title: string; defaultTab: string; features: string[] }> = {
  citizen: {
    title: 'Citizen Portal',
    defaultTab: 'planner',
    features: ['planner', 'complaints', 'ticketing', 'emergency', 'copilot']
  },
  operator: {
    title: 'Fleet Operator',
    defaultTab: 'map',
    features: ['map', 'dashboard', 'emergency', 'copilot']
  },
  admin: {
    title: 'City Administrator',
    defaultTab: 'dashboard',
    features: ['dashboard', 'traffic', 'infrastructure', 'environmental', 'map', 'emergency', 'copilot']
  },
  maintenance: {
    title: 'Maintenance Team',
    defaultTab: 'infrastructure',
    features: ['infrastructure', 'complaints', 'copilot', 'emergency']
  },
  super_admin: {
    title: 'Super Administrator',
    defaultTab: 'dashboard',
    features: ['dashboard', 'map', 'planner', 'traffic', 'infrastructure', 'ticketing', 'complaints', 'environmental', 'emergency', 'copilot']
  }
};

interface AppContextType {
  currentUser: AuthUser | null;
  login: (email: string, role?: UserRole, name?: string) => void;
  register: (name: string, email: string, role: UserRole, department?: string) => void;
  logout: () => void;

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
  isPaymentModalOpen: boolean;
  paymentModalDefaultAmount: number;

  // Actions
  openPaymentModal: (amount?: number) => void;
  closePaymentModal: () => void;
  triggerEmergencySOS: (type: EmergencySOSAlert['type'], source: string) => void;
  clearEmergencySOS: () => void;
  addComplaint: (title: string, category: CivicComplaint['category'], description: string, address: string, imageUrl?: string) => void;
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
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [userRole, setUserRole] = useState<UserRole>('citizen');
  const [activeTab, setActiveTab] = useState<string>('planner');
  const [isSimulating, setIsSimulating] = useState<boolean>(true);

  const login = (email: string, role: UserRole = 'citizen', name?: string) => {
    const roleMeta = ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS.citizen;
    const defaultName = name || (
      role === 'citizen' ? 'Alex Rivera (Citizen)' :
      role === 'operator' ? 'Marcus Vance (Fleet Ops)' :
      role === 'admin' ? 'Elena Rostova (City Admin)' :
      role === 'maintenance' ? 'Dave Kowalski (Infra Lead)' :
      'Chief Super Administrator'
    );

    const user: AuthUser = {
      id: `usr-${Date.now()}`,
      name: defaultName,
      email,
      role,
      roleTitle: roleMeta.title,
      assignedFeatures: roleMeta.features,
      avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80`
    };

    setCurrentUser(user);
    setUserRole(role);
    setActiveTab(roleMeta.defaultTab);
  };

  const register = (name: string, email: string, role: UserRole, department?: string) => {
    const roleMeta = ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS.citizen;
    const user: AuthUser = {
      id: `usr-${Date.now()}`,
      name,
      email,
      role,
      roleTitle: roleMeta.title,
      department: department || 'Municipal Transport Directorate',
      assignedFeatures: roleMeta.features,
      avatarUrl: `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80`
    };
    setCurrentUser(user);
    setUserRole(role);
    setActiveTab(roleMeta.defaultTab);
  };

  const logout = () => {
    setCurrentUser(null);
    setUserRole('citizen');
    setActiveTab('planner');
  };

  const [vehicles, setVehicles] = useState<TransitVehicle[]>(INITIAL_VEHICLES);
  const [stops] = useState<TransitStop[]>(INITIAL_STOPS);
  const [signals, setSignals] = useState<TrafficSignal[]>(INITIAL_SIGNALS);
  const [visionDetections] = useState<VisionDetection[]>(INITIAL_VISION_DETECTIONS);
  const [iotAssets, setIotAssets] = useState<IoTAsset[]>(INITIAL_IOT_ASSETS);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(INITIAL_WORK_ORDERS);
  const [complaints, setComplaints] = useState<CivicComplaint[]>(INITIAL_COMPLAINTS);
  const [tickets, setTickets] = useState<DigitalTicket[]>(INITIAL_TICKETS);
  const [environmental, setEnvironmental] = useState<EnvironmentalData>(INITIAL_ENVIRONMENTAL);
  const [emergencyAlert, setEmergencyAlert] = useState<EmergencySOSAlert | null>(null);
  const [walletBalance, setWalletBalance] = useState<number>(45.50);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
  const [paymentModalDefaultAmount, setPaymentModalDefaultAmount] = useState<number>(20);

  const openPaymentModal = (amount?: number) => {
    if (amount !== undefined && amount > 0) {
      setPaymentModalDefaultAmount(amount);
    }
    setIsPaymentModalOpen(true);
  };

  const closePaymentModal = () => {
    setIsPaymentModalOpen(false);
  };

  // Real-time live data simulation engine
  useEffect(() => {
    if (!isSimulating) return;

    let tickCount = 0;

    const interval = setInterval(() => {
      tickCount += 1;

      // 1. Live Vehicles Real-time Movement & GPS telemetry
      setVehicles((prevVehicles) =>
        prevVehicles.map((v, idx) => {
          let heading = v.heading;
          let lat = v.currentLocation.lat;
          let lng = v.currentLocation.lng;

          // Boundary turn check (keep within SF transit grid)
          if (lat > 37.8050 || lat < 37.7650) {
            heading = (heading + 180) % 360;
          }
          if (lng > -122.3850 || lng < -122.4350) {
            heading = (heading + 180) % 360;
          }

          const speedFactor = 0.00018;
          const deltaLat = Math.sin(heading * (Math.PI / 180)) * speedFactor;
          const deltaLng = Math.cos(heading * (Math.PI / 180)) * speedFactor;

          // Passenger flow
          const flux = Math.floor(Math.random() * 3) - 1;
          const newPassengerCount = Math.max(8, Math.min(v.capacity, v.passengerCount + flux));
          const newOccupancy = Math.round((newPassengerCount / v.capacity) * 100);

          // Realistic speed variation
          const speedFlux = Math.floor(Math.random() * 5) - 2;
          const newSpeed = Math.max(24, Math.min(65, v.speed + speedFlux));

          // Dynamic ETA cycle
          const etaList = ['3 mins', '2 mins', '1 min', 'Arriving', '4 mins'];
          const etaIndex = Math.floor((tickCount + idx * 2) / 6) % etaList.length;

          // Battery drain and terminal charging
          let newBattery = v.batteryLevel;
          if (newBattery !== undefined) {
            newBattery = newBattery > 15 ? Number((newBattery - 0.04).toFixed(1)) : 95;
          }

          return {
            ...v,
            heading,
            currentLocation: {
              lat: Number((lat + deltaLat).toFixed(6)),
              lng: Number((lng + deltaLng).toFixed(6))
            },
            speed: newSpeed,
            passengerCount: newPassengerCount,
            occupancy: newOccupancy,
            etaNextStop: etaList[etaIndex],
            batteryLevel: newBattery
          };
        })
      );

      // 2. Traffic Signals Live Countdown & AI Adaptation
      setSignals((prevSignals) =>
        prevSignals.map((sig, sIdx) => {
          if (sig.emergencyPriorityActive) return sig;
          
          const newSec = sig.timerSeconds - 1;
          if (newSec <= 0) {
            let nextStatus: TrafficSignal['status'] = 'green';
            let nextTimer = 30;

            if (sig.status === 'green') {
              nextStatus = 'yellow';
              nextTimer = 4;
            } else if (sig.status === 'yellow') {
              nextStatus = 'red';
              nextTimer = 25;
            } else {
              nextStatus = 'green';
              // AI timing optimization based on density
              nextTimer = sig.aiMode
                ? sig.vehicleDensity === 'heavy' ? 45 : sig.vehicleDensity === 'moderate' ? 32 : 18
                : 28;
            }

            // Periodically adjust density
            const densities: TrafficSignal['vehicleDensity'][] = ['low', 'moderate', 'heavy'];
            const newDensity = tickCount % 12 === 0 ? densities[(sIdx + Math.floor(tickCount / 12)) % 3] : sig.vehicleDensity;

            return {
              ...sig,
              status: nextStatus,
              timerSeconds: nextTimer,
              vehicleDensity: newDensity,
              cycleStats: {
                ...sig.cycleStats,
                delayReducedPercent: sig.aiMode ? Number((28.5 + (Math.random() * 2 - 1)).toFixed(1)) : 0
              }
            };
          }
          return { ...sig, timerSeconds: newSec };
        })
      );

      // 3. IoT Infrastructure Sensors Telemetry Update (every 2 ticks)
      if (tickCount % 2 === 0) {
        setIotAssets((prevAssets) =>
          prevAssets.map((asset) => {
            const vibFlux = Number((0.02 * (Math.random() - 0.5)).toFixed(3));
            const strainFlux = Math.floor(Math.random() * 5) - 2;
            const currentVib = asset.telemetry.vibrationMs2 ?? 0.42;
            const currentStrain = asset.telemetry.strainMicrostrain ?? 185;

            return {
              ...asset,
              telemetry: {
                ...asset.telemetry,
                vibrationMs2: Number(Math.max(0.1, currentVib + vibFlux).toFixed(2)),
                strainMicrostrain: Math.max(50, currentStrain + strainFlux),
                powerConsumptionKw: asset.telemetry.powerConsumptionKw
                  ? Number((asset.telemetry.powerConsumptionKw + (Math.random() * 0.2 - 0.1)).toFixed(1))
                  : undefined
              }
            };
          })
        );
      }

      // 4. Live Environmental & Carbon Offset Accumulation
      setEnvironmental((prev) => {
        // Continuous green fleet carbon offset accumulation (+1.8 kg per tick)
        const newCo2Kg = prev.co2OffsetTodayKg + 1.8;
        const aqiFlux = Math.floor(Math.random() * 3) - 1;
        const newAqi = Math.max(25, Math.min(55, prev.aqi + aqiFlux));
        const noiseFlux = Math.floor(Math.random() * 3) - 1;
        const newNoise = Math.max(50, Math.min(68, prev.noiseLevelDb + noiseFlux));

        return {
          ...prev,
          co2OffsetTodayKg: Number(newCo2Kg.toFixed(1)),
          aqi: newAqi,
          status: newAqi <= 50 ? 'Good' : 'Moderate',
          noiseLevelDb: newNoise,
          pm25: Number((8.2 + (Math.random() * 0.4 - 0.2)).toFixed(1))
        };
      });

    }, 1200);

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

  const addComplaint = (title: string, category: CivicComplaint['category'], description: string, address: string, imageUrl?: string) => {
    const aiVerification = verifyComplaintWithAI(title, category, description);
    const newComplaint: CivicComplaint = {
      id: `cmp-${Date.now()}`,
      title,
      category,
      location: { lat: 37.7790 + (Math.random() * 0.01 - 0.005), lng: -122.4150 + (Math.random() * 0.01 - 0.005) },
      address: address || 'Civic Corridor Area',
      reportedBy: currentUser?.name || 'Verified Citizen User',
      timestamp: 'Just now',
      description,
      imageUrl: imageUrl || (category === 'pothole' 
        ? 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=60'
        : category === 'streetlight'
        ? 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=600&auto=format&fit=crop&q=60'
        : 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600&auto=format&fit=crop&q=60'),
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
        currentUser,
        login,
        register,
        logout,
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
        isPaymentModalOpen,
        paymentModalDefaultAmount,
        openPaymentModal,
        closePaymentModal,
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
