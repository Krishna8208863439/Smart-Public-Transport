import { JourneyOption, CivicComplaint, IoTAsset, TrafficSignal } from '../types';

export const optimizeJourneys = (origin: string, destination: string): JourneyOption[] => {
  const isAirport = destination.toLowerCase().includes('airport');
  
  return [
    {
      id: 'j-fastest',
      type: 'fastest',
      title: 'Express Intermodal (Metro + Electric Shuttle)',
      totalDurationMin: isAirport ? 28 : 18,
      totalCost: 3.50,
      co2SavedKg: 2.8,
      transfers: 1,
      segments: [
        {
          mode: 'metro',
          lineName: 'Blue Line Rapid Metro',
          from: origin || 'Central Plaza',
          to: 'Financial Center Interchange',
          durationMin: 10,
          occupancy: 'moderate'
        },
        {
          mode: 'ebus',
          lineName: 'Route 101 E-Bus',
          from: 'Financial Center Interchange',
          to: destination || 'Tech Park',
          durationMin: 8,
          occupancy: 'low'
        }
      ]
    },
    {
      id: 'j-eco',
      type: 'eco',
      title: 'Zero-Emission Direct Ferry & E-Bike',
      totalDurationMin: isAirport ? 35 : 24,
      totalCost: 2.25,
      co2SavedKg: 4.5,
      caloriesBurned: 140,
      transfers: 1,
      segments: [
        {
          mode: 'ferry',
          lineName: 'Bay Zero-Emission Ferry 3',
          from: origin || 'Central Plaza Dock',
          to: 'Pier 7 Dock',
          durationMin: 14,
          occupancy: 'low'
        },
        {
          mode: 'walk',
          from: 'Pier 7 Dock',
          to: destination || 'Tech Park',
          durationMin: 10
        }
      ]
    },
    {
      id: 'j-congested',
      type: 'least_congested',
      title: 'AI Smart Loop Bus (Automated Traffic Bypass)',
      totalDurationMin: 22,
      totalCost: 2.75,
      co2SavedKg: 3.1,
      transfers: 0,
      segments: [
        {
          mode: 'ebus',
          lineName: 'Route 509 Express Loop',
          from: origin || 'Central Plaza',
          to: destination || 'Tech Park',
          durationMin: 22,
          occupancy: 'low'
        }
      ]
    },
    {
      id: 'j-cheapest',
      type: 'cheapest',
      title: 'Standard City Bus Line',
      totalDurationMin: 32,
      totalCost: 1.50,
      co2SavedKg: 2.4,
      transfers: 0,
      segments: [
        {
          mode: 'bus',
          lineName: 'Route 88 City Connector',
          from: origin || 'Central Plaza',
          to: destination || 'Tech Park',
          durationMin: 32,
          occupancy: 'high'
        }
      ]
    }
  ];
};

export const verifyComplaintWithAI = (
  title: string,
  category: CivicComplaint['category'],
  description: string
) => {
  let severity: CivicComplaint['aiVerification']['severityLevel'] = 'medium';
  let confidence = 0.92;
  let department = 'Department of Public Works';

  if (category === 'pothole' || category === 'water_leakage') {
    severity = description.toLowerCase().includes('deep') || description.toLowerCase().includes('burst') ? 'urgent' : 'high';
    department = category === 'pothole' ? 'DPW - Road Infrastructure' : 'Water & Sewage Authority';
    confidence = 0.96;
  } else if (category === 'traffic_signal') {
    severity = 'urgent';
    department = 'Traffic Police & Signal Control';
    confidence = 0.98;
  } else if (category === 'streetlight') {
    severity = 'low';
    department = 'Municipal Energy & Lighting';
    confidence = 0.88;
  } else if (category === 'illegal_parking') {
    severity = 'medium';
    department = 'Traffic Enforcement Bureau';
    confidence = 0.94;
  }

  return {
    verified: true,
    confidenceScore: confidence,
    severityLevel: severity,
    suggestedDepartment: department
  };
};

export const calculateSignalAITimer = (signal: TrafficSignal): number => {
  switch (signal.vehicleDensity) {
    case 'gridlock': return 65;
    case 'heavy': return 45;
    case 'moderate': return 30;
    case 'low': return 15;
    default: return 30;
  }
};

export const predictAssetFailure = (asset: IoTAsset) => {
  const { vibrationMs2 = 0, strainMicrostrain = 0, moisturePercent = 0 } = asset.telemetry;
  
  let riskScore = asset.failureRisk;
  if (vibrationMs2 > 1.2) riskScore += 25;
  if (strainMicrostrain > 150) riskScore += 20;
  if (moisturePercent > 85) riskScore += 30;

  riskScore = Math.min(Math.max(riskScore, 5), 98);
  
  return {
    predictedRiskPercent: Math.round(riskScore),
    healthScore: Math.round(100 - riskScore),
    status: riskScore > 70 ? 'critical' : riskScore > 40 ? 'warning' : 'normal',
    recommendation: riskScore > 70 
      ? 'Immediate maintenance dispatch recommended within 24 hours' 
      : riskScore > 40 
      ? 'Schedule inspection during off-peak maintenance window' 
      : 'Asset operating within optimal baseline parameters'
  };
};

export const processAICopilotQuery = (query: string): string => {
  const q = query.toLowerCase();

  if (q.includes('traffic') || q.includes('congestion')) {
    return "⚡ **Traffic Optimization Report**: AI Signal Grid is operating at 94.2% efficiency. Junction A (Market St & 4th) has heavy flow; AI signal cycle timing increased green time to 45s to clear northbound queue. Overall city travel delays reduced by **28.5%** today.";
  }
  if (q.includes('bus') || q.includes('metro') || q.includes('tracking') || q.includes('eta')) {
    return "🚌 **Transit Fleet Live Status**: 5 active vehicles on grid. **BUS-402** is 2 mins from Central Plaza (89% Battery). **Blue Line Metro** is on schedule at 52 km/h. **BUS-509** is experiencing a 6-min delay due to Mission St lane congestion.";
  }
  if (q.includes('maintenance') || q.includes('bridge') || q.includes('iot') || q.includes('pothole')) {
    return "🏗️ **Civic Infrastructure Alert**: Downtown Drainage Sensor #4 is flagged at **51% Failure Risk** (high moisture & vibration). Work Order #wo-901 has been dispatched to Hydro Squad A. Bay West Bridge is operating with normal structural strain (185 µε).";
  }
  if (q.includes('eco') || q.includes('air') || q.includes('aqi') || q.includes('carbon')) {
    return "🌿 **Environmental Snapshot**: Current City AQI is **38 (Good)**. Total CO₂ offset today by electric bus fleet & solar stops is **14,250 kg**. Noise levels average 58 dB in commercial corridors.";
  }
  if (q.includes('sos') || q.includes('emergency') || q.includes('ambulance')) {
    return "🚨 **Emergency Priority Protocol**: SOS System is ready. Triggering Emergency Corridor forces AI signals on designated routes to turn Green, creating a clear wave for ambulances & fire response.";
  }

  return `🤖 **SmartTransit AI Copilot**: I monitored your query regarding "${query}". The system is currently tracking live bus routes, AI traffic signal junctions, IoT bridge sensors, digital ticketing, and civic complaints. How can I assist your team further?`;
};
