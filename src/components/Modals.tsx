import React, { useState, useEffect } from 'react';
import { useFarm } from '../context/FarmContext';
import { SoilType, CropStage, ActivityType, AlertPriority } from '../types';
import { CROP_KNOWLEDGE_BASE } from '../data/cropKnowledgeBase';
import { JHARKHAND_DISTRICTS } from '../data/mockData';
import {
  MapPin,
  Wheat,
  CalendarCheck,
  FileSpreadsheet,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  Printer,
  Download,
  Calendar
} from 'lucide-react';

export const Modals: React.FC = () => {
  const {
    isAddFarmModalOpen,
    setIsAddFarmModalOpen,
    addFarm,
    isAddCropModalOpen,
    setIsAddCropModalOpen,
    addCrop,
    isAddActivityModalOpen,
    setIsAddActivityModalOpen,
    addActivity,
    isExportModalOpen,
    setIsExportModalOpen,
    farms,
    crops,
    activities,
    expenses,
    weather,
    user,
    preselectedCropForModal,
    setPreselectedCropForModal
  } = useFarm();

  // -------------------------------------------------------------
  // Add Farm State
  // -------------------------------------------------------------
  const [farmName, setFarmName] = useState('');
  const [location, setLocation] = useState('Ranchi District, Jharkhand');
  const [area, setArea] = useState('5.0');
  const [soilType, setSoilType] = useState<SoilType>('Loamy');
  const [irrigationType, setIrrigationType] = useState<'Drip' | 'Sprinkler' | 'Canal / Flood' | 'Rainfed' | 'Borewell'>('Drip');
  const [latitude, setLatitude] = useState('23.3441');
  const [longitude, setLongitude] = useState('85.3096');
  const [farmNotes, setFarmNotes] = useState('');

  const handleAddFarmSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmName) return;
    addFarm({
      farmName,
      location,
      area: parseFloat(area) || 1,
      soilType,
      irrigationType,
      latitude: parseFloat(latitude) || 23.3441,
      longitude: parseFloat(longitude) || 85.3096,
      notes: farmNotes
    });
    setFarmName('');
    setFarmNotes('');
    setIsAddFarmModalOpen(false);
  };

  // -------------------------------------------------------------
  // Add Crop State
  // -------------------------------------------------------------
  const [selectedFarmIdForCrop, setSelectedFarmIdForCrop] = useState(farms[0]?.id || '');
  const [cropName, setCropName] = useState('Wheat (Winter / Rabi)');
  const [variety, setVariety] = useState('HD 2967 High Yield');
  const [plantingDate, setPlantingDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [expectedHarvestDate, setExpectedHarvestDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 120);
    return d.toISOString().split('T')[0];
  });
  const [cropStage, setCropStage] = useState<CropStage>('Sowing');
  const [estimatedYieldKg, setEstimatedYieldKg] = useState('12000');
  const [cropNotes, setCropNotes] = useState('');

  // Auto preset loader
  useEffect(() => {
    if (preselectedCropForModal) {
      const preset = CROP_KNOWLEDGE_BASE.find(p => p.name.toLowerCase().includes(preselectedCropForModal.toLowerCase()));
      if (preset) {
        setCropName(preset.name);
        const d = new Date(plantingDate);
        d.setDate(d.getDate() + preset.durationDays);
        setExpectedHarvestDate(d.toISOString().split('T')[0]);
      }
      setPreselectedCropForModal(undefined);
    }
  }, [preselectedCropForModal, plantingDate, setPreselectedCropForModal]);

  const handlePresetSelect = (presetName: string) => {
    const preset = CROP_KNOWLEDGE_BASE.find(p => p.name === presetName);
    if (preset) {
      setCropName(preset.name);
      const d = new Date(plantingDate);
      d.setDate(d.getDate() + preset.durationDays);
      setExpectedHarvestDate(d.toISOString().split('T')[0]);
    }
  };

  const calculateDurationDays = () => {
    const p = new Date(plantingDate);
    const h = new Date(expectedHarvestDate);
    const diff = Math.round((h.getTime() - p.getTime()) / (1000 * 60 * 60 * 24));
    return isNaN(diff) ? 0 : diff;
  };

  const handleAddCropSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cropName || !selectedFarmIdForCrop) return;
    addCrop({
      farmId: selectedFarmIdForCrop || farms[0]?.id,
      cropName,
      variety,
      plantingDate,
      expectedHarvestDate,
      stage: cropStage,
      status: 'ACTIVE',
      estimatedYieldKg: parseFloat(estimatedYieldKg) || 5000,
      healthScore: 95,
      notes: cropNotes
    });
    setIsAddCropModalOpen(false);
  };

  // -------------------------------------------------------------
  // Add Activity State
  // -------------------------------------------------------------
  const [actFarmId, setActFarmId] = useState(farms[0]?.id || '');
  const [actCropId, setActCropId] = useState(crops[0]?.id || '');
  const [activityType, setActivityType] = useState<ActivityType>('PESTICIDE');
  const [actTitle, setActTitle] = useState('Preventive Foliar Spraying');
  const [actDate, setActDate] = useState(new Date().toISOString().split('T')[0]);
  const [dosage, setDosage] = useState('500ml / acre with water');
  const [cost, setCost] = useState('850');
  const [actPriority, setActPriority] = useState<AlertPriority>('HIGH');
  const [actNotes, setActNotes] = useState('');

  // Live conflict warning inside modal
  const isRainSprayConflict = activityType === 'PESTICIDE' && weather.rainProbability >= 50;
  const isRainIrrigConflict = activityType === 'IRRIGATION' && weather.rainfall24hMm >= 10;

  const handleAddActivitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!actTitle || !actCropId) return;

    addActivity({
      farmId: actFarmId || farms[0]?.id,
      cropId: actCropId || crops[0]?.id,
      activityType,
      title: actTitle,
      scheduledDate: actDate,
      status: 'PENDING',
      priority: actPriority,
      dosageOrVolume: dosage,
      cost: parseFloat(cost) || 0,
      notes: actNotes
    });

    setActTitle('');
    setActNotes('');
    setIsAddActivityModalOpen(false);
  };

  // -------------------------------------------------------------
  // Export Summary / Report State
  // -------------------------------------------------------------
  const handlePrint = () => {
    window.print();
  };

  const handleDownloadCSV = () => {
    let csv = 'AGRITECH Farm Management Summary Report\n';
    csv += `Export Date: ${new Date().toISOString()}\n`;
    csv += `Farmer: ${user.name} (${user.email})\n\n`;

    csv += '--- REGISTERED PLOTS ---\n';
    csv += 'Farm Name,Location,Area (Acres),Soil Type,Irrigation\n';
    farms.forEach(f => {
      csv += `"${f.farmName}","${f.location}",${f.area},"${f.soilType}","${f.irrigationType}"\n`;
    });

    csv += '\n--- ACTIVE CROP CYCLES ---\n';
    csv += 'Crop Name,Plot,Planting Date,Expected Harvest,Stage,Status\n';
    crops.forEach(c => {
      const f = farms.find(farm => farm.id === c.farmId);
      csv += `"${c.cropName}","${f?.farmName || ''}",${c.plantingDate},${c.expectedHarvestDate},"${c.stage}","${c.status}"\n`;
    });

    csv += '\n--- FIELD OPERATIONS ---\n';
    csv += 'Type,Title,Scheduled Date,Status,Dosage/Rate,Cost (INR)\n';
    activities.forEach(a => {
      csv += `"${a.activityType}","${a.title}",${a.scheduledDate},"${a.status}","${a.dosageOrVolume || ''}",₹${a.cost || 0}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `AGRITECH_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      {/* -------------------- ADD FARM MODAL -------------------- */}
      {isAddFarmModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-4 sm:p-6 space-y-4 shadow-2xl border border-lime-200 my-auto max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-lime-100 pb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-800" />
                <h3 className="text-base font-bold text-emerald-950">Register New Farm Plot</h3>
              </div>
              <button
                onClick={() => setIsAddFarmModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddFarmSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Farm Plot Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sunrise Valley - Sector B"
                  value={farmName}
                  onChange={(e) => setFarmName(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-xs font-semibold focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Location / District (Jharkhand) *</label>
                  <input
                    type="text"
                    required
                    list="jharkhand-districts-list"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Ranchi District, Jharkhand"
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs"
                  />
                  <datalist id="jharkhand-districts-list">
                    {JHARKHAND_DISTRICTS.map(dist => (
                      <option key={dist} value={`${dist} District, Jharkhand`} />
                    ))}
                  </datalist>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Area (Acres) *</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Soil Classification *</label>
                  <select
                    value={soilType}
                    onChange={(e) => setSoilType(e.target.value as SoilType)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs font-medium"
                  >
                    <option value="Loamy">Loamy (Fertile alluvium)</option>
                    <option value="Black">Black (Deep cotton soil)</option>
                    <option value="Clay">Clay (Water retentive)</option>
                    <option value="Sandy">Sandy (High drainage)</option>
                    <option value="Red">Red (Iron-rich)</option>
                    <option value="Silt">Silt (Fine riverbed)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Irrigation System *</label>
                  <select
                    value={irrigationType}
                    onChange={(e) => setIrrigationType(e.target.value as any)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs font-medium"
                  >
                    <option value="Drip">Drip Irrigation</option>
                    <option value="Sprinkler">Sprinkler System</option>
                    <option value="Borewell">Borewell Tube</option>
                    <option value="Canal / Flood">Canal / Surface Flood</option>
                    <option value="Rainfed">Rainfed / Dryland</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Latitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Longitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Plot Description / Notes</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Equipped with 5HP solar submersible pump"
                  value={farmNotes}
                  onChange={(e) => setFarmNotes(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsAddFarmModalOpen(false)}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-lg text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-lg text-xs shadow-xs"
                >
                  Register Plot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* -------------------- ADD CROP MODAL -------------------- */}
      {isAddCropModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-4 sm:p-6 space-y-4 shadow-2xl border border-lime-200 my-auto max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-lime-100 pb-3">
              <div className="flex items-center gap-2">
                <Wheat className="w-5 h-5 text-emerald-800" />
                <h3 className="text-base font-bold text-emerald-950">Plant New Crop Cycle</h3>
              </div>
              <button
                onClick={() => setIsAddCropModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Quick Presets Bar */}
            <div className="bg-lime-50/70 p-2.5 rounded-xl border border-lime-200 space-y-1">
              <span className="text-[11px] font-bold text-emerald-950 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                Quick Presets from Knowledge Base:
              </span>
              <div className="flex flex-wrap gap-1">
                {CROP_KNOWLEDGE_BASE.slice(0, 4).map(p => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handlePresetSelect(p.name)}
                    className="text-[10px] font-semibold bg-white hover:bg-lime-200 text-emerald-900 px-2 py-0.5 rounded border border-lime-300"
                  >
                    {p.name.split(' ')[0]} ({p.durationDays}d)
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleAddCropSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Assign Farm Plot *</label>
                  <select
                    value={selectedFarmIdForCrop}
                    onChange={(e) => setSelectedFarmIdForCrop(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs font-semibold"
                  >
                    {farms.map(f => (
                      <option key={f.id} value={f.id}>{f.farmName} ({f.area} Ac)</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Growth Stage *</label>
                  <select
                    value={cropStage}
                    onChange={(e) => setCropStage(e.target.value as CropStage)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs font-semibold"
                  >
                    <option value="Sowing">Sowing</option>
                    <option value="Vegetative">Vegetative</option>
                    <option value="Flowering">Flowering</option>
                    <option value="Maturity">Maturity</option>
                    <option value="Harvested">Harvested</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Crop Name *</label>
                  <input
                    type="text"
                    required
                    value={cropName}
                    onChange={(e) => setCropName(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Seed Variety</label>
                  <input
                    type="text"
                    placeholder="e.g. Hybrid Bella Rosa"
                    value={variety}
                    onChange={(e) => setVariety(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Sowing Date *</label>
                  <input
                    type="date"
                    required
                    value={plantingDate}
                    onChange={(e) => setPlantingDate(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Expected Harvest Date *</label>
                  <input
                    type="date"
                    required
                    value={expectedHarvestDate}
                    onChange={(e) => setExpectedHarvestDate(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs font-semibold"
                  />
                </div>
              </div>

              {/* Dynamic Duration Calculation Notice */}
              <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-200 flex items-center justify-between text-xs">
                <span className="text-stone-600">Calculated Cycle Length:</span>
                <span className="font-bold text-emerald-800 font-mono text-sm">
                  {calculateDurationDays()} Total Days
                </span>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Target Yield (Kg)</label>
                <input
                  type="number"
                  placeholder="e.g. 10000"
                  value={estimatedYieldKg}
                  onChange={(e) => setEstimatedYieldKg(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs font-mono"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsAddCropModalOpen(false)}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-lg text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-lg text-xs shadow-xs"
                >
                  Register Crop
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* -------------------- ADD ACTIVITY MODAL -------------------- */}
      {isAddActivityModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-4 sm:p-6 space-y-4 shadow-2xl border border-lime-200 my-auto max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-lime-100 pb-3">
              <div className="flex items-center gap-2">
                <CalendarCheck className="w-5 h-5 text-emerald-800" />
                <h3 className="text-base font-bold text-emerald-950">Schedule Field Operation</h3>
              </div>
              <button
                onClick={() => setIsAddActivityModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Live Meteorological Conflict Pre-Check Banner */}
            {(isRainSprayConflict || isRainIrrigConflict) && (
              <div className="bg-amber-50 border border-amber-300 rounded-xl p-3 text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-amber-900">
                  <AlertTriangle className="w-4 h-4 text-amber-700" />
                  <span>Rule Engine Conflict Pre-Check</span>
                </div>
                <p className="text-stone-700 text-[11px]">
                  {isRainSprayConflict && `Rain probability is ${weather.rainProbability}%. Chemical spraying may wash off.`}
                  {isRainIrrigConflict && `Heavy precipitation (${weather.rainfall24hMm}mm) forecasted. You can skip irrigation.`}
                </p>
              </div>
            )}

            <form onSubmit={handleAddActivitySubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Target Plot *</label>
                  <select
                    value={actFarmId}
                    onChange={(e) => {
                      setActFarmId(e.target.value);
                      const matched = crops.find(c => c.farmId === e.target.value);
                      if (matched) setActCropId(matched.id);
                    }}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs font-semibold"
                  >
                    {farms.map(f => (
                      <option key={f.id} value={f.id}>{f.farmName}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Target Crop *</label>
                  <select
                    value={actCropId}
                    onChange={(e) => setActCropId(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs font-semibold"
                  >
                    {crops.map(c => (
                      <option key={c.id} value={c.id}>{c.cropName} ({c.stage})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Activity Type *</label>
                  <select
                    value={activityType}
                    onChange={(e) => setActivityType(e.target.value as ActivityType)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs font-bold text-emerald-950"
                  >
                    <option value="PESTICIDE">🛡️ Pesticide / Spraying</option>
                    <option value="FERTILIZER">🌱 Fertilizer / Fertigation</option>
                    <option value="IRRIGATION">💧 Irrigation</option>
                    <option value="WEEDING">🌿 Weeding / Hoeing</option>
                    <option value="HARVEST">🌾 Harvesting</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Priority</label>
                  <select
                    value={actPriority}
                    onChange={(e) => setActPriority(e.target.value as AlertPriority)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs"
                  >
                    <option value="HIGH">High Priority</option>
                    <option value="MEDIUM">Medium Priority</option>
                    <option value="LOW">Low Priority</option>
                    <option value="CRITICAL">Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Activity Title / Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Second Nitrogen Top Dressing"
                  value={actTitle}
                  onChange={(e) => setActTitle(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-xs font-semibold"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Scheduled Date *</label>
                  <input
                    type="date"
                    required
                    value={actDate}
                    onChange={(e) => setActDate(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Dosage / Rate</label>
                  <input
                    type="text"
                    placeholder="e.g. 45kg/acre"
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Est. Cost (₹)</label>
                  <input
                    type="number"
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Field Hand Notes</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Apply between 07:00 and 09:30 AM before temperatures rise"
                  value={actNotes}
                  onChange={(e) => setActNotes(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsAddActivityModalOpen(false)}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-lg text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-lg text-xs shadow-xs"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* -------------------- EXPORT SUMMARY REPORT MODAL -------------------- */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-4 sm:p-6 space-y-5 shadow-2xl border border-lime-200 my-auto max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-lime-200 pb-3">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-800" />
                <div>
                  <h3 className="text-base font-bold text-emerald-950">AGRITECH Farm Seasonal Summary Report</h3>
                  <p className="text-xs text-stone-500">Official log for bank financing, co-op audits, and advisory reviews</p>
                </div>
              </div>
              <button
                onClick={() => setIsExportModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Print Header */}
            <div className="bg-lime-50/70 p-4 rounded-xl border border-lime-200 text-xs space-y-1">
              <div className="flex justify-between font-bold text-emerald-950">
                <span>Farmer: {user.name}</span>
                <span>Date: {new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Contact: {user.phone} • {user.email}</span>
                <span>District: {user.region}</span>
              </div>
            </div>

            {/* Section 1: Plots */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-emerald-950 uppercase tracking-wider">1. Registered Land Parcels</h4>
              <table className="w-full text-left border border-stone-200 rounded-lg overflow-hidden">
                <thead className="bg-stone-100 font-bold text-stone-700">
                  <tr>
                    <th className="p-2">Farm Name</th>
                    <th className="p-2">Location</th>
                    <th className="p-2">Area</th>
                    <th className="p-2">Soil Type</th>
                    <th className="p-2">Irrigation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {farms.map(f => (
                    <tr key={f.id} className="hover:bg-stone-50">
                      <td className="p-2 font-semibold text-stone-900">{f.farmName}</td>
                      <td className="p-2">{f.location}</td>
                      <td className="p-2 font-mono">{f.area} Ac</td>
                      <td className="p-2">{f.soilType}</td>
                      <td className="p-2">{f.irrigationType}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Section 2: Crops */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-emerald-950 uppercase tracking-wider">2. Crop Lifecycle Status</h4>
              <table className="w-full text-left border border-stone-200 rounded-lg overflow-hidden">
                <thead className="bg-stone-100 font-bold text-stone-700">
                  <tr>
                    <th className="p-2">Crop Name</th>
                    <th className="p-2">Sown</th>
                    <th className="p-2">Harvest Target</th>
                    <th className="p-2">Stage</th>
                    <th className="p-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {crops.map(c => (
                    <tr key={c.id} className="hover:bg-stone-50">
                      <td className="p-2 font-semibold text-stone-900">{c.cropName}</td>
                      <td className="p-2">{c.plantingDate}</td>
                      <td className="p-2">{c.expectedHarvestDate}</td>
                      <td className="p-2 font-semibold text-emerald-800">{c.stage}</td>
                      <td className="p-2 font-mono">{c.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-stone-100">
              <button
                onClick={handleDownloadCSV}
                className="flex items-center gap-1.5 bg-white hover:bg-lime-50 text-emerald-900 font-bold px-4 py-2 rounded-xl border border-lime-300 text-xs shadow-xs cursor-pointer"
              >
                <Download className="w-4 h-4 text-emerald-700" />
                <span>Download CSV Data</span>
              </button>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-xs cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-lime-400" />
                  <span>Print PDF Summary</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
