import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../../context/AppContext';
import {
  X,
  CreditCard,
  QrCode,
  Smartphone,
  CheckCircle2,
  ShieldCheck,
  Lock,
  ArrowRight,
  Plus,
  Minus,
  RefreshCw,
  Wallet,
  Sparkles,
  Building,
  Copy,
  Check,
  AlertCircle
} from 'lucide-react';

interface PaymentGatewayModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultAmount?: number;
}

type PaymentMethod = 'card' | 'upi' | 'apple' | 'google' | 'netbanking';

export const PaymentGatewayModal: React.FC<PaymentGatewayModalProps> = ({
  isOpen,
  onClose,
  defaultAmount = 20
}) => {
  const { walletBalance, topupWallet } = useApp();

  const [amount, setAmount] = useState<number>(defaultAmount);
  const [method, setMethod] = useState<PaymentMethod>('card');
  const [step, setStep] = useState<'details' | 'processing' | 'success'>('details');

  // Card form state
  const [cardNumber, setCardNumber] = useState('4532 8921 4091 7723');
  const [cardHolder, setCardHolder] = useState('ALEX CHEN');
  const [expiry, setExpiry] = useState('08/28');
  const [cvv, setCvv] = useState('382');
  const [saveCard, setSaveCard] = useState(true);

  // UPI form state
  const [upiSubTab, setUpiSubTab] = useState<'qr' | 'vpa'>('qr');
  const [upiVpa, setUpiVpa] = useState('alex.transit@okaxis');
  const [qrTimer, setQrTimer] = useState(299);

  // NetBanking state
  const [selectedBank, setSelectedBank] = useState('chase');

  // Processing state
  const [processingStatusText, setProcessingStatusText] = useState('Initiating secure gateway handshake...');

  // Success state receipt
  const [txnId, setTxnId] = useState('');
  const [copiedTxn, setCopiedTxn] = useState(false);

  // Reset or initialize on open
  useEffect(() => {
    if (isOpen) {
      setStep('details');
      setAmount(defaultAmount > 0 ? defaultAmount : 20);
      setCopiedTxn(false);
    }
  }, [isOpen, defaultAmount]);

  // QR Timer countdown
  useEffect(() => {
    if (!isOpen || step !== 'details' || method !== 'upi' || upiSubTab !== 'qr') return;
    const interval = setInterval(() => {
      setQrTimer((prev) => (prev > 0 ? prev - 1 : 300));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, step, method, upiSubTab]);

  if (!isOpen) return null;

  const presetAmounts = [10, 20, 50, 100];

  const handleCardNumberChange = (val: string) => {
    // Only numbers, format with space every 4 digits
    const cleaned = val.replace(/\D/g, '').slice(0, 16);
    const parts = cleaned.match(/.{1,4}/g) || [];
    setCardNumber(parts.join(' '));
  };

  const handleExpiryChange = (val: string) => {
    const cleaned = val.replace(/\D/g, '').slice(0, 4);
    if (cleaned.length >= 3) {
      setExpiry(`${cleaned.slice(0, 2)}/${cleaned.slice(2)}`);
    } else {
      setExpiry(cleaned);
    }
  };

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const startPayment = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (amount <= 0) return;

    setStep('processing');
    setProcessingStatusText('Connecting to 256-bit SSL encrypted payment gateway...');

    setTimeout(() => {
      setProcessingStatusText('Authorizing payment with banking network...');
    }, 600);

    setTimeout(() => {
      setProcessingStatusText('Verifying digital token and debit confirmation...');
    }, 1100);

    setTimeout(() => {
      // Execute wallet credit
      topupWallet(amount);
      const generatedId = `TXN-ST-${Math.floor(10000000 + Math.random() * 90000000)}`;
      setTxnId(generatedId);
      setStep('success');
    }, 1700);
  };

  const copyToClipboard = () => {
    if (!txnId) return;
    navigator.clipboard.writeText(txnId);
    setCopiedTxn(true);
    setTimeout(() => setCopiedTxn(false), 2000);
  };

  const getMethodName = () => {
    switch (method) {
      case 'card': return 'Credit/Debit Card (Stripe Global)';
      case 'upi': return 'Instant UPI / QR Code (NPCI)';
      case 'apple': return 'Apple Pay Tokenized Pass';
      case 'google': return 'Google Pay 1-Click Pay';
      case 'netbanking': return 'Direct NetBanking Gateway';
      default: return 'Secure Gateway';
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[99999] overflow-y-auto bg-black/85 backdrop-blur-md p-3 sm:p-4 md:p-6 flex items-center justify-center animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg my-auto bg-[#0B132B] border border-slate-700/80 rounded-3xl shadow-2xl text-white overflow-hidden max-h-[92vh] flex flex-col">
        
        {/* Ambient Glows */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between shrink-0 relative z-10 bg-[#0B132B]/90">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-slate-950 font-bold shadow-glow-cyan">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg text-white tracking-tight">
                  Transit Wallet Payment Gateway
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/80 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> 256-Bit SSL
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Current Wallet Balance: <strong className="text-emerald-400 font-mono font-bold">${walletBalance.toFixed(2)}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-5 flex-1 relative z-10">

          {/* STEP 1: CONFIGURE & PAY */}
          {step === 'details' && (
            <div className="space-y-5">
              
              {/* Amount Selection Section */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/80 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-300">Select Deposit Amount</span>
                  <span className="text-[11px] text-slate-400 font-mono">Min $1 • Max $500</span>
                </div>

                {/* Preset Chips */}
                <div className="grid grid-cols-4 gap-2">
                  {presetAmounts.map((amt) => {
                    const isSelected = amount === amt;
                    return (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setAmount(amt)}
                        className={`py-2 rounded-xl border text-xs sm:text-sm font-bold font-mono transition-all ${
                          isSelected
                            ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-glow-cyan scale-[1.02]'
                            : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white'
                        }`}
                      >
                        +${amt}
                      </button>
                    );
                  })}
                </div>

                {/* Custom Amount Field with Stepper */}
                <div className="relative flex items-center bg-slate-950 border border-slate-700 rounded-2xl p-1.5 focus-within:border-cyan-400 focus-within:ring-1 focus-within:ring-cyan-400/40 transition-all">
                  <span className="text-xl font-extrabold text-emerald-400 pl-3 pr-1 select-none font-mono">$</span>
                  
                  <input
                    type="number"
                    min="1"
                    max="500"
                    value={amount || ''}
                    onChange={(e) => setAmount(Math.max(0, Math.min(500, Number(e.target.value))))}
                    className="w-full bg-transparent text-xl font-mono font-extrabold text-white focus:outline-none placeholder-slate-600"
                    placeholder="20"
                  />

                  <div className="flex items-center gap-1 pr-1">
                    <button
                      type="button"
                      onClick={() => setAmount(Math.max(1, amount - 5))}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                      title="Decrease by $5"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setAmount(Math.min(500, amount + 5))}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                      title="Increase by $5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Live Real-Time Calculation */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Balance after deposit:</span>
                  <span className="font-mono text-emerald-400 font-extrabold text-sm">
                    ${(walletBalance + (Number(amount) || 0)).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Payment Gateway Tabs */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                  Select Payment Gateway
                </label>

                <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 p-1 rounded-2xl bg-slate-900 border border-slate-800">
                  {[
                    { id: 'card', label: 'Card', icon: CreditCard },
                    { id: 'upi', label: 'UPI / QR', icon: QrCode },
                    { id: 'apple', label: 'Apple Pay', icon: Smartphone },
                    { id: 'google', label: 'Google Pay', icon: Smartphone },
                    { id: 'netbanking', label: 'NetBank', icon: Building }
                  ].map((m) => {
                    const Icon = m.icon;
                    const isActive = method === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setMethod(m.id as PaymentMethod)}
                        className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-[11px] font-semibold transition-all ${
                          isActive
                            ? 'bg-cyan-500 text-slate-950 font-bold shadow-md scale-[1.02]'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                        }`}
                      >
                        <Icon className="w-4 h-4 mb-1" />
                        <span>{m.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* GATEWAY METHOD CONTENT */}
              
              {/* 1. CREDIT / DEBIT CARD */}
              {method === 'card' && (
                <div className="space-y-4">
                  {/* Virtual Card Preview */}
                  <div className="p-4 rounded-2xl bg-gradient-to-tr from-slate-900 via-sky-950 to-blue-900 border border-cyan-500/40 shadow-xl space-y-3 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400/10 rounded-full blur-2xl" />
                    
                    <div className="flex items-center justify-between text-xs text-slate-300">
                      <span className="font-mono tracking-widest text-[11px] font-bold text-cyan-300">TRANSIT SMART CARD</span>
                      <span className="font-extrabold text-sm tracking-wider bg-gradient-to-r from-amber-400 to-rose-400 bg-clip-text text-transparent">
                        {cardNumber.startsWith('4') ? 'VISA' : 'MASTERCARD'}
                      </span>
                    </div>

                    <div className="my-2">
                      <div className="w-9 h-7 rounded bg-amber-400/80 border border-amber-300 shadow-sm flex items-center justify-center text-[9px] text-amber-950 font-bold font-mono">
                        CHIP
                      </div>
                    </div>

                    <div className="font-mono text-base tracking-widest text-white font-bold drop-shadow">
                      {cardNumber || '•••• •••• •••• ••••'}
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-300 pt-1 font-mono uppercase">
                      <div>
                        <div className="text-[8px] text-slate-400">CARDHOLDER</div>
                        <div className="font-bold text-white tracking-wider">{cardHolder || 'ALEX CHEN'}</div>
                      </div>
                      <div>
                        <div className="text-[8px] text-slate-400">EXPIRES</div>
                        <div className="font-bold text-white">{expiry || 'MM/YY'}</div>
                      </div>
                    </div>
                  </div>

                  {/* Card Input Fields */}
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-slate-400 mb-1 font-medium">Card Number</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => handleCardNumberChange(e.target.value)}
                        placeholder="4532 8921 4091 7723"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 font-mono text-white text-sm focus:outline-none focus:border-cyan-400"
                        maxLength={19}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-400 mb-1 font-medium">Cardholder Name</label>
                        <input
                          type="text"
                          value={cardHolder}
                          onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                          placeholder="ALEX CHEN"
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-400 font-medium"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-slate-400 mb-1 font-medium">Expiry</label>
                          <input
                            type="text"
                            value={expiry}
                            onChange={(e) => handleExpiryChange(e.target.value)}
                            placeholder="MM/YY"
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 font-mono text-white text-center focus:outline-none focus:border-cyan-400"
                            maxLength={5}
                          />
                        </div>
                        <div>
                          <label className="block text-slate-400 mb-1 font-medium">CVV</label>
                          <input
                            type="password"
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value.slice(0, 4))}
                            placeholder="•••"
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 font-mono text-white text-center focus:outline-none focus:border-cyan-400"
                            maxLength={4}
                          />
                        </div>
                      </div>
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer pt-1 text-[11px] text-slate-400">
                      <input
                        type="checkbox"
                        checked={saveCard}
                        onChange={(e) => setSaveCard(e.target.checked)}
                        className="rounded border-slate-700 text-cyan-500 focus:ring-cyan-500 bg-slate-950"
                      />
                      <span>Save card token securely for fast NFC turnstile auto-billing</span>
                    </label>
                  </div>
                </div>
              )}

              {/* 2. UPI & DYNAMIC QR */}
              {method === 'upi' && (
                <div className="space-y-4">
                  {/* UPI Subtabs */}
                  <div className="flex gap-2 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                    <button
                      type="button"
                      onClick={() => setUpiSubTab('qr')}
                      className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
                        upiSubTab === 'qr' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Scan Dynamic QR Code
                    </button>
                    <button
                      type="button"
                      onClick={() => setUpiSubTab('vpa')}
                      className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
                        upiSubTab === 'vpa' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Enter UPI ID / VPA
                    </button>
                  </div>

                  {upiSubTab === 'qr' ? (
                    <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-center space-y-3">
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>Scan with any UPI App</span>
                        <span className="font-mono text-amber-400 font-bold bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800/60">
                          ⏱ {formatTimer(qrTimer)}
                        </span>
                      </div>

                      {/* Dynamic QR Display */}
                      <div className="flex justify-center py-2">
                        <div className="p-3 bg-white rounded-2xl shadow-xl border-2 border-cyan-400 relative group">
                          <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
                              `upi://pay?pa=smarttransit@citybank&pn=SmartTransitAI&am=${amount}&cu=USD`
                            )}`}
                            alt="Dynamic UPI QR"
                            className="w-36 h-36 object-contain"
                          />
                          <div className="absolute inset-x-0 bottom-2 bg-slate-900/90 text-[10px] text-cyan-300 font-mono py-0.5 rounded mx-2 font-bold">
                            Amount: ${amount}.00
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-center gap-3 text-[10px] text-slate-400">
                        <span className="px-2 py-1 rounded bg-slate-800 border border-slate-700">PhonePe</span>
                        <span className="px-2 py-1 rounded bg-slate-800 border border-slate-700">GPay</span>
                        <span className="px-2 py-1 rounded bg-slate-800 border border-slate-700">Paytm</span>
                        <span className="px-2 py-1 rounded bg-slate-800 border border-slate-700">BHIM</span>
                      </div>

                      <p className="text-[11px] text-slate-400 pt-1">
                        Point your mobile camera to scan and authorize the deposit.
                      </p>
                    </div>
                  ) : (
                    <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 text-xs">
                      <div>
                        <label className="block text-slate-400 mb-1 font-medium">Virtual Payment Address (VPA)</label>
                        <input
                          type="text"
                          value={upiVpa}
                          onChange={(e) => setUpiVpa(e.target.value)}
                          placeholder="e.g. mobile@upi or name@okaxis"
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-cyan-400"
                        />
                      </div>

                      {/* VPA quick suffixes */}
                      <div className="flex items-center gap-1.5 flex-wrap text-[11px]">
                        <span className="text-slate-500">Popular Handles:</span>
                        {['@okaxis', '@okhdfcbank', '@paytm', '@ybl'].map((h) => (
                          <button
                            key={h}
                            type="button"
                            onClick={() => {
                              const username = upiVpa.split('@')[0] || 'alex';
                              setUpiVpa(`${username}${h}`);
                            }}
                            className="px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700 font-mono"
                          >
                            {h}
                          </button>
                        ))}
                      </div>

                      <div className="p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-800/40 text-[11px] text-cyan-300 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
                        <span>A push notification will be sent directly to your UPI mobile app.</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 3. APPLE PAY */}
              {method === 'apple' && (
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-black border border-slate-700 flex items-center justify-center mx-auto text-white shadow-xl">
                    <span className="text-2xl font-bold tracking-tight">Pay</span>
                  </div>

                  <div>
                    <h4 className="font-bold text-sm text-white">Apple Pay Quick Transit Pass</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Biometric Touch ID or Face ID confirmation</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs flex items-center justify-between text-left">
                    <div>
                      <div className="text-slate-400 text-[10px]">DEVICE DEFAULT CARD</div>
                      <div className="font-bold text-white">Apple Card •••• 8492</div>
                    </div>
                    <span className="text-emerald-400 font-bold font-mono">READY</span>
                  </div>

                  <p className="text-[11px] text-slate-500">
                    Clicking Confirm below will invoke the Apple Pay secure enclave prompt.
                  </p>
                </div>
              )}

              {/* 4. GOOGLE PAY */}
              {method === 'google' && (
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-slate-700 flex items-center justify-center mx-auto shadow-xl">
                    <span className="text-xl font-black bg-gradient-to-r from-blue-400 via-rose-400 to-amber-400 bg-clip-text text-transparent">
                      GPay
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-sm text-white">Google Pay One-Tap Checkout</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Connected Google Account: alex.transit@gmail.com</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs flex items-center justify-between text-left">
                    <div>
                      <div className="text-slate-400 text-[10px]">PAYMENT METHOD</div>
                      <div className="font-bold text-white">Chase Premier Checking •••• 1042</div>
                    </div>
                    <span className="text-emerald-400 font-bold font-mono">LINKED</span>
                  </div>

                  <p className="text-[11px] text-slate-500">
                    Fast, secure, end-to-end encrypted checkout via Google Pay API.
                  </p>
                </div>
              )}

              {/* 5. NETBANKING */}
              {method === 'netbanking' && (
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 text-xs">
                  <span className="font-bold text-slate-300">Choose Primary Banking Portal</span>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      { id: 'chase', name: 'JPMorgan Chase' },
                      { id: 'bofa', name: 'Bank of America' },
                      { id: 'wells', name: 'Wells Fargo' },
                      { id: 'citi', name: 'Citibank' },
                      { id: 'hdfc', name: 'HDFC Bank' },
                      { id: 'sbi', name: 'State Bank of India' }
                    ].map((b) => (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => setSelectedBank(b.id)}
                        className={`p-2.5 rounded-xl border text-center transition-all ${
                          selectedBank === b.id
                            ? 'bg-slate-800 border-cyan-500 text-cyan-300 font-bold'
                            : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        {b.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* STEP 2: PROCESSING ANIMATION */}
          {step === 'processing' && (
            <div className="py-12 px-4 text-center space-y-6">
              <div className="relative flex items-center justify-center w-24 h-24 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-cyan-500/20 animate-ping" />
                <div className="w-20 h-20 rounded-full border-4 border-cyan-500 border-t-transparent animate-spin flex items-center justify-center" />
                <Lock className="w-8 h-8 text-cyan-400 absolute" />
              </div>

              <div className="space-y-2">
                <h4 className="text-lg font-bold text-white">Processing Payment Securely</h4>
                <p className="text-xs text-cyan-300 font-mono animate-pulse">{processingStatusText}</p>
                <p className="text-[11px] text-slate-500">Please do not refresh or close this window.</p>
              </div>

              <div className="max-w-xs mx-auto p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400">
                <span>Amount: <strong className="text-white">${amount}.00</strong></span>
                <span className="mx-2">•</span>
                <span>Gateway: <strong className="text-white">{getMethodName()}</strong></span>
              </div>
            </div>
          )}

          {/* STEP 3: SUCCESS RECEIPT */}
          {step === 'success' && (
            <div className="space-y-5 text-center">
              
              <div className="w-16 h-16 rounded-3xl bg-emerald-950 border-2 border-emerald-500 flex items-center justify-center mx-auto text-emerald-400 shadow-glow-green animate-bounce">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-1">
                <h4 className="text-xl font-extrabold text-white">Payment Successful!</h4>
                <p className="text-xs text-emerald-300 font-semibold">
                  ${amount}.00 has been credited to your Digital Transit Wallet.
                </p>
              </div>

              {/* Digital Transaction Receipt Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 text-left space-y-3 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="font-bold text-white uppercase tracking-wider text-[11px]">Official Transit Receipt</span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                    STATUS: SETTLED
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Transaction ID:</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-cyan-300 font-bold">{txnId}</span>
                      <button
                        onClick={copyToClipboard}
                        className="text-slate-400 hover:text-white"
                        title="Copy Txn ID"
                      >
                        {copiedTxn ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Payment Gateway:</span>
                    <span className="font-semibold text-slate-200">{getMethodName()}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Date & Timestamp:</span>
                    <span className="font-mono text-slate-300">{new Date().toLocaleString()}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Amount Paid:</span>
                    <span className="font-mono text-white font-extrabold text-sm">${amount}.00 USD</span>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                    <span className="font-bold text-slate-300">Updated Wallet Balance:</span>
                    <span className="font-mono text-emerald-400 font-extrabold text-base">
                      ${walletBalance.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400">
                You can now board any city bus, metro, or ferry turnstile instantly with your digital pass.
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer / Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-[#0B132B] shrink-0 relative z-10">
          {step === 'details' && (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all border border-slate-700/60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => startPayment()}
                disabled={amount <= 0}
                className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-slate-950 text-xs font-black shadow-glow-green transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Pay & Add ${amount}.00</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {step === 'processing' && (
            <div className="text-center text-xs text-slate-400 py-1 font-mono">
              Secured with End-to-End Encryption
            </div>
          )}

          {step === 'success' && (
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-xs shadow-glow-cyan transition-all"
            >
              Done & Return to Dashboard
            </button>
          )}
        </div>

      </div>
    </div>,
    document.body
  );
};
