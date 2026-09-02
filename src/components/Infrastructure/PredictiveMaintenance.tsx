import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { predictAssetFailure } from '../../services/aiService';
import { IoTAsset, WorkOrder } from '../../types';
import {
  Wrench,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Plus,
  Building,
  Zap,
  Droplets,
  Gauge,
  Sliders,
  ChevronRight
} from 'lucide-react';

export const PredictiveMaintenance: React.FC = () => {
  const { iotAssets, workOrders, createWorkOrder, resolveWorkOrder } = useApp();

  const [selectedAssetId, setSelectedAssetId] = useState<string>(iotAssets[0]?.id || '');
  const [showWoModal, setShowWoModal] = useState(false);
  const [woPriority, setWoPriority] = useState<WorkOrder['priority']>('high');
  const [woDesc, setWoDesc] = useState('');

  const selectedAsset = iotAssets.find((a) => a.id === selectedAssetId) || iotAssets[0];
  const failureAnalysis = selectedAsset ? predictAssetFailure(selectedAsset) : null;

  const handleCreateWO = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAsset) return;
    createWorkOrder(selectedAsset.id, woPriority, woDesc || `Maintenance requested for ${selectedAsset.name}`);
    setShowWoModal(false);
    setWoDesc('');
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6 text-slate-100">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Wrench className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              IoT Infrastructure & Predictive Maintenance
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Real-time telemetry for city bridges, streetlights, drainage systems, and road grids with ML failure prediction.
          </p>
        </div>

        <button
          onClick={() => setShowWoModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-extrabold text-xs shadow-glow-green transition-all"
        >
          <Plus className="w-4 h-4" /> Dispatch Work Order
        </button>
      </div>

      {/* Main Layout: Assets Grid + Telemetry & AI Risk Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Assets List Column */}
        <div className="space-y-3">
          <h3 className="font-bold text-sm text-white px-1">City Infrastructure Assets</h3>

          <div className="space-y-2">
            {iotAssets.map((asset) => {
              const analysis = predictAssetFailure(asset);
              const isSelected = selectedAssetId === asset.id;
              
              return (
                <div
                  key={asset.id}
                  onClick={() => setSelectedAssetId(asset.id)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-900 border-emerald-500 shadow-glow-green'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">
                        {asset.category.replace('_', ' ')}
                      </span>
                      <h4 className="font-bold text-xs text-white mt-0.5">{asset.name}</h4>
                    </div>

                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded font-mono ${
                        analysis.status === 'critical'
                          ? 'bg-rose-950 text-rose-400 border border-rose-800'
                          : analysis.status === 'warning'
                          ? 'bg-amber-950 text-amber-400 border border-amber-800'
                          : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      }`}
                    >
                      {analysis.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 mt-2 border-t border-slate-800/80">
                    <span className="text-slate-400">Health Score:</span>
                    <strong className="text-white font-mono">{analysis.healthScore}/100</strong>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Asset Detailed Telemetry & Risk Inspector */}
        <div className="lg:col-span-2 space-y-6">
          
          {selectedAsset && failureAnalysis && (
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <span className="text-xs uppercase font-mono font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                    Asset ID: {selectedAsset.id}
                  </span>
                  <h3 className="text-lg font-bold text-white mt-1">{selectedAsset.name}</h3>
                  <p className="text-xs text-slate-400">Last Sensor Calibration: {selectedAsset.lastInspected}</p>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-extrabold text-rose-400 font-mono">
                    {failureAnalysis.predictedRiskPercent}% Risk
                  </div>
                  <div className="text-xs text-slate-400">Failure Probability</div>
                </div>
              </div>

              {/* Sensor Telemetry Values Grid */}
              <div className="space-y-3">
                <h4 className="font-bold text-xs uppercase text-slate-400">Live Telemetry Readings</h4>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  {selectedAsset.telemetry.vibrationMs2 !== undefined && (
                    <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1">
                      <span className="text-slate-400 text-[10px] flex items-center gap-1">
                        <Activity className="w-3 h-3 text-cyan-400" /> Vibration
                      </span>
                      <p className="font-bold text-white font-mono">{selectedAsset.telemetry.vibrationMs2} m/s²</p>
                    </div>
                  )}

                  {selectedAsset.telemetry.strainMicrostrain !== undefined && (
                    <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1">
                      <span className="text-slate-400 text-[10px] flex items-center gap-1">
                        <Gauge className="w-3 h-3 text-amber-400" /> Structural Strain
                      </span>
                      <p className="font-bold text-white font-mono">{selectedAsset.telemetry.strainMicrostrain} µε</p>
                    </div>
                  )}

                  {selectedAsset.telemetry.moisturePercent !== undefined && (
                    <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1">
                      <span className="text-slate-400 text-[10px] flex items-center gap-1">
                        <Droplets className="w-3 h-3 text-blue-400" /> Moisture Index
                      </span>
                      <p className="font-bold text-white font-mono">{selectedAsset.telemetry.moisturePercent}%</p>
                    </div>
                  )}

                  {selectedAsset.telemetry.powerConsumptionKw !== undefined && (
                    <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1">
                      <span className="text-slate-400 text-[10px] flex items-center gap-1">
                        <Zap className="w-3 h-3 text-amber-400" /> Power Load
                      </span>
                      <p className="font-bold text-white font-mono">{selectedAsset.telemetry.powerConsumptionKw} kW</p>
                    </div>
                  )}
                </div>
              </div>

              {/* AI Recommendation Box */}
              <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 text-xs space-y-1">
                <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> AI Maintenance Recommendation
                </span>
                <p className="text-slate-300 leading-relaxed">{failureAnalysis.recommendation}</p>
              </div>

            </div>
          )}

          {/* Work Orders List */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="font-bold text-sm text-white">Active Maintenance Work Orders ({workOrders.length})</h3>

            <div className="space-y-2">
              {workOrders.map((wo) => (
                <div key={wo.id} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{wo.assetName}</span>
                      <span className="text-[10px] font-mono uppercase font-bold text-amber-400 bg-amber-950 px-1.5 py-0.5 rounded border border-amber-800">
                        {wo.priority}
                      </span>
                    </div>
                    <p className="text-slate-400 text-[11px] mt-0.5">{wo.description}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    {wo.status === 'in_progress' ? (
                      <button
                        onClick={() => resolveWorkOrder(wo.id)}
                        className="px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-[11px]"
                      >
                        Mark Resolved
                      </button>
                    ) : (
                      <span className="text-emerald-400 font-bold">✓ Resolved</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Work Order Modal */}
      {showWoModal && selectedAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-[#0F172A] border border-slate-700/80 rounded-3xl p-6 sm:p-7 w-full max-w-md shadow-2xl space-y-5 text-white relative overflow-hidden">
            
            {/* Ambient Corner Glow */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-start justify-between relative z-10">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-emerald-950/80 border border-emerald-800 text-emerald-400 shadow-glow-green">
                  <Wrench className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-white tracking-tight">
                    Dispatch Maintenance Squad
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Target: <strong className="text-emerald-400">{selectedAsset.name}</strong>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowWoModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
                title="Close"
              >
                <ChevronRight className="w-5 h-5 rotate-90" />
              </button>
            </div>

            <form onSubmit={handleCreateWO} className="space-y-4 relative z-10">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Priority Level</label>
                <select
                  value={woPriority}
                  onChange={(e) => setWoPriority(e.target.value as any)}
                  className="w-full bg-slate-950/80 border border-slate-700/90 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-400"
                >
                  <option value="low">Low Priority (Routine Checkup)</option>
                  <option value="medium">Medium Priority (Scheduled Inspection)</option>
                  <option value="high">High Priority (Urgent Repair)</option>
                  <option value="critical">CRITICAL (Immediate Dispatch Required)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Instructions for Repair Squad</label>
                <textarea
                  rows={3}
                  value={woDesc}
                  onChange={(e) => setWoDesc(e.target.value)}
                  placeholder="Specify sensor telemetry warnings, part replacement, or diagnostic instructions..."
                  className="w-full bg-slate-950/80 border border-slate-700/90 rounded-xl p-3.5 text-xs text-white focus:outline-none focus:border-emerald-400 placeholder-slate-600"
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowWoModal(false)}
                  className="flex-1 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all border border-slate-700/60"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-slate-950 text-xs font-extrabold shadow-glow-green transition-all flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm Dispatch</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
