import React, { useState } from 'react';
import { useFarm } from '../context/FarmContext';
import { Farm, SoilType } from '../types';
import { 
  MapPin, 
  Plus, 
  Trash2, 
  Edit3, 
  Layers, 
  Droplet, 
  Wheat, 
  Calendar, 
  CheckCircle,
  AlertTriangle,
  Compass,
  ArrowRight
} from 'lucide-react';

export const FarmsView: React.FC = () => {
  const { 
    farms, 
    crops, 
    activities, 
    deleteFarm, 
    setIsAddFarmModalOpen, 
    setIsAddCropModalOpen,
    setSelectedFarmId,
    setActiveTab
  } = useFarm();

  const [farmToDelete, setFarmToDelete] = useState<Farm | null>(null);

  const getSoilBadgeColor = (soil: SoilType) => {
    switch (soil) {
      case 'Black': return 'bg-stone-800 text-stone-100 border-stone-700';
      case 'Red': return 'bg-rose-100 text-rose-900 border-rose-300';
      case 'Clay': return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'Loamy': return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'Sandy': return 'bg-yellow-100 text-yellow-900 border-yellow-300';
      case 'Silt': return 'bg-teal-100 text-teal-900 border-teal-300';
      default: return 'bg-stone-100 text-stone-800 border-stone-300';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-lime-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
              <MapPin className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-extrabold text-emerald-950 font-serif">Registered Farm Plots</h1>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Manage your land parcels, GPS locations, acreage, soil classifications, and water infrastructure.
          </p>
        </div>

        <button
          id="add-new-farm-btn"
          onClick={() => setIsAddFarmModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-4 py-2.5 rounded-xl shadow-xs transition active:scale-95 text-xs sm:text-sm cursor-pointer"
        >
          <Plus className="w-4 h-4 text-lime-400 stroke-[3]" />
          <span>Register New Plot</span>
        </button>
      </div>

      {/* Grid of Farm Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {farms.map((farm) => {
          const linkedCrops = crops.filter(c => c.farmId === farm.id);
          const activeLinkedCrops = linkedCrops.filter(c => c.status === 'ACTIVE');
          const linkedActivities = activities.filter(a => a.farmId === farm.id && a.status === 'PENDING');

          return (
            <div
              key={farm.id}
              className="bg-white rounded-2xl border border-lime-200/90 shadow-xs hover:shadow-md transition flex flex-col justify-between overflow-hidden group"
            >
              {/* Card Header */}
              <div className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-bold text-emerald-950 group-hover:text-emerald-700 transition">
                      {farm.farmName}
                    </h3>
                    <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{farm.location}</span>
                    </p>
                  </div>
                  
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getSoilBadgeColor(farm.soilType)}`}>
                    {farm.soilType} Soil
                  </span>
                </div>

                {/* Plot Specs */}
                <div className="grid grid-cols-2 gap-2 bg-lime-50/50 p-3 rounded-xl border border-lime-100 text-xs">
                  <div>
                    <span className="text-[10px] text-stone-500 uppercase font-semibold block">Total Area</span>
                    <span className="font-extrabold text-emerald-950 text-sm">
                      {farm.area} Acres
                    </span>
                    <span className="text-[10px] text-stone-500 block">({(farm.area * 0.4046).toFixed(1)} ha)</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 uppercase font-semibold block">Irrigation</span>
                    <span className="font-bold text-emerald-900 text-xs flex items-center gap-1 mt-0.5">
                      <Droplet className="w-3.5 h-3.5 text-sky-600" />
                      {farm.irrigationType}
                    </span>
                  </div>
                </div>

                {/* GPS info */}
                <div className="text-[11px] text-stone-500 flex items-center justify-between px-1">
                  <span className="flex items-center gap-1">
                    <Compass className="w-3.5 h-3.5 text-stone-400" />
                    Coords: {farm.latitude.toFixed(3)}°N, {farm.longitude.toFixed(3)}°E
                  </span>
                  <span className="text-[10px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded">
                    Registered {farm.createdAt}
                  </span>
                </div>

                {/* Notes */}
                {farm.notes && (
                  <p className="text-xs text-stone-600 italic bg-stone-50 p-2.5 rounded-lg border border-stone-100">
                    "{farm.notes}"
                  </p>
                )}

                {/* Linked Crops Mini-List */}
                <div className="pt-2 border-t border-stone-100">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-emerald-950 flex items-center gap-1">
                      <Wheat className="w-3.5 h-3.5 text-emerald-700" />
                      Associated Crops ({linkedCrops.length})
                    </span>
                    <button
                      onClick={() => {
                        setSelectedFarmId(farm.id);
                        setIsAddCropModalOpen(true);
                      }}
                      className="text-[11px] text-emerald-700 hover:text-emerald-900 font-bold"
                    >
                      + Add Crop
                    </button>
                  </div>

                  {linkedCrops.length === 0 ? (
                    <p className="text-[11px] text-stone-400 italic">No crops currently planted on this plot.</p>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {linkedCrops.map(crop => (
                        <span 
                          key={crop.id}
                          className={`text-[10px] font-medium px-2 py-0.5 rounded-md border ${
                            crop.status === 'ACTIVE'
                              ? 'bg-lime-100 text-emerald-900 border-lime-300 font-semibold'
                              : 'bg-stone-100 text-stone-600 border-stone-200'
                          }`}
                        >
                          {crop.cropName} ({crop.stage})
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-4 bg-stone-50/80 border-t border-lime-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-stone-500">
                  <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                  <span><strong>{linkedActivities.length}</strong> tasks pending</span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setSelectedFarmId(farm.id);
                      setActiveTab('crops');
                    }}
                    className="bg-emerald-800 hover:bg-emerald-900 text-white font-semibold px-2.5 py-1.5 rounded-lg text-xs transition"
                  >
                    View Field →
                  </button>

                  <button
                    onClick={() => setFarmToDelete(farm)}
                    className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    title="Delete Farm Plot"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Delete Confirmation Modal */}
      {farmToDelete && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-rose-200">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            
            <div className="text-center space-y-2">
              <h3 className="text-lg font-bold text-stone-900">Delete Farm Plot?</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Are you sure you want to remove <strong className="text-stone-900">{farmToDelete.farmName}</strong>?
                This action will <strong>cascade-delete all associated crop cycles and field schedules</strong> for this plot.
              </p>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setFarmToDelete(null)}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-lg transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteFarm(farmToDelete.id);
                  setFarmToDelete(null);
                }}
                className="px-4 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition shadow-xs cursor-pointer"
              >
                Yes, Delete Plot & Cascaded Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
