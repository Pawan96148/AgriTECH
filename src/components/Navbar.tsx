import React, { useState, useRef, useEffect } from 'react';
import { useFarm } from '../context/FarmContext';
import { ActiveTab } from '../types';
import { 
  Sprout, 
  LayoutDashboard, 
  MapPin, 
  Wheat, 
  CalendarCheck, 
  CloudSun, 
  Bell, 
  BookOpen, 
  DollarSign, 
  User as UserIcon,
  Home,
  FileDown,
  Sparkles,
  ChevronRight,
  Plus,
  LogIn,
  UserPlus,
  LogOut,
  ChevronDown,
  Users,
  ShieldCheck,
  KeyRound
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    unreadRemindersCount, 
    weather, 
    selectedFarm,
    farms,
    setSelectedFarmId,
    setIsAddActivityModalOpen,
    setIsExportModalOpen,
    user,
    isAuthenticated,
    openAuthModal,
    logout,
    registeredAccounts,
    switchAccount,
    showToast
  } = useFarm();

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const handleLogTaskClick = () => {
    if (!isAuthenticated) {
      showToast('Please sign in to log agricultural operations and activities.');
      openAuthModal('LOGIN');
    } else {
      setIsAddActivityModalOpen(true);
    }
  };

  const handleExportClick = () => {
    if (!isAuthenticated) {
      showToast('Please sign in to generate and export farm records.');
      openAuthModal('LOGIN');
    } else {
      setIsExportModalOpen(true);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const userInitials = user.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'FM';

  const navItems: { id: ActiveTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'landing', label: 'Home', icon: Home },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'farms', label: 'My Farms', icon: MapPin },
    { id: 'crops', label: 'Crops', icon: Wheat },
    { id: 'activities', label: 'Schedule', icon: CalendarCheck },
    { id: 'weather', label: 'Weather', icon: CloudSun },
    { id: 'knowledge', label: 'Crop Guide', icon: BookOpen },
    { id: 'expenses', label: 'Expenses', icon: DollarSign },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-lime-200/80 shadow-xs">
      {/* Top micro bar for quick agricultural context */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-green-900 text-white text-xs py-1 px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center space-x-3 overflow-x-auto scrollbar-none py-0.5">
          <span className="flex items-center gap-1 font-medium text-lime-300">
            <span className="inline-block w-2 h-2 rounded-full bg-lime-400 animate-pulse"></span>
            Deterministic AgriTech Engine v1.0
          </span>
          <span className="text-emerald-300/60">|</span>
          <span className="text-emerald-100/90 hidden sm:inline flex items-center gap-1">
            📍 Active Farm: 
            <select 
              id="header-farm-selector"
              value={selectedFarm?.id || ''} 
              onChange={(e) => setSelectedFarmId(e.target.value)}
              className="bg-emerald-950/70 border border-emerald-600/60 rounded px-1.5 py-0.5 text-xs text-lime-200 focus:outline-none focus:ring-1 focus:ring-lime-400 cursor-pointer"
            >
              {farms.map(f => (
                <option key={f.id} value={f.id} className="bg-emerald-900 text-white">
                  {f.farmName} ({f.area} Ac)
                </option>
              ))}
            </select>
          </span>
          <span className="text-emerald-300/60 hidden sm:inline">|</span>
          <span className="text-emerald-100 flex items-center gap-1">
            🌤️ {weather.currentTemp}°C, {weather.condition} ({weather.rainProbability}% Rain Prob)
          </span>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          {isAuthenticated ? (
            <span className="text-[11px] text-lime-300 hidden md:inline-flex items-center gap-1 font-medium bg-emerald-950/50 px-2 py-0.5 rounded">
              <ShieldCheck className="w-3 h-3 text-lime-400" />
              <span>{user.roleTitle || 'Verified Cultivator'}</span>
            </span>
          ) : (
            <button
              onClick={() => openAuthModal('LOGIN')}
              className="text-[11px] text-lime-200 hover:text-white underline font-semibold cursor-pointer"
            >
              Sign In to Save Data
            </button>
          )}

          <button 
            id="header-export-summary-btn"
            onClick={handleExportClick}
            className="flex items-center gap-1 text-[11px] bg-emerald-700/60 hover:bg-emerald-700 text-lime-200 px-2 py-0.5 rounded transition font-medium cursor-pointer"
          >
            <FileDown className="w-3 h-3" />
            <span className="hidden md:inline">Export Report</span>
          </button>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            onClick={() => setActiveTab('landing')}
            className="flex items-center space-x-2.5 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-lime-500 via-green-600 to-emerald-800 flex items-center justify-center text-white shadow-sm shadow-lime-500/20 group-hover:scale-105 transition">
              <Sprout className="w-6 h-6 text-lime-100" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-emerald-950 font-serif">AGRITECH</span>
                <span className="bg-lime-100 text-lime-800 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-lime-300 uppercase tracking-wider">Smart Farm</span>
              </div>
              <p className="text-[11px] text-emerald-700/80 -mt-0.5 font-medium hidden sm:block">Smart Monitoring & Intelligent Farming</p>
            </div>
          </div>

          {/* Desktop Nav Tabs */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-tab-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'text-emerald-900/80 hover:text-emerald-950 hover:bg-lime-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-lime-300' : 'text-emerald-600'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons & Auth */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Quick Add Task Button */}
            <button
              id="header-quick-add-task-btn"
              onClick={handleLogTaskClick}
              className="hidden sm:flex items-center gap-1.5 bg-lime-500 hover:bg-lime-600 text-emerald-950 px-3 py-1.5 rounded-lg text-xs font-bold shadow-xs transition active:scale-95 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Log Task</span>
            </button>

            {/* Reminders & Alerts Icon */}
            <button
              id="header-reminders-inbox-btn"
              onClick={() => setActiveTab('reminders')}
              className={`relative p-2 rounded-lg border transition cursor-pointer ${
                activeTab === 'reminders'
                  ? 'bg-lime-100 border-lime-400 text-emerald-900'
                  : 'bg-stone-50 hover:bg-lime-50 border-stone-200 text-emerald-800'
              }`}
              title="Alerts & Reminders"
            >
              <Bell className="w-5 h-5 text-emerald-700" />
              {unreadRemindersCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-xs animate-bounce">
                  {unreadRemindersCount}
                </span>
              )}
            </button>

            {/* Authentication Buttons OR Profile Dropdown */}
            {isAuthenticated ? (
              <div className="relative" ref={profileMenuRef}>
                <button
                  id="header-profile-btn"
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className={`flex items-center gap-2 p-1.5 pr-2.5 rounded-xl border transition text-xs font-medium cursor-pointer ${
                    activeTab === 'profile'
                      ? 'bg-emerald-900 text-white border-emerald-950 shadow-xs'
                      : 'bg-emerald-50/80 hover:bg-emerald-100/90 border-emerald-200 text-emerald-950'
                  }`}
                >
                  <div className={`w-7 h-7 rounded-lg ${user.avatarBg || 'bg-emerald-700'} text-white flex items-center justify-center text-xs font-bold shadow-xs`}>
                    {userInitials}
                  </div>
                  <div className="text-left hidden md:block">
                    <div className="font-bold text-xs leading-none text-emerald-950">{user.name.split(' ')[0]}</div>
                    <div className="text-[10px] text-emerald-700 leading-tight truncate max-w-[90px]">
                      {user.role === 'AGRONOMIST' ? 'Agronomist' : user.role === 'FIELD_MANAGER' ? 'Manager' : 'Farmer'}
                    </div>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-emerald-700 transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Profile Dropdown Menu */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-lime-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-2.5 border-b border-stone-100">
                      <p className="text-xs font-bold text-emerald-950">{user.name}</p>
                      <p className="text-[11px] text-stone-500 truncate">{user.email}</p>
                      <span className="inline-block mt-1 text-[10px] bg-lime-100 text-emerald-900 px-2 py-0.5 rounded font-semibold border border-lime-200">
                        {user.roleTitle || 'Lead Cultivator'}
                      </span>
                    </div>

                    <div className="py-1 text-xs">
                      <button
                        onClick={() => {
                          setActiveTab('profile');
                          setIsProfileMenuOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-stone-700 hover:bg-lime-50 hover:text-emerald-900 flex items-center gap-2 font-medium cursor-pointer"
                      >
                        <UserIcon className="w-4 h-4 text-emerald-700" />
                        <span>Farmer Profile & Settings</span>
                      </button>

                      <button
                        onClick={() => {
                          openAuthModal('SWITCH_ACCOUNT');
                          setIsProfileMenuOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-stone-700 hover:bg-lime-50 hover:text-emerald-900 flex items-center justify-between font-medium cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-emerald-700" />
                          <span>Switch Account</span>
                        </div>
                        <span className="text-[10px] bg-stone-100 px-1.5 py-0.5 rounded font-mono">
                          {registeredAccounts.length}
                        </span>
                      </button>

                      <button
                        onClick={() => {
                          openAuthModal('SIGNUP');
                          setIsProfileMenuOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-stone-700 hover:bg-lime-50 hover:text-emerald-900 flex items-center gap-2 font-medium cursor-pointer"
                      >
                        <UserPlus className="w-4 h-4 text-emerald-700" />
                        <span>Add Another Account</span>
                      </button>
                    </div>

                    <div className="pt-1 border-t border-stone-100">
                      <button
                        onClick={() => {
                          logout();
                          setIsProfileMenuOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-rose-700 hover:bg-rose-50 flex items-center gap-2 text-xs font-semibold cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 text-rose-600" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  id="navbar-login-btn"
                  onClick={() => openAuthModal('LOGIN')}
                  className="flex items-center gap-1 text-xs font-bold text-emerald-900 hover:text-emerald-950 bg-stone-100 hover:bg-lime-100 px-3 py-1.5 rounded-xl border border-stone-200 transition cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Sign In</span>
                </button>

                <button
                  id="navbar-signup-btn"
                  onClick={() => openAuthModal('SIGNUP')}
                  className="flex items-center gap-1 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 px-3 py-1.5 rounded-xl shadow-xs transition cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5 text-lime-300" />
                  <span className="hidden sm:inline">Sign Up</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Horizontal Sub-Navigation */}
        <div className="lg:hidden flex items-center space-x-1 overflow-x-auto scrollbar-none py-2 border-t border-lime-100">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`mobile-nav-tab-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-md text-xs font-medium whitespace-nowrap shrink-0 transition cursor-pointer ${
                  isActive
                    ? 'bg-emerald-800 text-white font-bold'
                    : 'text-emerald-900/80 bg-lime-50/50 hover:bg-lime-100'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-lime-300' : 'text-emerald-600'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
