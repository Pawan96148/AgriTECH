import React, { useState, useEffect } from 'react';
import { useFarm } from '../context/FarmContext';
import { UserRole } from '../types';
import {
  User as UserIcon,
  Save,
  RotateCcw,
  ShieldCheck,
  MapPin,
  Mail,
  Phone,
  Calendar,
  Layers,
  Sparkles,
  CheckCircle2,
  Lock,
  KeyRound,
  Users,
  LogOut,
  UserPlus,
  Eye,
  EyeOff,
  Trash2,
  Check,
  AlertCircle,
  LogIn
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { 
    user, 
    isAuthenticated,
    updateUserProfile, 
    farms, 
    crops, 
    resetToSampleData,
    registeredAccounts,
    switchAccount,
    removeAccount,
    changePassword,
    logout,
    openAuthModal,
    showToast
  } = useFarm();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [region, setRegion] = useState(user.region);
  const [role, setRole] = useState<UserRole>(user.role || 'FARM_OWNER');
  const [farmSizeAcre, setFarmSizeAcre] = useState(user.farmSizeAcre?.toString() || '15.2');
  const [preferredLanguage, setPreferredLanguage] = useState(user.preferredLanguage);

  // Password Change State
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [passError, setPassError] = useState<string | null>(null);
  const [passSuccess, setPassSuccess] = useState(false);

  // Sync state if active user changes (e.g. account switch)
  useEffect(() => {
    setName(user.name);
    setEmail(user.email);
    setPhone(user.phone);
    setRegion(user.region);
    setRole(user.role || 'FARM_OWNER');
    setFarmSizeAcre(user.farmSizeAcre?.toString() || '15.2');
    setPreferredLanguage(user.preferredLanguage);
    setCurrentPass('');
    setNewPass('');
    setConfirmPass('');
    setPassError(null);
    setPassSuccess(false);
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name,
      email,
      phone,
      region,
      role,
      farmSizeAcre: parseFloat(farmSizeAcre) || 10,
      preferredLanguage
    });
  };

  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPassError(null);
    setPassSuccess(false);

    if (newPass.length < 6) {
      setPassError('New password must be at least 6 characters.');
      return;
    }
    if (newPass !== confirmPass) {
      setPassError('New passwords do not match.');
      return;
    }

    const res = changePassword(currentPass, newPass);
    if (!res.success) {
      setPassError(res.error || 'Failed to update password.');
    } else {
      setPassSuccess(true);
      setCurrentPass('');
      setNewPass('');
      setConfirmPass('');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="border-b border-lime-200 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
              <UserIcon className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-extrabold text-emerald-950 font-serif">Farmer Account & Multi-Profile Vault</h1>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Manage your agricultural credentials, profile settings, security password, and multi-farm operator accounts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => openAuthModal('SWITCH_ACCOUNT')}
            className="flex items-center gap-1.5 px-3 py-2 bg-lime-100 hover:bg-lime-200 text-emerald-900 rounded-xl text-xs font-bold border border-lime-300 transition cursor-pointer"
          >
            <Users className="w-4 h-4" />
            <span>Switch Profile ({registeredAccounts.length})</span>
          </button>

          {isAuthenticated ? (
            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold border border-rose-200 transition cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          ) : (
            <button
              onClick={() => openAuthModal('LOGIN')}
              className="flex items-center gap-1.5 px-3 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <LogIn className="w-4 h-4 text-lime-400" />
              <span>Sign In / Register</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Profile Summary & Saved Accounts */}
        <div className="lg:col-span-4 space-y-5">
          {/* Active Profile Card */}
          <div className="bg-white rounded-2xl border border-lime-200 shadow-xs p-5 space-y-4 text-center">
            <div className={`w-20 h-20 rounded-2xl ${user.avatarBg || 'bg-emerald-700'} text-white font-extrabold text-2xl flex items-center justify-center mx-auto shadow-md`}>
              {user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
            </div>

            <div>
              <h3 className="text-base font-bold text-emerald-950">{user.name}</h3>
              <p className="text-xs text-stone-500">{user.email}</p>
              <span className="inline-block mt-1 bg-lime-100 text-emerald-900 border border-lime-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                {user.roleTitle || 'Verified Farm Manager'}
              </span>
            </div>

            <div className="pt-3 border-t border-stone-100 space-y-2 text-xs text-left">
              <div className="flex items-center justify-between">
                <span className="text-stone-500">Registered Farms:</span>
                <span className="font-bold text-emerald-950">{farms.length} Plots</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-500">Active Crop Cycles:</span>
                <span className="font-bold text-emerald-950">{crops.filter(c => c.status === 'ACTIVE').length} Crops</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-500">Total Landholdings:</span>
                <span className="font-bold text-emerald-950">{user.farmSizeAcre || 15.2} Acres</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-500">Agricultural State:</span>
                <span className="font-bold text-stone-700 truncate max-w-[150px]">{user.region}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-500">Member Since:</span>
                <span className="font-bold text-stone-700">{user.createdAt}</span>
              </div>
            </div>

            {/* Reset Demo Data Button */}
            <div className="pt-4 border-t border-stone-100">
              <button
                onClick={resetToSampleData}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-stone-100 hover:bg-rose-50 text-stone-700 hover:text-rose-700 border border-stone-200 rounded-xl text-xs font-semibold transition cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Default Demo Dataset</span>
              </button>
            </div>
          </div>

          {/* Quick Switch Profiles on this Device */}
          <div className="bg-white rounded-2xl border border-lime-200 shadow-xs p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-emerald-700" />
                <span>Saved Device Profiles</span>
              </span>
              <button
                onClick={() => openAuthModal('SIGNUP')}
                className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 hover:underline cursor-pointer"
              >
                + Add Account
              </button>
            </div>

            <div className="space-y-1.5">
              {registeredAccounts.map((acc) => {
                const isActive = acc.id === user.id;
                return (
                  <div
                    key={acc.id}
                    className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition ${
                      isActive
                        ? 'bg-lime-50/80 border-lime-300 text-emerald-950 font-bold'
                        : 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className={`w-6 h-6 rounded-lg ${acc.avatarBg || 'bg-emerald-700'} text-white font-bold text-[10px] flex items-center justify-center shrink-0`}>
                        {acc.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div className="truncate min-w-0">
                        <div className="truncate font-semibold">{acc.name}</div>
                        <div className="text-[10px] text-stone-500 truncate">{acc.roleTitle || acc.region}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0 ml-2">
                      {isActive ? (
                        <span className="text-[10px] bg-emerald-800 text-lime-300 px-2 py-0.5 rounded-full font-bold">
                          Active
                        </span>
                      ) : (
                        <button
                          onClick={() => switchAccount(acc.id)}
                          className="px-2 py-1 bg-emerald-800 hover:bg-emerald-900 text-white rounded text-[10px] font-bold cursor-pointer transition"
                        >
                          Switch
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Settings & Security Forms */}
        <div className="lg:col-span-8 space-y-6">
          {/* Profile Form Card */}
          <div className="bg-white rounded-2xl border border-lime-200 shadow-xs p-6">
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <h3 className="text-sm font-bold text-emerald-950 border-b border-lime-100 pb-2 flex items-center gap-2">
                <UserIcon className="w-4 h-4 text-emerald-700" />
                <span>Cultivator / Operator Information</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs font-semibold text-stone-900 focus:bg-white focus:ring-2 focus:ring-emerald-700 transition"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs font-semibold text-stone-900 focus:bg-white focus:ring-2 focus:ring-emerald-700 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Mobile / WhatsApp Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs font-semibold text-stone-900 focus:bg-white focus:ring-2 focus:ring-emerald-700 transition font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Agricultural Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs font-semibold text-stone-900 focus:bg-white focus:ring-2 focus:ring-emerald-700 transition"
                  >
                    <option value="FARM_OWNER">🌾 Farm Owner / Cultivator</option>
                    <option value="AGRONOMIST">🧪 Agronomist / Plant Doctor</option>
                    <option value="FIELD_MANAGER">🚜 Field Operations Manager</option>
                    <option value="RESEARCHER">🔬 Agricultural Researcher</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Primary District / Region</label>
                  <input
                    type="text"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs font-semibold text-stone-900 focus:bg-white focus:ring-2 focus:ring-emerald-700 transition"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Total Landholding Area (Acres)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={farmSizeAcre}
                    onChange={(e) => setFarmSizeAcre(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs font-bold font-mono text-stone-900 focus:bg-white focus:ring-2 focus:ring-emerald-700 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Interface Language</label>
                <select
                  value={preferredLanguage}
                  onChange={(e) => setPreferredLanguage(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs font-semibold text-stone-900 focus:bg-white focus:ring-2 focus:ring-emerald-700 transition"
                >
                  <option value="English">English (Default)</option>
                  <option value="Hindi">हिन्दी (Hindi)</option>
                  <option value="Marathi">मराठी (Marathi)</option>
                  <option value="Punjabi">ਪੰਜਾਬੀ (Punjabi)</option>
                  <option value="Gujarati">ગુજરાતી (Gujarati)</option>
                  <option value="Telugu">తెలుగు (Telugu)</option>
                  <option value="Tamil">தமிழ் (Tamil)</option>
                </select>
              </div>

              <div className="flex items-center justify-end pt-2">
                <button
                  type="submit"
                  id="profile-save-settings-btn"
                  className="flex items-center gap-1.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-xs transition active:scale-95 cursor-pointer"
                >
                  <Save className="w-4 h-4 text-lime-400" />
                  <span>Save Profile Information</span>
                </button>
              </div>
            </form>
          </div>

          {/* Security & Password Change Card */}
          <div className="bg-white rounded-2xl border border-lime-200 shadow-xs p-6">
            <form onSubmit={handleChangePasswordSubmit} className="space-y-4 text-xs">
              <h3 className="text-sm font-bold text-emerald-950 border-b border-lime-100 pb-2 flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-emerald-700" />
                <span>Security & Password Protection</span>
              </h3>

              {passError && (
                <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-xl text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{passError}</span>
                </div>
              )}

              {passSuccess && (
                <div className="bg-lime-50 border border-lime-200 text-emerald-900 p-3 rounded-xl text-xs flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span>Your account password has been updated securely.</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Current Password *</label>
                  <input
                    type={showPass ? 'text' : 'password'}
                    required
                    placeholder="Existing password"
                    value={currentPass}
                    onChange={(e) => setCurrentPass(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-emerald-700 transition"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">New Password *</label>
                  <input
                    type={showPass ? 'text' : 'password'}
                    required
                    placeholder="Min 6 characters"
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-emerald-700 transition"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Confirm New Password *</label>
                  <input
                    type={showPass ? 'text' : 'password'}
                    required
                    placeholder="Repeat new password"
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-emerald-700 transition"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="flex items-center gap-1.5 text-stone-500 hover:text-stone-800 cursor-pointer text-[11px] font-semibold"
                >
                  {showPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showPass ? 'Hide passwords' : 'Show passwords'}</span>
                </button>

                <button
                  type="submit"
                  className="flex items-center gap-1.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-4 py-2 rounded-xl text-xs transition cursor-pointer shadow-xs"
                >
                  <Lock className="w-3.5 h-3.5 text-lime-400" />
                  <span>Update Password</span>
                </button>
              </div>
            </form>
          </div>

          {/* Rule Threshold Configuration Preview */}
          <div className="bg-lime-50/60 rounded-2xl border border-lime-200 p-5 space-y-3">
            <h3 className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>Deterministic Conflict Engine Rules</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] text-stone-600 bg-white p-3.5 rounded-xl border border-lime-200">
              <div>
                <span className="font-bold text-emerald-950 block">Rain vs Pesticide Conflict:</span>
                <span>Triggers advisory when Rain Prob &ge; 50%</span>
              </div>
              <div>
                <span className="font-bold text-emerald-950 block">Heavy Rain Irrigation Skip:</span>
                <span>Triggers advisory when Precipitation &ge; 10 mm</span>
              </div>
              <div>
                <span className="font-bold text-emerald-950 block">Maturity Window Alert:</span>
                <span>Triggers when Crop Lifecycle &ge; 90%</span>
              </div>
              <div>
                <span className="font-bold text-emerald-950 block">Midday Heatwave Alert:</span>
                <span>Triggers when Temperature &ge; 38°C</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
