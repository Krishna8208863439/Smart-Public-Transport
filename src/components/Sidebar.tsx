import React from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  MapPin,
  Compass,
  TrafficCone,
  Wrench,
  QrCode,
  MessageSquareWarning,
  Leaf,
  Siren,
  Bot,
  Sliders,
  ChevronRight
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, emergencyAlert, workOrders, complaints, userRole } = useApp();

  const activeWorkOrdersCount = workOrders.filter((w) => w.status === 'in_progress').length;
  const activeComplaintsCount = complaints.filter((c) => c.status === 'ai_verified').length;

  const navItems = [
    { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'map', label: 'Live City GIS Map', icon: MapPin, badge: 'LIVE' },
    { id: 'planner', label: 'AI Journey Planner', icon: Compass, badge: 'AI' },
    { id: 'traffic', label: 'AI Traffic & Vision', icon: TrafficCone, badge: null, roles: ['operator', 'traffic_police', 'admin'] },
    { id: 'infrastructure', label: 'IoT Asset Maintenance', icon: Wrench, badge: activeWorkOrdersCount ? `${activeWorkOrdersCount}` : null, roles: ['municipal', 'admin'] },
    { id: 'ticketing', label: 'Digital QR Wallet', icon: QrCode, badge: null },
    { id: 'complaints', label: 'Smart Civic Complaints', icon: MessageSquareWarning, badge: activeComplaintsCount ? `${activeComplaintsCount}` : null },
    { id: 'environmental', label: 'Eco & Carbon Analytics', icon: Leaf, badge: null },
    { id: 'emergency', label: 'Emergency SOS Center', icon: Siren, badge: emergencyAlert ? 'ACTIVE' : null, alert: !!emergencyAlert },
    { id: 'copilot', label: 'Smart City AI Assistant', icon: Bot, badge: 'GPT-4' },
  ];

  return (
    <aside className="w-full md:w-64 bg-[#0B0F19] border-r border-slate-800/80 flex flex-col justify-between p-3 shrink-0">
      <div className="space-y-4">
        
        {/* Navigation Category Label */}
        <div className="px-3 py-1">
          <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500">
            Control Navigation ({userRole.replace('_', ' ')})
          </p>
        </div>

        {/* Navigation List */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold shadow-glow-cyan'
                    : item.alert
                    ? 'bg-rose-950/70 text-rose-300 border border-rose-600/50 animate-pulse'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-slate-950' : 'text-cyan-400'}`} />
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span
                      className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md ${
                        item.alert
                          ? 'bg-rose-600 text-white'
                          : isActive
                          ? 'bg-slate-950 text-cyan-300'
                          : 'bg-slate-800 text-cyan-400 border border-slate-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-slate-950" />}
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* System Health Snapshot Footer */}
      <div className="pt-4 border-t border-slate-800/80 px-2 space-y-2">
        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2 text-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span>Fleet Health</span>
            <span className="text-emerald-400 font-mono font-bold">96.8%</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-cyan-400 to-emerald-400 h-full w-[96.8%]"></div>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
            <span>V2I Latency: <strong className="text-slate-300">12ms</strong></span>
            <span>Edge Nodes: <strong className="text-emerald-400">42/42</strong></span>
          </div>
        </div>

        <div className="text-[10px] text-slate-600 text-center py-1 font-mono">
          SmartTransit OS © 2026 Enterprise Edition
        </div>
      </div>
    </aside>
  );
};
