import React, { useState } from 'react';
import {
  Shield,
  Lock,
  Mail,
  User,
  ArrowRight,
  Sparkles,
  Eye,
  EyeOff,
  CheckCircle2,
  FileText,
  Type
} from 'lucide-react';
import { UserProfile } from '../types';

interface LoginPageProps {
  onLogin: (user: UserProfile) => void;
  onExploreLanding: () => void;
  easyRead: boolean;
  onToggleEasyRead: () => void;
  onOpenSafetyModal: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLogin,
  onExploreLanding,
  easyRead,
  onToggleEasyRead,
  onOpenSafetyModal,
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('alex.morgan@example.com');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('Alex Morgan');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDemoLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      onLogin({
        name: 'Alex Morgan',
        email: 'alex.morgan@patientcare.org',
        patientId: 'PT-94821',
        age: '42 years',
        isDemo: true,
      });
      setIsLoading(false);
    }, 400);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError('Please provide both email and password.');
      return;
    }

    if (mode === 'signup' && !name.trim()) {
      setError('Please enter your full name.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      onLogin({
        name: mode === 'signup' ? name : (email.split('@')[0] || 'Patient'),
        email: email,
        patientId: `PT-${Math.floor(10000 + Math.random() * 90000)}`,
        age: '40 years',
        isDemo: false,
      });
      setIsLoading(false);
    }, 450);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between">
      {/* Top Utility Bar */}
      <header className="w-full bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">🩺</span>
          <span className="font-extrabold text-slate-900 tracking-tight text-lg">
            MediGuide AI
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Easy Read Mode Toggle */}
          <button
            onClick={onToggleEasyRead}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
              easyRead
                ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-xs'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
            title="Toggle Easy Read Mode with larger text"
          >
            <Type className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Easy Read</span>
            <span className={`text-[10px] px-1 rounded-sm uppercase ${easyRead ? 'bg-amber-300 font-bold' : 'text-slate-400'}`}>
              {easyRead ? 'ON' : 'OFF'}
            </span>
          </button>

          {/* Tour / Landing Link */}
          <button
            onClick={onExploreLanding}
            className="text-xs text-slate-600 hover:text-slate-900 font-medium py-1 px-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Explore App Tour
          </button>
        </div>
      </header>

      {/* Main Login Card Section */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200/90 overflow-hidden">
          {/* Header Banner */}
          <div className="bg-gradient-to-br from-blue-950 via-slate-900 to-teal-950 text-white p-6 sm:p-8 text-center space-y-2 relative">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold text-teal-200 border border-white/10 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-teal-300" />
              <span>Patient Health Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome to MediGuide AI
            </h1>
            <p className="text-xs sm:text-sm text-teal-100/90 max-w-xs mx-auto">
              Understand your medical reports and health information, simply.
            </p>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Quick Demo Sign In Box (Hackathon Friendly) */}
            <div className="p-4 bg-teal-50/70 border border-teal-200 rounded-2xl space-y-2.5 text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal-900">
                <Sparkles className="w-4 h-4 text-teal-600" />
                <span>Instant Hackathon Evaluation</span>
              </div>
              <p className="text-xs text-slate-600 leading-normal">
                Skip typing and log in immediately as demo patient <strong>Alex Morgan</strong> with a preloaded sample blood test report.
              </p>
              <button
                type="button"
                onClick={handleDemoLogin}
                disabled={isLoading}
                className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2 text-sm"
              >
                <span>{isLoading ? 'Accessing Portal...' : '1-Click Demo Patient Login'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-3 text-slate-400 font-semibold tracking-wider">
                  or sign in with email
                </span>
              </div>
            </div>

            {/* Sign in / Sign up Mode Switcher */}
            <div className="flex p-1 bg-slate-100 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setError(null);
                }}
                className={`flex-1 py-2 rounded-lg transition-colors cursor-pointer ${
                  mode === 'signin'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setError(null);
                }}
                className={`flex-1 py-2 rounded-lg transition-colors cursor-pointer ${
                  mode === 'signup'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl font-medium">
                {error}
              </div>
            )}

            {/* Standard Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 block">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alex Morgan"
                      className="w-full pl-10 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-900"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 block">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    required
                    className="w-full pl-10 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-900"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 block">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                  />
                  <span>Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={handleDemoLogin}
                  className="text-teal-700 hover:text-teal-800 font-semibold cursor-pointer"
                >
                  Fill demo info
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer text-sm"
              >
                {isLoading
                  ? 'Verifying...'
                  : mode === 'signin'
                  ? 'Sign In to Dashboard'
                  : 'Create Patient Account'}
              </button>
            </form>

            {/* Quick Guest Option */}
            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() =>
                  onLogin({
                    name: 'Guest Patient',
                    email: 'guest@mediguide.internal',
                    patientId: 'GUEST-01',
                    isDemo: true,
                  })
                }
                className="text-xs text-slate-500 hover:text-slate-800 font-medium cursor-pointer"
              >
                Or continue directly as Guest Visitor →
              </button>
            </div>
          </div>

          {/* Card Footer: Trust Markers */}
          <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-teal-600" />
              <span>Safe & Educational</span>
            </span>
            <button
              type="button"
              onClick={onOpenSafetyModal}
              className="text-teal-700 hover:underline cursor-pointer"
            >
              Safety Guidelines
            </button>
          </div>
        </div>
      </main>

      {/* Page Footer */}
      <footer className="w-full py-4 text-center text-xs text-slate-500 border-t border-slate-200 bg-white">
        <p>
          🩺 MediGuide AI · Healthcare information, explained responsibly. Does not replace professional medical advice.
        </p>
      </footer>
    </div>
  );
};
