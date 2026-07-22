import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import {
  Bus,
  Shield,
  Activity,
  AlertTriangle,
  Wallet,
  Play,
  Pause,
  UserCheck,
  Building2,
  Navigation,
  Radio,
  Sparkles
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    userRole,
    setUserRole,
    isSimulating,
    setIsSimulating,
    emergencyAlert,
    triggerEmergencySOS,
    clearEmergencySOS,
    walletBalance,
    topupWallet,
    environmental,
    vehicles
  } = useApp();

  const [showTopupModal, setShowTopupModal] = useState(false);
  const [topupAmount, setTopupAmount] = useState(20);

  const roles: { key: UserRole; label: string; icon: React.ReactNode }[] = [
    { key: 'citizen', label: 'Citizen Portal', icon: <Navigation className="w-3.5 h-3.5" /> },
    { key: 'operator', label: 'Fleet Operator', icon: <Bus className="w-3.5 h-3.5" /> },
    { key: 'traffic_police', label: 'Traffic Police', icon: <Shield className="w-3.5 h-3.5" /> },
    { key: 'municipal', label: 'Municipal Corp', icon: <Building2 className="w-3.5 h-3.5" /> },
    { key: 'admin', label: 'City Admin', icon: <UserCheck className="w-3.5 h-3.5" /> }
  ];

  const handleTopupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    topupWallet(topupAmount);
    setShowTopupModal(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0F172A]/90 backdrop-blur-md border-b border-slate-800 text-white px-4 lg:px-6 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        
        {/* Left: Branding & Status */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-glow-cyan">
            <Bus className="w-6 h-6 text-white" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-400"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400 bg-clip-text text-transparent">
                SmartTransit AI
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-400 border border-cyan-800/50">
                v2.5 Enterprise
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-2">
              <span>Urban Mobility OS</span>
              <span className="text-slate-600">•</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <Radio className="w-3 h-3 animate-pulse" /> Live Telemetry
              </span>
            </p>
          </div>
        </div>

        {/* Center: System Telemetry Ticker */}
        <div className="hidden xl:flex items-center gap-4 px-4 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
          <div className="flex items-center gap-1.5">
            <Bus className="w-3.5 h-3.5 text-cyan-400" />
            <span>Vehicles:</span>
            <strong className="text-white">{vehicles.length} Active</strong>
          </div>
          <span className="text-slate-700">|</span>
          <div className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>AQI:</span>
            <strong className="text-emerald-400">{environmental.aqi} ({environmental.status})</strong>
          </div>
          <span className="text-slate-700">|</span>
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>CO₂ Saved:</span>
            <strong className="text-amber-300">{(environmental.co2OffsetTodayKg / 1000).toFixed(1)}t</strong>
          </div>
        </div>

        {/* Right: Controls, Role Switcher & Emergency SOS */}
        <div className="flex items-center flex-wrap gap-2.5 justify-end">
          
          {/* Wallet Balance Widget */}
          <button
            onClick={() => setShowTopupModal(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700/70 text-xs font-medium text-slate-200 transition-all hover:border-cyan-500/50"
            title="Click to Top up Wallet"
          >
            <Wallet className="w-4 h-4 text-emerald-400" />
            <span>${walletBalance.toFixed(2)}</span>
            <span className="text-[10px] text-cyan-400 bg-cyan-950 px-1.5 py-0.5 rounded font-mono">+ Add</span>
          </button>

          {/* Simulation Toggle */}
          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              isSimulating
                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60'
                : 'bg-amber-950/60 border-amber-500/40 text-amber-300 hover:bg-amber-900/60'
            }`}
          >
            {isSimulating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isSimulating ? 'Simulating' : 'Paused'}</span>
          </button>

          {/* Emergency SOS Override */}
          {emergencyAlert ? (
            <button
              onClick={clearEmergencySOS}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-glow-red animate-pulse"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>SOS ACTIVE (Clear)</span>
            </button>
          ) : (
            <button
              onClick={() => triggerEmergencySOS('ambulance', 'Central Command')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-950/80 hover:bg-rose-900 border border-rose-600/50 text-rose-300 transition-all hover:shadow-glow-red"
            >
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>Emergency SOS</span>
            </button>
          )}

          {/* Role Switcher Pill Group */}
          <div className="hidden sm:flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800">
            {roles.map((r) => (
              <button
                key={r.key}
                onClick={() => setUserRole(r.key)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  userRole === r.key
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {r.icon}
                <span>{r.label}</span>
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Wallet Topup Modal */}
      {showTopupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-sm shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Wallet className="w-5 h-5 text-emerald-400" /> Top Up Digital Transit Wallet
            </h3>
            <p className="text-xs text-slate-400">
              Select or enter an amount to instant load via UPI / Credit / Apple Pay.
            </p>
            
            <form onSubmit={handleTopupSubmit} className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                {[10, 25, 50].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setTopupAmount(amt)}
                    className={`py-2 rounded-xl border text-sm font-bold transition-all ${
                      topupAmount === amt
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    +${amt}
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Custom Amount ($)</label>
                <input
                  type="number"
                  min="1"
                  max="500"
                  value={topupAmount}
                  onChange={(e) => setTopupAmount(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-semibold focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTopupModal(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-extrabold shadow-glow-green"
                >
                  Confirm Top-Up
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};
