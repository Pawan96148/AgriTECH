import React, { useState } from 'react';
import { useFarm } from '../context/FarmContext';
import { UserRole, AuthMode } from '../types';
import {
  Sprout,
  LogIn,
  UserPlus,
  Lock,
  Mail,
  Phone,
  User as UserIcon,
  ShieldCheck,
  CheckCircle2,
  KeyRound,
  Eye,
  EyeOff,
  Sparkles,
  Users,
  MapPin,
  Wheat,
  ArrowRight,
  ArrowLeft,
  Trash2,
  Check,
  AlertCircle
} from 'lucide-react';

const JHARKHAND_REGIONS = [
  'Ranchi, Jharkhand',
  'Jamshedpur (East Singhbhum), Jharkhand',
  'Dhanbad, Jharkhand',
  'Bokaro, Jharkhand',
  'Deoghar, Jharkhand',
  'Hazaribagh, Jharkhand',
  'Ramgarh, Jharkhand',
  'Dumka, Jharkhand',
  'Giridih, Jharkhand',
  'Chaibasa (West Singhbhum), Jharkhand',
  'Palamu, Jharkhand',
  'Other State (Outside Jharkhand)'
];

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalMode,
    setAuthModalMode,
    login,
    signup,
    user,
    isAuthenticated,
    registeredAccounts,
    loginAsDemoUser,
    switchAccount,
    removeAccount,
    resetPasswordWithOtp
  } = useFarm();

  // Login Form State
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Signup Form State
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('+91 ');
  const [signupPassword, setSignupPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [signupRole, setSignupRole] = useState<UserRole>('FARM_OWNER');
  const [signupRegion, setSignupRegion] = useState(JHARKHAND_REGIONS[0]);
  const [signupFarmSize, setSignupFarmSize] = useState('10.0');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [signupError, setSignupError] = useState<string | null>(null);

  // Forgot Password / OTP Flow State
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [otpStep, setOtpStep] = useState<1 | 2 | 3>(1);
  const [generatedOtp, setGeneratedOtp] = useState('482910');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [forgotError, setForgotError] = useState<string | null>(null);
  const [forgotSuccess, setForgotSuccess] = useState(false);

  if (!isAuthModalOpen) return null;

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: 'Empty', color: 'bg-stone-200' };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 10) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 2) return { score: 1, label: 'Weak', color: 'bg-rose-500' };
    if (score <= 4) return { score: 2, label: 'Moderate', color: 'bg-amber-500' };
    return { score: 3, label: 'Strong', color: 'bg-emerald-600' };
  };

  const passStrength = getPasswordStrength(signupPassword);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    if (!loginIdentifier) {
      setLoginError('Please enter your email address or mobile number.');
      return;
    }
    setIsSubmitting(true);
    const res = await login(loginIdentifier, loginPassword);
    setIsSubmitting(false);
    if (!res.success) {
      setLoginError(res.error || 'Login failed. Please check your credentials.');
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError(null);
    if (!signupName.trim()) {
      setSignupError('Please provide your full name.');
      return;
    }
    if (!signupEmail.trim() || !signupEmail.includes('@')) {
      setSignupError('Please provide a valid email address.');
      return;
    }
    if (signupPassword.length < 6) {
      setSignupError('Password must be at least 6 characters.');
      return;
    }
    if (!agreeTerms) {
      setSignupError('Please accept the agronomic data management terms.');
      return;
    }

    setIsSubmitting(true);
    const res = await signup({
      name: signupName,
      email: signupEmail,
      phone: signupPhone,
      password: signupPassword,
      role: signupRole,
      region: signupRegion,
      farmSizeAcre: parseFloat(signupFarmSize) || 5.0
    });
    setIsSubmitting(false);
    if (!res.success) {
      setSignupError(res.error || 'Sign up failed.');
    }
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);
    if (!forgotIdentifier) {
      setForgotError('Please enter your registered email or mobile number.');
      return;
    }
    const clean = forgotIdentifier.trim().toLowerCase();
    const found = registeredAccounts.find(
      u => u.email.toLowerCase() === clean || u.phone.replace(/[\s+-]/g, '').includes(clean.replace(/[\s+-]/g, ''))
    );
    if (!found) {
      setForgotError('No registered farmer account found with this email or mobile number.');
      return;
    }
    setOtpStep(2);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);
    if (enteredOtp.trim() !== generatedOtp && enteredOtp.trim() !== '123456') {
      setForgotError('Invalid verification code. Please check or use demo OTP.');
      return;
    }
    setOtpStep(3);
  };

  const handleResetPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);
    if (newPassword.length < 6) {
      setForgotError('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setForgotError('Passwords do not match.');
      return;
    }
    const res = resetPasswordWithOtp(forgotIdentifier, newPassword);
    if (!res.success) {
      setForgotError(res.error || 'Failed to update password.');
    } else {
      setForgotSuccess(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl sm:rounded-3xl max-w-lg w-full max-h-[94vh] overflow-hidden shadow-2xl border border-lime-300 relative my-auto animate-in fade-in zoom-in-95 duration-200 flex flex-col">
        
        {/* Header with Agro Branding */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-green-900 text-white p-4 sm:p-6 relative shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-lime-400/20 text-lime-300 border border-lime-400/40 flex items-center justify-center shadow-inner shrink-0">
                <Sprout className="w-6 h-6 text-lime-400" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-extrabold text-base tracking-tight font-serif text-white">AGRITECH</span>
                  <span className="text-[10px] bg-lime-400/30 text-lime-200 px-2 py-0.2 rounded-full font-mono border border-lime-300/30">
                    FARM AUTH
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-emerald-200 truncate">Smart Monitoring & Intelligent Farming</p>
              </div>
            </div>
            
            <button
              id="auth-modal-close-btn"
              onClick={closeAuthModal}
              className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-full bg-emerald-950/60 hover:bg-emerald-950 text-emerald-200 hover:text-white flex items-center justify-center transition cursor-pointer text-sm font-bold active:scale-95 shrink-0 ml-2"
              aria-label="Close authentication modal"
            >
              ✕
            </button>
          </div>

          {/* Mode Selector Tabs (only shown when in normal LOGIN/SIGNUP/SWITCH mode) */}
          {authModalMode !== 'FORGOT_PASSWORD' && (
            <div className="mt-5 grid grid-cols-2 bg-emerald-950/60 p-1 rounded-xl border border-emerald-700/50 text-xs font-semibold">
              <button
                type="button"
                id="auth-tab-login"
                onClick={() => {
                  setLoginError(null);
                  setAuthModalMode('LOGIN');
                }}
                className={`py-2 rounded-lg flex items-center justify-center gap-2 transition cursor-pointer ${
                  authModalMode === 'LOGIN'
                    ? 'bg-lime-400 text-emerald-950 font-bold shadow-xs'
                    : 'text-emerald-200 hover:text-white'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
              
              <button
                type="button"
                id="auth-tab-signup"
                onClick={() => {
                  setSignupError(null);
                  setAuthModalMode('SIGNUP');
                }}
                className={`py-2 rounded-lg flex items-center justify-center gap-2 transition cursor-pointer ${
                  authModalMode === 'SIGNUP'
                    ? 'bg-lime-400 text-emerald-950 font-bold shadow-xs'
                    : 'text-emerald-200 hover:text-white'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Create Account</span>
              </button>
            </div>
          )}
        </div>

        {/* Modal Body Container */}
        <div className="p-5 sm:p-6 max-h-[75vh] overflow-y-auto">
          
          {/* ======================================================== */}
          {/* 1. SIGN IN (LOGIN) TAB */}
          {/* ======================================================== */}
          {authModalMode === 'LOGIN' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-emerald-950 font-serif">Welcome to Your Farm Hub</h3>
                  <p className="text-xs text-stone-500">Access your plots, crop milestones & real-time weather alerts</p>
                </div>
                <button
                  type="button"
                  onClick={() => setAuthModalMode('SWITCH_ACCOUNT')}
                  className="text-xs text-emerald-700 hover:text-emerald-900 font-semibold flex items-center gap-1 bg-lime-50 px-2.5 py-1 rounded-lg border border-lime-200 cursor-pointer"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Switch ({registeredAccounts.length})</span>
                </button>
              </div>

              {loginError && (
                <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-xl text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Authentication Issue: </span>
                    <span>{loginError}</span>
                  </div>
                </div>
              )}

              {/* Demo Password Callout Banner */}
              <div className="bg-lime-50/80 border border-lime-300 rounded-xl p-2.5 text-[11px] text-emerald-950 flex items-center justify-between">
                <div>
                  <span className="font-bold text-emerald-900">Demo Password: </span>
                  <code className="bg-white px-1.5 py-0.5 rounded border border-lime-300 font-mono font-bold text-emerald-950">Password@123</code>
                </div>
                <span className="text-[10px] text-stone-500">Universal demo password</span>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Email Address or Registered Mobile *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      id="login-email-input"
                      type="text"
                      required
                      placeholder="e.g. ramesh.farmer@jharkhandagro.in or +91 94311 55678"
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold text-stone-900 focus:bg-white focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 transition"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-semibold text-stone-700">Password *</label>
                    <button
                      type="button"
                      onClick={() => {
                        setForgotIdentifier(loginIdentifier);
                        setOtpStep(1);
                        setAuthModalMode('FORGOT_PASSWORD');
                      }}
                      className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 cursor-pointer hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id="login-password-input"
                      type={showLoginPassword ? 'text' : 'password'}
                      placeholder="Enter your secure password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full pl-9 pr-10 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold text-stone-900 focus:bg-white focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-700 cursor-pointer"
                    >
                      {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-stone-600 select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded text-emerald-700 focus:ring-emerald-600 w-3.5 h-3.5"
                    />
                    <span>Remember this device</span>
                  </label>
                  <span className="text-[11px] text-stone-400 font-mono">Zero-Sensor Platform</span>
                </div>

                <button
                  type="submit"
                  id="login-submit-btn"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl transition shadow-md shadow-emerald-900/15 flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer disabled:opacity-50"
                >
                  <LogIn className="w-4 h-4 text-lime-400" />
                  <span>{isSubmitting ? 'Verifying Account...' : 'Sign In to Farm Portal'}</span>
                </button>
              </form>

              {/* Fast 1-Click Demo Profiles */}
              <div className="pt-3 border-t border-stone-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-stone-600 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    One-Click Quick Login (Demo Profiles):
                  </span>
                  <span className="text-[10px] text-stone-400">Instant role switching</span>
                </div>

                <div className="space-y-1.5">
                  {registeredAccounts.slice(0, 4).map((acc) => (
                    <button
                      key={acc.id}
                      type="button"
                      onClick={() => loginAsDemoUser(acc.id)}
                      className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition cursor-pointer ${
                        user.id === acc.id && isAuthenticated
                          ? 'bg-lime-50 border-lime-400 text-emerald-950 ring-1 ring-lime-400/50'
                          : 'bg-stone-50 hover:bg-lime-50/60 border-stone-200 hover:border-lime-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`w-8 h-8 rounded-lg ${acc.avatarBg || 'bg-emerald-700'} text-white font-bold text-xs flex items-center justify-center shrink-0`}>
                          {acc.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div className="truncate">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs text-stone-900 truncate">{acc.name}</span>
                            <span className="bg-stone-200/80 text-stone-700 text-[9px] font-bold px-1.5 py-0.2 rounded uppercase">
                              {acc.role === 'FARM_OWNER' ? 'Farmer' : acc.role}
                            </span>
                          </div>
                          <div className="text-[10px] text-stone-500 truncate">{acc.roleTitle || acc.region}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-800 shrink-0 ml-2">
                        {user.id === acc.id && isAuthenticated ? (
                          <span className="bg-emerald-800 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                            Active
                          </span>
                        ) : (
                          <>
                            <span>Sign In</span>
                            <ArrowRight className="w-3 h-3 text-emerald-600" />
                          </>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 2. SIGN UP (CREATE ACCOUNT) TAB */}
          {/* ======================================================== */}
          {authModalMode === 'SIGNUP' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-emerald-950 font-serif">Create Your Farmer Account</h3>
                <p className="text-xs text-stone-500">Join thousands of cultivators leveraging intelligent farm schedules</p>
              </div>

              {signupError && (
                <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-xl text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Sign Up Notice: </span>
                    <span>{signupError}</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleSignupSubmit} className="space-y-3 text-xs">
                {/* Full Name */}
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Full Name *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                      <UserIcon className="w-4 h-4" />
                    </div>
                    <input
                      id="signup-name-input"
                      type="text"
                      required
                      placeholder="e.g. Gurpreet Singh"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold text-stone-900 focus:bg-white focus:ring-2 focus:ring-emerald-700 transition"
                    />
                  </div>
                </div>

                {/* Email & Phone Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Email Address *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        id="signup-email-input"
                        type="email"
                        required
                        placeholder="farmer@domain.com"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold text-stone-900 focus:bg-white focus:ring-2 focus:ring-emerald-700 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">WhatsApp / Mobile *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                        <Phone className="w-4 h-4" />
                      </div>
                      <input
                        id="signup-phone-input"
                        type="tel"
                        required
                        placeholder="+91 98765 00000"
                        value={signupPhone}
                        onChange={(e) => setSignupPhone(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold text-stone-900 focus:bg-white focus:ring-2 focus:ring-emerald-700 transition font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Role Selector */}
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Your Primary Agricultural Role *</label>
                  <div className="grid grid-cols-2 sm:grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setSignupRole('FARM_OWNER')}
                      className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                        signupRole === 'FARM_OWNER'
                          ? 'bg-emerald-50 border-emerald-600 text-emerald-950 font-bold'
                          : 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-700'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 text-xs font-bold">
                        <span>🌾 Farm Owner</span>
                      </div>
                      <p className="text-[10px] text-stone-500 mt-0.5">Direct land cultivation & produce seller</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSignupRole('CUSTOMER')}
                      className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                        signupRole === 'CUSTOMER'
                          ? 'bg-lime-50 border-lime-600 text-emerald-950 font-bold'
                          : 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-700'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 text-xs font-bold">
                        <span>🛒 Customer / Buyer</span>
                      </div>
                      <p className="text-[10px] text-stone-500 mt-0.5">Direct farm produce purchaser</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSignupRole('DEALER')}
                      className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                        signupRole === 'DEALER'
                          ? 'bg-amber-50 border-amber-600 text-emerald-950 font-bold'
                          : 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-700'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 text-xs font-bold">
                        <span>🏪 Inputs Dealer</span>
                      </div>
                      <p className="text-[10px] text-stone-500 mt-0.5">Seeds, fertilizer & farm equipment</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSignupRole('DELIVERY_PARTNER')}
                      className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                        signupRole === 'DELIVERY_PARTNER'
                          ? 'bg-emerald-50 border-emerald-600 text-emerald-950 font-bold'
                          : 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-700'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 text-xs font-bold">
                        <span>🚚 Delivery Partner</span>
                      </div>
                      <p className="text-[10px] text-stone-500 mt-0.5">Verified local logistics & cold delivery</p>
                    </button>
                  </div>
                </div>

                {/* Region & Farm Size Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">State / District (Jharkhand Scope) *</label>
                    <select
                      value={signupRegion}
                      onChange={(e) => setSignupRegion(e.target.value)}
                      className="w-full py-2 px-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold text-stone-900 focus:bg-white focus:ring-2 focus:ring-emerald-700"
                    >
                      {JHARKHAND_REGIONS.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                    {signupRegion.includes('Outside Jharkhand') && (
                      <p className="mt-1 text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-1.5">
                        ⚠️ Currently available only within Jharkhand.
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      {signupRole === 'CUSTOMER' ? 'Delivery Pin Code' : 'Total Landholdings (Acres)'}
                    </label>
                    <input
                      type={signupRole === 'CUSTOMER' ? 'text' : 'number'}
                      step="0.5"
                      placeholder={signupRole === 'CUSTOMER' ? 'e.g. 834001 (Ranchi)' : 'e.g. 12.5'}
                      value={signupFarmSize}
                      onChange={(e) => setSignupFarmSize(e.target.value)}
                      className="w-full py-2 px-3 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold font-mono text-stone-900 focus:bg-white focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>
                </div>

                {/* Password & Live Strength Meter */}
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Create Password *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id="signup-password-input"
                      type={showSignupPassword ? 'text' : 'password'}
                      required
                      placeholder="Minimum 6 characters with numbers"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      className="w-full pl-9 pr-10 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold text-stone-900 focus:bg-white focus:ring-2 focus:ring-emerald-700 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignupPassword(!showSignupPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-700 cursor-pointer"
                    >
                      {showSignupPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {signupPassword && (
                    <div className="mt-1.5 flex items-center gap-2">
                      <div className="flex-1 bg-stone-200 h-1.5 rounded-full overflow-hidden flex gap-1">
                        <div className={`h-full ${passStrength.score >= 1 ? passStrength.color : 'bg-transparent'} w-1/3 transition-all`} />
                        <div className={`h-full ${passStrength.score >= 2 ? passStrength.color : 'bg-transparent'} w-1/3 transition-all`} />
                        <div className={`h-full ${passStrength.score >= 3 ? passStrength.color : 'bg-transparent'} w-1/3 transition-all`} />
                      </div>
                      <span className="text-[10px] font-bold text-stone-600">
                        Strength: {passStrength.label}
                      </span>
                    </div>
                  )}
                </div>

                {/* Terms Agreement */}
                <label className="flex items-start gap-2 cursor-pointer text-stone-600 pt-1 select-none">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 rounded text-emerald-700 focus:ring-emerald-600 w-3.5 h-3.5"
                  />
                  <span className="text-[11px] leading-tight">
                    I agree to the <span className="font-semibold text-emerald-800">AGRITECH Smart Farming Terms</span> and localized weather conflict advisory guidelines.
                  </span>
                </label>

                <button
                  type="submit"
                  id="signup-submit-btn"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl transition shadow-md shadow-emerald-900/15 flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer disabled:opacity-50"
                >
                  <UserPlus className="w-4 h-4 text-lime-400" />
                  <span>{isSubmitting ? 'Creating Farm Account...' : 'Register Farm & Open Dashboard'}</span>
                </button>
              </form>
            </div>
          )}

          {/* ======================================================== */}
          {/* 3. FORGOT PASSWORD (OTP RECOVERY) VIEW */}
          {/* ======================================================== */}
          {authModalMode === 'FORGOT_PASSWORD' && (
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => setAuthModalMode('LOGIN')}
                className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-900 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Sign In</span>
              </button>

              <div>
                <h3 className="text-base font-bold text-emerald-950 font-serif">Account Recovery & PIN Reset</h3>
                <p className="text-xs text-stone-500">Recover access to your crop cycles using mobile/email verification</p>
              </div>

              {forgotError && (
                <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-xl text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{forgotError}</span>
                </div>
              )}

              {/* Step 1: Send OTP */}
              {otpStep === 1 && (
                <form onSubmit={handleSendOtp} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Enter Registered Email or Mobile Number *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="rajesh.farmer@agropulse.io or +91 98765 43210"
                      value={forgotIdentifier}
                      onChange={(e) => setForgotIdentifier(e.target.value)}
                      className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>

                  <div className="bg-lime-50 border border-lime-200 rounded-xl p-3 text-xs text-emerald-900 space-y-1">
                    <div className="font-bold flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-700" />
                      <span>Instant SMS & Email Dispatch</span>
                    </div>
                    <p className="text-[11px] text-stone-600">
                      We will generate a 6-digit OTP verification code for secure account confirmation.
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl transition text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <span>Send Verification Code (OTP)</span>
                    <ArrowRight className="w-4 h-4 text-lime-400" />
                  </button>
                </form>
              )}

              {/* Step 2: Enter OTP */}
              {otpStep === 2 && (
                <form onSubmit={handleVerifyOtp} className="space-y-3 text-xs">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-900">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold">Verification Code Sent!</span>
                      <span className="text-[10px] font-mono bg-emerald-200/80 px-2 py-0.5 rounded font-bold">
                        OTP: {generatedOtp}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-600">
                      Enter the 6-digit code sent to <span className="font-bold">{forgotIdentifier}</span>
                    </p>
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">6-Digit Verification PIN *</label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      placeholder="482910"
                      value={enteredOtp}
                      onChange={(e) => setEnteredOtp(e.target.value)}
                      className="w-full p-3 bg-stone-50 border border-stone-300 rounded-xl text-center text-lg font-mono font-bold tracking-widest text-emerald-950 focus:bg-white focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px]">
                    <button
                      type="button"
                      onClick={() => setEnteredOtp(generatedOtp)}
                      className="font-bold text-emerald-700 hover:underline cursor-pointer"
                    >
                      ⚡ Auto-Fill Demo OTP ({generatedOtp})
                    </button>
                    <span className="text-stone-400">Expires in 04:59</span>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl transition text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <span>Verify Code & Continue</span>
                    <ArrowRight className="w-4 h-4 text-lime-400" />
                  </button>
                </form>
              )}

              {/* Step 3: Set New Password */}
              {otpStep === 3 && (
                <form onSubmit={handleResetPasswordSubmit} className="space-y-3 text-xs">
                  <div className="bg-lime-50 border border-lime-200 rounded-xl p-2.5 text-xs text-emerald-900 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>Identity verified successfully! Set your new password below.</span>
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">New Password *</label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        required
                        placeholder="Minimum 6 characters"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full p-2.5 pr-10 bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-emerald-700"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-700 cursor-pointer"
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Confirm New Password *</label>
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      placeholder="Re-enter new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl transition text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <KeyRound className="w-4 h-4 text-lime-400" />
                    <span>Update Password & Enter Dashboard</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* 4. SWITCH ACCOUNT / SAVED PROFILES VIEW */}
          {/* ======================================================== */}
          {authModalMode === 'SWITCH_ACCOUNT' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-emerald-950 font-serif">Saved Farmer Profiles</h3>
                  <p className="text-xs text-stone-500">Switch between multi-farm owner accounts on this device</p>
                </div>
                <button
                  type="button"
                  onClick={() => setAuthModalMode('SIGNUP')}
                  className="text-xs text-emerald-700 hover:text-emerald-900 font-bold bg-lime-100 hover:bg-lime-200 px-3 py-1.5 rounded-lg border border-lime-300 flex items-center gap-1 cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>+ Add Profile</span>
                </button>
              </div>

              <div className="space-y-2">
                {registeredAccounts.map((acc) => {
                  const isActive = user.id === acc.id && isAuthenticated;
                  return (
                    <div
                      key={acc.id}
                      className={`p-3 rounded-2xl border flex items-center justify-between transition ${
                        isActive
                          ? 'bg-lime-50/80 border-lime-400 shadow-xs'
                          : 'bg-white hover:bg-stone-50 border-stone-200'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-9 h-9 rounded-xl ${acc.avatarBg || 'bg-emerald-700'} text-white font-bold text-sm flex items-center justify-center shrink-0`}>
                          {acc.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-stone-950 truncate">{acc.name}</span>
                            {isActive && (
                              <span className="bg-emerald-800 text-lime-300 text-[9px] px-2 py-0.2 rounded-full font-bold">
                                Current
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-stone-500 truncate">{acc.email}</p>
                          <p className="text-[10px] text-emerald-800 font-medium truncate">
                            {acc.roleTitle || acc.region} • {acc.farmSizeAcre || 10} Acres
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 ml-2">
                        {!isActive && (
                          <button
                            type="button"
                            onClick={() => switchAccount(acc.id)}
                            className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-lg text-xs transition cursor-pointer shadow-xs"
                          >
                            Switch
                          </button>
                        )}
                        {registeredAccounts.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeAccount(acc.id)}
                            title="Remove account from device"
                            className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 flex justify-between items-center text-xs">
                <button
                  type="button"
                  onClick={() => setAuthModalMode('LOGIN')}
                  className="text-stone-500 hover:text-stone-800 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Login</span>
                </button>
                <button
                  type="button"
                  onClick={closeAuthModal}
                  className="bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold px-4 py-1.5 rounded-lg transition cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer Security Badge */}
        <div className="bg-stone-50 px-6 py-2.5 border-t border-stone-100 flex items-center justify-between text-[10px] text-stone-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>End-to-End Local Farm Vault Protection</span>
          </div>
          <span>AgroPulse v2.4</span>
        </div>

      </div>
    </div>
  );
};
