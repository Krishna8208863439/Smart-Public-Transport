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
  ChevronRight,
  LogOut,
  User,
  ShieldCheck
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, emergencyAlert, workOrders, complaints, userRole, currentUser, logout } = useApp();

  const activeWorkOrdersCount = workOrders.filter((w) => w.status === 'in_progress').length;
  const activeComplaintsCount = complaints.filter((c) => c.status === 'ai_verified').length;

  const allNavItems = [
    { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard, badge: null, roles: ['admin', 'operator', 'super_admin'] },
    { id: 'map', label: 'Live City GIS Map', icon: MapPin, badge: 'LIVE', roles: ['operator', 'admin', 'super_admin'] },
    { id: 'planner', label: 'AI Journey Planner', icon: Compass, badge: 'AI', roles: ['citizen', 'super_admin'] },
    { id: 'traffic', label: 'AI Traffic & Vision', icon: TrafficCone, badge: null, roles: ['admin', 'super_admin'] },
    { id: 'infrastructure', label: 'IoT Asset Maintenance', icon: Wrench, badge: activeWorkOrdersCount ? `${activeWorkOrdersCount}` : null, roles: ['maintenance', 'admin', 'super_admin'] },
    { id: 'ticketing', label: 'Digital QR Wallet', icon: QrCode, badge: null, roles: ['citizen', 'super_admin'] },
    { id: 'complaints', label: 'Smart Civic Complaints', icon: MessageSquareWarning, badge: activeComplaintsCount ? `${activeComplaintsCount}` : null, roles: ['citizen', 'maintenance', 'super_admin'] },
    { id: 'environmental', label: 'Eco & Carbon Analytics', icon: Leaf, badge: null, roles: ['admin', 'super_admin'] },
    { id: 'emergency', label: 'Emergency SOS Center', icon: Siren, badge: emergencyAlert ? 'ACTIVE' : null, alert: !!emergencyAlert, roles: ['citizen', 'operator', 'admin', 'maintenance', 'super_admin'] },
    { id: 'copilot', label: 'Smart City AI Assistant', icon: Bot, badge: 'AI', roles: ['citizen', 'operator', 'admin', 'maintenance', 'super_admin'] },
  ];

  // Filter items matching user's active role
  const visibleNavItems = allNavItems.filter((item) => {
    if (userRole === 'super_admin') return true;
    return item.roles.includes(userRole);
  });

  const getRoleDisplayName = (r: string) => {
    switch (r) {
      case 'citizen': return '👤 Citizen';
      case 'operator': return '🚍 Fleet Operator';
      case 'admin': return '🏛️ City Admin';
      case 'maintenance': return '🛠️ Maintenance Lead';
      case 'super_admin': return '⚡ Super Admin';
      default: return r;
    }
  };

  return (
    <aside className="w-full md:w-64 bg-[#0B0F19] border-r border-slate-800/80 flex flex-col justify-between p-3 shrink-0">
      <div className="space-y-4">
        
        {/* Navigation Category Label */}
        <div className="px-3 py-1 flex items-center justify-between">
          <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500">
            Control Navigation
          </p>
          <span className="text-[10px] font-bold text-cyan-400 font-mono bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/60">
            {getRoleDisplayName(userRole)}
          </span>
        </div>

        {/* Navigation List */}
        <nav className="space-y-1">
          {visibleNavItems.map((item) => {
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

      {/* User Profile & Sign Out Footer */}
      <div className="pt-3 border-t border-slate-800/80 px-1 space-y-2">
        {currentUser && (
          <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-slate-950 text-xs shrink-0">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="overflow-hidden">
                  <h4 className="font-extrabold text-xs text-white truncate">{currentUser.name}</h4>
                  <p className="text-[10px] text-slate-400 truncate">{currentUser.email}</p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={logout}
              className="w-full py-1.5 px-2.5 rounded-xl bg-slate-800 hover:bg-rose-950/80 hover:text-rose-300 hover:border-rose-600/50 border border-slate-700/60 text-slate-300 text-xs font-semibold transition-all flex items-center justify-center gap-2"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-400" />
              <span>Sign Out</span>
            </button>
          </div>
        )}

        <div className="text-[10px] text-slate-600 text-center py-0.5 font-mono">
          SmartTransit OS © 2026 Enterprise
        </div>
      </div>
    </aside>
  );
};
