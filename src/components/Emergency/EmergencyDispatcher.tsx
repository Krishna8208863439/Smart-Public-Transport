import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Siren, ShieldAlert, AlertTriangle, Radio, CheckCircle2, Navigation, Send } from 'lucide-react';

export const EmergencyDispatcher: React.FC = () => {
  const { emergencyAlert, triggerEmergencySOS, clearEmergencySOS } = useApp();
  const [broadcastMsg, setBroadcastMsg] = useState('');
  const [broadcastSent, setBroadcastSent] = useState(false);

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMsg) return;
    setBroadcastSent(true);
    setTimeout(() => {
      setBroadcastSent(false);
      setBroadcastMsg('');
    }, 2500);
  };

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-6 text-slate-100">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Siren className="w-5 h-5 text-rose-500 animate-pulse" />
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              Emergency SOS & Priority Dispatch Center
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Rapid priority corridor green wave routing for ambulances, fire engines, and emergency services.
          </p>
        </div>

        {emergencyAlert && (
          <div className="flex items-center gap-2 bg-rose-950 border border-rose-600 px-3.5 py-2 rounded-2xl text-xs font-bold text-rose-200 animate-pulse shadow-glow-red">
            <Radio className="w-4 h-4 text-rose-400" />
            <span>EMERGENCY CORRIDOR OVERRIDE ACTIVE</span>
          </div>
        )}
      </div>

      {/* Main Grid: SOS Controls + Emergency Broadcast */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left Column: Quick Priority Dispatch Buttons */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-5">
          <h3 className="font-bold text-sm text-white flex items-center justify-between">
            <span>Trigger Emergency Priority Wave</span>
            <span className="text-[10px] text-rose-400 font-mono">V2I Protocol</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => triggerEmergencySOS('ambulance', 'Medical Dispatch Center')}
              className="p-4 rounded-xl bg-rose-950/80 border border-rose-600 hover:bg-rose-900 text-left space-y-1 transition-all group"
            >
              <div className="text-xs font-extrabold text-rose-300 uppercase tracking-wider flex items-center justify-between">
                <span>Ambulance Priority</span>
                <Siren className="w-4 h-4 text-rose-400 group-hover:animate-bounce" />
              </div>
              <p className="text-[11px] text-slate-300">Force Market St & 4th St signals GREEN</p>
            </button>

            <button
              onClick={() => triggerEmergencySOS('fire', 'Central Fire Station #2')}
              className="p-4 rounded-xl bg-amber-950/80 border border-amber-600 hover:bg-amber-900 text-left space-y-1 transition-all group"
            >
              <div className="text-xs font-extrabold text-amber-300 uppercase tracking-wider flex items-center justify-between">
                <span>Fire Response</span>
                <AlertTriangle className="w-4 h-4 text-amber-400 group-hover:animate-bounce" />
              </div>
              <p className="text-[11px] text-slate-300">Clear Civic Center overpass route</p>
            </button>
          </div>

          {emergencyAlert ? (
            <button
              onClick={clearEmergencySOS}
              className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-all"
            >
              Deactivate SOS & Resume Standard AI Signals
            </button>
          ) : (
            <p className="text-[11px] text-slate-500 text-center">
              No emergency overrides currently active. Signals operating on AI optimization mode.
            </p>
          )}
        </div>

        {/* Right Column: City Emergency Broadcast Modal */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-4">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <Radio className="w-4 h-4 text-cyan-400" />
            <span>Citywide Emergency Alert Broadcast</span>
          </h3>
          <p className="text-xs text-slate-400">
            Broadcast urgent traffic detour or public safety push notifications to citizen mobile apps & digital bus shelter displays.
          </p>

          <form onSubmit={handleSendBroadcast} className="space-y-4">
            <textarea
              rows={4}
              value={broadcastMsg}
              onChange={(e) => setBroadcastMsg(e.target.value)}
              placeholder="e.g. URGENT: Market St Closed due to emergency vehicle passage. Use Mission St detour."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-500"
            />

            <button
              type="submit"
              disabled={broadcastSent}
              className={`w-full py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
                broadcastSent
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white shadow-glow-red'
              }`}
            >
              {broadcastSent ? (
                <>
                  <CheckCircle2 className="w-4 h-4" /> Broadcast Pushed to All Mobile Apps!
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" /> Transmit Emergency City Broadcast
                </>
              )}
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};
