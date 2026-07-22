import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bus,
  Activity,
  ShieldAlert,
  Leaf,
  TrendingDown,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Zap,
  ArrowUpRight,
  Radio,
  Sliders,
  ChevronRight,
  Navigation,
  Wrench,
  QrCode
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  CartesianGrid,
  LineChart,
  Line
} from 'recharts';

const DEMAND_DATA = [
  { time: '06:00', passengers: 1200, capacity: 3000 },
  { time: '08:00', passengers: 4800, capacity: 5000 },
  { time: '10:00', passengers: 3100, capacity: 4500 },
  { time: '12:00', passengers: 2400, capacity: 4000 },
  { time: '14:00', passengers: 2900, capacity: 4200 },
  { time: '16:00', passengers: 4200, capacity: 5000 },
  { time: '18:00', passengers: 5100, capacity: 5500 },
  { time: '20:00', passengers: 2100, capacity: 3500 },
];

const TRAFFIC_REDUCTION_DATA = [
  { hour: '08:00', standardDelay: 24, aiOptimizedDelay: 14 },
  { hour: '10:00', standardDelay: 18, aiOptimizedDelay: 10 },
  { hour: '12:00', standardDelay: 15, aiOptimizedDelay: 8 },
  { hour: '14:00', standardDelay: 16, aiOptimizedDelay: 9 },
  { hour: '16:00', standardDelay: 22, aiOptimizedDelay: 12 },
  { hour: '18:00', standardDelay: 28, aiOptimizedDelay: 15 },
];

