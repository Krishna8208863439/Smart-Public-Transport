import React from 'react';
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
  Sparkles,
  Wrench,
  LogOut,
  User
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    userRole,
    setUserRole,
    currentUser,
    logout,
    isSimulating,
    setIsSimulating,
    emergencyAlert,
    triggerEmergencySOS,
    clearEmergencySOS,
    walletBalance,
    topupWallet,
    environmental,
    vehicles,
    openPaymentModal
  } = useApp();

  const roles: { key: UserRole; label: string; icon: React.ReactNode }[] = [
    { key: 'citizen', label: 'Citizen', icon: <Navigation className="w-3.5 h-3.5" /> },
    { key: 'operator', label: 'Fleet Operator', icon: <Bus className="w-3.5 h-3.5" /> },
    { key: 'admin', label: 'City Admin', icon: <Building2 className="w-3.5 h-3.5" /> },
    { key: 'maintenance', label: 'Maintenance', icon: <Wrench className="w-3.5 h-3.5" /> },
    { key: 'super_admin', label: 'Super Admin', icon: <Shield className="w-3.5 h-3.5" /> }
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0F172A]/95 backdrop-blur-md border-b border-slate-800 text-white px-3 sm:px-5 lg:px-6 py-2.5">
      <div className="w-full flex items-center justify-between gap-3 lg:gap-4">
        
        {/* Left: Branding & Status */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-glow-cyan shrink-0">
            <Bus className="w-5 h-5 text-white" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400"></span>
            </span>
          </div>

          <div className="whitespace-nowrap shrink-0">
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-base sm:text-lg tracking-tight bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400 bg-clip-text text-transparent leading-none">
                SmartTransit AI
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-400 border border-cyan-800/50 whitespace-nowrap">
                v2.5 Enterprise
              </span>
            </div>
            <p className="text-[11px] text-slate-400 flex items-center gap-2 mt-1 leading-none">
              <span>Urban Mobility OS</span>
              <span className="text-slate-600">•</span>
              <span className="text-emerald-400 flex items-center gap-1 font-medium">
                <Radio className="w-3 h-3 animate-pulse" /> Live Telemetry
              </span>
            </p>
          </div>
        </div>

        {/* Center: Ultra-Compact Telemetry Ticker */}
        <div className="hidden xl:flex items-center gap-2.5 px-3 py-1 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 shrink-0 whitespace-nowrap shadow-inner">
          <div className="flex items-center gap-1">
            <Bus className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="text-white font-semibold">{vehicles.length} Active</span>
          </div>
          <span className="text-slate-700 select-none">•</span>
          <div className="flex items-center gap-1">
            <Activity className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="text-emerald-400 font-semibold">AQI {environmental.aqi}</span>
          </div>
          <span className="text-slate-700 select-none">•</span>
          <div className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="text-amber-300 font-semibold">{(environmental.co2OffsetTodayKg / 1000).toFixed(1)}t CO₂</span>
          </div>
        </div>

        {/* Right: Controls, Profile & Always-Visible Logout */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          
          {/* Wallet Balance Widget */}
          <button
            onClick={() => openPaymentModal(20)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700/70 text-xs font-medium text-slate-200 transition-all hover:border-cyan-500/50 whitespace-nowrap shrink-0"
            title="Click to Top up Wallet via Payment Gateway"
          >
            <Wallet className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="font-semibold">${walletBalance.toFixed(2)}</span>
            <span className="text-[10px] text-cyan-400 bg-cyan-950 px-1 py-0.2 rounded font-mono font-bold border border-cyan-800/60">+ Add</span>
          </button>

          {/* Simulation Toggle */}
          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className={`hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all whitespace-nowrap shrink-0 ${
              isSimulating
                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60'
                : 'bg-amber-950/60 border-amber-500/40 text-amber-300 hover:bg-amber-900/60'
            }`}
          >
            {isSimulating ? <Pause className="w-3.5 h-3.5 shrink-0" /> : <Play className="w-3.5 h-3.5 shrink-0" />}
            <span className="hidden lg:inline">{isSimulating ? 'Simulating' : 'Paused'}</span>
          </button>

          {/* Emergency SOS Override */}
          {emergencyAlert ? (
            <button
              onClick={clearEmergencySOS}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-glow-red animate-pulse whitespace-nowrap shrink-0"
            >
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span>SOS ACTIVE</span>
            </button>
          ) : (
            <button
              onClick={() => triggerEmergencySOS('ambulance', 'Central Command')}
              className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-rose-950/80 hover:bg-rose-900 border border-rose-600/50 text-rose-300 transition-all hover:shadow-glow-red whitespace-nowrap shrink-0"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span>Emergency SOS</span>
            </button>
          )}

          {/* Single Active Logged-In User Profile */}
          <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-2.5 py-1.5 rounded-xl shrink-0">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-extrabold text-slate-950 text-xs shadow-glow-cyan shrink-0">
              {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="text-left whitespace-nowrap">
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <span className="truncate max-w-[90px] sm:max-w-[130px]">{currentUser?.name || 'User'}</span>
                <span className="text-[10px] text-cyan-300 bg-cyan-950 px-1.5 py-0.2 rounded font-mono font-bold border border-cyan-800/80">
                  {currentUser?.roleTitle || userRole.replace('_', ' ').toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Prominent Red Logout Button */}
          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-extrabold transition-all shadow-glow-red hover:scale-105 shrink-0"
            title="Click to Sign Out"
          >
            <LogOut className="w-3.5 h-3.5 text-white shrink-0" />
            <span>Logout</span>
          </button>

        </div>
      </div>
    </header>
  );
};

