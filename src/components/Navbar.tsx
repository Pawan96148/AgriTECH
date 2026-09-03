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
  KeyRound,
  Store,
  ShoppingBag,
  Menu,
  X,
  Truck,
  ArrowRight
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
    showToast,
    cartCount,
    setIsCheckoutModalOpen,
    orders
  } = useFarm();

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
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

  // Close drawer when route/tab changes
  useEffect(() => {
    setIsMobileDrawerOpen(false);
  }, [activeTab]);

  const userInitials = user.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'FM';

  const navItems: { id: ActiveTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'landing', label: 'Home', icon: Home },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'marketplace', label: 'Marketplace', icon: Store },
    { id: 'sell-produce', label: 'Sell Produce', icon: Sparkles },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'farms', label: 'My Farms', icon: MapPin },
    { id: 'crops', label: 'Crops', icon: Wheat },
    { id: 'activities', label: 'Schedule', icon: CalendarCheck },
    { id: 'weather', label: 'Weather', icon: CloudSun },
    { id: 'knowledge', label: 'Crop Guide', icon: BookOpen },
    { id: 'expenses', label: 'Expenses', icon: DollarSign },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-lime-200/80 shadow-xs">
      {/* Top micro bar for agricultural context */}
      <div className="bg-linear-to-r from-emerald-900 via-emerald-800 to-green-900 text-white text-[11px] sm:text-xs py-1 px-3 sm:px-6 flex items-center justify-between gap-2 overflow-x-auto scrollbar-none">
        <div className="flex items-center space-x-2 sm:space-x-3 shrink-0 py-0.5">
          <span className="flex items-center gap-1 font-medium text-lime-300">
            <span className="inline-block w-2 h-2 rounded-full bg-lime-400 animate-pulse"></span>
            <span className="hidden xs:inline">AgriTech</span> Engine v1.0
          </span>
          <span className="text-emerald-300/60">|</span>
          <span className="text-emerald-100/90 flex items-center gap-1">
            <span>📍</span>
            <select 
              id="header-farm-selector"
              value={selectedFarm?.id || ''} 
              onChange={(e) => setSelectedFarmId(e.target.value)}
              className="bg-emerald-950/70 border border-emerald-600/60 rounded px-1.5 py-0.5 text-[10px] sm:text-xs text-lime-200 focus:outline-none focus:ring-1 focus:ring-lime-400 cursor-pointer max-w-[125px] sm:max-w-none truncate"
            >
              {farms.map(f => (
                <option key={f.id} value={f.id} className="bg-emerald-900 text-white">
                  {f.farmName} ({f.area} Ac)
                </option>
              ))}
            </select>
          </span>
          <span className="text-emerald-300/60 hidden sm:inline">|</span>
          <span className="text-emerald-100 hidden sm:flex items-center gap-1">
            🌤️ {weather.currentTemp}°C, {weather.condition}
          </span>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          {isAuthenticated ? (
            <span className="text-[10px] sm:text-[11px] text-lime-300 hidden md:inline-flex items-center gap-1 font-medium bg-emerald-950/50 px-2 py-0.5 rounded">
              <ShieldCheck className="w-3 h-3 text-lime-400" />
              <span>{user.roleTitle || 'Verified Cultivator'}</span>
            </span>
          ) : (
            <button
              onClick={() => openAuthModal('LOGIN')}
              className="text-[10px] sm:text-[11px] text-lime-200 hover:text-white underline font-semibold cursor-pointer whitespace-nowrap"
            >
              Sign In
            </button>
          )}

          <button 
            id="header-export-summary-btn"
            onClick={handleExportClick}
            className="flex items-center gap-1 text-[10px] sm:text-[11px] bg-emerald-700/60 hover:bg-emerald-700 text-lime-200 px-2 py-0.5 rounded transition font-medium cursor-pointer"
            title="Export Agricultural Report"
          >
            <FileDown className="w-3 h-3" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Main navigation row */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2">
          {/* Logo */}
          <div 
            onClick={() => setActiveTab('landing')}
            className="flex items-center space-x-2 sm:space-x-2.5 cursor-pointer group select-none shrink-0"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-linear-to-br from-lime-500 via-green-600 to-emerald-800 flex items-center justify-center text-white shadow-sm shadow-lime-500/20 group-hover:scale-105 transition">
              <Sprout className="w-5 h-5 sm:w-6 sm:h-6 text-lime-100" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-emerald-950 font-serif">AGRITECH</span>
                <span className="bg-lime-100 text-lime-800 text-[9px] sm:text-[10px] font-bold px-1.5 py-0.2 rounded-full border border-lime-300 uppercase tracking-wider">Smart Farm</span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-emerald-700/80 -mt-0.5 font-medium hidden sm:block">Smart Monitoring & Intelligent Farming</p>
            </div>
          </div>

          {/* Desktop Nav Tabs (Hidden on mobile/tablet < xl to prevent overflow, accessible via drawer or horizontal bar) */}
          <nav className="hidden xl:flex items-center space-x-0.5 overflow-x-auto scrollbar-none">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-tab-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-1 px-2.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'text-emerald-900/80 hover:text-emerald-950 hover:bg-lime-50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-lime-300' : 'text-emerald-600'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Medium Desktop Nav Tabs (lg to xl): show core tabs */}
          <nav className="hidden lg:flex xl:hidden items-center space-x-0.5">
            {navItems.slice(0, 5).map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-1 px-2 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'text-emerald-900/80 hover:text-emerald-950 hover:bg-lime-50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-lime-300' : 'text-emerald-600'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
            <button
              onClick={() => setIsMobileDrawerOpen(true)}
              className="px-2 py-1.5 rounded-lg text-xs font-semibold text-emerald-800 hover:bg-lime-50 flex items-center gap-1 cursor-pointer"
            >
              <span>More...</span>
            </button>
          </nav>

          {/* Right Action Icons & Auth */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
            {/* Quick Add Task Button */}
            <button
              id="header-quick-add-task-btn"
              onClick={handleLogTaskClick}
              className="hidden sm:flex items-center gap-1.5 bg-lime-500 hover:bg-lime-600 text-emerald-950 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold shadow-xs transition active:scale-95 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-3" />
              <span className="hidden md:inline">Log Task</span>
            </button>

            {/* Reminders & Alerts Icon */}
            <button
              id="header-reminders-inbox-btn"
              onClick={() => setActiveTab('reminders')}
              className={`relative p-2 rounded-xl border transition cursor-pointer flex items-center justify-center min-w-[36px] min-h-[36px] ${
                activeTab === 'reminders'
                  ? 'bg-lime-100 border-lime-400 text-emerald-900'
                  : 'bg-stone-50 hover:bg-lime-50 border-stone-200 text-emerald-800'
              }`}
              title="Alerts & Reminders"
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-700" />
              {unreadRemindersCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[10px] font-bold w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shadow-xs animate-bounce">
                  {unreadRemindersCount}
                </span>
              )}
            </button>

            {/* Shopping Cart Button */}
            <button
              id="header-cart-btn"
              onClick={() => {
                setActiveTab('marketplace');
                if (cartCount > 0) {
                  setIsCheckoutModalOpen(true);
                }
              }}
              className={`relative p-2 rounded-xl border transition cursor-pointer flex items-center justify-center min-w-[36px] min-h-[36px] ${
                activeTab === 'marketplace'
                  ? 'bg-lime-100 border-lime-400 text-emerald-900'
                  : 'bg-stone-50 hover:bg-lime-50 border-stone-200 text-emerald-800'
              }`}
              title="Fresh Produce Cart"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-700" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-lime-500 text-emerald-950 text-[10px] font-extrabold w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Profile Dropdown OR Sign In */}
            {isAuthenticated ? (
              <div className="relative" ref={profileMenuRef}>
                <button
                  id="header-profile-btn"
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className={`flex items-center gap-1.5 sm:gap-2 p-1 sm:p-1.5 sm:pr-2.5 rounded-xl border transition text-xs font-medium cursor-pointer ${
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
                    <div className="text-[10px] text-emerald-700 leading-tight truncate max-w-[80px]">{user.roleTitle || 'Cultivator'}</div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-emerald-700 hidden sm:block" />
                </button>

                {/* Profile dropdown menu */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-lime-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100 text-xs">
                    <div className="px-4 py-2 border-b border-stone-100">
                      <div className="font-bold text-emerald-950 truncate">{user.name}</div>
                      <div className="text-[11px] text-stone-500 truncate">{user.email}</div>
                      <span className="inline-block mt-1 bg-lime-100 text-emerald-900 px-2 py-0.5 rounded text-[10px] font-bold">
                        {user.roleTitle || 'Verified Cultivator'}
                      </span>
                    </div>

                    <div className="py-1 text-xs">
                      <button
                        onClick={() => {
                          setActiveTab('marketplace');
                          setIsProfileMenuOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-stone-700 hover:bg-lime-50 hover:text-emerald-900 flex items-center gap-2 font-medium cursor-pointer"
                      >
                        <Store className="w-4 h-4 text-emerald-700" />
                        <span>Jharkhand Marketplace</span>
                      </button>

                      <button
                        onClick={() => {
                          setActiveTab('orders');
                          setIsProfileMenuOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-stone-700 hover:bg-lime-50 hover:text-emerald-900 flex items-center gap-2 font-medium cursor-pointer"
                      >
                        <ShoppingBag className="w-4 h-4 text-emerald-700" />
                        <span>Orders & Deliveries</span>
                      </button>

                      <button
                        onClick={() => {
                          setActiveTab('profile');
                          setIsProfileMenuOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-stone-700 hover:bg-lime-50 hover:text-emerald-900 flex items-center gap-2 font-medium cursor-pointer"
                      >
                        <UserIcon className="w-4 h-4 text-emerald-700" />
                        <span>Profile & Settings</span>
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
                  className="flex items-center gap-1 text-xs font-bold text-emerald-900 hover:text-emerald-950 bg-stone-100 hover:bg-lime-100 px-2.5 sm:px-3 py-1.5 rounded-xl border border-stone-200 transition cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Sign In</span>
                </button>
              </div>
            )}

            {/* Mobile / Tablet Hamburger Toggle Button */}
            <button
              id="navbar-mobile-drawer-toggle"
              onClick={() => setIsMobileDrawerOpen(!isMobileDrawerOpen)}
              className="lg:hidden p-2 rounded-xl bg-lime-100 hover:bg-lime-200 text-emerald-950 border border-lime-300 transition cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileDrawerOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Horizontal Sub-Navigation for quick swipe */}
        <div className="lg:hidden flex items-center space-x-1 overflow-x-auto scrollbar-none py-1.5 border-t border-lime-100">
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
                    ? 'bg-emerald-800 text-white font-bold shadow-2xs'
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

      {/* Full Mobile & Tablet Slide-Over Navigation Drawer */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
          {/* Backdrop */}
          <div 
            onClick={() => setIsMobileDrawerOpen(false)} 
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
          />

          {/* Drawer Panel */}
          <div className="relative w-full max-w-xs sm:max-w-sm bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden z-10 animate-in slide-in-from-right duration-200 text-xs">
            
            {/* Drawer Header */}
            <div className="bg-gradient-to-r from-emerald-950 to-green-950 text-white p-4 flex items-center justify-between border-b border-emerald-800 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-lg ${user.avatarBg || 'bg-emerald-700'} text-white flex items-center justify-center font-bold text-xs shadow-xs`}>
                  {userInitials}
                </div>
                <div>
                  <div className="font-bold text-white leading-tight truncate max-w-[150px]">{user.name}</div>
                  <div className="text-[10px] text-lime-300 font-medium truncate">{user.roleTitle || 'Verified Cultivator'}</div>
                </div>
              </div>

              <button
                onClick={() => setIsMobileDrawerOpen(false)}
                className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-900 transition cursor-pointer"
                aria-label="Close Navigation"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Navigation List */}
            <div className="p-4 space-y-4 overflow-y-auto flex-1">
              
              {/* Category 1: Marketplace & Commerce */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block px-2">
                  Marketplace & Produce
                </span>
                
                <button
                  onClick={() => setActiveTab('marketplace')}
                  className={`w-full flex items-center justify-between p-2 rounded-xl transition cursor-pointer ${
                    activeTab === 'marketplace' ? 'bg-emerald-800 text-white font-bold' : 'hover:bg-lime-50 text-stone-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Store className="w-4 h-4 text-emerald-700" />
                    <span>Fresh Harvest Marketplace</span>
                  </div>
                  <span className="text-[9px] bg-lime-100 text-emerald-950 px-1.5 py-0.2 rounded font-bold">JH</span>
                </button>

                <button
                  onClick={() => setActiveTab('sell-produce')}
                  className={`w-full flex items-center justify-between p-2 rounded-xl transition cursor-pointer ${
                    activeTab === 'sell-produce' ? 'bg-emerald-800 text-white font-bold' : 'hover:bg-lime-50 text-stone-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-emerald-700" />
                    <span>Sell Produce / Post Harvest</span>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center justify-between p-2 rounded-xl transition cursor-pointer ${
                    activeTab === 'orders' ? 'bg-emerald-800 text-white font-bold' : 'hover:bg-lime-50 text-stone-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <ShoppingBag className="w-4 h-4 text-emerald-700" />
                    <span>Orders & Fulfillment</span>
                  </div>
                  {orders.length > 0 && (
                    <span className="bg-lime-400 text-emerald-950 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                      {orders.length}
                    </span>
                  )}
                </button>
              </div>

              {/* Category 2: Farm Management */}
              <div className="space-y-1 pt-2 border-t border-stone-100">
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block px-2">
                  Plot & Crop Management
                </span>

                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`w-full flex items-center gap-2.5 p-2 rounded-xl transition cursor-pointer ${
                    activeTab === 'dashboard' ? 'bg-emerald-800 text-white font-bold' : 'hover:bg-lime-50 text-stone-700'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 text-emerald-700" />
                  <span>Farmer Dashboard</span>
                </button>

                <button
                  onClick={() => setActiveTab('farms')}
                  className={`w-full flex items-center gap-2.5 p-2 rounded-xl transition cursor-pointer ${
                    activeTab === 'farms' ? 'bg-emerald-800 text-white font-bold' : 'hover:bg-lime-50 text-stone-700'
                  }`}
                >
                  <MapPin className="w-4 h-4 text-emerald-700" />
                  <span>My Farm Plots ({farms.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('crops')}
                  className={`w-full flex items-center gap-2.5 p-2 rounded-xl transition cursor-pointer ${
                    activeTab === 'crops' ? 'bg-emerald-800 text-white font-bold' : 'hover:bg-lime-50 text-stone-700'
                  }`}
                >
                  <Wheat className="w-4 h-4 text-emerald-700" />
                  <span>Crop Life-Cycles</span>
                </button>

                <button
                  onClick={() => setActiveTab('activities')}
                  className={`w-full flex items-center gap-2.5 p-2 rounded-xl transition cursor-pointer ${
                    activeTab === 'activities' ? 'bg-emerald-800 text-white font-bold' : 'hover:bg-lime-50 text-stone-700'
                  }`}
                >
                  <CalendarCheck className="w-4 h-4 text-emerald-700" />
                  <span>Field Schedule & Tasks</span>
                </button>
              </div>

              {/* Category 3: Intelligence & Weather */}
              <div className="space-y-1 pt-2 border-t border-stone-100">
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block px-2">
                  Intelligence & Feeds
                </span>

                <button
                  onClick={() => setActiveTab('weather')}
                  className={`w-full flex items-center gap-2.5 p-2 rounded-xl transition cursor-pointer ${
                    activeTab === 'weather' ? 'bg-emerald-800 text-white font-bold' : 'hover:bg-lime-50 text-stone-700'
                  }`}
                >
                  <CloudSun className="w-4 h-4 text-emerald-700" />
                  <span>Localized 5-Day Weather</span>
                </button>

                <button
                  onClick={() => setActiveTab('reminders')}
                  className={`w-full flex items-center justify-between p-2 rounded-xl transition cursor-pointer ${
                    activeTab === 'reminders' ? 'bg-emerald-800 text-white font-bold' : 'hover:bg-lime-50 text-stone-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Bell className="w-4 h-4 text-emerald-700" />
                    <span>Rule Advisories & Alerts</span>
                  </div>
                  {unreadRemindersCount > 0 && (
                    <span className="bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                      {unreadRemindersCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('knowledge')}
                  className={`w-full flex items-center gap-2.5 p-2 rounded-xl transition cursor-pointer ${
                    activeTab === 'knowledge' ? 'bg-emerald-800 text-white font-bold' : 'hover:bg-lime-50 text-stone-700'
                  }`}
                >
                  <BookOpen className="w-4 h-4 text-emerald-700" />
                  <span>Crop Encyclopedia</span>
                </button>

                <button
                  onClick={() => setActiveTab('expenses')}
                  className={`w-full flex items-center gap-2.5 p-2 rounded-xl transition cursor-pointer ${
                    activeTab === 'expenses' ? 'bg-emerald-800 text-white font-bold' : 'hover:bg-lime-50 text-stone-700'
                  }`}
                >
                  <DollarSign className="w-4 h-4 text-emerald-700" />
                  <span>Input Costs & Ledger</span>
                </button>
              </div>

              {/* Category 4: Account Actions */}
              <div className="space-y-1 pt-2 border-t border-stone-100">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block px-2">
                  Account & System
                </span>

                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center gap-2.5 p-2 rounded-xl transition cursor-pointer ${
                    activeTab === 'profile' ? 'bg-emerald-800 text-white font-bold' : 'hover:bg-lime-50 text-stone-700'
                  }`}
                >
                  <UserIcon className="w-4 h-4 text-emerald-700" />
                  <span>Profile & Password</span>
                </button>

                <button
                  onClick={() => openAuthModal('SWITCH_ACCOUNT')}
                  className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-lime-50 text-stone-700 transition cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Users className="w-4 h-4 text-emerald-700" />
                    <span>Switch Operator Account</span>
                  </div>
                  <span className="text-[10px] bg-stone-100 px-1.5 py-0.5 rounded font-mono">
                    {registeredAccounts.length}
                  </span>
                </button>
              </div>

            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 bg-stone-50 border-t border-stone-200 space-y-2 shrink-0">
              <button
                onClick={handleLogTaskClick}
                className="w-full py-2.5 bg-lime-500 hover:bg-lime-600 text-emerald-950 font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-3" />
                <span>Log New Operation</span>
              </button>

              {isAuthenticated ? (
                <button
                  onClick={logout}
                  className="w-full py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold rounded-xl flex items-center justify-center gap-1.5 text-xs border border-rose-200 cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-rose-600" />
                  <span>Sign Out</span>
                </button>
              ) : (
                <button
                  onClick={() => openAuthModal('LOGIN')}
                  className="w-full py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-xl flex items-center justify-center gap-1.5 text-xs shadow-xs cursor-pointer"
                >
                  <LogIn className="w-4 h-4 text-lime-300" />
                  <span>Sign In / Register</span>
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Mobile Persistent Bottom Navigation Bar (Visible on phones & small tablets < md) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-lime-200/90 shadow-lg px-2 py-1.5 flex items-center justify-around">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition cursor-pointer ${
            activeTab === 'dashboard' ? 'text-emerald-900 font-extrabold' : 'text-stone-500 hover:text-emerald-800'
          }`}
        >
          <LayoutDashboard className={`w-5 h-5 ${activeTab === 'dashboard' ? 'text-emerald-700 stroke-[2.5]' : 'text-stone-400'}`} />
          <span className="text-[10px] mt-0.5 leading-none">Dashboard</span>
        </button>

        <button
          onClick={() => setActiveTab('marketplace')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition cursor-pointer relative ${
            activeTab === 'marketplace' ? 'text-emerald-900 font-extrabold' : 'text-stone-500 hover:text-emerald-800'
          }`}
        >
          <Store className={`w-5 h-5 ${activeTab === 'marketplace' ? 'text-emerald-700 stroke-[2.5]' : 'text-stone-400'}`} />
          <span className="text-[10px] mt-0.5 leading-none">Market</span>
          {cartCount > 0 && (
            <span className="absolute top-0 right-1 w-2 h-2 rounded-full bg-lime-500 ring-2 ring-white animate-pulse"></span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('sell-produce')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition cursor-pointer ${
            activeTab === 'sell-produce' ? 'text-emerald-900 font-extrabold' : 'text-stone-500 hover:text-emerald-800'
          }`}
        >
          <Sparkles className={`w-5 h-5 ${activeTab === 'sell-produce' ? 'text-emerald-700 stroke-[2.5]' : 'text-stone-400'}`} />
          <span className="text-[10px] mt-0.5 leading-none">Sell</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition cursor-pointer relative ${
            activeTab === 'orders' ? 'text-emerald-900 font-extrabold' : 'text-stone-500 hover:text-emerald-800'
          }`}
        >
          <ShoppingBag className={`w-5 h-5 ${activeTab === 'orders' ? 'text-emerald-700 stroke-[2.5]' : 'text-stone-400'}`} />
          <span className="text-[10px] mt-0.5 leading-none">Orders</span>
          {orders.length > 0 && (
            <span className="absolute top-0 right-1 bg-emerald-800 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {orders.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setIsMobileDrawerOpen(true)}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition cursor-pointer ${
            isMobileDrawerOpen ? 'text-emerald-900 font-extrabold' : 'text-stone-500 hover:text-emerald-800'
          }`}
        >
          <Menu className="w-5 h-5 text-stone-500" />
          <span className="text-[10px] mt-0.5 leading-none">Menu</span>
        </button>
      </div>

    </header>
  );
};
