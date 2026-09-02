export type UserRole = 'citizen' | 'operator' | 'admin' | 'maintenance' | 'super_admin';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleTitle: string;
  avatarUrl?: string;
  department?: string;
  phone?: string;
  assignedFeatures: string[];
}

export type TransportType = 'bus' | 'metro' | 'ebus' | 'train' | 'ferry';

export interface Location {
  lat: number;
  lng: number;
  address?: string;
}

export interface TransitVehicle {
  id: string;
  code: string;
  name: string;
  type: TransportType;
  routeId: string;
  routeName: string;
  currentLocation: Location;
  speed: number; // in km/h
  heading: number; // 0-360 deg
  occupancy: number; // 0-100%
  passengerCount: number;
  capacity: number;
  batteryLevel?: number; // % for electric
  driverName: string;
  nextStop: string;
  etaNextStop: string; // e.g. "3 mins"
  status: 'on_schedule' | 'delayed' | 'rerouted' | 'emergency';
  delayMinutes: number;
}

export interface TransitStop {
  id: string;
  name: string;
  code: string;
  location: Location;
  lines: string[];
  hasSolarPower: boolean;
  passengerCount: number;
  digitalDisplayActive: boolean;
  hasEmergencyButton: boolean;
  hasAccessibility: boolean;
}

export interface TrafficSignal {
  id: string;
  name: string;
  intersection: string;
  location: Location;
  status: 'red' | 'yellow' | 'green';
  aiMode: boolean;
  timerSeconds: number;
  vehicleDensity: 'low' | 'moderate' | 'heavy' | 'gridlock';
  emergencyPriorityActive: boolean;
  cycleStats: {
    greenTimeSec: number;
    avgQueueLength: number;
    delayReducedPercent: number;
  };
}

export interface VisionDetection {
  id: string;
  timestamp: string;
  cameraName: string;
  location: string;
  type: 'speeding' | 'illegal_parking' | 'red_light_violation' | 'road_damage' | 'accident';
  licensePlate?: string;
  confidence: number;
  imageUrl: string;
  status: 'flagged' | 'reviewed' | 'fine_issued' | 'cleared';
}

export interface IoTAsset {
  id: string;
  name: string;
  category: 'bridge' | 'road' | 'streetlight' | 'water_drainage' | 'bus_shelter' | 'elevator';
  location: Location;
  healthScore: number; // 0-100
  failureRisk: number; // 0-100%
  lastInspected: string;
  telemetry: {
    vibrationMs2?: number;
    strainMicrostrain?: number;
    moisturePercent?: number;
    powerConsumptionKw?: number;
    tiltDegrees?: number;
  };
  status: 'normal' | 'warning' | 'critical';
  maintenanceScheduleDate: string;
}

export interface WorkOrder {
  id: string;
  assetId: string;
  assetName: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignedTeam: string;
  status: 'pending' | 'in_progress' | 'completed';
  createdAt: string;
  description: string;
}

export interface CivicComplaint {
  id: string;
  title: string;
  category: 'pothole' | 'streetlight' | 'water_leakage' | 'traffic_signal' | 'garbage' | 'illegal_parking' | 'damaged_shelter';
  location: Location;
  address: string;
  reportedBy: string;
  timestamp: string;
  description: string;
  imageUrl?: string;
  aiVerification: {
    verified: boolean;
    confidenceScore: number;
    severityLevel: 'low' | 'medium' | 'high' | 'urgent';
    suggestedDepartment: string;
  };
  status: 'submitted' | 'ai_verified' | 'in_progress' | 'resolved';
  upvotes: number;
}

export interface DigitalTicket {
  id: string;
  passengerName: string;
  routeId: string;
  routeName: string;
  origin: string;
  destination: string;
  fare: number;
  purchaseTime: string;
  validUntil: string;
  qrCodeValue: string;
  status: 'active' | 'used' | 'expired';
  transitType: TransportType;
}

export interface JourneyOption {
  id: string;
  type: 'fastest' | 'eco' | 'least_congested' | 'cheapest';
  title: string;
  totalDurationMin: number;
  totalCost: number;
  co2SavedKg: number;
  caloriesBurned?: number;
  transfers: number;
  segments: {
    mode: TransportType | 'walk';
    lineName?: string;
    from: string;
    to: string;
    durationMin: number;
    occupancy?: 'low' | 'moderate' | 'high';
  }[];
}

export interface EnvironmentalData {
  aqi: number;
  status: 'Good' | 'Moderate' | 'Unhealthy' | 'Hazardous';
  pm25: number;
  no2: number;
  co2OffsetTodayKg: number;
  noiseLevelDb: number;
  tempCelsius: number;
  humidityPercent: number;
}

export interface EmergencySOSAlert {
  id: string;
  type: 'ambulance' | 'fire' | 'police' | 'citizen_sos';
  source: string;
  location: Location;
  destination?: Location;
  targetVehicleId?: string;
  status: 'active' | 'cleared';
  timestamp: string;
  greenCorridorActive: boolean;
}
