import React from 'react';
import { FarmProvider, useFarm } from './context/FarmContext';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { DashboardView } from './components/DashboardView';
import { FarmsView } from './components/FarmsView';
import { CropsView } from './components/CropsView';
import { ActivitiesView } from './components/ActivitiesView';
import { WeatherView } from './components/WeatherView';
import { RemindersView } from './components/RemindersView';
import { KnowledgeBaseView } from './components/KnowledgeBaseView';
import { ExpensesView } from './components/ExpensesView';
import { ProfileView } from './components/ProfileView';
import { ProtectedAccessGate } from './components/ProtectedAccessGate';
import { Modals } from './components/Modals';
import { AuthModal } from './components/AuthModal';
import { MarketplaceView } from './components/MarketplaceView';
import { SellProduceView } from './components/SellProduceView';
import { OrdersView } from './components/OrdersView';
import { CheckoutModal } from './components/CheckoutModal';
import { DeliveryTrackingModal } from './components/DeliveryTrackingModal';
import { FeedbackModal } from './components/FeedbackModal';
import { Sprout, CheckCircle2, Heart } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeTab, setActiveTab, toastMessage, isAuthenticated } = useFarm();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'landing':
        return <LandingPage />;
      case 'knowledge':
        return <KnowledgeBaseView />;
      case 'weather':
        return <WeatherView />;
      case 'dashboard':
        return isAuthenticated ? (
          <DashboardView />
        ) : (
          <ProtectedAccessGate
            viewName="Farmer Dashboard & Field Operations"
            description="Sign in to your cultivator account to access your live plots, crop growth phenology, weather-conflict advisories, and operational tasks."
          />
        );
      case 'farms':
        return isAuthenticated ? (
          <FarmsView />
        ) : (
          <ProtectedAccessGate
            viewName="My Farms & Plot Manager"
            description="Sign in to view and manage registered farm plots, soil classifications, acreage, and irrigation sources."
          />
        );
      case 'crops':
        return isAuthenticated ? (
          <CropsView />
        ) : (
          <ProtectedAccessGate
            viewName="Crop Lifecycle & Growth Tracker"
            description="Sign in to monitor active crop cycles, growing degree days (GDD), and harvest schedules."
          />
        );
      case 'activities':
        return isAuthenticated ? (
          <ActivitiesView />
        ) : (
          <ProtectedAccessGate
            viewName="Activity Planner & Spray Schedule"
            description="Sign in to schedule agricultural operations with automated meteorological conflict checking."
          />
        );
      case 'reminders':
        return isAuthenticated ? (
          <RemindersView />
        ) : (
          <ProtectedAccessGate
            viewName="Alerts & Notification Inbox"
            description="Sign in to view custom farm reminders, crop phenology alerts, and urgent weather conflict advisories."
          />
        );
      case 'expenses':
        return isAuthenticated ? (
          <ExpensesView />
        ) : (
          <ProtectedAccessGate
            viewName="Farm Ledger & Cost Analytics"
            description="Sign in to analyze agricultural input costs, machinery rentals, and labor expenses."
          />
        );
      case 'profile':
        return isAuthenticated ? (
          <ProfileView />
        ) : (
          <ProtectedAccessGate
            viewName="Farmer Account & Multi-Profile Vault"
            description="Sign in to manage your cultivator credentials, security passwords, and registered device accounts."
          />
        );
      case 'marketplace':
        return <MarketplaceView />;
      case 'orders':
        return <OrdersView />;
      case 'sell-produce':
        return isAuthenticated ? (
          <SellProduceView />
        ) : (
          <ProtectedAccessGate
            viewName="Sell Produce & Harvest Listings"
            description="Sign in to your cultivator account to post crop harvests, set pricing, and manage incoming consumer orders."
          />
        );
      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAF7] text-[#212529] flex flex-col font-sans selection:bg-lime-200 selection:text-emerald-950">
      {/* Toast Notification Popup */}
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-5 right-4 left-4 sm:left-auto sm:right-5 z-50 animate-bounce duration-300 bg-emerald-950 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-2xl border border-lime-400/50 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-lime-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar />

      {/* Main Tab Screen */}
      <main className="flex-1 pb-16 md:pb-0">
        {renderActiveView()}
      </main>

      {/* Modals Provider */}
      <Modals />
      <AuthModal />
      <CheckoutModal />
      <DeliveryTrackingModal />
      <FeedbackModal />

      {/* Universal AgriTech Footer */}
      <footer className="bg-emerald-950 text-emerald-100 border-t border-emerald-900 mt-12 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-lime-400 text-emerald-950 flex items-center justify-center font-bold">
                  <Sprout className="w-5 h-5" />
                </div>
                <span className="font-extrabold text-xl tracking-tight text-white font-serif">AGRITECH</span>
              </div>
              <p className="text-xs text-emerald-300/80 leading-relaxed font-normal">
                Smart monitoring and intelligent farming platform. Sensor-free, deterministic rule evaluations for small-to-medium agricultural operations.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold text-lime-300 uppercase tracking-wider mb-3">Farm Management</h4>
              <ul className="space-y-1.5 text-xs text-emerald-200">
                <li><button onClick={() => setActiveTab('dashboard')} className="hover:text-white transition">Farmer Dashboard</button></li>
                <li><button onClick={() => setActiveTab('sell-produce')} className="hover:text-white transition">Sell Produce / Post Harvest</button></li>
                <li><button onClick={() => setActiveTab('orders')} className="hover:text-white transition">Direct Orders & Fulfillment</button></li>
                <li><button onClick={() => setActiveTab('farms')} className="hover:text-white transition">Registered Land Plots</button></li>
                <li><button onClick={() => setActiveTab('crops')} className="hover:text-white transition">Crop Life-Cycles</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-lime-300 uppercase tracking-wider mb-3">Market & Intelligence</h4>
              <ul className="space-y-1.5 text-xs text-emerald-200">
                <li><button onClick={() => setActiveTab('marketplace')} className="hover:text-white transition font-semibold text-lime-300">Jharkhand Fresh Marketplace</button></li>
                <li><button onClick={() => setActiveTab('weather')} className="hover:text-white transition">Localized 5-Day Weather</button></li>
                <li><button onClick={() => setActiveTab('reminders')} className="hover:text-white transition">Deterministic Rule Advisories</button></li>
                <li><button onClick={() => setActiveTab('knowledge')} className="hover:text-white transition">Predefined Crop Encyclopedia</button></li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-lime-300 uppercase tracking-wider mb-3">System Specifications</h4>
              <div className="bg-emerald-900/60 p-3 rounded-xl border border-emerald-800 text-[11px] text-emerald-200 space-y-1">
                <div>Architecture: <strong>SPA + Deterministic Logic</strong></div>
                <div>Palette: <strong>Light Green Lime / Forest Green</strong></div>
                <div>Status: <strong>P0 Core Features Ready</strong></div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-emerald-900/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-emerald-400">
            <p>© 2026 AGRITECH Systems • Smart Monitoring & Intelligent Farming.</p>
            <div className="flex items-center gap-1 text-emerald-300 text-[11px]">
              <span>Built with precision for sustainable agriculture</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <FarmProvider>
      <MainContent />
    </FarmProvider>
  );
}
