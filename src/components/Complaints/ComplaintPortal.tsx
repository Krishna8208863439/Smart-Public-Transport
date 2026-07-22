import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CivicComplaint } from '../../types';
import {
  MessageSquareWarning,
  Plus,
  ThumbsUp,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  MapPin,
  Camera,
  ShieldCheck,
  Building2
} from 'lucide-react';

export const ComplaintPortal: React.FC = () => {
  const { complaints, addComplaint, upvoteComplaint } = useApp();

  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CivicComplaint['category']>('pothole');
  const [address, setAddress] = useState('Market St & 8th Ave Junction');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;
    addComplaint(title, category, description, address);
    setShowModal(false);
    setTitle('');
    setDescription('');
  };

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-6 text-slate-100">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <MessageSquareWarning className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              Smart Civic Complaint & Infrastructure Portal
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Citizen issue reporting with AI photo verification, priority assessment, and automated municipal department routing.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-xs shadow-glow-cyan transition-all"
        >
          <Plus className="w-4 h-4" /> Report Civic Issue
        </button>
      </div>

      {/* Complaints List Grid */}
      <div className="space-y-4">
        <h3 className="font-bold text-sm text-white px-1">Reported Civic Issues ({complaints.length})</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {complaints.map((cmp) => (
            <div
              key={cmp.id}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                
                {/* Header Row */}
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                      {cmp.category.replace('_', ' ')}
                    </span>
                    <h4 className="font-bold text-sm text-white mt-1.5">{cmp.title}</h4>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-rose-400" /> {cmp.address}
                    </p>
                  </div>

                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded font-mono ${
                      cmp.status === 'resolved'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-amber-950 text-amber-400 border border-amber-800'
                    }`}
                  >
                    {cmp.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed bg-slate-800/40 p-3 rounded-xl border border-slate-800">
                  {cmp.description}
                </p>

                {/* AI Verification Badge Card */}
                {cmp.aiVerification && (
                  <div className="p-3 rounded-xl bg-slate-800/80 border border-cyan-500/30 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-cyan-400 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" /> AI Verified ({Math.round(cmp.aiVerification.confidenceScore * 100)}% Conf)
                      </span>
                      <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                        cmp.aiVerification.severityLevel === 'urgent'
                          ? 'bg-rose-950 text-rose-400'
                          : 'bg-amber-950 text-amber-400'
                      }`}>
                        {cmp.aiVerification.severityLevel} Severity
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-300 flex items-center gap-1 pt-1">
                      <Building2 className="w-3 h-3 text-slate-400" /> Routed to: <strong className="text-slate-200">{cmp.aiVerification.suggestedDepartment}</strong>
                    </div>
                  </div>
                )}
              </div>

              {/* Upvote & Reporter Footer */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>By {cmp.reportedBy} ({cmp.timestamp})</span>

                <button
                  onClick={() => upvoteComplaint(cmp.id)}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold transition-all border border-slate-700"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{cmp.upvotes} Upvotes</span>
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* Report Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <MessageSquareWarning className="w-5 h-5 text-cyan-400" /> Report Civic Issue to City Council
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Issue Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Hazardous pothole near transit station"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="pothole">Road Pothole</option>
                    <option value="streetlight">Broken Streetlight</option>
                    <option value="water_leakage">Water Leakage</option>
                    <option value="traffic_signal">Traffic Signal Fault</option>
                    <option value="damaged_shelter">Damaged Bus Shelter</option>
                    <option value="illegal_parking">Illegal Parking</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Address / GPS</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Detailed Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the issue size, hazard level, or traffic impact..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white"
                  required
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-cyan-300 flex items-center gap-2">
                <Camera className="w-4 h-4 text-cyan-400" />
                <span>Simulated photo attachment will be auto-scanned by AI Computer Vision.</span>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-cyan-500 text-slate-950 text-xs font-extrabold shadow-glow-cyan"
                >
                  Submit & Verify with AI
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
