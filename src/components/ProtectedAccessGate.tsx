import React from 'react';
import { useFarm } from '../context/FarmContext';
import { 
  Sprout, 
  LogIn, 
  UserPlus, 
  ShieldCheck, 
  Lock, 
  Sparkles, 
  ArrowRight, 
  Wheat, 
  CalendarCheck, 
  DollarSign, 
  MapPin, 
  CloudSun,
  BookOpen,
  CheckCircle2
} from 'lucide-react';

interface ProtectedAccessGateProps {
  viewName: string;
  description?: string;
}

export const ProtectedAccessGate: React.FC<ProtectedAccessGateProps> = ({ 
  viewName, 
  description = "Sign in to your farmer account to access, manage, and synchronize your agricultural records." 
}) => {
  const { openAuthModal, loginAsDemoUser, registeredAccounts, setActiveTab } = useFarm();

  const unlockedFeatures = [
    {
      icon: MapPin,
      title: "Multi-Plot & Landholding Vault",
      desc: "Manage farm acreage, soil classifications, water sources and geographical zones."
    },
    {
      icon: Wheat,
      title: "Real-Time Crop Phenology Engine",
      desc: "Track GDD milestones, maturity percentages, and active growth stages."
    },
    {
      icon: CalendarCheck,
      title: "Weather-Conflict Activity Planner",
      desc: "Prevent spray washouts and fertilizer leaching with zero-sensor meteorological rules."
    },
    {
      icon: DollarSign,
      title: "Agricultural Cost & Ledger Analysis",
      desc: "Log input costs, machinery rentals, and labor expenses with exportable summaries."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      <div className="bg-white rounded-3xl border border-lime-200 shadow-xl overflow-hidden">
        
        {/* Header Hero */}
        <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-green-950 text-white p-8 sm:p-10 relative overflow-hidden text-center">
          {/* Subtle decorative background circles */}
          <div className="absolute -right-10 -bottom-10 w-60 h-60 rounded-full bg-lime-400/10 blur-2xl pointer-events-none" />
          <div className="absolute -left-10 -top-10 w-60 h-60 rounded-full bg-emerald-400/10 blur-2xl pointer-events-none" />
          
          <div className="relative z-10 max-w-xl mx-auto space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-lime-400/20 text-lime-300 border border-lime-400/30 shadow-inner">
              <Lock className="w-8 h-8 text-lime-400" />
            </div>

            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-lime-300 bg-lime-950/60 px-3 py-1 rounded-full border border-lime-400/30">
                Authentication Required
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-serif mt-3">
                Sign In to Access {viewName}
              </h2>
              <p className="text-xs sm:text-sm text-emerald-200/90 mt-2">
                {description}
              </p>
            </div>

            {/* Primary Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                id="gate-signin-btn"
                onClick={() => openAuthModal('LOGIN')}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-lime-400 hover:bg-lime-500 text-emerald-950 font-extrabold px-6 py-3 rounded-xl shadow-md transition active:scale-95 text-sm cursor-pointer"
              >
                <LogIn className="w-4 h-4 text-emerald-900" />
                <span>Sign In to Your Account</span>
              </button>

              <button
                id="gate-signup-btn"
                onClick={() => openAuthModal('SIGNUP')}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-800/80 hover:bg-emerald-800 text-white font-bold px-6 py-3 rounded-xl border border-emerald-600/60 shadow-xs transition active:scale-95 text-sm cursor-pointer"
              >
                <UserPlus className="w-4 h-4 text-lime-300" />
                <span>Register New Farm Profile</span>
              </button>
            </div>
          </div>
        </div>

        {/* 1-Click Fast Demo Login Profiles */}
        <div className="p-6 sm:p-8 bg-stone-50/80 border-b border-lime-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-emerald-950 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Fast 1-Click Access (Instant Demo Login)</span>
              </h3>
              <p className="text-xs text-stone-500">
                Select any registered field persona below to immediately unlock full access
              </p>
            </div>
            <span className="text-[11px] font-semibold text-emerald-800 bg-lime-100 px-2.5 py-1 rounded-lg border border-lime-200 hidden sm:inline">
              Instant Authorization
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {registeredAccounts.slice(0, 3).map((acc) => (
              <button
                key={acc.id}
                type="button"
                onClick={() => loginAsDemoUser(acc.id)}
                className="p-3.5 rounded-2xl bg-white hover:bg-lime-50/80 border border-stone-200 hover:border-lime-400 text-left transition shadow-xs group cursor-pointer flex flex-col justify-between"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-9 h-9 rounded-xl ${acc.avatarBg || 'bg-emerald-700'} text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs`}>
                    {acc.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-xs text-emerald-950 truncate group-hover:text-emerald-800">
                      {acc.name}
                    </div>
                    <div className="text-[10px] text-stone-500 truncate">
                      {acc.roleTitle || acc.region}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] font-bold text-emerald-700 pt-2 border-t border-stone-100">
                  <span>Sign In as {acc.role === 'FARM_OWNER' ? 'Farm Owner' : acc.roleTitle || 'User'}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Feature Overview Grid */}
        <div className="p-6 sm:p-8 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 font-mono">
            Included in Your Farm Management Suite:
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {unlockedFeatures.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div key={idx} className="p-4 rounded-2xl bg-lime-50/40 border border-lime-200/80 flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-emerald-800 text-lime-300 shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-emerald-950">{feat.title}</h5>
                    <p className="text-[11px] text-stone-600 mt-0.5">{feat.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 flex items-center justify-between text-xs text-stone-500 border-t border-stone-100">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>Full Offline-Ready Persistence & Farm Security</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveTab('knowledge')}
                className="font-semibold text-emerald-800 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Explore Public Crop Guide</span>
              </button>
              <span>•</span>
              <button
                onClick={() => setActiveTab('weather')}
                className="font-semibold text-emerald-800 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <CloudSun className="w-3.5 h-3.5" />
                <span>View Live Weather</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
