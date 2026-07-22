import {
  TransitVehicle,
  TransitStop,
  TrafficSignal,
  VisionDetection,
  IoTAsset,
  CivicComplaint,
  DigitalTicket,
  EnvironmentalData,
  WorkOrder
} from '../types';

export const INITIAL_VEHICLES: TransitVehicle[] = [
  {
    id: 'v-101',
    code: 'BUS-402',
    name: 'Electric Metro Express',
    type: 'ebus',
    routeId: 'r-1',
    routeName: 'Route 101 - Downtown Hub to Tech Park',
    currentLocation: { lat: 37.7790, lng: -122.4180 },
    speed: 34,
    heading: 45,
    occupancy: 68,
    passengerCount: 41,
    capacity: 60,
    batteryLevel: 89,
    driverName: 'Marcus Vance',
    nextStop: 'Central Plaza Transit Hub',
    etaNextStop: '2 mins',
    status: 'on_schedule',
    delayMinutes: 0
  },
  {
    id: 'v-102',
    code: 'METRO-L1',
    name: 'Blue Line Rapid Metro',
    type: 'metro',
    routeId: 'r-metro',
    routeName: 'Line 1 - North Terminal to South Harbor',
    currentLocation: { lat: 37.7850, lng: -122.4070 },
    speed: 52,
    heading: 120,
    occupancy: 84,
    passengerCount: 336,
    capacity: 400,
    driverName: 'AI Autonomous Guidance v4',
    nextStop: 'Financial Center Metro Station',
    etaNextStop: '1 min',
    status: 'on_schedule',
    delayMinutes: 0
  },
  {
    id: 'v-103',
    code: 'BUS-509',
    name: 'Eco Hybrid Shuttle',
    type: 'bus',
    routeId: 'r-2',
    routeName: 'Route 509 - Civic Mall to Airport Terminal',
    currentLocation: { lat: 37.7650, lng: -122.4290 },
    speed: 28,
    heading: 210,
    occupancy: 92,
    passengerCount: 55,
    capacity: 60,
    batteryLevel: 45,
    driverName: 'Sarah Jenkins',
    nextStop: 'Mission District Station',
    etaNextStop: '4 mins',
    status: 'delayed',
    delayMinutes: 6
  },
  {
    id: 'v-104',
    code: 'FERRY-F3',
    name: 'Bay Zero-Emission Ferry',
    type: 'ferry',
    routeId: 'r-ferry',
    routeName: 'Ferry Line 3 - Pier 7 to Island Park',
    currentLocation: { lat: 37.7980, lng: -122.3950 },
    speed: 22,
    heading: 330,
    occupancy: 42,
    passengerCount: 105,
    capacity: 250,
    batteryLevel: 94,
    driverName: 'Capt. Robert Chen',
    nextStop: 'Island Marina Dock',
    etaNextStop: '7 mins',
    status: 'on_schedule',
    delayMinutes: 0
  },
  {
    id: 'v-105',
    code: 'EBUS-88',
    name: 'Smart School Connector',
    type: 'ebus',
    routeId: 'r-school',
    routeName: 'School Loop 88 - University to East Campus',
    currentLocation: { lat: 37.7710, lng: -122.4400 },
    speed: 30,
    heading: 90,
    occupancy: 30,
    passengerCount: 18,
    capacity: 60,
    batteryLevel: 98,
    driverName: 'Elena Rostova',
    nextStop: 'Polytechnic High Stop',
    etaNextStop: '3 mins',
    status: 'on_schedule',
    delayMinutes: 0
  }
];

export const INITIAL_STOPS: TransitStop[] = [
  {
    id: 's-1',
    name: 'Central Plaza Transit Hub',
    code: 'CP-01',
    location: { lat: 37.7815, lng: -122.4110 },
    lines: ['Route 101', 'Line 1 Metro', 'Route 509'],
    hasSolarPower: true,
    passengerCount: 142,
    digitalDisplayActive: true,
    hasEmergencyButton: true,
    hasAccessibility: true
  },
  {
    id: 's-2',
    name: 'Financial Center Metro Station',
    code: 'FC-04',
    location: { lat: 37.7885, lng: -122.4020 },
    lines: ['Line 1 Metro', 'Line 2 Metro'],
    hasSolarPower: true,
    passengerCount: 289,
    digitalDisplayActive: true,
    hasEmergencyButton: true,
    hasAccessibility: true
  },
  {
    id: 's-3',
    name: 'Civic Mall Smart Stop',
    code: 'CM-09',
    location: { lat: 37.7750, lng: -122.4200 },
    lines: ['Route 101', 'School Loop 88'],
    hasSolarPower: true,
    passengerCount: 64,
    digitalDisplayActive: true,
    hasEmergencyButton: true,
    hasAccessibility: true
  },
  {
    id: 's-4',
    name: 'Pier 7 Bay Dock',
    code: 'P7-01',
    location: { lat: 37.7960, lng: -122.3980 },
    lines: ['Ferry Line 3'],
    hasSolarPower: false,
    passengerCount: 88,
    digitalDisplayActive: true,
    hasEmergencyButton: true,
    hasAccessibility: true
  }
];

