import React, { useState, useRef, useEffect, useMemo } from 'react';
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
  ArrowRight,
  Scan
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

  const navItems = useMemo(() => {
    const allItems: { id: ActiveTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
      { id: 'landing', label: 'Home', icon: Home },
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'community', label: 'Community', icon: Users },
      { id: 'plant-scanner', label: 'Plant Scanner', icon: Scan },
      { id: 'marketplace', label: 'Marketplace', icon: Store },
      { id: 'sell-produce', label: 'Sell Produce', icon: Sparkles },
      { id: 'orders', label: user.role === 'DELIVERY_PARTNER' ? 'Deliveries' : 'Orders', icon: user.role === 'DELIVERY_PARTNER' ? Truck : ShoppingBag },
      { id: 'farms', label: 'My Farms', icon: MapPin },
      { id: 'crops', label: 'Crops', icon: Wheat },
      { id: 'activities', label: 'Schedule', icon: CalendarCheck },
      { id: 'weather', label: 'Weather', icon: CloudSun },
      { id: 'knowledge', label: 'Crop Guide', icon: BookOpen },
      { id: 'expenses', label: 'Expenses', icon: DollarSign },
    ];

    if (!isAuthenticated) {
      return allItems.filter(item => ['landing', 'marketplace', 'weather', 'knowledge'].includes(item.id));
    }

    if (user.role === 'CUSTOMER') {
      return allItems.filter(item => ['landing', 'marketplace', 'orders', 'weather'].includes(item.id));
    }

    if (user.role === 'DELIVERY_PARTNER') {
      return allItems.filter(item => ['landing', 'dashboard', 'orders', 'weather'].includes(item.id));
    }

    if (user.role === 'DEALER') {
      return allItems.filter(item => ['landing', 'dashboard', 'marketplace', 'orders', 'weather'].includes(item.id));
    }

    // Default FARM_OWNER gets full suite including community and plant-scanner
    return allItems;
  }, [user.role, isAuthenticated]);

  // Dynamic Role-Aware Persistent Bottom Navigation Tabs (5 tabs including Menu)
  const bottomNavItems = useMemo(() => {
    if (user.role === 'CUSTOMER') {
      return [
        { id: 'marketplace' as ActiveTab, label: 'Market', icon: Store, hasCartBadge: true },
        { id: 'orders' as ActiveTab, label: 'Orders', icon: ShoppingBag, hasOrderBadge: true },
        { id: 'weather' as ActiveTab, label: 'Weather', icon: CloudSun },
        { id: 'profile' as ActiveTab, label: 'Account', icon: UserIcon },
      ];
    }
    if (user.role === 'DELIVERY_PARTNER') {
      return [
        { id: 'orders' as ActiveTab, label: 'Deliveries', icon: Truck, hasOrderBadge: true },
        { id: 'marketplace' as ActiveTab, label: 'Market', icon: Store },
        { id: 'weather' as ActiveTab, label: 'Weather', icon: CloudSun },
        { id: 'profile' as ActiveTab, label: 'Partner ID', icon: UserIcon },
      ];
    }
    if (user.role === 'DEALER') {
      return [
        { id: 'marketplace' as ActiveTab, label: 'Market', icon: Store },
        { id: 'orders' as ActiveTab, label: 'Orders', icon: ShoppingBag, hasOrderBadge: true },
        { id: 'weather' as ActiveTab, label: 'Weather', icon: CloudSun },
        { id: 'profile' as ActiveTab, label: 'Dealer ID', icon: UserIcon },
      ];
    }
    // Default FARM_OWNER
    return [
      { id: 'dashboard' as ActiveTab, label: 'Dashboard', icon: LayoutDashboard },
      { id: 'marketplace' as ActiveTab, label: 'Market', icon: Store, hasCartBadge: true },
      { id: 'sell-produce' as ActiveTab, label: 'Sell', icon: Sparkles },
      { id: 'orders' as ActiveTab, label: 'Orders', icon: ShoppingBag, hasOrderBadge: true },
    ];
  }, [user.role]);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-lime-200/80 shadow-xs">
      {/* Top micro bar for agricultural context */}
      <div className="bg-linear-to-r from-emerald-900 via-emerald-800 to-green-900 text-white text-[10px] sm:text-xs border-b border-emerald-800/60">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 py-1.5 flex items-center justify-between gap-1.5 sm:gap-3 min-w-0">
          <div className="flex items-center gap-1.5 sm:gap-3 min-w-0 flex-1">
            <span className="flex items-center gap-1 sm:gap-1.5 font-semibold text-lime-300 shrink-0 text-[10px] sm:text-xs whitespace-nowrap">
              <span className="inline-block w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-lime-400 animate-pulse shrink-0"></span>
              Engine v1.0
            </span>
            <span className="text-emerald-500/50 select-none shrink-0">•</span>
            <div className="flex items-center gap-1 min-w-0 max-w-[130px] sm:max-w-[240px] md:max-w-none text-emerald-100">
              <MapPin className="w-3 h-3 text-lime-400 shrink-0" />
              <select 
                id="header-farm-selector"
                value={selectedFarm?.id || ''} 
                onChange={(e) => setSelectedFarmId(e.target.value)}
                className="bg-emerald-950/70 border border-emerald-600/60 rounded px-1 sm:px-1.5 py-1 text-[10px] sm:text-xs text-lime-200 focus:outline-none focus:ring-1 focus:ring-lime-400 cursor-pointer w-full truncate min-h-[26px]"
              >
                {farms.map(f => (
                  <option key={f.id} value={f.id} className="bg-emerald-900 text-white">
                    {f.farmName} ({f.area} Ac)
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0 ml-auto">
            <div className="hidden sm:flex items-center gap-1 text-emerald-100/90 whitespace-nowrap">
              <CloudSun className="w-3.5 h-3.5 text-lime-300 shrink-0" />
              <span>{weather.currentTemp}°C, {weather.condition}</span>
            </div>
            <span className="text-emerald-500/50 hidden sm:inline select-none shrink-0">•</span>
            {isAuthenticated ? (
              <span className="hidden md:inline-flex items-center gap-1 font-medium bg-emerald-950/50 border border-emerald-700/40 text-lime-300 px-2 py-0.5 rounded text-[10px] sm:text-[11px] shrink-0">
                <ShieldCheck className="w-3 h-3 text-lime-400 shrink-0" />
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
              className="flex items-center gap-1 text-[10px] sm:text-[11px] bg-emerald-700/60 hover:bg-emerald-700 text-lime-200 px-1.5 sm:px-2 py-0.5 rounded transition font-medium cursor-pointer shrink-0"
              title="Export Agricultural Report"
            >
              <FileDown className="w-3 h-3 shrink-0" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
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
                <span className="bg-lime-100 text-lime-800 text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-lime-300 uppercase tracking-wider">Smart Farm</span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-emerald-700/80 -mt-0.5 font-medium hidden sm:block">Smart Monitoring & Intelligent Farming</p>
            </div>
          </div>

          {/* Main Desktop Navigation - Clean, single set of navigational items (<768px hidden, >=768px flex) */}
          <nav className="hidden md:flex items-center space-x-0.5 overflow-x-auto scrollbar-none">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-tab-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
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

          {/* Right Action Icons & Auth */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Quick Add Task Button */}
            <button
              id="header-quick-add-task-btn"
              onClick={handleLogTaskClick}
              className="hidden sm:flex items-center gap-1.5 bg-lime-500 hover:bg-lime-400 text-emerald-950 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold shadow-xs transition active:scale-95 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-3" />
              <span className="hidden md:inline">Log Task</span>
            </button>

            {/* Reminders & Alerts Icon */}
            <button
              id="header-reminders-inbox-btn"
              onClick={() => setActiveTab('reminders')}
              className={`relative w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-xl border transition cursor-pointer flex items-center justify-center ${
                activeTab === 'reminders'
                  ? 'bg-lime-100 border-lime-400 text-emerald-900'
                  : 'bg-stone-50/80 hover:bg-lime-50/80 border-stone-200 text-emerald-800'
              }`}
              title="Alerts & Reminders"
            >
              <Bell className="w-4 h-4 text-emerald-700" />
              {unreadRemindersCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
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
              className={`relative w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-xl border transition cursor-pointer flex items-center justify-center ${
                activeTab === 'marketplace'
                  ? 'bg-lime-100 border-lime-400 text-emerald-900'
                  : 'bg-stone-50/80 hover:bg-lime-50/80 border-stone-200 text-emerald-800'
              }`}
              title="Fresh Produce Cart"
            >
              <ShoppingBag className="w-4 h-4 text-emerald-700" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-lime-500 text-emerald-950 text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Streamlined Profile Dropdown OR Sign In */}
            {isAuthenticated ? (
              <div className="relative" ref={profileMenuRef}>
                <button
                  id="header-profile-btn"
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className={`flex items-center gap-1.5 p-1 sm:p-1.5 sm:pr-2.5 rounded-xl border transition text-xs font-medium cursor-pointer ${
                    activeTab === 'profile'
                      ? 'bg-emerald-900 text-white border-emerald-950 shadow-xs'
                      : 'bg-emerald-50/70 hover:bg-emerald-100/80 border-emerald-200 text-emerald-950'
                  }`}
                >
                  <div className={`w-7 h-7 rounded-lg ${user.avatarBg || 'bg-emerald-700'} text-white flex items-center justify-center text-xs font-bold shadow-xs`}>
                    {userInitials}
                  </div>
                  <span className="font-bold text-xs leading-none text-emerald-950 hidden xl:inline truncate max-w-[80px]">
                    {user.name.split(' ')[0]}
                  </span>
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

            {/* Mobile / Tablet Hamburger Toggle Button (<768px visible, >=768px hidden) */}
            <button
              id="navbar-mobile-drawer-toggle"
              onClick={() => setIsMobileDrawerOpen(!isMobileDrawerOpen)}
              className="md:hidden p-2 rounded-xl bg-lime-100 hover:bg-lime-200 text-emerald-950 border border-lime-300 transition cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center active:scale-95"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileDrawerOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Full Mobile & Tablet Slide-Over Navigation Drawer (<768px) */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex justify-end">
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
                className="w-10 h-10 rounded-xl text-emerald-200 hover:text-white hover:bg-emerald-900 transition cursor-pointer flex items-center justify-center active:scale-95"
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

                <button
                  onClick={() => setActiveTab('plant-scanner')}
                  className={`w-full flex items-center justify-between p-2 rounded-xl transition cursor-pointer ${
                    activeTab === 'plant-scanner' ? 'bg-emerald-800 text-white font-bold' : 'hover:bg-lime-50 text-stone-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Scan className="w-4 h-4 text-emerald-700" />
                    <span>AI Plant Disease Scanner</span>
                  </div>
                  <span className="text-[9px] bg-emerald-100 text-emerald-900 px-1.5 py-0.2 rounded font-bold">AI</span>
                </button>

                <button
                  onClick={() => setActiveTab('community')}
                  className={`w-full flex items-center justify-between p-2 rounded-xl transition cursor-pointer ${
                    activeTab === 'community' ? 'bg-emerald-800 text-white font-bold' : 'hover:bg-lime-50 text-stone-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Users className="w-4 h-4 text-emerald-700" />
                    <span>District Farmer Community</span>
                  </div>
                  <span className="text-[9px] bg-lime-100 text-emerald-950 px-1.5 py-0.2 rounded font-bold">24 Dists</span>
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
      <nav 
        aria-label="Mobile Bottom Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-lime-200/90 shadow-lg px-1.5 py-1 flex items-center justify-around"
        style={{ paddingBottom: 'calc(0.375rem + env(safe-area-inset-bottom, 0px))' }}
      >
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`mobile-bottom-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`flex-1 min-h-[48px] min-w-[44px] flex flex-col items-center justify-center py-1 px-1 rounded-xl transition cursor-pointer relative active:scale-95 ${
                isActive ? 'text-emerald-900 font-extrabold' : 'text-stone-500 hover:text-emerald-800'
              }`}
            >
              <Icon className={`w-5 h-5 transition-transform ${isActive ? 'text-emerald-700 stroke-[2.5] scale-110' : 'text-stone-400'}`} />
              <span className={`text-[10px] mt-0.5 leading-none transition-colors ${isActive ? 'text-emerald-900 font-bold' : 'text-stone-500'}`}>
                {item.label}
              </span>
              {item.hasCartBadge && cartCount > 0 && (
                <span className="absolute top-1 right-3 w-2 h-2 rounded-full bg-lime-500 ring-2 ring-white animate-pulse"></span>
              )}
              {item.hasOrderBadge && orders.length > 0 && (
                <span className="absolute top-0.5 right-2 bg-emerald-800 text-white text-[9px] font-bold min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center">
                  {orders.length}
                </span>
              )}
            </button>
          );
        })}

        {/* 5th Tab: Mobile Drawer Menu Toggle */}
        <button
          id="mobile-bottom-menu"
          onClick={() => setIsMobileDrawerOpen(true)}
          className={`flex-1 min-h-[48px] min-w-[44px] flex flex-col items-center justify-center py-1 px-1 rounded-xl transition cursor-pointer active:scale-95 ${
            isMobileDrawerOpen ? 'text-emerald-900 font-extrabold' : 'text-stone-500 hover:text-emerald-800'
          }`}
        >
          <Menu className={`w-5 h-5 transition-transform ${isMobileDrawerOpen ? 'text-emerald-700 stroke-[2.5] scale-110' : 'text-stone-500'}`} />
          <span className="text-[10px] mt-0.5 leading-none">Menu</span>
        </button>
      </nav>

    </header>
  );
};
