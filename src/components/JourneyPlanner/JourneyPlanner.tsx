import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { optimizeJourneys } from '../../services/aiService';
import { JourneyOption } from '../../types';
import {
  Compass,
  MapPin,
  Clock,
  Zap,
  Leaf,
  DollarSign,
  Bus,
  Train,
  Anchor,
  Footprints,
  ArrowRight,
  CheckCircle,
  QrCode,
  Sparkles
} from 'lucide-react';

export const JourneyPlanner: React.FC = () => {
  const { buyTicket, setActiveTab, walletBalance } = useApp();

  const [origin, setOrigin] = useState('Central Plaza Transit Hub');
  const [destination, setDestination] = useState('Tech Park Station');
  const [selectedType, setSelectedType] = useState<'fastest' | 'eco' | 'least_congested' | 'cheapest'>('fastest');
  const [purchasedTicketId, setPurchasedTicketId] = useState<string | null>(null);

  const journeys = optimizeJourneys(origin, destination);
  const activeJourney = journeys.find((j) => j.type === selectedType) || journeys[0];

  const handlePurchase = (journey: JourneyOption) => {
    const success = buyTicket(
      journey.id,
      journey.title,
      origin,
      destination,
      journey.totalCost,
      journey.segments[0].mode === 'walk' ? 'bus' : (journey.segments[0].mode as any)
    );

    if (success) {
      setPurchasedTicketId(journey.id);
      setTimeout(() => {
        setPurchasedTicketId(null);
        setActiveTab('ticketing');
      }, 1500);
    } else {
      alert('Insufficient wallet balance. Please top up your wallet in the header!');
    }
  };

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'metro': return <Train className="w-4 h-4 text-purple-400" />;
      case 'ferry': return <Anchor className="w-4 h-4 text-blue-400" />;
      case 'ebus': return <Bus className="w-4 h-4 text-emerald-400" />;
      case 'walk': return <Footprints className="w-4 h-4 text-amber-400" />;
      default: return <Bus className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-6 text-slate-100">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-extrabold text-white tracking-tight">AI Intermodal Journey Planner</h2>
          </div>
          <p className="text-xs text-slate-400">
            Real-time multi-modal transit search optimized for speed, carbon savings, and zero-congestion routing.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-xs">
          <span className="text-slate-400">Wallet Balance:</span>
          <strong className="text-emerald-400 font-mono">${walletBalance.toFixed(2)}</strong>
        </div>
      </div>

      {/* Input Form */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" /> Origin Location
            </label>
            <input
              type="text"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              placeholder="e.g. Central Plaza Transit Hub"
              className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-rose-400" /> Destination
            </label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="e.g. Tech Park Station"
              className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 font-medium"
            />
          </div>

        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-2 flex-wrap text-xs text-slate-400">
          <span>Popular Presets:</span>
          {[
            'Central Plaza Transit Hub',
            'Financial Center Metro Station',
            'Airport Terminal',
            'Pier 7 Bay Dock'
          ].map((loc) => (
            <button
              key={loc}
              onClick={() => setDestination(loc)}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all text-[11px]"
            >
              + {loc}
            </button>
          ))}
        </div>
      </div>

      {/* Priority Mode Selector Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { id: 'fastest', label: 'Fastest Route', icon: Clock, color: 'border-cyan-500 text-cyan-400' },
          { id: 'eco', label: 'Eco-Friendly', icon: Leaf, color: 'border-emerald-500 text-emerald-400' },
          { id: 'least_congested', label: 'Least Congested', icon: Zap, color: 'border-amber-500 text-amber-400' },
          { id: 'cheapest', label: 'Lowest Fare', icon: DollarSign, color: 'border-purple-500 text-purple-400' }
        ].map((opt) => {
          const Icon = opt.icon;
          const isSelected = selectedType === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => setSelectedType(opt.id as any)}
              className={`p-3.5 rounded-2xl border text-left transition-all ${
                isSelected
                  ? 'bg-slate-900 border-cyan-500 shadow-glow-cyan'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <Icon className={`w-5 h-5 mb-1 ${opt.color}`} />
              <div className="font-bold text-xs text-white">{opt.label}</div>
              <p className="text-[10px] text-slate-400 mt-0.5">AI Optimized</p>
            </button>
          );
        })}
      </div>

      {/* Selected Itinerary Card */}
      {activeJourney && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-extrabold tracking-wider text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                  {activeJourney.type.replace('_', ' ').toUpperCase()} CHOICE
                </span>
                <span className="text-xs text-slate-400 font-mono">ID: {activeJourney.id}</span>
              </div>
              <h3 className="text-lg font-bold text-white mt-1">{activeJourney.title}</h3>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-2xl font-extrabold text-white font-mono">{activeJourney.totalDurationMin} mins</div>
                <div className="text-xs text-slate-400">{activeJourney.transfers} Transfers</div>
              </div>

              <div className="text-right pl-4 border-l border-slate-800">
                <div className="text-2xl font-extrabold text-emerald-400 font-mono">${activeJourney.totalCost.toFixed(2)}</div>
                <div className="text-xs text-emerald-300 font-medium">-{activeJourney.co2SavedKg}kg CO₂ Saved</div>
              </div>
            </div>
          </div>

          {/* Step-by-Step Segments Timeline */}
          <div className="space-y-4">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">Step-By-Step Journey Route</h4>

            <div className="space-y-3">
              {activeJourney.segments.map((seg, idx) => (
                <div key={idx} className="flex items-start gap-4 p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-700 shrink-0 mt-0.5">
                    {getModeIcon(seg.mode)}
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-white">
                        {seg.lineName ? `${seg.lineName} (${seg.mode.toUpperCase()})` : 'Walking Segment'}
                      </span>
                      <span className="text-slate-400 font-mono">{seg.durationMin} mins</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span>{seg.from}</span>
                      <ArrowRight className="w-3 h-3 text-slate-600" />
                      <span className="text-slate-200">{seg.to}</span>
                    </div>

                    {seg.occupancy && (
                      <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded ${
                        seg.occupancy === 'low' ? 'bg-emerald-950 text-emerald-400' : 'bg-amber-950 text-amber-400'
                      }`}>
                        Occupancy: {seg.occupancy.toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Bar */}
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Instant QR digital ticket will be added to your Mobile Wallet upon booking.</span>
            </div>

            <button
              onClick={() => handlePurchase(activeJourney)}
              disabled={purchasedTicketId === activeJourney.id}
              className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-extrabold text-xs transition-all shadow-glow-cyan ${
                purchasedTicketId === activeJourney.id
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950'
              }`}
            >
              {purchasedTicketId === activeJourney.id ? (
                <>
                  <CheckCircle className="w-4 h-4" /> Ticket Generated! Redirecting...
                </>
              ) : (
                <>
                  <QrCode className="w-4 h-4" /> Purchase QR Ticket (${activeJourney.totalCost.toFixed(2)})
                </>
              )}
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
