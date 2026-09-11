import React, { useState } from 'react';
import { useFarm } from '../context/FarmContext';
import { calculateCropProgress } from '../utils/ruleEngine';
import { CropDoodle } from './CropDoodle';
import {
  LayoutDashboard,
  MapPin,
  Wheat,
  CalendarCheck,
  CloudSun,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Droplets,
  Wind,
  Sun,
  Plus,
  ArrowRight,
  TrendingUp,
  ShieldAlert,
  ChevronRight,
  Sparkles,
  RefreshCw,
  Check,
  Calendar,
  Layers,
  FileSpreadsheet,
  Store,
  ShoppingBag,
  Truck
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    farms,
    selectedFarm,
    selectedFarmId,
    setSelectedFarmId,
    crops,
    activities,
    weather,
    weatherLoading,
    weatherError,
    refreshWeather,
    userTotalAcreage,
    setWeatherScenario,
    reminders,
    unreadRemindersCount,
    markReminderAsRead,
    updateActivityStatus,
    setActiveTab,
    setIsAddActivityModalOpen,
    setIsAddCropModalOpen,
    setIsAddFarmModalOpen,
    setIsExportModalOpen,
    user,
    products,
    orders,
    isSharingLocation,
    startLocationSharing,
    stopLocationSharing
  } = useFarm();

  const [activeWeatherSim, setActiveWeatherSim] = useState<'rainy' | 'sunny' | 'heatwave' | 'windy'>('rainy');

  // Filter tasks for this farm or all
  const farmCrops = crops.filter(c => !selectedFarmId || c.farmId === selectedFarmId);
  const farmCropIds = farmCrops.map(c => c.id);
  const activeCrops = crops.filter(c => c.status === 'ACTIVE');
  const userFarms = farms.filter(f => f.userId === user.id);
  const totalAcreage = userTotalAcreage > 0 ? userTotalAcreage : farms.reduce((acc, f) => acc + f.area, 0);

  // Today & Overdue tasks
  const todayStr = new Date().toISOString().split('T')[0];
  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);

  const dueTodayTasks = activities.filter(a => {
    return a.status === 'PENDING' && a.scheduledDate === todayStr;
  });

  const overdueTasks = activities.filter(a => {
    if (a.status !== 'PENDING') return false;
    const d = new Date(a.scheduledDate);
    d.setHours(0, 0, 0, 0);
    return d < todayDate;
  });

  const upcomingTasks = activities.filter(a => {
    if (a.status !== 'PENDING') return false;
    const d = new Date(a.scheduledDate);
    d.setHours(0, 0, 0, 0);
    return d > todayDate;
  }).slice(0, 4);

  // Top high-priority alerts
  const criticalAndHighAlerts = reminders.filter(r => r.priority === 'CRITICAL' || r.priority === 'HIGH');
  const displayAlerts = criticalAndHighAlerts.length > 0 ? criticalAndHighAlerts : reminders.slice(0, 3);

  const handleScenarioChange = (s: 'rainy' | 'sunny' | 'heatwave' | 'windy') => {
    setActiveWeatherSim(s);
    setWeatherScenario(s);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* Top Welcome & Active Weather Banner */}
      <div className="bg-linear-to-br from-emerald-900 via-emerald-800 to-green-900 text-white rounded-2xl p-5 sm:p-6 shadow-md relative overflow-hidden">
        {/* Subtle background leaves decorative pattern */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-lime-400/20 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Welcome greeting */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-lime-400/20 border border-lime-400/40 text-lime-300 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-ping" />
                Live Farm Operations
              </span>
              <span className="text-xs text-emerald-200">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-serif tracking-tight text-white">
              Welcome back, {user.name.split(' ')[0]} 👋
            </h1>
            <p className="text-xs sm:text-sm text-emerald-50 font-medium max-w-xl leading-relaxed">
              Deterministic rule engine is active for <strong className="text-lime-300 font-bold">{farms.length} plots</strong> across <strong className="text-lime-300 font-bold">{totalAcreage.toFixed(1)} acres</strong>.
            </p>
          </div>

          {/* Weather Snapshot Widget inside banner */}
          <div className="w-full lg:w-auto lg:min-w-90 bg-emerald-950/40 backdrop-blur-md border border-white/20 rounded-xl p-4 flex flex-col justify-between space-y-3.5 shadow-inner">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="p-2 rounded-lg bg-lime-400/20 border border-lime-400/30 shrink-0">
                  <CloudSun className="w-6 h-6 text-lime-300" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-emerald-100 block">Current Farm Weather</span>
                    {weatherLoading && (
                      <RefreshCw className="w-3 h-3 text-lime-300 animate-spin" />
                    )}
                  </div>
                  <span className="text-sm font-bold text-white truncate block">
                    {weather.farmName ? `${weather.farmName} • ` : ''}{weather.location}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={refreshWeather}
                  disabled={weatherLoading}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-lime-300 transition cursor-pointer disabled:opacity-40"
                  title="Refresh Live Weather from Farm Coordinates"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${weatherLoading ? 'animate-spin' : ''}`} />
                </button>
                <div className="text-right">
                  <span className="text-2xl font-extrabold text-white leading-tight block">{weather.currentTemp}°C</span>
                  <span className="text-xs font-semibold text-lime-300 block">{weather.condition}</span>
                </div>
              </div>
            </div>

            {weatherError && (
              <div className="bg-rose-950/70 border border-rose-400/40 rounded-lg p-2 text-[11px] text-rose-200 flex items-center justify-between">
                <span>⚠️ {weatherError}</span>
                <button onClick={refreshWeather} className="underline text-lime-300 font-bold ml-2 cursor-pointer">Retry</button>
              </div>
            )}

            {/* Micro meteorological stats */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs py-2 border-t border-white/15">
              <div className="bg-emerald-950/60 border border-emerald-800/60 rounded-lg p-2 flex flex-col items-center justify-center">
                <span className="text-[10px] uppercase font-semibold text-emerald-200/90 block mb-0.5">Rain Prob</span>
                <span className={`text-sm font-extrabold ${weather.rainProbability >= 50 ? 'text-amber-300' : 'text-white'}`}>
                  {weather.rainProbability}%
                </span>
              </div>
              <div className="bg-emerald-950/60 border border-emerald-800/60 rounded-lg p-2 flex flex-col items-center justify-center">
                <span className="text-[10px] uppercase font-semibold text-emerald-200/90 block mb-0.5">Humidity</span>
                <span className="text-sm font-extrabold text-white">{weather.humidity}%</span>
              </div>
              <div className="bg-emerald-950/60 border border-emerald-800/60 rounded-lg p-2 flex flex-col items-center justify-center">
                <span className="text-[10px] uppercase font-semibold text-emerald-200/90 block mb-0.5">Wind Speed</span>
                <span className="text-sm font-extrabold text-white">{weather.windSpeedKmH} km/h</span>
              </div>
            </div>

            {/* Weather Simulator Quick Switcher - Separated and responsive */}
            <div className="pt-2 border-t border-white/15 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-lime-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Test Scenario:</span>
                </span>
                <span className="text-[10px] text-emerald-200/80 font-medium">Rule simulation</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5 w-full">
                {(['rainy', 'sunny', 'heatwave', 'windy'] as const).map((s) => (
                  <button
                    key={s}
                    id={`sim-btn-${s}`}
                    onClick={() => handleScenarioChange(s)}
                    className={`px-1.5 py-1.5 rounded-lg text-xs font-bold transition-all text-center truncate cursor-pointer ${
                      activeWeatherSim === s
                        ? 'bg-lime-400 text-emerald-950 shadow-xs ring-1 ring-lime-300'
                        : 'bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-700/50 text-emerald-100 hover:text-white'
                    }`}
                  >
                    {s === 'rainy' ? '🌧️ Rain' : s === 'sunny' ? '☀️ Sun' : s === 'heatwave' ? '🔥 40°C' : '💨 Wind'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Ribbon (PRD Section 14) */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {/* Metric 1: Active Farms */}
        <div 
          onClick={() => setActiveTab('farms')}
          className="bg-white p-3.5 sm:p-4 rounded-xl border border-lime-200 hover:border-lime-400 shadow-xs transition cursor-pointer group flex flex-col justify-between h-full"
        >
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold text-emerald-900/80">Active Plots</span>
            <MapPin className="w-4 h-4 text-emerald-700 group-hover:scale-110 transition shrink-0" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold text-emerald-950 tracking-tight">{farms.length}</span>
            <span className="text-xs font-medium text-stone-500">Parcels</span>
          </div>
          <span className="text-[11px] font-medium text-stone-500 mt-2 block truncate">
            {farms[0]?.soilType} & {farms[1]?.soilType || 'Mixed'} soils
          </span>
        </div>

        {/* Metric 2: Total Land Area */}
        <div 
          onClick={() => setActiveTab('farms')}
          className="bg-white p-3.5 sm:p-4 rounded-xl border border-lime-200 hover:border-lime-400 shadow-xs transition cursor-pointer group flex flex-col justify-between h-full"
        >
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold text-emerald-900/80">Total Area</span>
            <Layers className="w-4 h-4 text-emerald-700 group-hover:scale-110 transition shrink-0" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold text-emerald-950 tracking-tight">{totalAcreage.toFixed(1)}</span>
            <span className="text-xs font-medium text-stone-500">Acres</span>
          </div>
          <span className="text-[11px] font-medium text-stone-500 mt-2 block truncate">
            {(totalAcreage * 0.4046).toFixed(1)} Hectares
          </span>
        </div>

        {/* Metric 3: Growing Crops */}
        <div 
          onClick={() => setActiveTab('crops')}
          className="bg-white p-3.5 sm:p-4 rounded-xl border border-lime-200 hover:border-lime-400 shadow-xs transition cursor-pointer group flex flex-col justify-between h-full"
        >
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold text-emerald-900/80">Growing Crops</span>
            <Wheat className="w-4 h-4 text-emerald-700 group-hover:scale-110 transition shrink-0" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold text-emerald-950 tracking-tight">{activeCrops.length}</span>
            <span className="text-xs font-semibold text-emerald-700 bg-lime-100 px-1.5 py-0.5 rounded">Active</span>
          </div>
          <span className="text-[11px] font-medium text-stone-500 mt-2 block truncate">
            {crops.filter(c => c.status === 'COMPLETED').length} harvested
          </span>
        </div>

        {/* Metric 4: Tasks Due Today */}
        <div 
          onClick={() => setActiveTab('activities')}
          className="bg-white p-3.5 sm:p-4 rounded-xl border border-lime-200 hover:border-lime-400 shadow-xs transition cursor-pointer group flex flex-col justify-between h-full"
        >
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold text-emerald-900/80">Pending Tasks</span>
            <CalendarCheck className="w-4 h-4 text-emerald-700 group-hover:scale-110 transition shrink-0" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold text-emerald-950 tracking-tight">
              {dueTodayTasks.length + overdueTasks.length}
            </span>
            {overdueTasks.length > 0 ? (
              <span className="text-xs font-bold text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded">
                {overdueTasks.length} Late Tasks
              </span>
            ) : (
              <span className="text-xs font-medium text-stone-500">Tasks</span>
            )}
          </div>
          <span className="text-[11px] font-medium text-stone-500 mt-2 block truncate">
            {dueTodayTasks.length} scheduled today
          </span>
        </div>

        {/* Metric 5: Active Rule Advisories */}
        <div 
          onClick={() => setActiveTab('reminders')}
          className="bg-white p-3.5 sm:p-4 rounded-xl border border-lime-200 hover:border-lime-400 shadow-xs transition cursor-pointer group col-span-2 lg:col-span-1 flex flex-col justify-between h-full"
        >
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold text-emerald-900/80">Active Alerts</span>
            <ShieldAlert className="w-4 h-4 text-amber-600 group-hover:scale-110 transition shrink-0" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold text-amber-700 tracking-tight">{reminders.length}</span>
            <span className="text-xs font-semibold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
              {unreadRemindersCount} Unread
            </span>
          </div>
          <span className="text-[11px] font-medium text-stone-500 mt-2 block truncate">
            Deterministic Engine
          </span>
        </div>
      </div>

      {user.role === 'DELIVERY_PARTNER' && (
        <div className="bg-linear-to-r from-emerald-900 to-green-950 border border-lime-400/40 text-white rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-lime-400 text-emerald-950 flex items-center justify-center font-bold shrink-0 shadow-sm">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">Delivery Partner Operations Desk</h3>
                  <span className="bg-lime-400 text-emerald-950 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Active Partner
                  </span>
                </div>
                <p className="text-xs text-emerald-200 mt-0.5">
                  Assigned pickups, Cold-Line intra-Jharkhand transits, and real-time customer GPS beacon sharing.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('orders')}
                className="px-4 py-2 bg-lime-400 hover:bg-lime-500 text-emerald-950 font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Truck className="w-4 h-4" />
                <span>View Assigned Deliveries</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Jharkhand Produce & Direct Orders Banner */}
      <div className="bg-linear-to-r from-emerald-950 via-emerald-900 to-green-950 text-white rounded-2xl p-4 sm:p-5 shadow-xs border border-lime-400/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-lime-400 text-emerald-950 flex items-center justify-center font-bold shrink-0">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-white font-serif">Direct Cultivator Produce Channel</span>
              <span className="bg-lime-400 text-emerald-950 text-[10px] font-extrabold px-2 py-0.2 rounded-full uppercase tracking-wider">
                Jharkhand Scope
              </span>
            </div>
            <p className="text-xs text-emerald-200 mt-0.5">
              {products.length} live harvest listings in 24 districts • {orders.length} direct orders undergoing transparent farm-to-doorstep tracking
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap w-full md:w-auto">
          <button
            onClick={() => setActiveTab('sell-produce')}
            className="flex-1 sm:flex-initial justify-center px-3.5 py-2 bg-lime-400 hover:bg-lime-300 text-emerald-950 font-bold text-xs rounded-xl transition shadow-xs cursor-pointer flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Post Harvest Listing</span>
          </button>
          <button
            onClick={() => setActiveTab('marketplace')}
            className="flex-1 sm:flex-initial justify-center px-3.5 py-2 bg-emerald-900 hover:bg-emerald-800 text-lime-200 border border-emerald-600 font-bold text-xs rounded-xl transition shadow-xs cursor-pointer flex items-center gap-1.5"
          >
            <span>Fresh Marketplace</span>
            <ArrowRight className="w-3.5 h-3.5 text-lime-400" />
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className="flex-1 sm:flex-initial justify-center px-3.5 py-2 bg-emerald-900 hover:bg-emerald-800 text-lime-200 border border-emerald-600 font-bold text-xs rounded-xl transition shadow-xs cursor-pointer flex items-center gap-1.5"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-lime-400" />
            <span>Orders ({orders.length})</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Priority Action Card + Live Alerts Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 7 Cols: Priority Action Tasks ("Due Today" & "Overdue" with 1-click checkmarks) */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="bg-white rounded-2xl border border-lime-200 shadow-xs p-5">
            <div className="flex items-center justify-between border-b border-lime-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-lime-100 text-emerald-800 flex items-center justify-center font-bold">
                  <CalendarCheck className="w-5 h-5 text-emerald-800" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-emerald-950">Priority Field Operations</h2>
                  <p className="text-xs text-stone-500">Tasks requiring farmer execution or verification</p>
                </div>
              </div>
              <button
                id="dash-log-new-task-btn"
                onClick={() => setIsAddActivityModalOpen(true)}
                className="flex items-center gap-1 text-xs bg-lime-500 hover:bg-lime-600 text-emerald-950 font-bold px-3 py-1.5 rounded-lg transition shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 stroke-3" />
                <span>Log Task</span>
              </button>
            </div>

            {/* Overdue Section if any */}
            {overdueTasks.length > 0 && (
              <div className="mb-4 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-rose-700">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>OVERDUE FIELD TASKS ({overdueTasks.length})</span>
                </div>

                <div className="space-y-2">
                  {overdueTasks.map((task) => {
                    const linkedCrop = crops.find(c => c.id === task.cropId);
                    const linkedFarm = farms.find(f => f.id === task.farmId);
                    return (
                      <div
                        key={task.id}
                        className="bg-rose-50/70 border border-rose-200 rounded-xl p-3.5 flex items-start justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-rose-200 text-rose-900 px-2 py-0.5 rounded">
                              {task.activityType}
                            </span>
                            <span className="text-xs font-semibold text-rose-900">
                              Due on {task.scheduledDate}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-emerald-950">{task.title}</h4>
                          <p className="text-xs text-stone-600">
                            Plot: <strong className="text-emerald-900">{linkedFarm?.farmName}</strong> • Crop: <strong className="text-emerald-900">{linkedCrop?.cropName}</strong>
                          </p>
                          {task.dosageOrVolume && (
                            <p className="text-xs text-stone-500 italic">Rate: {task.dosageOrVolume}</p>
                          )}
                        </div>

                        <button
                          id={`complete-task-${task.id}`}
                          onClick={() => updateActivityStatus(task.id, 'COMPLETED')}
                          className="shrink-0 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1.5 shadow-xs transition active:scale-95 cursor-pointer"
                          title="Mark as Completed"
                        >
                          <Check className="w-4 h-4 stroke-3" />
                          <span className="hidden sm:inline">Complete</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Today's Tasks */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-950">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-emerald-700" />
                  DUE TODAY ({dueTodayTasks.length})
                </span>
                <span className="text-stone-500 font-normal">{todayStr}</span>
              </div>

              {dueTodayTasks.length === 0 ? (
                <div className="text-center py-6 bg-lime-50/50 rounded-xl border border-dashed border-lime-200">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-1" />
                  <p className="text-xs font-bold text-emerald-950">All caught up for today!</p>
                  <p className="text-[11px] text-stone-500">No pending operations scheduled for today's date.</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {dueTodayTasks.map((task) => {
                    const linkedCrop = crops.find(c => c.id === task.cropId);
                    const linkedFarm = farms.find(f => f.id === task.farmId);
                    return (
                      <div
                        key={task.id}
                        className="bg-lime-50/50 hover:bg-lime-50 border border-lime-200 rounded-xl p-3.5 flex items-start justify-between gap-3 transition"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded border border-emerald-200">
                              {task.activityType}
                            </span>
                            <span className="text-xs font-medium text-emerald-800">
                              {linkedFarm?.farmName}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-emerald-950">{task.title}</h4>
                          <p className="text-xs text-stone-600">
                            Target Crop: <strong className="text-emerald-900">{linkedCrop?.cropName}</strong>
                          </p>
                          {task.dosageOrVolume && (
                            <p className="text-xs text-stone-500 italic">Rate: {task.dosageOrVolume}</p>
                          )}
                        </div>

                        <button
                          id={`complete-task-${task.id}`}
                          onClick={() => updateActivityStatus(task.id, 'COMPLETED')}
                          className="shrink-0 bg-lime-500 hover:bg-lime-600 text-emerald-950 text-xs font-extrabold px-3.5 py-2 rounded-lg flex items-center gap-1.5 shadow-xs transition active:scale-95 cursor-pointer"
                          title="Mark Done"
                        >
                          <Check className="w-4 h-4 stroke-3" />
                          <span>Done</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Upcoming Next 4 Tasks teaser */}
            {upcomingTasks.length > 0 && (
              <div className="mt-5 pt-4 border-t border-lime-100">
                <div className="flex items-center justify-between text-xs font-semibold text-stone-600 mb-2">
                  <span>Upcoming This Week</span>
                  <button
                    onClick={() => setActiveTab('activities')}
                    className="text-emerald-700 hover:text-emerald-900 text-xs font-bold flex items-center gap-1"
                  >
                    <span>Full Schedule</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {upcomingTasks.map((task) => (
                    <div key={task.id} className="bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-xs">
                      <div className="flex items-center justify-between text-[11px] text-stone-500 mb-0.5">
                        <span className="font-semibold text-emerald-800">{task.activityType}</span>
                        <span>{task.scheduledDate}</span>
                      </div>
                      <p className="font-bold text-stone-800 truncate">{task.title}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Active Crops Growth Stage Cards */}
          <div className="bg-white rounded-2xl border border-lime-200 shadow-xs p-5">
            <div className="flex items-center justify-between border-b border-lime-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <Wheat className="w-5 h-5 text-emerald-800" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-emerald-950">Active Crop Cycles</h2>
                  <p className="text-xs text-stone-500">Growth milestones calculated automatically</p>
                </div>
              </div>
              <button
                id="dash-add-crop-btn"
                onClick={() => setIsAddCropModalOpen(true)}
                className="flex items-center gap-1 text-xs text-emerald-800 hover:text-emerald-950 font-bold bg-lime-100 hover:bg-lime-200 px-3 py-1.5 rounded-lg border border-lime-300 transition"
              >
                <Plus className="w-3.5 h-3.5 stroke-3" />
                <span>Add Crop</span>
              </button>
            </div>

            <div className="space-y-4">
              {activeCrops.map((crop) => {
                const linkedFarm = farms.find(f => f.id === crop.farmId);
                const { daysElapsed, totalDays, daysRemaining, progressPercent } = calculateCropProgress(
                  crop.plantingDate,
                  crop.expectedHarvestDate
                );

                return (
                  <div key={crop.id} className="border border-lime-200 bg-lime-50/20 hover:bg-lime-50/40 transition rounded-xl p-3.5 space-y-2.5">
                    <div className="flex items-center gap-3">
                      {/* Real-time Crop Doodle */}
                      <div className="shrink-0">
                        <CropDoodle cropName={crop.cropName} stage={crop.stage} size="sm" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center justify-between gap-1">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-emerald-950 truncate">{crop.cropName}</h4>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-800 text-white">
                              {crop.stage}
                            </span>
                          </div>

                          <div className="text-right">
                            <span className="text-xs font-mono font-bold text-emerald-900">
                              {daysRemaining} Days left
                            </span>
                          </div>
                        </div>

                        <p className="text-xs text-stone-500 mt-0.5">
                          Plot: <strong className="text-emerald-900">{linkedFarm?.farmName || 'General'}</strong> • Sown: {crop.plantingDate}
                        </p>
                      </div>
                    </div>

                    {/* Progress Bar with Consistent Padding and Alignment */}
                    <div className="bg-lime-50/50 p-3 rounded-xl border border-lime-200/70 space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-medium text-stone-600">
                        <span className="font-semibold text-emerald-950">Milestone Progress</span>
                        <span className="text-emerald-800 font-mono font-bold text-xs">
                          {progressPercent}% ({daysElapsed}/{totalDays}d)
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-stone-200/80 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-linear-to-r from-lime-500 to-emerald-600 rounded-full transition-all duration-500"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right 5 Cols: Deterministic Rule Alerts Feed + Quick Actions */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Active Rule Alerts Inbox Card */}
          <div className="bg-white rounded-2xl border border-lime-200 shadow-xs p-5">
            <div className="flex items-center justify-between border-b border-lime-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <ShieldAlert className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-emerald-950">Deterministic Advisories</h2>
                  <p className="text-xs text-stone-500">Weather & schedule cross-evaluations</p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                {reminders.length} Active
              </span>
            </div>

            <div className="space-y-3">
              {displayAlerts.length === 0 ? (
                <div className="text-center py-6 text-xs text-stone-500">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
                  No warnings active. All farming conditions nominal.
                </div>
              ) : (
                displayAlerts.map((alert) => {
                  const isCritical = alert.priority === 'CRITICAL';
                  const isHigh = alert.priority === 'HIGH';
                  return (
                    <div
                      key={alert.id}
                      className={`p-3.5 rounded-xl border text-xs transition ${
                        isCritical
                          ? 'bg-rose-50 border-rose-200'
                          : isHigh
                          ? 'bg-amber-50 border-amber-200'
                          : 'bg-lime-50/70 border-lime-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span
                          className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded font-mono ${
                            isCritical
                              ? 'bg-rose-600 text-white'
                              : isHigh
                              ? 'bg-amber-600 text-white'
                              : 'bg-emerald-700 text-white'
                          }`}
                        >
                          {alert.priority} PRIORITY
                        </span>
                        <button
                          onClick={() => markReminderAsRead(alert.id)}
                          className="text-[10px] text-stone-500 hover:text-stone-800 underline cursor-pointer"
                        >
                          {alert.isRead ? 'Read' : 'Mark Read'}
                        </button>
                      </div>
                      <h4 className="font-bold text-xs text-emerald-950 mb-1">{alert.title}</h4>
                      <p className="text-stone-700 leading-relaxed">{alert.message}</p>
                    </div>
                  );
                })
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-lime-100 flex items-center justify-between">
              <span className="text-[11px] text-stone-500">Rules re-evaluated on schedule update</span>
              <button
                onClick={() => setActiveTab('reminders')}
                className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
              >
                <span>View All In Inbox</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick Action Matrix Card */}
          <div className="bg-linear-to-br from-lime-50 to-emerald-50 rounded-2xl border border-lime-300/80 p-5 space-y-3">
            <h3 className="text-sm font-bold text-emerald-950 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              <span>Quick Field Management Actions</span>
            </h3>

            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <button
                id="dash-quick-add-farm"
                onClick={() => setIsAddFarmModalOpen(true)}
                className="p-3 bg-white hover:bg-lime-100/60 rounded-xl border border-lime-200 text-left transition font-semibold text-emerald-950 flex flex-col justify-between shadow-2xs cursor-pointer"
              >
                <MapPin className="w-4 h-4 text-emerald-700 mb-2" />
                <span>+ Register Plot</span>
                <span className="text-[10px] text-stone-500 font-normal">Define soil & area</span>
              </button>

              <button
                id="dash-quick-add-crop"
                onClick={() => setIsAddCropModalOpen(true)}
                className="p-3 bg-white hover:bg-lime-100/60 rounded-xl border border-lime-200 text-left transition font-semibold text-emerald-950 flex flex-col justify-between shadow-2xs cursor-pointer"
              >
                <Wheat className="w-4 h-4 text-lime-700 mb-2" />
                <span>+ Plant New Crop</span>
                <span className="text-[10px] text-stone-500 font-normal">Auto-calc harvest date</span>
              </button>

              <button
                id="dash-quick-schedule-task"
                onClick={() => setIsAddActivityModalOpen(true)}
                className="p-3 bg-white hover:bg-lime-100/60 rounded-xl border border-lime-200 text-left transition font-semibold text-emerald-950 flex flex-col justify-between shadow-2xs cursor-pointer"
              >
                <CalendarCheck className="w-4 h-4 text-emerald-700 mb-2" />
                <span>+ Schedule Task</span>
                <span className="text-[10px] text-stone-500 font-normal">Irrigation / Spray</span>
              </button>

              <button
                id="dash-quick-export"
                onClick={() => setIsExportModalOpen(true)}
                className="p-3 bg-white hover:bg-lime-100/60 rounded-xl border border-lime-200 text-left transition font-semibold text-emerald-950 flex flex-col justify-between shadow-2xs cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-700 mb-2" />
                <span>Export Report</span>
                <span className="text-[10px] text-stone-500 font-normal">PDF / CSV summary</span>
              </button>
            </div>
          </div>

          {/* 5-Day Weather Summary Forecast Teaser */}
          <div className="bg-white rounded-2xl border border-lime-200 shadow-xs p-5">
            <div className="flex items-center justify-between border-b border-lime-100 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <CloudSun className="w-5 h-5 text-emerald-700" />
                <h3 className="text-sm font-bold text-emerald-950">5-Day Meteorological Trend</h3>
              </div>
              <button
                onClick={() => setActiveTab('weather')}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-900"
              >
                Full Feed →
              </button>
            </div>

            <div className="space-y-2">
              {weather.forecast.slice(0, 4).map((day) => (
                <div key={day.date} className="flex items-center justify-between text-xs py-1.5 border-b border-stone-100 last:border-none">
                  <span className="font-semibold text-emerald-950 w-16">{day.dayName}</span>
                  <span className="text-stone-500 flex-1 truncate">{day.condition}</span>
                  <div className="flex items-center gap-3 font-mono text-right">
                    <span className={`text-[11px] font-bold ${day.rainProbability >= 50 ? 'text-amber-700' : 'text-stone-500'}`}>
                      💧 {day.rainProbability}%
                    </span>
                    <span className="font-bold text-emerald-950 w-12">
                      {day.tempMax}° / {day.tempMin}°
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
