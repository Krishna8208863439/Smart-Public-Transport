import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  Bus,
  Shield,
  Lock,
  Mail,
  User,
  Building2,
  Wrench,
  Navigation,
  ArrowRight,
  CheckCircle2,
  KeyRound,
  Eye,
  EyeOff,
  Sparkles,
  Activity,
  AlertCircle
} from 'lucide-react';

export const AuthPortal: React.FC = () => {
  const { login, register } = useApp();

  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot'>('login');
  
  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('citizen');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Register Form State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('citizen');
  const [regDepartment, setRegDepartment] = useState('');

  // Forgot Password State
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStep, setForgotStep] = useState<'email' | 'otp' | 'newpass' | 'success'>('email');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }
    setErrorMessage('');
    setIsSubmitting(true);

    setTimeout(() => {
      login(loginEmail, selectedRole);
      setIsSubmitting(false);
    }, 600);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim()) {
      setErrorMessage('Please fill in your full name and email address.');
      return;
    }
    setErrorMessage('');
    setIsSubmitting(true);

    setTimeout(() => {
      register(regName, regEmail, regRole, regDepartment);
      setIsSubmitting(false);
    }, 600);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (forgotStep === 'email') {
      if (!forgotEmail.trim()) return;
      setForgotStep('otp');
    } else if (forgotStep === 'otp') {
      if (otpCode.length < 6) return;
      setForgotStep('newpass');
    } else if (forgotStep === 'newpass') {
      if (!newPassword.trim()) return;
      setForgotStep('success');
    }
  };

  const roleOptions: { key: UserRole; label: string; icon: React.ReactNode; desc: string }[] = [
    { key: 'citizen', label: 'Citizen', icon: <Navigation className="w-3.5 h-3.5 text-cyan-400" />, desc: 'Journey Planner, QR Wallet, Complaints, SOS, AI' },
    { key: 'operator', label: 'Fleet Operator', icon: <Bus className="w-3.5 h-3.5 text-blue-400" />, desc: 'Live GPS Tracking, Fleet Schedules & Status' },
    { key: 'admin', label: 'City Administrator', icon: <Building2 className="w-3.5 h-3.5 text-emerald-400" />, desc: 'Traffic Signals, IoT Engine, Analytics & Hub' },
    { key: 'maintenance', label: 'Maintenance Team', icon: <Wrench className="w-3.5 h-3.5 text-amber-400" />, desc: 'IoT Asset Telemetry, Alerts, Work Orders' },
    { key: 'super_admin', label: 'Super Admin', icon: <Shield className="w-3.5 h-3.5 text-purple-400" />, desc: 'Full Access to All 10 Modules & Role Switcher' }
  ];

  return (
    <div className="min-h-screen w-full bg-[#070A13] text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-cyan-500/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Header */}
      <header className="relative z-10 w-full px-6 py-4 border-b border-slate-800/80 bg-[#0B0F19]/80 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-glow-cyan">
            <Bus className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400 bg-clip-text text-transparent">
                SmartTransit AI
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800/60">
                Enterprise v2.5
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Intelligent Public Transport & Civic Infrastructure Platform
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline">256-Bit SSL</span>
          <span className="text-emerald-400 font-bold">RBAC SECURED</span>
        </div>
      </header>

      {/* Main Centered Auth Form */}
      <main className="relative z-10 max-w-lg w-full mx-auto p-4 sm:p-6 my-auto">
        <div className="bg-[#0B132B]/95 backdrop-blur-2xl border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          
          {/* Form Header */}
          <div className="text-center space-y-1">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-glow-cyan text-slate-950 mb-1">
              <Bus className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Transit Enterprise Portal
            </h2>
            <p className="text-xs text-slate-400">
              Role-Based Access Control • Sign in to access your authorized modules
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center p-1 rounded-2xl bg-slate-900/90 border border-slate-800">
            <button
              type="button"
              onClick={() => {
                setAuthMode('login');
                setErrorMessage('');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                authMode === 'login'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-glow-cyan'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('register');
                setErrorMessage('');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                authMode === 'register'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-glow-cyan'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Create Account
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('forgot');
                setForgotStep('email');
                setErrorMessage('');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                authMode === 'forgot'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-glow-cyan'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Forgot Password
            </button>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-600 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* 1. SIGN IN FORM */}
          {authMode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              
              {/* Select Role for Login */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span>Select Access Role</span>
                  <span className="text-[10px] text-cyan-400 font-mono">RBAC Profile</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {roleOptions.map((r) => (
                    <button
                      key={r.key}
                      type="button"
                      onClick={() => {
                        setSelectedRole(r.key);
                        if (!loginEmail || loginEmail.includes('@smarttransit') || loginEmail.includes('@transitfleet') || loginEmail.includes('@cityhall') || loginEmail.includes('@infra-tech')) {
                          if (r.key === 'citizen') setLoginEmail('citizen@smarttransit.city');
                          else if (r.key === 'operator') setLoginEmail('operator@transitfleet.city');
                          else if (r.key === 'admin') setLoginEmail('admin@cityhall.gov');
                          else if (r.key === 'maintenance') setLoginEmail('maintenance@infra-tech.city');
                          else if (r.key === 'super_admin') setLoginEmail('superadmin@smarttransit.gov');
                        }
                      }}
                      className={`p-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 text-center ${
                        selectedRole === r.key
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-glow-cyan'
                          : 'bg-slate-800/80 border-slate-700/80 text-slate-400 hover:text-white'
                      }`}
                    >
                      {r.icon}
                      <span className="truncate">{r.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Email Input */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-cyan-400" /> Account Email
                </label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="name@organization.city"
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Password Input */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-cyan-400" /> Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('forgot');
                      setForgotEmail(loginEmail);
                      setForgotStep('email');
                    }}
                    className="text-[11px] text-cyan-400 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter security password"
                    className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-xs shadow-glow-cyan transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Activity className="w-4 h-4 animate-spin" /> Authenticating...
                  </span>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* 2. CREATE ACCOUNT FORM */}
          {authMode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-cyan-400" /> Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Alex Rivera"
                    className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-cyan-400" /> Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="user@smarttransit.city"
                    className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Role Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Select Role</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { key: 'citizen', label: 'Citizen', icon: <Navigation className="w-3 h-3 text-cyan-400" /> },
                    { key: 'operator', label: 'Operator', icon: <Bus className="w-3 h-3 text-blue-400" /> },
                    { key: 'admin', label: 'Admin', icon: <Building2 className="w-3 h-3 text-emerald-400" /> },
                    { key: 'maintenance', label: 'Maintainer', icon: <Wrench className="w-3 h-3 text-amber-400" /> }
                  ].map((r) => (
                    <button
                      key={r.key}
                      type="button"
                      onClick={() => setRegRole(r.key as UserRole)}
                      className={`p-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                        regRole === r.key
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-glow-cyan'
                          : 'bg-slate-800/80 border-slate-700/80 text-slate-400 hover:text-white'
                      }`}
                    >
                      {r.icon}
                      <span>{r.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-cyan-400" /> Department / Badge
                  </label>
                  <input
                    type="text"
                    value={regDepartment}
                    onChange={(e) => setRegDepartment(e.target.value)}
                    placeholder="e.g. Transit Mobility Div"
                    className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-cyan-400" /> Password
                  </label>
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Create strong password"
                    className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-slate-950 font-extrabold text-xs shadow-glow-green transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Activity className="w-4 h-4 animate-spin" /> Registering...
                  </span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Create Account & Sign In</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* 3. FORGOT PASSWORD FLOW */}
          {authMode === 'forgot' && (
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              
              {forgotStep === 'email' && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-cyan-400" /> Registered Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="e.g. user@smarttransit.city"
                      className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs shadow-glow-cyan transition-all"
                  >
                    Send 6-Digit OTP Code
                  </button>
                </div>
              )}

              {forgotStep === 'otp' && (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-cyan-950/60 border border-cyan-800 text-xs text-cyan-300">
                    <span>A verification code was sent to <strong>{forgotEmail || 'your email'}</strong> (Expires in 01:59).</span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                        <KeyRound className="w-3.5 h-3.5 text-cyan-400" /> Enter 6-Digit OTP Code
                      </label>
                      <button
                        type="button"
                        onClick={() => setOtpCode('739201')}
                        className="text-[10px] text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800 font-mono"
                      >
                        Auto-Fill (739201)
                      </button>
                    </div>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="7 3 9 2 0 1"
                      className="w-full text-center tracking-[0.5em] font-mono text-base font-bold bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs shadow-glow-cyan transition-all"
                  >
                    Verify Security Code
                  </button>
                </div>
              )}

              {forgotStep === 'newpass' && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-cyan-400" /> Enter New Password
                    </label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new strong password"
                      className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-glow-green transition-all"
                  >
                    Update Password & Save
                  </button>
                </div>
              )}

              {forgotStep === 'success' && (
                <div className="space-y-3 text-center py-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                  <h4 className="font-extrabold text-sm text-white">Password Updated Successfully!</h4>
                  <p className="text-xs text-slate-400">Your security credentials have been updated on the transit identity grid.</p>
                  
                  <button
                    type="button"
                    onClick={() => setAuthMode('login')}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-extrabold text-xs shadow-glow-cyan transition-all"
                  >
                    Return to Sign In
                  </button>
                </div>
              )}
            </form>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full px-6 py-3 border-t border-slate-800/80 bg-[#0B0F19]/80 backdrop-blur-md text-center text-xs text-slate-500">
        SmartTransit AI &copy; 2026 • Municipal Public Transport & Civic Infrastructure System • Multi-Role Access Control
      </footer>

    </div>
  );
};
