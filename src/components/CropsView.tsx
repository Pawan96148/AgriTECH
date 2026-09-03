import React, { useState } from 'react';
import { useFarm } from '../context/FarmContext';
import { Crop, CropStage, SeedPacketData } from '../types';
import { calculateCropProgress } from '../utils/ruleEngine';
import { CropDoodle } from './CropDoodle';
import { CropQRScanner } from './CropQRScanner';
import { 
  Wheat, 
  Plus, 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  Activity, 
  Trash2, 
  Edit3, 
  Sparkles,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  Scissors,
  QrCode,
  ShoppingBag
} from 'lucide-react';

export const CropsView: React.FC = () => {
  const { 
    crops, 
    farms, 
    activities, 
    updateCrop, 
    deleteCrop, 
    setIsAddCropModalOpen, 
    setIsAddActivityModalOpen,
    setSelectedFarmId,
    setActiveTab,
    setPreselectedCropForModal,
    showToast
  } = useFarm();

  const [filterStage, setFilterStage] = useState<'ALL' | 'ACTIVE' | 'HARVESTED'>('ALL');
  const [filterFarmId, setFilterFarmId] = useState<string>('ALL');
  const [selectedCropDetail, setSelectedCropDetail] = useState<Crop | null>(null);
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);

  const filteredCrops = crops.filter(c => {
    if (filterStage === 'ACTIVE' && c.status !== 'ACTIVE') return false;
    if (filterStage === 'HARVESTED' && c.status !== 'COMPLETED') return false;
    if (filterFarmId !== 'ALL' && c.farmId !== filterFarmId) return false;
    return true;
  });

  const getStageBadgeColor = (stage: CropStage) => {
    switch (stage) {
      case 'Sowing': return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'Vegetative': return 'bg-lime-100 text-lime-900 border-lime-300';
      case 'Flowering': return 'bg-purple-100 text-purple-900 border-purple-300';
      case 'Maturity': return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'Harvested': return 'bg-stone-200 text-stone-800 border-stone-300';
      default: return 'bg-stone-100 text-stone-800 border-stone-200';
    }
  };

  const handleAdvanceStage = (crop: Crop) => {
    const stages: CropStage[] = ['Sowing', 'Vegetative', 'Flowering', 'Maturity', 'Harvested'];
    const currIdx = stages.indexOf(crop.stage);
    if (currIdx < stages.length - 1) {
      const nextStage = stages[currIdx + 1];
      const isNowHarvested = nextStage === 'Harvested';
      updateCrop(crop.id, {
        stage: nextStage,
        status: isNowHarvested ? 'COMPLETED' : 'ACTIVE',
        actualHarvestDate: isNowHarvested ? new Date().toISOString().split('T')[0] : crop.actualHarvestDate
      });
    }
  };

  const handleQuickSowFromQR = (seed: SeedPacketData) => {
    setPreselectedCropForModal(seed.cropName);
    setIsAddCropModalOpen(true);
    showToast(`Pre-populated ${seed.variety} into crop cycle form.`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-lime-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-lime-100 text-emerald-800 rounded-lg">
              <Wheat className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-extrabold text-emerald-950 font-serif">Crop Cycles & Life-Stages</h1>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Track vegetative milestones, days-to-harvest windows, certified seed tags, and equipment calibration.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <button
            id="open-qr-scanner-btn"
            onClick={() => setIsQRScannerOpen(true)}
            className="flex items-center justify-center gap-2 bg-lime-400 hover:bg-lime-300 text-emerald-950 font-extrabold px-3.5 py-2.5 rounded-xl border border-lime-500 shadow-xs transition active:scale-95 text-xs sm:text-sm cursor-pointer"
          >
            <QrCode className="w-4 h-4 text-emerald-950" />
            <span>Scan Seed / Machine QR</span>
          </button>

          <button
            id="open-crop-guide-btn"
            onClick={() => setActiveTab('knowledge')}
            className="flex items-center gap-1.5 bg-white hover:bg-lime-50 text-emerald-900 font-semibold px-3 py-2 rounded-xl border border-lime-300 shadow-xs transition text-xs cursor-pointer"
          >
            <span>Crop Encyclopedia</span>
          </button>

          <button
            id="sell-harvest-btn"
            onClick={() => setActiveTab('sell-produce')}
            className="flex items-center gap-1.5 bg-lime-100 hover:bg-lime-200 text-emerald-950 font-bold px-3 py-2 rounded-xl border border-lime-300 shadow-xs transition text-xs cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-800" />
            <span>Sell Produce</span>
          </button>
          
          <button
            id="add-new-crop-btn"
            onClick={() => setIsAddCropModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-4 py-2.5 rounded-xl shadow-xs transition active:scale-95 text-xs sm:text-sm cursor-pointer"
          >
            <Plus className="w-4 h-4 text-lime-400 stroke-[3]" />
            <span>Plant New Crop</span>
          </button>
        </div>
      </div>

      {/* Smart QR Scanner Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-900 text-white rounded-2xl p-4 sm:p-5 shadow-xs border border-emerald-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-lime-400 text-emerald-950 flex items-center justify-center font-bold shrink-0 shadow-md">
            <QrCode className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-bold text-white font-serif">
                Smart Seed Packet & Equipment QR Scanner
              </h3>
              <span className="bg-lime-400 text-emerald-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Instant Lifecycle Decoder
              </span>
            </div>
            <p className="text-xs text-emerald-100/90 mt-1 max-w-2xl leading-relaxed">
              Scan certified seed packets (Wheat HD-2967, Basmati Rice, Tomato F1, Bt Cotton) to auto-extract germination rates, seed dressing formulas, and day-by-day stage schedules, or scan farm tractors & sprayers for instant service history.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsQRScannerOpen(true)}
          className="bg-white hover:bg-lime-50 text-emerald-950 font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-sm transition flex items-center gap-1.5 shrink-0 self-stretch sm:self-auto justify-center cursor-pointer"
        >
          <QrCode className="w-4 h-4 text-emerald-800" />
          <span>Launch Scanner</span>
        </button>
      </div>

      {/* Filter Tabs & Farm Select */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-lime-200 shadow-2xs">
        <div className="flex items-center space-x-1 overflow-x-auto">
          {(['ALL', 'ACTIVE', 'HARVESTED'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterStage(tab)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition capitalize ${
                filterStage === tab
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-stone-600 hover:text-emerald-950 hover:bg-lime-50'
              }`}
            >
              {tab === 'ALL' ? 'All Crop Cycles' : tab.toLowerCase()}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="text-stone-500 font-semibold">Filter Plot:</span>
          <select
            value={filterFarmId}
            onChange={(e) => setFilterFarmId(e.target.value)}
            className="bg-stone-50 border border-stone-300 rounded-lg px-2.5 py-1.5 text-xs font-medium text-emerald-950 focus:outline-none focus:ring-1 focus:ring-emerald-700"
          >
            <option value="ALL">All Farm Plots ({farms.length})</option>
            {farms.map(f => (
              <option key={f.id} value={f.id}>{f.farmName}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Crop Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCrops.map((crop) => {
          const linkedFarm = farms.find(f => f.id === crop.farmId);
          const cropActivities = activities.filter(a => a.cropId === crop.id);
          const pendingCount = cropActivities.filter(a => a.status === 'PENDING').length;
          
          const { daysElapsed, totalDays, daysRemaining, progressPercent } = calculateCropProgress(
            crop.plantingDate,
            crop.expectedHarvestDate
          );

          return (
            <div
              key={crop.id}
              className="bg-white rounded-2xl border border-lime-200/90 shadow-xs hover:shadow-md transition flex flex-col justify-between overflow-hidden group"
            >
              <div className="p-5 space-y-3.5">
                {/* Header with Crop Doodle */}
                <div className="flex items-start gap-3">
                  <CropDoodle cropName={crop.cropName} stage={crop.stage} size="md" />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h3 className="text-base font-bold text-emerald-950 group-hover:text-emerald-700 transition truncate">
                        {crop.cropName}
                      </h3>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${getStageBadgeColor(crop.stage)}`}>
                        {crop.stage}
                      </span>
                    </div>

                    <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">{linkedFarm?.farmName || 'Assigned Plot'}</span>
                    </p>
                    <span className="text-[11px] text-stone-400 font-medium">
                      Variety: {crop.variety || 'Hybrid Strain'}
                    </span>
                  </div>
                </div>

                {/* Growth Progress Bar */}
                <div className="space-y-1 bg-lime-50/40 p-3 rounded-xl border border-lime-100">
                  <div className="flex justify-between text-xs font-semibold text-emerald-950">
                    <span>Days Elapsed</span>
                    <span className="font-mono text-emerald-800 font-bold">
                      {daysElapsed} of {totalDays} Days ({progressPercent}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-stone-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-lime-500 to-emerald-600 rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-stone-500 pt-0.5">
                    <span>Sown: {crop.plantingDate}</span>
                    <span className="font-semibold text-emerald-900">
                      {crop.status === 'COMPLETED' ? 'Harvest Completed' : `Harvest: ${crop.expectedHarvestDate}`}
                    </span>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-200">
                    <span className="text-[10px] text-stone-500 block">Est. Yield</span>
                    <span className="font-bold text-stone-900">
                      {crop.estimatedYieldKg ? `${(crop.estimatedYieldKg / 1000).toFixed(1)} Tonnes` : 'N/A'}
                    </span>
                  </div>
                  <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-200">
                    <span className="text-[10px] text-stone-500 block">Health Index</span>
                    <span className="font-bold text-emerald-700">
                      {crop.healthScore ? `${crop.healthScore}% Optimal` : '92% Optimal'}
                    </span>
                  </div>
                </div>

                {/* Stage Advancement Quick Action */}
                {crop.status === 'ACTIVE' && (
                  <div className="flex items-center justify-between bg-emerald-50/70 p-2.5 rounded-lg border border-emerald-200/80 text-xs">
                    <span className="text-[11px] text-emerald-900 font-medium">Lifecycle Stage:</span>
                    <button
                      onClick={() => handleAdvanceStage(crop)}
                      className="text-xs font-bold text-emerald-800 hover:text-emerald-950 bg-white hover:bg-lime-100 px-2.5 py-1 rounded-md border border-emerald-300 transition shadow-2xs cursor-pointer flex items-center gap-1"
                      title="Advance to next vegetative milestone"
                    >
                      <span>Next Stage →</span>
                    </button>
                  </div>
                )}

                {crop.notes && (
                  <p className="text-xs text-stone-600 italic line-clamp-2">
                    "{crop.notes}"
                  </p>
                )}
              </div>

              {/* Card Footer */}
              <div className="p-4 bg-stone-50/80 border-t border-lime-100 flex items-center justify-between text-xs">
                <span className="text-stone-600 font-medium">
                  <strong>{pendingCount}</strong> operations pending
                </span>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setActiveTab('sell-produce')}
                    className="text-xs font-bold text-emerald-900 bg-lime-100 hover:bg-lime-200 px-2.5 py-1.5 rounded-lg border border-lime-300 transition cursor-pointer flex items-center gap-1"
                    title="Sell this crop produce in the Jharkhand Marketplace"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-emerald-800" />
                    <span>Sell Harvest</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedCropDetail(crop);
                    }}
                    className="text-stone-700 hover:text-emerald-950 font-semibold text-xs bg-stone-100 hover:bg-stone-200 px-2.5 py-1.5 rounded-lg border border-stone-200 transition cursor-pointer"
                  >
                    Details & Log
                  </button>

                  <button
                    onClick={() => deleteCrop(crop.id)}
                    className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                    title="Delete Crop Cycle"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Crop Detail Modal / Drawer */}
      {selectedCropDetail && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-lime-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-lime-100 pb-3">
              <div className="flex items-center gap-3">
                <CropDoodle cropName={selectedCropDetail.cropName} stage={selectedCropDetail.stage} size="md" />
                <div>
                  <span className="text-xs font-bold text-emerald-800 bg-lime-100 px-2 py-0.5 rounded uppercase">
                    {selectedCropDetail.stage} Stage
                  </span>
                  <h3 className="text-xl font-bold text-emerald-950 mt-1">{selectedCropDetail.cropName}</h3>
                  <p className="text-xs text-stone-500">Variety: {selectedCropDetail.variety || 'Standard Hybrid'}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCropDetail(null)}
                className="text-stone-400 hover:text-stone-700 text-lg font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Timeline Breakdown */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-emerald-950">Crop Life-Cycle Milestones</h4>
              <div className="grid grid-cols-2 gap-2 bg-stone-50 p-3 rounded-xl border border-stone-200">
                <div>
                  <span className="text-stone-500 block">Sowing Date:</span>
                  <span className="font-bold text-stone-900">{selectedCropDetail.plantingDate}</span>
                </div>
                <div>
                  <span className="text-stone-500 block">Expected Harvest:</span>
                  <span className="font-bold text-stone-900">{selectedCropDetail.expectedHarvestDate}</span>
                </div>
              </div>
            </div>

            {/* Linked Activities */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-emerald-950">Field Operations Log</h4>
                <button
                  onClick={() => {
                    setSelectedCropDetail(null);
                    setIsAddActivityModalOpen(true);
                  }}
                  className="text-emerald-700 font-bold hover:underline"
                >
                  + Add Operation
                </button>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto">
                {activities.filter(a => a.cropId === selectedCropDetail.id).map(act => (
                  <div key={act.id} className="p-2.5 bg-lime-50/40 rounded-lg border border-lime-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-emerald-900 bg-emerald-100 px-1.5 py-0.2 rounded">
                        {act.activityType}
                      </span>
                      <p className="font-semibold text-stone-900 text-xs mt-0.5">{act.title}</p>
                      <span className="text-[10px] text-stone-500">Scheduled: {act.scheduledDate}</span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      act.status === 'COMPLETED' ? 'bg-emerald-700 text-white' : 'bg-amber-100 text-amber-900'
                    }`}>
                      {act.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end pt-3 border-t border-stone-100 gap-2">
              <button
                onClick={() => {
                  setSelectedCropDetail(null);
                  setIsQRScannerOpen(true);
                }}
                className="px-3.5 py-2 bg-lime-100 text-emerald-900 hover:bg-lime-200 font-bold rounded-lg text-xs transition flex items-center gap-1 cursor-pointer"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>Scan Seed / Machine QR</span>
              </button>
              <button
                onClick={() => setSelectedCropDetail(null)}
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-lg text-xs transition cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Embedded QR Code Scanner Modal */}
      <CropQRScanner
        isOpen={isQRScannerOpen}
        onClose={() => setIsQRScannerOpen(false)}
        onQuickSowCrop={handleQuickSowFromQR}
      />
    </div>
  );
};
