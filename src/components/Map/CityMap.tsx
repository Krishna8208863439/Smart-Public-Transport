import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TransitVehicle, TrafficSignal, IoTAsset, TransitStop } from '../../types';
import {
  Bus,
  Train,
  Anchor,
  Radio,
  SlidersHorizontal,
  Layers,
  AlertTriangle,
  Zap,
  Activity,
  CheckCircle2,
  Navigation,
  ShieldAlert
} from 'lucide-react';
import L from 'leaflet';

export const CityMap: React.FC = () => {
  const { vehicles, stops, signals, iotAssets, emergencyAlert } = useApp();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});
  const polylineRef = useRef<L.Polyline | null>(null);

  // Filters
  const [showVehicles, setShowVehicles] = useState(true);
  const [showSignals, setShowSignals] = useState(true);
  const [showIoT, setShowIoT] = useState(true);
  const [showStops, setShowStops] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState<TransitVehicle | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Create Leaflet map centered at SF / Smart City hub
    const map = L.map(mapContainerRef.current, {
      center: [37.7815, -122.4110],
      zoom: 14,
      zoomControl: false
    });

    // Dark cyber map tile layer (CartoDB Dark Matter)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a> & SmartTransit AI',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Markers & Polylines dynamically
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing markers
    Object.values(markersRef.current).forEach((m) => m.remove());
    markersRef.current = {};

    // 1. Render Vehicles
    if (showVehicles) {
      vehicles.forEach((v) => {
        const isMetro = v.type === 'metro';
        const isFerry = v.type === 'ferry';
        const isEbus = v.type === 'ebus';

        const iconHtml = `
          <div class="relative flex items-center justify-center w-8 h-8 rounded-full border-2 shadow-lg transition-transform hover:scale-125 ${
            isMetro
              ? 'bg-purple-600 border-purple-300 text-white'
              : isFerry
              ? 'bg-blue-600 border-blue-300 text-white'
              : isEbus
              ? 'bg-emerald-600 border-emerald-300 text-white'
              : 'bg-amber-600 border-amber-300 text-white'
          }">
            <span class="font-bold text-[11px]">${v.code.split('-')[0]}</span>
            <span class="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full ${
              v.status === 'delayed' ? 'bg-rose-500' : 'bg-emerald-400'
            } border border-slate-900 flex items-center justify-center text-[8px] font-bold text-slate-950">
              ${v.delayMinutes > 0 ? `${v.delayMinutes}m` : '✓'}
            </span>
          </div>
        `;

        const customIcon = L.divIcon({
          html: iconHtml,
          className: 'custom-vehicle-icon',
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });

        const marker = L.marker([v.currentLocation.lat, v.currentLocation.lng], { icon: customIcon }).addTo(map);

        marker.on('click', () => {
          setSelectedVehicle(v);
        });

        markersRef.current[`veh-${v.id}`] = marker;
      });
    }

    // 2. Render Traffic Signals
    if (showSignals) {
      signals.forEach((sig) => {
        const colorClass = sig.status === 'green' ? 'bg-emerald-500 shadow-glow-green' : sig.status === 'yellow' ? 'bg-amber-500 shadow-glow-amber' : 'bg-rose-500 shadow-glow-red';
        const iconHtml = `
          <div class="flex items-center justify-center px-2 py-1 rounded-lg ${colorClass} text-slate-950 font-extrabold text-[10px] border border-white/40 font-mono shadow-md">
            🚦 ${sig.timerSeconds}s
          </div>
        `;

        const customIcon = L.divIcon({
          html: iconHtml,
          className: 'custom-signal-icon',
          iconSize: [44, 24],
          iconAnchor: [22, 12]
        });

        const marker = L.marker([sig.location.lat, sig.location.lng], { icon: customIcon }).addTo(map);

        marker.bindPopup(`
          <div class="p-2 text-slate-950 font-sans space-y-1">
            <h4 class="font-bold text-sm text-slate-900">${sig.name}</h4>
            <p class="text-xs text-slate-600">Density: <strong class="uppercase font-bold">${sig.vehicleDensity}</strong></p>
            <p class="text-xs text-slate-600">AI Timing: <strong>${sig.aiMode ? 'ENABLED (Auto)' : 'Manual Mode'}</strong></p>
            <p class="text-xs text-emerald-700 font-medium">Delay Saved: +${sig.cycleStats.delayReducedPercent}%</p>
          </div>
        `);

        markersRef.current[`sig-${sig.id}`] = marker;
      });
    }

    // 3. Render IoT Infrastructure Assets
    if (showIoT) {
      iotAssets.forEach((asset) => {
        const isCritical = asset.status === 'critical';
        const isWarning = asset.status === 'warning';
        const iconColor = isCritical ? 'bg-rose-600 border-rose-300' : isWarning ? 'bg-amber-500 border-amber-300' : 'bg-cyan-600 border-cyan-300';

        const iconHtml = `
          <div class="flex items-center justify-center w-7 h-7 rounded-lg ${iconColor} text-white border text-[11px] font-bold shadow-lg">
            🏗️
          </div>
        `;

        const customIcon = L.divIcon({
          html: iconHtml,
          className: 'custom-iot-icon',
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        });

        const marker = L.marker([asset.location.lat, asset.location.lng], { icon: customIcon }).addTo(map);

        marker.bindPopup(`
          <div class="p-2 text-slate-950 font-sans space-y-1">
            <h4 class="font-bold text-sm">${asset.name}</h4>
            <p class="text-xs">Category: <strong class="capitalize">${asset.category.replace('_', ' ')}</strong></p>
            <p class="text-xs">Health Score: <strong>${asset.healthScore}/100</strong></p>
            <p class="text-xs text-rose-600 font-bold">Failure Risk: ${asset.failureRisk}%</p>
          </div>
        `);

        markersRef.current[`iot-${asset.id}`] = marker;
      });
    }

    // 4. Emergency SOS Corridor Polyline Highlight
    if (polylineRef.current) {
      polylineRef.current.remove();
      polylineRef.current = null;
    }

    if (emergencyAlert && emergencyAlert.greenCorridorActive) {
      const emergencyPath: [number, number][] = [
        [37.7710, -122.4400],
        [37.7790, -122.4180],
        [37.7850, -122.4060],
        [37.7920, -122.3930]
      ];

      polylineRef.current = L.polyline(emergencyPath, {
        color: '#FF2E93',
        weight: 6,
        opacity: 0.9,
        dashArray: '10, 10'
      }).addTo(map);
    }

  }, [vehicles, signals, iotAssets, showVehicles, showSignals, showIoT, emergencyAlert]);

  return (
    <div className="relative w-full h-[calc(100vh-4.5rem)] bg-slate-950 overflow-hidden flex flex-col">
      
      {/* Map Header Floating Overlay */}
      <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2 bg-slate-900/90 backdrop-blur-md p-2 rounded-2xl border border-slate-800 shadow-2xl">
        <div className="flex items-center gap-2 px-3 py-1 bg-slate-800/80 rounded-xl text-xs font-semibold text-white">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span>Layer Filters:</span>
        </div>

        <button
          onClick={() => setShowVehicles(!showVehicles)}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            showVehicles ? 'bg-cyan-500 text-slate-950 shadow-glow-cyan' : 'bg-slate-800 text-slate-400'
          }`}
        >
          🚌 Vehicles ({vehicles.length})
        </button>

        <button
          onClick={() => setShowSignals(!showSignals)}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            showSignals ? 'bg-amber-500 text-slate-950 shadow-glow-amber' : 'bg-slate-800 text-slate-400'
          }`}
        >
          🚦 AI Signals ({signals.length})
        </button>

        <button
          onClick={() => setShowIoT(!showIoT)}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            showIoT ? 'bg-emerald-500 text-slate-950 shadow-glow-green' : 'bg-slate-800 text-slate-400'
          }`}
        >
          🏗️ IoT Assets ({iotAssets.length})
        </button>
      </div>

      {/* Emergency Corridor SOS Notification Banner */}
      {emergencyAlert && (
        <div className="absolute top-4 right-4 z-20 bg-rose-950/90 backdrop-blur-md border border-rose-600 text-white p-3 rounded-2xl shadow-glow-red flex items-center gap-3 animate-pulse max-w-sm">
          <ShieldAlert className="w-6 h-6 text-rose-400 shrink-0" />
          <div>
            <h4 className="font-extrabold text-xs text-rose-200 uppercase tracking-wider">
              Emergency SOS Corridor Active
            </h4>
            <p className="text-xs text-rose-300">
              {emergencyAlert.type.toUpperCase()} priority green light wave enabled along Market St corridor.
            </p>
          </div>
        </div>
      )}

      {/* Leaflet Map Container */}
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Selected Vehicle Telemetry Drawer */}
      {selectedVehicle && (
        <div className="absolute bottom-6 left-6 z-20 w-80 bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-2xl p-4 shadow-2xl space-y-3 text-white">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                {selectedVehicle.code}
              </span>
              <h3 className="font-bold text-sm text-white mt-1">{selectedVehicle.name}</h3>
              <p className="text-xs text-slate-400">{selectedVehicle.routeName}</p>
            </div>
            <button
              onClick={() => setSelectedVehicle(null)}
              className="text-slate-400 hover:text-white text-xs font-bold p-1 rounded bg-slate-800"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60">
              <span className="text-slate-400 text-[10px]">Speed</span>
              <p className="font-bold text-white font-mono">{selectedVehicle.speed} km/h</p>
            </div>
            <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60">
              <span className="text-slate-400 text-[10px]">Occupancy</span>
              <p className="font-bold text-cyan-400 font-mono">{selectedVehicle.occupancy}% ({selectedVehicle.passengerCount}/{selectedVehicle.capacity})</p>
            </div>
            <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60">
              <span className="text-slate-400 text-[10px]">Next Stop</span>
              <p className="font-bold text-white truncate">{selectedVehicle.nextStop}</p>
            </div>
            <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60">
              <span className="text-slate-400 text-[10px]">ETA</span>
              <p className="font-bold text-emerald-400 font-mono">{selectedVehicle.etaNextStop}</p>
            </div>
          </div>

          <div className="pt-1 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800">
            <span>Driver: <strong className="text-slate-200">{selectedVehicle.driverName}</strong></span>
            {selectedVehicle.batteryLevel && (
              <span className="text-emerald-400 flex items-center gap-1 font-bold">
                <Zap className="w-3 h-3" /> {selectedVehicle.batteryLevel.toFixed(0)}%
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