export const INITIAL_SIGNALS: TrafficSignal[] = [
  {
    id: 'sig-1',
    name: 'Junction A - Market & 4th Street',
    intersection: 'Market St & 4th St',
    location: { lat: 37.7850, lng: -122.4060 },
    status: 'green',
    aiMode: true,
    timerSeconds: 24,
    vehicleDensity: 'heavy',
    emergencyPriorityActive: false,
    cycleStats: {
      greenTimeSec: 45,
      avgQueueLength: 14,
      delayReducedPercent: 28.5
    }
  },
  {
    id: 'sig-2',
    name: 'Junction B - Van Ness & Mission',
    intersection: 'Van Ness Ave & Mission St',
    location: { lat: 37.7720, lng: -122.4190 },
    status: 'red',
    aiMode: true,
    timerSeconds: 12,
    vehicleDensity: 'moderate',
    emergencyPriorityActive: false,
    cycleStats: {
      greenTimeSec: 35,
      avgQueueLength: 8,
      delayReducedPercent: 34.1
    }
  },
  {
    id: 'sig-3',
    name: 'Junction C - Embarcadero Transit Gate',
    intersection: 'Embarcadero & Howard',
    location: { lat: 37.7920, lng: -122.3930 },
    status: 'green',
    aiMode: true,
    timerSeconds: 38,
    vehicleDensity: 'low',
    emergencyPriorityActive: false,
    cycleStats: {
      greenTimeSec: 50,
      avgQueueLength: 4,
      delayReducedPercent: 41.2
    }
  }
];

export const INITIAL_VISION_DETECTIONS: VisionDetection[] = [
  {
    id: 'det-1',
    timestamp: '10:14:02 AM',
    cameraName: 'CCTV-CAM-04 (Market St)',
    location: 'Market St & 5th Ave',
    type: 'illegal_parking',
    licensePlate: '7XYZ892',
    confidence: 0.96,
    imageUrl: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=600&auto=format&fit=crop&q=60',
    status: 'flagged'
  },
  {
    id: 'det-2',
    timestamp: '10:12:45 AM',
    cameraName: 'ANPR-CAM-12 (Civic Bridge)',
    location: 'Civic Center Overpass',
    type: 'speeding',
    licensePlate: '8AB9104',
    confidence: 0.98,
    imageUrl: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=600&auto=format&fit=crop&q=60',
    status: 'fine_issued'
  },
  {
    id: 'det-3',
    timestamp: '10:08:19 AM',
    cameraName: 'ROADS-CAM-02 (Mission St)',
    location: 'Mission St & 16th St',
    type: 'road_damage',
    confidence: 0.91,
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=60',
    status: 'flagged'
  }
];