export const ExecutiveDashboard: React.FC = () => {
  const {
    vehicles,
    signals,
    iotAssets,
    workOrders,
    complaints,
    environmental,
    emergencyAlert,
    setActiveTab,
    userRole
  } = useApp();

  const activeWorkOrdersCount = workOrders.filter((w) => w.status === 'in_progress').length;
  const activeComplaintsCount = complaints.filter((c) => c.status === 'ai_verified').length;
  const criticalAssetsCount = iotAssets.filter((a) => a.status === 'critical').length;

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto text-slate-100">
      
      {/* Top Welcome & Mode Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="space-y-1 z-10">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-extrabold tracking-widest text-cyan-400 bg-cyan-950 px-2.5 py-0.5 rounded-full border border-cyan-800">
              Smart City Command Hub
            </span>
            <span className="text-xs text-slate-400 font-mono">Role: {userRole.toUpperCase()}</span>
          </div>
          <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">
            Intelligent Public Transport & Civic Infrastructure System
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl">
            Real-time multi-modal fleet telemetry, AI traffic signal queue optimization, computer vision violation detection, and IoT infrastructure maintenance engine.
          </p>
        </div>

        <div className="flex items-center gap-3 z-10">
          <button
            onClick={() => setActiveTab('planner')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-xs shadow-glow-cyan transition-all"
          >
            <Navigation className="w-4 h-4" />
            <span>AI Journey Planner</span>
          </button>
          
          <button
            onClick={() => setActiveTab('traffic')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-all"
          >
            <Sliders className="w-4 h-4 text-amber-400" />
            <span>Traffic Signals</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Active Transit Vehicles */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-3 relative overflow-hidden group hover:border-cyan-500/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Live Active Fleet</span>
            <div className="p-2 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800">
              <Bus className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white font-mono">{vehicles.length} Vehicles</div>
            <p className="text-xs text-emerald-400 flex items-center gap-1 mt-0.5">
              <CheckCircle2 className="w-3 h-3" /> 92.4% On Schedule
            </p>
          </div>
          <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-800 flex justify-between">
            <span>Electric Buses: <strong className="text-slate-300">3/5</strong></span>
            <span>Metro Trains: <strong className="text-slate-300">1 Line</strong></span>
          </div>
        </div>

        {/* Card 2: AI Traffic Signal Grid */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-3 relative overflow-hidden group hover:border-amber-500/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Traffic Congestion Grid</span>
            <div className="p-2 rounded-xl bg-amber-950 text-amber-400 border border-amber-800">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white font-mono">18% (Low)</div>
            <p className="text-xs text-amber-400 flex items-center gap-1 mt-0.5">
              <TrendingDown className="w-3 h-3" /> -28.5% Wait Time via AI
            </p>
          </div>
          <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-800 flex justify-between">
            <span>Active Signals: <strong className="text-slate-300">{signals.length}</strong></span>
            <span>AI Timing: <strong className="text-emerald-400">AUTO</strong></span>
          </div>
        </div>

        {/* Card 3: IoT Infrastructure Health */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-3 relative overflow-hidden group hover:border-emerald-500/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">IoT Infrastructure</span>
            <div className="p-2 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800">
              <Wrench className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white font-mono">82% Avg Health</div>
            <p className="text-xs text-rose-400 flex items-center gap-1 mt-0.5">
              <AlertTriangle className="w-3 h-3" /> {criticalAssetsCount} Critical Risk Assets
            </p>
          </div>
          <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-800 flex justify-between">
            <span>Work Orders: <strong className="text-amber-400">{activeWorkOrdersCount} Active</strong></span>
            <span>Inspected: <strong className="text-slate-300">Today</strong></span>
          </div>
        </div>

        {/* Card 4: Environmental & Carbon */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-3 relative overflow-hidden group hover:border-emerald-500/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Air Quality & Carbon</span>
            <div className="p-2 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800">
              <Leaf className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-emerald-400 font-mono">AQI {environmental.aqi}</div>
            <p className="text-xs text-slate-300 flex items-center gap-1 mt-0.5">
              <Zap className="w-3 h-3 text-amber-400" /> {(environmental.co2OffsetTodayKg / 1000).toFixed(1)}t CO₂ Saved
            </p>
          </div>
          <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-800 flex justify-between">
            <span>Status: <strong className="text-emerald-400">{environmental.status}</strong></span>
            <span>PM2.5: <strong className="text-slate-300">{environmental.pm25} µg/m³</strong></span>
          </div>
        </div>

      </div>

      {/* Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Hourly Passenger Demand vs Fleet Capacity */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-white">Passenger Demand vs Transit Capacity</h3>
              <p className="text-xs text-slate-400">Real-time load balancing across bus & metro lines</p>
            </div>
            <span className="text-[10px] uppercase font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
              Live Hourly Feed
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={DEMAND_DATA}>
                <defs>
                  <linearGradient id="colorCap" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPass" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00E676" stopOpacity={0.5}/>
                    <stop offset="95%" stopColor="#00E676" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', borderRadius: '12px', fontSize: '12px' }} />
                <Area type="monotone" dataKey="capacity" name="Vehicle Capacity" stroke="#0ea5e9" fillOpacity={1} fill="url(#colorCap)" strokeWidth={2} />
                <Area type="monotone" dataKey="passengers" name="Actual Passengers" stroke="#00E676" fillOpacity={1} fill="url(#colorPass)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Traffic Signal AI Optimization Delay Reduction */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-white">AI Signal Delay Reduction (mins)</h3>
              <p className="text-xs text-slate-400">Comparing fixed timer vs adaptive AI traffic control</p>
            </div>
            <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
              -28.5% Congestion
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={TRAFFIC_REDUCTION_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="hour" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', borderRadius: '12px', fontSize: '12px' }} />
                <Bar dataKey="standardDelay" name="Legacy Fixed Timing (mins)" fill="#475569" radius={[6, 6, 0, 0]} />
                <Bar dataKey="aiOptimizedDelay" name="AI Adaptive Control (mins)" fill="#00F2FE" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Bottom Row: Real-Time Event Stream & Quick Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Real-time Telemetry Activity Feed */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
              <h3 className="font-bold text-sm text-white">Live System Events Stream</h3>
            </div>
            <span className="text-[10px] font-mono text-slate-500">Real-Time</span>
          </div>

          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs space-y-1">
              <div className="flex justify-between font-bold">
                <span className="text-cyan-400">BUS-402 (Electric)</span>
                <span className="text-slate-500 font-mono">10:14 AM</span>
              </div>
              <p className="text-slate-300">Arrived at Central Plaza Hub. Passenger load: 68%.</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs space-y-1">
              <div className="flex justify-between font-bold">
                <span className="text-amber-400">AI Traffic Signal #sig-1</span>
                <span className="text-slate-500 font-mono">10:12 AM</span>
              </div>
              <p className="text-slate-300">Adjusted green light timer to 45s due to heavy Market St queue.</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs space-y-1">
              <div className="flex justify-between font-bold">
                <span className="text-rose-400">IoT Sensor Warning</span>
                <span className="text-slate-500 font-mono">10:08 AM</span>
              </div>
              <p className="text-slate-300">Downtown Drainage Sensor #4 flagged 94% moisture level.</p>
            </div>
          </div>
        </div>

        {/* Quick Portal Action Panels */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          <div
            onClick={() => setActiveTab('complaints')}
            className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition-all space-y-3 group"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-cyan-400 transition-transform group-hover:translate-x-1" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Smart Civic Complaint Portal</h4>
              <p className="text-xs text-slate-400 mt-1">
                Report potholes, broken streetlights & water leaks with instant AI photo verification.
              </p>
            </div>
            <div className="text-xs text-cyan-400 font-semibold pt-1">
              {activeComplaintsCount} Complaints Pending AI Verification →
            </div>
          </div>

          <div
            onClick={() => setActiveTab('ticketing')}
            className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 hover:border-emerald-500/50 cursor-pointer transition-all space-y-3 group"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800">
                <QrCode className="w-5 h-5" />
              </div>
              <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-emerald-400 transition-transform group-hover:translate-x-1" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Digital QR & NFC Wallet</h4>
              <p className="text-xs text-slate-400 mt-1">
                Tap-to-pay bus & metro tickets, NFC monthly passes, and digital wallet balance.
              </p>
            </div>
            <div className="text-xs text-emerald-400 font-semibold pt-1">
              Instant QR Ticket Booking →
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
