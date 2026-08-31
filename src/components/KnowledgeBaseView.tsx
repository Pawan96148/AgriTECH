import React, { useState } from 'react';
import { useFarm } from '../context/FarmContext';
import { CROP_KNOWLEDGE_BASE } from '../data/cropKnowledgeBase';
import { CropPresetKnowledge } from '../types';
import { CropDoodle } from './CropDoodle';
import {
  BookOpen,
  Wheat,
  Droplets,
  Thermometer,
  Calendar,
  Layers,
  ShieldAlert,
  Sparkles,
  ChevronRight,
  Search,
  Plus,
  ArrowRight
} from 'lucide-react';

export const KnowledgeBaseView: React.FC = () => {
  const { 
    setIsAddCropModalOpen, 
    setActiveTab, 
    setPreselectedCropForModal 
  } = useFarm();

  const [selectedCrop, setSelectedCrop] = useState<CropPresetKnowledge>(CROP_KNOWLEDGE_BASE[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const filteredCrops = CROP_KNOWLEDGE_BASE.filter(c => {
    if (selectedCategory !== 'ALL' && c.category !== selectedCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.scientificName.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handlePlantPreset = (preset: CropPresetKnowledge) => {
    setPreselectedCropForModal(preset.name);
    setActiveTab('crops');
    setIsAddCropModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-lime-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
              <BookOpen className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-extrabold text-emerald-950 font-serif">Predefined Crop Knowledge Base</h1>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Standard agronomic durations, soil prerequisites, fertigation schedules, and critical milestone practices.
          </p>
        </div>

        <button
          onClick={() => handlePlantPreset(selectedCrop)}
          className="flex items-center justify-center gap-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-4 py-2.5 rounded-xl shadow-xs transition active:scale-95 text-xs sm:text-sm cursor-pointer"
        >
          <Plus className="w-4 h-4 text-lime-400 stroke-[3]" />
          <span>Plant {selectedCrop.name.split(' ')[0]} Now</span>
        </button>
      </div>

      {/* Main 2-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 4 cols: Crop Selector Sidebar */}
        <div className="lg:col-span-4 space-y-3">
          {/* Search & Category Filter */}
          <div className="bg-white p-3.5 rounded-xl border border-lime-200 shadow-2xs space-y-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search crops, scientific names..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-lg pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-700"
              />
            </div>

            <div className="flex flex-wrap gap-1">
              {(['ALL', 'Cereal', 'Vegetable', 'Pulse', 'Cash Crop'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold transition ${
                    selectedCategory === cat
                      ? 'bg-emerald-800 text-white'
                      : 'bg-stone-100 text-stone-600 hover:bg-lime-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* List of preset crops */}
          <div className="space-y-2">
            {filteredCrops.map((crop) => {
              const isSelected = selectedCrop.id === crop.id;
              return (
                <div
                  key={crop.id}
                  onClick={() => setSelectedCrop(crop)}
                  className={`p-3 rounded-xl border cursor-pointer transition flex items-center justify-between gap-2.5 ${
                    isSelected
                      ? 'bg-emerald-800 text-white border-emerald-950 shadow-xs'
                      : 'bg-white hover:bg-lime-50/70 border-lime-200 text-stone-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <CropDoodle cropName={crop.name} size="sm" />
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-sm font-bold truncate">{crop.name}</h4>
                        <span className={`text-[9px] font-semibold px-1.5 py-0.2 rounded shrink-0 ${
                          isSelected ? 'bg-emerald-950 text-lime-300' : 'bg-lime-100 text-emerald-900'
                        }`}>
                          {crop.category}
                        </span>
                      </div>
                      <p className={`text-xs italic truncate ${isSelected ? 'text-emerald-200' : 'text-stone-500'}`}>
                        {crop.scientificName}
                      </p>
                    </div>
                  </div>

                  <div className="text-right font-mono text-xs font-bold shrink-0">
                    <span className={isSelected ? 'text-lime-300' : 'text-emerald-700'}>
                      {crop.durationDays}d
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 8 cols: Detailed Crop Agronomic Guide */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-lime-200 shadow-xs p-6 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-lime-100 pb-4">
            <div className="flex items-start gap-4">
              <CropDoodle cropName={selectedCrop.name} size="lg" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider bg-lime-100 px-2.5 py-0.5 rounded-full border border-lime-200">
                    {selectedCrop.category}
                  </span>
                  <span className="text-xs font-mono font-semibold text-stone-500">
                    Standard Duration: {selectedCrop.durationDays} Days
                  </span>
                </div>
                <h2 className="text-2xl font-extrabold text-emerald-950 font-serif mt-1">{selectedCrop.name}</h2>
                <p className="text-xs italic text-stone-500">{selectedCrop.scientificName}</p>
                <p className="text-xs text-stone-700 mt-2 leading-relaxed">{selectedCrop.description}</p>
              </div>
            </div>

            <button
              onClick={() => handlePlantPreset(selectedCrop)}
              className="bg-lime-500 hover:bg-lime-600 text-emerald-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-xs shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Use This Preset</span>
            </button>
          </div>

          {/* Key Agronomic Specs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-lime-50/50 p-3 rounded-xl border border-lime-100">
              <span className="text-stone-500 block mb-1">Ideal Soil Types</span>
              <span className="font-bold text-emerald-950 block">{selectedCrop.idealSoil.join(', ')}</span>
            </div>
            <div className="bg-lime-50/50 p-3 rounded-xl border border-lime-100">
              <span className="text-stone-500 block mb-1">Water Demand</span>
              <span className="font-bold text-emerald-950 block">{selectedCrop.waterDemand} Demand</span>
            </div>
            <div className="bg-lime-50/50 p-3 rounded-xl border border-lime-100">
              <span className="text-stone-500 block mb-1">Temp Range</span>
              <span className="font-bold text-emerald-950 block">{selectedCrop.idealTempRange}</span>
            </div>
            <div className="bg-lime-50/50 p-3 rounded-xl border border-lime-100">
              <span className="text-stone-500 block mb-1">Average Yield</span>
              <span className="font-bold text-emerald-950 block">{selectedCrop.averageYieldPerAcre}</span>
            </div>
          </div>

          {/* Growth Stage Milestones Timeline */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-emerald-950 uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-700" />
              <span>Standard Growth Milestones & Practices</span>
            </h3>

            <div className="space-y-3">
              {selectedCrop.keyStages.map((stage, idx) => (
                <div key={idx} className="bg-stone-50/80 border border-stone-200 rounded-xl p-3.5 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-950">
                      Phase {idx + 1}: {stage.stage} (Day {stage.dayOffset})
                    </span>
                    <span className="text-[10px] font-mono bg-stone-200 text-stone-800 px-2 py-0.5 rounded">
                      Day ~{stage.dayOffset}
                    </span>
                  </div>
                  <p className="text-xs text-stone-600">{stage.description}</p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {stage.recommendedActivities.map((act, i) => (
                      <span key={i} className="text-[10px] font-semibold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded">
                        ✓ {act}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fertilizer Plan & Pest Alerts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200 space-y-1.5">
              <h4 className="font-bold text-emerald-950 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-emerald-700" />
                <span>Fertilizer Management Protocol</span>
              </h4>
              <p className="text-stone-700 leading-relaxed">{selectedCrop.fertilizerPlan}</p>
            </div>

            <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200 space-y-1.5">
              <h4 className="font-bold text-amber-950 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-700" />
                <span>Primary Pest & Disease Risks</span>
              </h4>
              <ul className="list-disc list-inside text-stone-700 space-y-0.5">
                {selectedCrop.pestRisks.map((pest, i) => (
                  <li key={i}>{pest}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Harvesting Signs */}
          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-xs">
            <span className="font-bold text-emerald-950 block mb-1">Harvesting Readiness Indicators:</span>
            <p className="text-stone-700 leading-relaxed">{selectedCrop.harvestingSigns}</p>
          </div>
        </div>

      </div>
    </div>
  );
};
