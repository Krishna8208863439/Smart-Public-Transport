import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DigitalTicket } from '../../types';
import {
  QrCode,
  Wallet,
  CreditCard,
  CheckCircle2,
  Clock,
  Bus,
  Train,
  Anchor,
  Zap,
  Sparkles,
  Plus,
  RefreshCw,
  ShieldCheck
} from 'lucide-react';

export const DigitalWallet: React.FC = () => {
  const { tickets, walletBalance, buyTicket, openPaymentModal } = useApp();
  const [nfcTapped, setNfcTapped] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<DigitalTicket | null>(tickets[0] || null);

  const handleNfcTap = () => {
    setNfcTapped(true);
    setTimeout(() => setNfcTapped(false), 2000);
  };

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-6 text-slate-100">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              Digital Ticketing & NFC Mobile Wallet
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            QR code transit passes, contactless NFC card tap, and wallet balance management.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
            <Wallet className="w-5 h-5 text-emerald-400" />
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-bold">Transit Wallet</div>
              <div className="text-base font-extrabold text-white font-mono">${walletBalance.toFixed(2)}</div>
            </div>
            <button
              onClick={() => openPaymentModal(20)}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-xs shadow-glow-cyan transition-all flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Funds</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: QR Ticket Inspector + NFC Card & Pass Subscriptions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Active Digital Tickets List */}
        <div className="space-y-4">
          <h3 className="font-bold text-sm text-white px-1">Your Active Digital Passes ({tickets.length})</h3>

          <div className="space-y-3">
            {tickets.map((tkt) => {
              const isSelected = selectedTicket?.id === tkt.id;
              return (
                <div
                  key={tkt.id}
                  onClick={() => setSelectedTicket(tkt)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-900 border-cyan-500 shadow-glow-cyan'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono uppercase font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                        {tkt.transitType.toUpperCase()}
                      </span>
                      <h4 className="font-bold text-xs text-white mt-1">{tkt.routeName}</h4>
                    </div>

                    <span className="text-xs font-bold text-emerald-400 font-mono">${tkt.fare.toFixed(2)}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-3 mt-2 border-t border-slate-800">
                    <span>Purchased: {tkt.purchaseTime}</span>
                    <span className="text-emerald-400 font-semibold">{tkt.status.toUpperCase()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Center Column: Interactive QR Ticket Display */}
        {selectedTicket ? (
          <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-cyan-950/30 border border-slate-800 shadow-2xl space-y-6 text-center">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-widest font-extrabold text-cyan-400 bg-cyan-950 px-3 py-1 rounded-full border border-cyan-800">
                Official Transit Pass
              </span>
              <h3 className="font-extrabold text-base text-white mt-2">{selectedTicket.routeName}</h3>
              <p className="text-xs text-slate-400">{selectedTicket.origin} → {selectedTicket.destination}</p>
            </div>

            {/* Simulated Animated QR Code */}
            <div className="flex justify-center my-4">
              <div className="p-4 bg-white rounded-2xl shadow-2xl border-4 border-cyan-500 relative">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
                    selectedTicket.qrCodeValue
                  )}`}
                  alt="Transit Ticket QR Code"
                  className="w-40 h-40 object-contain"
                />
                <div className="mt-2 text-[10px] font-mono text-slate-900 font-bold tracking-widest uppercase">
                  {selectedTicket.id}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs text-left bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
              <div>
                <span className="text-slate-400 text-[10px]">Valid Until</span>
                <p className="font-bold text-emerald-400">{selectedTicket.validUntil}</p>
              </div>
              <div>
                <span className="text-slate-400 text-[10px]">Passenger</span>
                <p className="font-bold text-white">{selectedTicket.passengerName}</p>
              </div>
            </div>

            <p className="text-[11px] text-slate-500">
              Present this QR code to the turnstile optical scanner or bus onboard validator.
            </p>
          </div>
        ) : (
          <div className="flex items-center justify-center p-8 bg-slate-900 border border-slate-800 rounded-2xl text-xs text-slate-500">
            Select a ticket from the list to view QR code.
          </div>
        )}

        {/* Right Column: NFC Card Tap Simulator & Subscription Passes */}
        <div className="space-y-6">
          
          {/* NFC Tap Card Simulator */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-4 text-center">
            <div className="flex items-center justify-center gap-2 text-xs font-bold text-white">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>NFC Transit Card Simulator</span>
            </div>

            <div
              onClick={handleNfcTap}
              className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                nfcTapped
                  ? 'bg-emerald-500/20 border-emerald-400 shadow-glow-green scale-105'
                  : 'bg-gradient-to-tr from-slate-900 to-cyan-950 border-cyan-500/50 hover:border-cyan-400 shadow-glow-cyan'
              }`}
            >
              <CreditCard className="w-10 h-10 text-cyan-400 mx-auto mb-2" />
              <div className="font-extrabold text-sm text-white">Smart City NFC Pass</div>
              <p className="text-xs text-slate-400 mt-1">Tap to Simulate Turnstile Gate Boarding</p>

              {nfcTapped && (
                <div className="mt-3 text-xs font-bold text-emerald-400 flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> BEEP! GATE OPENED ($2.75 deducted)
                </div>
              )}
            </div>
          </div>

          {/* Subscription Passes Cards */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <h4 className="font-bold text-xs uppercase text-slate-400">Monthly Unlimited Passes</h4>

            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-white">All-Access City Pass</span>
                <p className="text-[11px] text-slate-400">Unlimited Bus, Metro & Ferry</p>
              </div>
              <button
                onClick={() => buyTicket('monthly-pass', 'All-Access Monthly Pass', 'All City Stops', 'All City Stops', 49.00, 'metro')}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold"
              >
                $49/mo
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-emerald-400">Student Eco Pass</span>
                <p className="text-[11px] text-slate-400">50% Student Discount</p>
              </div>
              <button
                onClick={() => buyTicket('student-pass', 'Student Eco Monthly Pass', 'All City Stops', 'All City Stops', 25.00, 'ebus')}
                className="px-3 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-bold"
              >
                $25/mo
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
