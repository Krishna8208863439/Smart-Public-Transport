import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TrafficSignal, VisionDetection } from '../../types';
import {
  Sliders,
  Shield,
  Camera,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Radio,
  Play,
  RotateCcw,
  Zap,
  Eye,
  Siren
} from 'lucide-react';

export const TrafficSignalController: React.FC = () => {
  const {
    signals,
    toggleSignalAI,
    overrideSignalStatus,
    visionDetections,
    triggerEmergencySOS,
    emergencyAlert,
    clearEmergencySOS
  } = useApp();

  const [selectedSignalId, setSelectedSignalId] = useState<string>(signals[0]?.id || '');
  const [selectedCam, setSelectedCam] = useState<string>('CCTV-CAM-04 (Market St)');

  const currentSignal = signals.find((s) => s.id === selectedSignalId) || signals[0];

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6 text-slate-100">
      
      {/* Title & Emergency Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              AI Traffic Signal Grid & Computer Vision Center
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Real-time adaptive signal control, automated queue balancing, and computer vision traffic violation detection.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {emergencyAlert ? (
            <button
              onClick={clearEmergencySOS}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-glow-red animate-pulse"
            >
              <Siren className="w-4 h-4" /> Deactivate Green Corridor
            </button>
          ) : (
            <button
              onClick={() => triggerEmergencySOS('ambulance', 'Market St Intersection')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-950 border border-rose-600/50 hover:bg-rose-900 text-rose-300 font-bold text-xs transition-all hover:shadow-glow-red"
            >
              <Siren className="w-4 h-4 text-rose-400" /> Trigger Emergency Green Corridor
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Signals Control Panel + CCTV Computer Vision Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Signals Junction List & Detailed Control */}
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <h3 className="font-bold text-sm text-white flex items-center justify-between">
              <span>Traffic Junctions</span>
              <span className="text-[10px] text-cyan-400 font-mono">AI Adaptive</span>
            </h3>

            <div className="space-y-2">
              {signals.map((sig) => (
                <div
                  key={sig.id}
                  onClick={() => setSelectedSignalId(sig.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedSignalId === sig.id
                      ? 'bg-slate-800 border-cyan-500 shadow-glow-cyan'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-white">{sig.name}</span>
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded font-mono ${
                        sig.status === 'green'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : sig.status === 'yellow'
                          ? 'bg-amber-950 text-amber-400 border border-amber-800'
                          : 'bg-rose-950 text-rose-400 border border-rose-800'
                      }`}
                    >
                      {sig.status.toUpperCase()} ({sig.timerSeconds}s)
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
                    <span>Density: <strong className="uppercase font-bold text-slate-200">{sig.vehicleDensity}</strong></span>
                    <span className="text-cyan-400 font-semibold">{sig.aiMode ? 'AI Auto' : 'Manual'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Selected Signal Controls */}
          {currentSignal && (
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h4 className="font-bold text-sm text-white">{currentSignal.name}</h4>
                  <p className="text-xs text-slate-400">{currentSignal.intersection}</p>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-800 px-2.5 py-1 rounded-xl text-xs">
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="font-bold text-cyan-300">{currentSignal.aiMode ? 'AI On' : 'Manual'}</span>
                </div>
              </div>

              {/* AI Mode Toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs">
                <div>
                  <span className="font-bold text-white">AI Adaptive Optimization</span>
                  <p className="text-[11px] text-slate-400">Dynamically adjust green split based on live CCTV queue</p>
                </div>
                <button
                  onClick={() => toggleSignalAI(currentSignal.id)}
                  className={`px-3 py-1.5 rounded-xl font-extrabold transition-all ${
                    currentSignal.aiMode
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-slate-700 text-slate-300'
                  }`}
                >
                  {currentSignal.aiMode ? 'ENABLED' : 'DISABLED'}
                </button>
              </div>

              {/* Manual Override Buttons */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-400">Manual State Override</span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => overrideSignalStatus(currentSignal.id, 'red')}
                    className="py-2 rounded-xl bg-rose-950 border border-rose-600 text-rose-300 font-bold text-xs hover:bg-rose-900"
                  >
                    Force RED
                  </button>
                  <button
                    onClick={() => overrideSignalStatus(currentSignal.id, 'yellow')}
                    className="py-2 rounded-xl bg-amber-950 border border-amber-600 text-amber-300 font-bold text-xs hover:bg-amber-900"
                  >
                    Force YELLOW
                  </button>
                  <button
                    onClick={() => overrideSignalStatus(currentSignal.id, 'green')}
                    className="py-2 rounded-xl bg-emerald-950 border border-emerald-600 text-emerald-300 font-bold text-xs hover:bg-emerald-900"
                  >
                    Force GREEN
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: CCTV Computer Vision Analytics & Violation Feed */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Simulated CCTV Camera Feed Box */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-cyan-400" />
                <h3 className="font-bold text-sm text-white">Live Computer Vision Stream (ANPR & Object Detection)</h3>
              </div>
              <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                <Radio className="w-3 h-3 animate-pulse" /> 30 FPS YOLOv11 Engine
              </span>
            </div>

            {/* Video Feed Simulation Display */}
            <div className="relative w-full h-72 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden group">
              <img
                src="https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=1000&auto=format&fit=crop&q=80"
                alt="Traffic CCTV Feed"
                className="w-full h-full object-cover opacity-60"
              />

              {/* Bounding Box Overlays */}
              <div className="absolute top-12 left-16 border-2 border-emerald-400 bg-emerald-500/20 p-1.5 rounded text-[10px] font-mono text-emerald-300 font-bold">
                [CAR] 98% Conf | Plate: 7XYZ892
              </div>

              <div className="absolute bottom-16 right-24 border-2 border-amber-400 bg-amber-500/20 p-1.5 rounded text-[10px] font-mono text-amber-300 font-bold">
                [ILLEGAL PARKING] 96% Conf
              </div>

              <div className="absolute top-6 right-6 border border-cyan-500/50 bg-slate-900/80 backdrop-blur p-2 rounded-xl text-xs space-y-1">
                <div className="text-slate-400 text-[10px]">ANPR OCR Active</div>
                <div className="text-cyan-400 font-mono font-bold">7XYZ892 • PASSED</div>
              </div>

              <div className="absolute bottom-4 left-4 flex items-center gap-3 text-xs bg-slate-900/90 backdrop-blur px-3 py-1.5 rounded-xl border border-slate-800">
                <span className="text-slate-400">Stream: <strong className="text-white">{selectedCam}</strong></span>
                <span className="text-slate-700">|</span>
                <span className="text-emerald-400 font-bold">Vehicle Count: 14</span>
              </div>
            </div>
          </div>

          {/* Computer Vision Flagged Violations List */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Eye className="w-4 h-4 text-amber-400" />
              <span>Flagged Traffic Violations & Incidents</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {visionDetections.map((det) => (
                <div key={det.id} className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-rose-400 uppercase tracking-wider text-[10px] bg-rose-950 px-2 py-0.5 rounded border border-rose-800">
                      {det.type.replace('_', ' ')}
                    </span>
                    <span className="text-slate-400 font-mono text-[10px]">{det.timestamp}</span>
                  </div>

                  <div className="text-xs">
                    <div className="font-bold text-white">{det.cameraName}</div>
                    <p className="text-slate-400 text-[11px]">{det.location}</p>
                  </div>

                  {det.licensePlate && (
                    <div className="flex items-center justify-between pt-1 border-t border-slate-700/50 text-xs">
                      <span className="text-slate-400">License Plate:</span>
                      <strong className="text-amber-300 font-mono font-bold">{det.licensePlate}</strong>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