export const INITIAL_IOT_ASSETS: IoTAsset[] = [
  {
    id: 'iot-b1',
    name: 'Bay West Suspension Bridge',
    category: 'bridge',
    location: { lat: 37.7950, lng: -122.3880 },
    healthScore: 84,
    failureRisk: 16,
    lastInspected: '2026-07-15',
    telemetry: {
      vibrationMs2: 0.42,
      strainMicrostrain: 185,
      tiltDegrees: 0.02
    },
    status: 'normal',
    maintenanceScheduleDate: '2026-08-30'
  },
  {
    id: 'iot-sl88',
    name: 'Solar Smart Streetlight Array #88',
    category: 'streetlight',
    location: { lat: 37.7780, lng: -122.4150 },
    healthScore: 62,
    failureRisk: 38,
    lastInspected: '2026-06-20',
    telemetry: {
      powerConsumptionKw: 1.2,
      moisturePercent: 78
    },
    status: 'warning',
    maintenanceScheduleDate: '2026-07-28'
  },
  {
    id: 'iot-dr04',
    name: 'Downtown Stormwater Drainage Sensor #4',
    category: 'water_drainage',
    location: { lat: 37.7730, lng: -122.4220 },
    healthScore: 49,
    failureRisk: 51,
    lastInspected: '2026-05-10',
    telemetry: {
      moisturePercent: 94,
      vibrationMs2: 1.8
    },
    status: 'critical',
    maintenanceScheduleDate: '2026-07-24'
  },
  {
    id: 'iot-rd12',
    name: 'Market St Asphalt Strain Grid',
    category: 'road',
    location: { lat: 37.7830, lng: -122.4080 },
    healthScore: 92,
    failureRisk: 8,
    lastInspected: '2026-07-01',
    telemetry: {
      strainMicrostrain: 90,
      vibrationMs2: 0.2
    },
    status: 'normal',
    maintenanceScheduleDate: '2026-09-15'
  }
];

export const INITIAL_WORK_ORDERS: WorkOrder[] = [
  {
    id: 'wo-901',
    assetId: 'iot-dr04',
    assetName: 'Downtown Stormwater Drainage Sensor #4',
    category: 'Water Drainage',
    priority: 'critical',
    assignedTeam: 'Municipal Hydro Squad A',
    status: 'in_progress',
    createdAt: '2026-07-21 14:30',
    description: 'Sensor indicates 94% sediment clog risk. Debris clearance required before rainfall.'
  },
  {
    id: 'wo-899',
    assetId: 'iot-sl88',
    assetName: 'Solar Smart Streetlight Array #88',
    category: 'Streetlighting',
    priority: 'medium',
    assignedTeam: 'Grid Electrical Team B',
    status: 'pending',
    createdAt: '2026-07-22 08:15',
    description: 'High humidity sensor reading inside housing. Inverter gasket seal replacement needed.'
  }
];

export const INITIAL_COMPLAINTS: CivicComplaint[] = [
  {
    id: 'cmp-101',
    title: 'Deep pothole causing vehicle slowdown',
    category: 'pothole',
    location: { lat: 37.7760, lng: -122.4170 },
    address: 'Corner of 8th St & Howard St',
    reportedBy: 'Alex Rivera',
    timestamp: '2 hours ago',
    description: 'Large 8-inch deep crater on the right lane near the bus stop. Multiple buses having to swerve into oncoming traffic.',
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=60',
    aiVerification: {
      verified: true,
      confidenceScore: 0.97,
      severityLevel: 'high',
      suggestedDepartment: 'Department of Public Works - Paving Team'
    },
    status: 'ai_verified',
    upvotes: 24
  },
  {
    id: 'cmp-102',
    title: 'Flickering LED array on bus shelter #14',
    category: 'damaged_shelter',
    location: { lat: 37.7840, lng: -122.4040 },
    address: 'Market St & 3rd St',
    reportedBy: 'Priya Sharma',
    timestamp: '5 hours ago',
    description: 'The solar roof display screen is flashing rapidly and the night lighting is completely dark.',
    imageUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266010b?w=600&auto=format&fit=crop&q=60',
    aiVerification: {
      verified: true,
      confidenceScore: 0.89,
      severityLevel: 'medium',
      suggestedDepartment: 'Transit Authority - Electrical Maintenance'
    },
    status: 'in_progress',
    upvotes: 11
  }
];

export const INITIAL_TICKETS: DigitalTicket[] = [
  {
    id: 'tkt-88219',
    passengerName: 'Citizen Traveler',
    routeId: 'r-1',
    routeName: 'Route 101 - Downtown Hub to Tech Park',
    origin: 'Civic Mall Smart Stop',
    destination: 'Financial Center Metro Station',
    fare: 2.75,
    purchaseTime: 'Today 09:15 AM',
    validUntil: 'Today 11:15 AM',
    qrCodeValue: 'SMART-TRANSIT-QR-88219-VAL-2026',
    status: 'active',
    transitType: 'ebus'
  }
];

export const INITIAL_ENVIRONMENTAL: EnvironmentalData = {
  aqi: 38,
  status: 'Good',
  pm25: 8.4,
  no2: 12.1,
  co2OffsetTodayKg: 14250,
  noiseLevelDb: 58,
  tempCelsius: 22,
  humidityPercent: 64
};
