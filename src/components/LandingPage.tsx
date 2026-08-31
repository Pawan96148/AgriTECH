import React, { useState } from 'react';
import { useFarm } from '../context/FarmContext';
import { CROP_KNOWLEDGE_BASE } from '../data/cropKnowledgeBase';
import {
  Sprout,
  Calendar,
  CloudRain,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  MapPin,
  Wheat,
  Layers,
  Clock,
  Droplets,
  DollarSign,
  AlertTriangle,
  Play,
  SunMedium,
  Check,
  ChevronRight,
  Database,
  Cpu,
  BarChart3,
  LayoutDashboard,
  BookOpen,
  LogIn,
  UserPlus,
  ShieldCheck,
  Users
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { 
    setActiveTab, 
    setIsAddFarmModalOpen, 
    setIsAddCropModalOpen, 
    setWeatherScenario, 
    weather,
    isAuthenticated,
    user,
    openAuthModal
  } = useFarm();

  // Interactive Live Rule Simulation slider on Landing Page
  const [simRainProb, setSimRainProb] = useState<number>(75);
  const [simTaskType, setSimTaskType] = useState<'PESTICIDE' | 'IRRIGATION' | 'WEEDING'>('PESTICIDE');
  const [simTemp, setSimTemp] = useState<number>(31);

  // Deterministic rule evaluation for simulator
  const getSimulatedRuleOutcome = () => {
    if (simTaskType === 'PESTICIDE' && simRainProb >= 50) {
      return {
        triggered: true,
        type: 'WARNING',
        badge: 'High Conflict Alert',
        badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
        title: 'Rule 3 Triggered: Postpone Chemical Spraying',
        desc: `Rain probability is ${simRainProb}% (threshold > 50%). Spraying now causes active pesticide wash-off, wasting chemical inputs and polluting run-off water.`
      };
    }
    if (simTaskType === 'IRRIGATION' && simRainProb >= 60) {
      return {
        triggered: true,
        type: 'ADVISORY',
        badge: 'Water Saving Trigger',
        badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
        title: 'Rule 4 Triggered: Skip Scheduled Irrigation',
        desc: `Forecast predicts significant precipitation (${simRainProb}% likelihood). Natural rainfall will meet root zone moisture requirements.`
      };
    }
    if (simTemp >= 38) {
      return {
        triggered: true,
        type: 'CAUTION',
        badge: 'Heat Stress Advisory',
        badgeColor: 'bg-orange-100 text-orange-800 border-orange-300',
        title: 'Rule 6 Triggered: High Midday Temperature Alert',
        desc: `Air temperature is ${simTemp}°C. Move foliar operations to early dawn (05:30 - 08:30) to avoid stomatal closure and chemical leaf scorch.`
      };
    }
    return {
      triggered: false,
      type: 'OPTIMAL',
      badge: 'Green Light Conditions',
      badgeColor: 'bg-lime-100 text-lime-800 border-lime-300',
      title: 'Optimal Field Condition: Proceed With Operation',
      desc: `Weather metrics are well within safe thresholds. No meteorological conflicts detected for ${simTaskType}.`
    };
  };

  const simResult = getSimulatedRuleOutcome();

  return (
    <div className="bg-[#F8FAF7] text-[#212529] min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-10 pb-16 md:pt-16 md:pb-24 border-b border-lime-200/70 bg-gradient-to-b from-lime-50/70 via-[#F8FAF7] to-white">
        {/* Subtle decorative agricultural grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#84cc1610_1px,transparent_1px),linear-gradient(to_bottom,#84cc1610_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-lime-100 border border-lime-300/80 text-emerald-900 text-xs font-semibold shadow-xs">
                <span className="w-2 h-2 rounded-full bg-lime-500 animate-ping"></span>
                <span>Rule-Based Decision Support for Modern Smallholders</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-emerald-950 font-serif leading-[1.1]">
                <span className="text-emerald-700 underline decoration-lime-400 decoration-4 underline-offset-4">AGRITECH</span>: Smart Monitoring & Intelligent Farming
              </h1>

              {/* Subtitle */}
              <p className="text-lg md:text-xl text-emerald-900/80 leading-relaxed max-w-2xl font-normal">
                AGRITECH unifies multi-plot land profiling, crop life-cycle milestone tracking, localized weather feeds, and automated agricultural reminders into a <strong>zero-sensor, deterministic dashboard</strong>.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  id="hero-launch-dashboard-btn"
                  onClick={() => setActiveTab('dashboard')}
                  className="flex items-center gap-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-6 py-3.5 rounded-xl shadow-md shadow-emerald-900/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-sm sm:text-base cursor-pointer"
                >
                  <LayoutDashboard className="w-5 h-5 text-lime-300" />
                  <span>Open Farmer Dashboard</span>
                  <ArrowRight className="w-4 h-4 text-lime-400 ml-1" />
                </button>

                {!isAuthenticated ? (
                  <button
                    id="hero-signin-btn"
                    onClick={() => openAuthModal('LOGIN')}
                    className="flex items-center gap-2 bg-lime-400 hover:bg-lime-500 text-emerald-950 font-bold px-5 py-3.5 rounded-xl shadow-sm transition text-sm sm:text-base cursor-pointer"
                  >
                    <LogIn className="w-5 h-5 text-emerald-900" />
                    <span>Farmer Sign In / Register</span>
                  </button>
                ) : (
                  <button
                    id="hero-explore-knowledge-btn"
                    onClick={() => setActiveTab('knowledge')}
                    className="flex items-center gap-2 bg-white hover:bg-lime-50 text-emerald-900 font-semibold px-5 py-3.5 rounded-xl border border-lime-300 shadow-xs transition text-sm sm:text-base cursor-pointer"
                  >
                    <BookOpen className="w-5 h-5 text-emerald-700" />
                    <span>Explore Crop Guide</span>
                  </button>
                )}
              </div>

              {/* Trust & Spec Markers */}
              <div className="pt-4 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-emerald-800/80 border-t border-lime-200/80">
                <span className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  Deterministic Rule Engine (No Black-box AI)
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  Multi-Plot & Multi-Crop Management
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  Zero-Hardware Sensor-Free Operation
                </span>
              </div>
            </div>

            {/* Right Interactive Hero Card (Live Rule Engine Showcase) */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl p-6 border-2 border-lime-300 shadow-xl shadow-lime-900/5 relative">
                {/* Header of Preview */}
                <div className="flex items-center justify-between border-b border-lime-100 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-lime-500/20 text-emerald-800 flex items-center justify-center font-bold">
                      <Sparkles className="w-4 h-4 text-emerald-700" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-emerald-950">Deterministic Rule Sandbox</h3>
                      <p className="text-[11px] text-emerald-700">Test how AGRITECH prevents farming mistakes</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-emerald-800 text-white font-mono px-2 py-0.5 rounded font-bold">
                    LIVE DEMO
                  </span>
                </div>

                {/* Interactive Controls */}
                <div className="space-y-4 text-xs">
                  {/* Task Selector */}
                  <div>
                    <label className="block font-semibold text-emerald-900 mb-1.5">Scheduled Field Operation:</label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {(['PESTICIDE', 'IRRIGATION', 'WEEDING'] as const).map((t) => (
                        <button
                          key={t}
                          onClick={() => setSimTaskType(t)}
                          className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition border ${
                            simTaskType === t
                              ? 'bg-emerald-800 text-white border-emerald-900'
                              : 'bg-lime-50/70 hover:bg-lime-100 text-emerald-900 border-lime-200'
                          }`}
                        >
                          {t === 'PESTICIDE' ? '🛡️ Spraying' : t === 'IRRIGATION' ? '💧 Irrigation' : '🌿 Weeding'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Rain Probability Slider */}
                  <div>
                    <div className="flex justify-between font-semibold text-emerald-900 mb-1">
                      <span>Forecasted Rain Probability:</span>
                      <span className={`font-mono font-bold ${simRainProb >= 50 ? 'text-amber-700' : 'text-emerald-700'}`}>
                        {simRainProb}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={simRainProb}
                      onChange={(e) => setSimRainProb(Number(e.target.value))}
                      className="w-full accent-emerald-700 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-stone-500 mt-0.5">
                      <span>0% (Dry Sun)</span>
                      <span className="font-bold text-amber-700">50% (Threshold)</span>
                      <span>100% (Downpour)</span>
                    </div>
                  </div>

                  {/* Temperature Slider */}
                  <div>
                    <div className="flex justify-between font-semibold text-emerald-900 mb-1">
                      <span>Ambient Temperature:</span>
                      <span className={`font-mono font-bold ${simTemp >= 38 ? 'text-rose-700' : 'text-emerald-700'}`}>
                        {simTemp}°C
                      </span>
                    </div>
                    <input
                      type="range"
                      min="18"
                      max="45"
                      step="1"
                      value={simTemp}
                      onChange={(e) => setSimTemp(Number(e.target.value))}
                      className="w-full accent-emerald-700 cursor-pointer"
                    />
                  </div>

                  {/* Generated Dynamic Result Output */}
                  <div className={`mt-4 p-4 rounded-xl border transition-all ${
                    simResult.type === 'WARNING' 
                      ? 'bg-rose-50/80 border-rose-200' 
                      : simResult.type === 'ADVISORY' 
                      ? 'bg-amber-50/80 border-amber-200' 
                      : simResult.type === 'CAUTION' 
                      ? 'bg-orange-50/80 border-orange-200' 
                      : 'bg-lime-50/80 border-lime-200'
                  }`}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border ${simResult.badgeColor}`}>
                        {simResult.badge}
                      </span>
                      <span className="text-[10px] text-stone-500 font-mono">Status: Evaluated</span>
                    </div>
                    <h4 className="font-bold text-sm text-emerald-950 mb-1">{simResult.title}</h4>
                    <p className="text-xs text-stone-700 leading-snug">{simResult.desc}</p>
                  </div>

                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className="w-full py-2.5 bg-lime-500 hover:bg-lime-600 text-emerald-950 font-bold rounded-lg transition text-xs flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <span>Try Real Plots on Dashboard</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6 Core Value Pillars (From PRD Features) */}
      <section className="py-16 md:py-20 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-emerald-700 font-bold text-xs uppercase tracking-wider bg-lime-100 px-3 py-1 rounded-full border border-lime-300">
            Engineered For Practicality
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-emerald-950 font-serif mt-3">
            Everything A Farm Manager Needs in One Portal
          </h2>
          <p className="text-base text-emerald-800/80 mt-2 font-normal">
            No convoluted IoT sensors, no expensive satellite contracts. Just reliable agricultural logic, synchronized field schedules, and localized weather checks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Multi-Plot Land Profiling */}
          <div 
            onClick={() => setActiveTab('farms')} 
            className="group bg-white p-6 rounded-2xl border border-lime-200 hover:border-lime-400 shadow-xs hover:shadow-md transition cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <MapPin className="w-6 h-6 text-emerald-700" />
            </div>
            <h3 className="text-lg font-bold text-emerald-950 group-hover:text-emerald-700 transition flex items-center justify-between">
              <span>Multi-Plot Land Profiling</span>
              <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition" />
            </h3>
            <p className="text-sm text-stone-600 mt-2 leading-relaxed">
              Register separated farm parcels with exact acreage, GPS coordinates, water sources, and soil classifications (Clay, Sandy, Loamy, Black Cotton, Red).
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-emerald-700">
              <span>Manage Land Parcels</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 2: Crop Lifecycle Tracking */}
          <div 
            onClick={() => setActiveTab('crops')} 
            className="group bg-white p-6 rounded-2xl border border-lime-200 hover:border-lime-400 shadow-xs hover:shadow-md transition cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl bg-lime-100 text-lime-800 flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <Wheat className="w-6 h-6 text-lime-700" />
            </div>
            <h3 className="text-lg font-bold text-emerald-950 group-hover:text-emerald-700 transition flex items-center justify-between">
              <span>Crop Lifecycle Tracking</span>
              <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition" />
            </h3>
            <p className="text-sm text-stone-600 mt-2 leading-relaxed">
              Map crops to specific plots. Visual progress bars track days elapsed versus harvest windows across Sowing, Vegetative, Flowering, and Maturity stages.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-emerald-700">
              <span>View Active Crop Cycles</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 3: Deterministic Rule Engine */}
          <div 
            onClick={() => setActiveTab('reminders')} 
            className="group bg-white p-6 rounded-2xl border border-lime-200 hover:border-lime-400 shadow-xs hover:shadow-md transition cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <ShieldAlert className="w-6 h-6 text-amber-700" />
            </div>
            <h3 className="text-lg font-bold text-emerald-950 group-hover:text-emerald-700 transition flex items-center justify-between">
              <span>Weather-Conflict Engine</span>
              <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition" />
            </h3>
            <p className="text-sm text-stone-600 mt-2 leading-relaxed">
              Cross-references daily activities with meteorological forecasts. Generates smart advisories (e.g. postponing pesticide sprays before heavy rains).
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-emerald-700">
              <span>Inspect Smart Alerts</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 4: Localized 5-Day Weather Feed */}
          <div 
            onClick={() => setActiveTab('weather')} 
            className="group bg-white p-6 rounded-2xl border border-lime-200 hover:border-lime-400 shadow-xs hover:shadow-md transition cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <CloudRain className="w-6 h-6 text-sky-700" />
            </div>
            <h3 className="text-lg font-bold text-emerald-950 group-hover:text-emerald-700 transition flex items-center justify-between">
              <span>Localized Weather Feeds</span>
              <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition" />
            </h3>
            <p className="text-sm text-stone-600 mt-2 leading-relaxed">
              Hourly and 5-day forecasts featuring temperature, humidity %, rain probability %, wind gusts, and agricultural spraying suitability windows.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-emerald-700">
              <span>Explore Forecast Cards</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 5: Predefined Crop Knowledge Base */}
          <div 
            onClick={() => setActiveTab('knowledge')} 
            className="group bg-white p-6 rounded-2xl border border-lime-200 hover:border-lime-400 shadow-xs hover:shadow-md transition cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <BookOpen className="w-6 h-6 text-emerald-700" />
            </div>
            <h3 className="text-lg font-bold text-emerald-950 group-hover:text-emerald-700 transition flex items-center justify-between">
              <span>Crop Agronomy Guide</span>
              <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition" />
            </h3>
            <p className="text-sm text-stone-600 mt-2 leading-relaxed">
              Built-in encyclopedia covering Wheat, Tomato, Rice, Maize, Cotton, Soybean with NPK fertilizer splits, pest protocols, and one-click cycle setup.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-emerald-700">
              <span>Browse Knowledge Presets</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 6: Expense & Yield Balance Sheet */}
          <div 
            onClick={() => setActiveTab('expenses')} 
            className="group bg-white p-6 rounded-2xl border border-lime-200 hover:border-lime-400 shadow-xs hover:shadow-md transition cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl bg-green-100 text-green-800 flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <DollarSign className="w-6 h-6 text-green-700" />
            </div>
            <h3 className="text-lg font-bold text-emerald-950 group-hover:text-emerald-700 transition flex items-center justify-between">
              <span>Input Costs & Margins</span>
              <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition" />
            </h3>
            <p className="text-sm text-stone-600 mt-2 leading-relaxed">
              Log seed, fertilizer, pesticide, machinery, and labor expenditures per crop cycle to calculate net margins and seasonal financial profitability.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-emerald-700">
              <span>Review Financial Ledger</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </section>

      {/* The 5 Deterministic Rules Showcase (PRD Section 9) */}
      <section className="py-14 bg-emerald-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mb-10">
            <span className="text-lime-300 font-bold text-xs uppercase tracking-wider">
              PRD Specification Section 9
            </span>
            <h2 className="text-3xl font-extrabold font-serif mt-2 text-white">
              The 5 Deterministic Decision Rules
            </h2>
            <p className="text-emerald-200 text-sm mt-2">
              How AgroPulse translates simple field calendar dates and meteorological data into actionable advice.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-emerald-950/80 border border-emerald-700/60 p-4 rounded-xl">
              <div className="flex items-center gap-2 text-lime-400 font-mono text-xs font-bold mb-1">
                <span>RULE 1</span>
                <span className="text-emerald-400/60">•</span>
                <span>Date == Today && Status == 'PENDING'</span>
              </div>
              <h4 className="font-bold text-sm text-white mb-1">Task Due Today Alert</h4>
              <p className="text-xs text-emerald-200/90 leading-relaxed">
                Highlights daily interventions on the dashboard with one-click "Mark Completed" checkmarks so field hands never miss a dose.
              </p>
            </div>

            <div className="bg-emerald-950/80 border border-emerald-700/60 p-4 rounded-xl">
              <div className="flex items-center gap-2 text-rose-400 font-mono text-xs font-bold mb-1">
                <span>RULE 2</span>
                <span className="text-emerald-400/60">•</span>
                <span>Date &lt; Today && Status == 'PENDING'</span>
              </div>
              <h4 className="font-bold text-sm text-white mb-1">Critical Overdue Task Flag</h4>
              <p className="text-xs text-emerald-200/90 leading-relaxed">
                Escalates forgotten weeding, irrigation, or top-dressing tasks with high-visibility warning badges and days-delayed counters.
              </p>
            </div>

            <div className="bg-emerald-950/80 border border-emerald-700/60 p-4 rounded-xl">
              <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold mb-1">
                <span>RULE 3</span>
                <span className="text-emerald-400/60">•</span>
                <span>Type == 'SPRAYING' && Rain &gt; 50%</span>
              </div>
              <h4 className="font-bold text-sm text-white mb-1">Spray Wash-Off Prevention</h4>
              <p className="text-xs text-emerald-200/90 leading-relaxed">
                Advises postponing pesticide applications when incoming rain will wash active ingredients into the soil before absorption.
              </p>
            </div>

            <div className="bg-emerald-950/80 border border-emerald-700/60 p-4 rounded-xl">
              <div className="flex items-center gap-2 text-sky-400 font-mono text-xs font-bold mb-1">
                <span>RULE 4</span>
                <span className="text-emerald-400/60">•</span>
                <span>Type == 'IRRIGATION' && Rain &gt; 10mm</span>
              </div>
              <h4 className="font-bold text-sm text-white mb-1">Water & Energy Conservation</h4>
              <p className="text-xs text-emerald-200/90 leading-relaxed">
                Advises skipping pump cycles when forecasted precipitation provides sufficient root moisture, saving electricity and diesel.
              </p>
            </div>

            <div className="bg-emerald-950/80 border border-emerald-700/60 p-4 rounded-xl">
              <div className="flex items-center gap-2 text-lime-400 font-mono text-xs font-bold mb-1">
                <span>RULE 5</span>
                <span className="text-emerald-400/60">•</span>
                <span>DaysElapsed &gt;= StandardHarvestDays</span>
              </div>
              <h4 className="font-bold text-sm text-white mb-1">Harvest Window Readiness</h4>
              <p className="text-xs text-emerald-200/90 leading-relaxed">
                Triggers visual readiness alerts to schedule combine thresher machinery, labor crews, and dry storage bags ahead of time.
              </p>
            </div>

            <div className="bg-emerald-950/80 border border-emerald-700/60 p-4 rounded-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-lime-300 font-mono text-xs font-bold mb-1">
                  <span>ARCHITECTURE</span>
                  <span className="text-emerald-400/60">•</span>
                  <span>Lightweight & Deterministic</span>
                </div>
                <h4 className="font-bold text-sm text-white mb-1">Zero Cloud ML Overhead</h4>
                <p className="text-xs text-emerald-200/90 leading-relaxed">
                  Fast sub-50ms execution on mobile browsers even in low-bandwidth rural cellular environments.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('dashboard')}
                className="mt-3 py-1.5 px-3 bg-lime-400 hover:bg-lime-500 text-emerald-950 font-bold rounded-lg text-xs transition"
              >
                Launch Dashboard Demo →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Crop Presets Teaser */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <span className="text-emerald-700 font-bold text-xs uppercase tracking-wider bg-lime-100 px-3 py-1 rounded-full border border-lime-300">
              Agronomic Knowledge
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-emerald-950 font-serif mt-2">
              Ready-to-Use Crop Lifecycle Presets
            </h2>
            <p className="text-stone-600 text-sm mt-1">
              Select any standard crop to instantly generate milestone intervals and scheduled interventions.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('knowledge')}
            className="mt-4 md:mt-0 flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 bg-lime-100 hover:bg-lime-200 px-4 py-2 rounded-lg border border-lime-300 transition"
          >
            <span>View All 8 Crop Profiles</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CROP_KNOWLEDGE_BASE.slice(0, 3).map((crop) => (
            <div key={crop.id} className="bg-white rounded-xl p-5 border border-lime-200/90 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    {crop.category}
                  </span>
                  <span className="text-xs font-mono font-semibold text-stone-500">
                    ⏱️ {crop.durationDays} Days
                  </span>
                </div>
                <h3 className="font-bold text-base text-emerald-950">{crop.name}</h3>
                <p className="text-xs italic text-stone-500 -mt-0.5 mb-2">{crop.scientificName}</p>
                <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed mb-3">
                  {crop.description}
                </p>

                <div className="space-y-1.5 text-xs bg-lime-50/50 p-2.5 rounded-lg border border-lime-100">
                  <div className="flex items-center justify-between">
                    <span className="text-stone-600 font-medium">Ideal Soil:</span>
                    <span className="font-semibold text-emerald-900">{crop.idealSoil.join(', ')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-600 font-medium">Water Demand:</span>
                    <span className="font-semibold text-emerald-900">{crop.waterDemand}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-600 font-medium">Average Yield:</span>
                    <span className="font-semibold text-emerald-900">{crop.averageYieldPerAcre}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                <button
                  onClick={() => setActiveTab('knowledge')}
                  className="text-xs text-emerald-700 hover:text-emerald-900 font-semibold flex items-center gap-1"
                >
                  <span>Detailed Stages</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    setActiveTab('crops');
                    setIsAddCropModalOpen(true);
                  }}
                  className="text-xs bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-3 py-1.5 rounded-lg transition shadow-xs"
                >
                  + Plant Crop
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="bg-gradient-to-r from-emerald-900 via-green-900 to-emerald-950 text-white py-14 border-t border-lime-500/30">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-lime-400/20 text-lime-300 mb-2 border border-lime-400/40">
            <Sprout className="w-8 h-8" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-serif">
            Take Control of Your Farm's Seasonal Operations
          </h2>
          <p className="text-emerald-100 text-base max-w-2xl mx-auto font-normal">
            Experience the interactive farmer dashboard with preloaded multi-plot plots, active crop cycles, dynamic weather feeds, and live deterministic notifications.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="bg-lime-400 hover:bg-lime-500 text-emerald-950 font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-lime-400/20 transition text-base flex items-center gap-2 cursor-pointer"
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>Launch Live Dashboard</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('farms');
                setIsAddFarmModalOpen(true);
              }}
              className="bg-emerald-800 hover:bg-emerald-700 text-white font-semibold px-6 py-3.5 rounded-xl border border-emerald-600 transition text-base flex items-center gap-2 cursor-pointer"
            >
              <MapPin className="w-5 h-5 text-lime-300" />
              <span>Register New Plot</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
