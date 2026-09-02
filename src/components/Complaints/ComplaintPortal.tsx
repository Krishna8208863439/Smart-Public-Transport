import React, { useState, useRef } from 'react';
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
  Building2,
  Upload,
  X,
  Image as ImageIcon,
  Check,
  Eye
} from 'lucide-react';

export const ComplaintPortal: React.FC = () => {
  const { complaints, addComplaint, upvoteComplaint } = useApp();

  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CivicComplaint['category']>('pothole');
  const [address, setAddress] = useState('Market St & 8th Ave Junction');
  const [description, setDescription] = useState('');

  // Image Upload State
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imageFileName, setImageFileName] = useState<string | null>(null);
  const [isScanningAI, setIsScanningAI] = useState(false);
  const [previewModalImage, setPreviewModalImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const samplePhotos = [
    {
      label: '🕳️ Road Pothole',
      category: 'pothole' as const,
      url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=60'
    },
    {
      label: '💡 Streetlight Fault',
      category: 'streetlight' as const,
      url: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=600&auto=format&fit=crop&q=60'
    },
    {
      label: '🚏 Shelter Damage',
      category: 'damaged_shelter' as const,
      url: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600&auto=format&fit=crop&q=60'
    }
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      setIsScanningAI(true);
      reader.onload = () => {
        setUploadedImage(reader.result as string);
        setImageFileName(file.name);
        setTimeout(() => setIsScanningAI(false), 800);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectSample = (url: string, cat: CivicComplaint['category']) => {
    setIsScanningAI(true);
    setUploadedImage(url);
    setImageFileName('Sample-Civic-Photo.jpg');
    setCategory(cat);
    setTimeout(() => setIsScanningAI(false), 600);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;
    addComplaint(title, category, description, address, uploadedImage || undefined);
    setShowModal(false);
    setTitle('');
    setDescription('');
    setUploadedImage(null);
    setImageFileName(null);
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
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4 hover:border-slate-700 transition-all flex flex-col justify-between overflow-hidden"
            >
              <div className="space-y-3">
                
                {/* Header Row */}
                <div className="flex items-start justify-between gap-2">
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
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded font-mono shrink-0 ${
                      cmp.status === 'resolved'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-amber-950 text-amber-400 border border-amber-800'
                    }`}
                  >
                    {cmp.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>

                {/* Attached Incident Photo Preview */}
                {cmp.imageUrl && (
                  <div 
                    onClick={() => setPreviewModalImage(cmp.imageUrl || null)}
                    className="relative group rounded-xl overflow-hidden h-36 bg-slate-950 border border-slate-800 cursor-pointer"
                  >
                    <img
                      src={cmp.imageUrl}
                      alt={cmp.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-2.5">
                      <span className="text-[10px] font-bold text-cyan-300 flex items-center gap-1 bg-slate-900/80 px-2 py-0.5 rounded-md border border-slate-700 backdrop-blur-sm">
                        <Eye className="w-3 h-3" /> Click to view full photo
                      </span>
                    </div>
                  </div>
                )}

                <p className="text-xs text-slate-300 leading-relaxed bg-slate-800/40 p-3 rounded-xl border border-slate-800">
                  {cmp.description}
                </p>

                {/* AI Verification Badge Card */}
                {cmp.aiVerification && (
                  <div className="p-3 rounded-xl bg-slate-800/80 border border-cyan-500/30 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-cyan-400 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" /> AI Vision Verified ({Math.round(cmp.aiVerification.confidenceScore * 100)}% Conf)
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

      {/* Full Photo Modal Preview */}
      {previewModalImage && (
        <div 
          onClick={() => setPreviewModalImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in"
        >
          <div className="relative max-w-3xl w-full bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden p-2">
            <button
              onClick={() => setPreviewModalImage(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-950/80 text-white hover:bg-rose-600 transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <img src={previewModalImage} alt="Civic Issue Full" className="w-full h-auto max-h-[80vh] object-contain rounded-xl" />
          </div>
        </div>
      )}

      {/* Report Issue Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-[#0F172A] border border-slate-700/80 rounded-3xl p-6 sm:p-7 w-full max-w-lg shadow-2xl space-y-4 text-white relative overflow-hidden max-h-[90vh] overflow-y-auto">
            
            {/* Ambient Corner Glow */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="flex items-start justify-between relative z-10">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-cyan-950/80 border border-cyan-800 text-cyan-400 shadow-glow-cyan">
                  <MessageSquareWarning className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-white tracking-tight">
                    Report Civic Infrastructure Issue
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Submissions are auto-triaged with Computer Vision & routed to city teams.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 relative z-10">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Issue Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Hazardous pothole near transit station"
                  className="w-full bg-slate-950/80 border border-slate-700/90 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 placeholder-slate-600 font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-slate-950/80 border border-slate-700/90 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-medium"
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
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-300">Address / GPS</label>
                    <button
                      type="button"
                      onClick={() => {
                        if ('geolocation' in navigator) {
                          navigator.geolocation.getCurrentPosition(
                            (pos) => {
                              setAddress(`📍 Lat: ${pos.coords.latitude.toFixed(4)}, Lng: ${pos.coords.longitude.toFixed(4)}`);
                            },
                            () => {
                              setAddress('📍 Lat: 37.7815, Lng: -122.4110 (Market St)');
                            }
                          );
                        } else {
                          setAddress('📍 Lat: 37.7815, Lng: -122.4110 (Market St)');
                        }
                      }}
                      className="text-[10px] text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800 font-bold hover:bg-cyan-900 transition-all flex items-center gap-1"
                    >
                      <MapPin className="w-2.5 h-2.5" /> Tag GPS
                    </button>
                  </div>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-slate-950/80 border border-slate-700/90 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Detailed Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the issue size, hazard level, or traffic impact..."
                  className="w-full bg-slate-950/80 border border-slate-700/90 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-400 placeholder-slate-600"
                  required
                />
              </div>

              {/* Working Photo Upload Area */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-cyan-400" /> Evidence Photo Attachment
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">JPG, PNG, WebP</span>
                </label>

                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                {uploadedImage ? (
                  <div className="relative rounded-2xl border border-cyan-500/50 overflow-hidden bg-slate-950 p-2 space-y-2 animate-in fade-in">
                    <div className="relative h-28 rounded-xl overflow-hidden">
                      <img src={uploadedImage} alt="Uploaded evidence" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          setUploadedImage(null);
                          setImageFileName(null);
                        }}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-950/80 hover:bg-rose-600 text-white transition-colors"
                        title="Remove Photo"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-xs px-1">
                      <div className="flex items-center gap-1.5 text-emerald-400 font-semibold truncate max-w-[200px]">
                        <Check className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{imageFileName || 'Photo Attached'}</span>
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-[11px] text-cyan-400 hover:underline"
                      >
                        Change Photo
                      </button>
                    </div>

                    {isScanningAI && (
                      <div className="p-2 rounded-xl bg-cyan-950/80 border border-cyan-800 text-[11px] text-cyan-300 flex items-center gap-2 animate-pulse">
                        <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                        <span>AI Computer Vision scanning hazard severity & dimensions...</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {/* Drag & Drop Clickable Dropzone */}
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-slate-700 hover:border-cyan-500/60 rounded-2xl p-4 bg-slate-950/50 hover:bg-slate-900/60 transition-all cursor-pointer text-center space-y-1 group"
                    >
                      <Upload className="w-6 h-6 text-slate-400 group-hover:text-cyan-400 mx-auto transition-colors" />
                      <p className="text-xs font-bold text-slate-200 group-hover:text-white">
                        Click to upload photo from device or drag & drop
                      </p>
                      <p className="text-[10px] text-slate-500">Supports direct camera capture or local photos</p>
                    </div>

                    {/* Quick Sample Presets */}
                    <div className="flex items-center gap-1.5 flex-wrap text-xs text-slate-400">
                      <span className="text-[10px]">Or attach sample:</span>
                      {samplePhotos.map((s, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSelectSample(s.url, s.category)}
                          className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-medium border border-slate-700/80"
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all border border-slate-700/60"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-extrabold shadow-glow-cyan transition-all flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Submit & Verify with AI</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
