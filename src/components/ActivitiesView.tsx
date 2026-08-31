import React, { useState } from 'react';
import { useFarm } from '../context/FarmContext';
import { Activity, ActivityStatus, ActivityType } from '../types';
import {
  CalendarCheck,
  Plus,
  Filter,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Droplets,
  Trash2,
  MapPin,
  Wheat,
  AlertTriangle,
  FileSpreadsheet,
  Check,
  Calendar,
  Sparkles
} from 'lucide-react';

export const ActivitiesView: React.FC = () => {
  const {
    activities,
    farms,
    crops,
    updateActivityStatus,
    deleteActivity,
    setIsAddActivityModalOpen,
    setIsExportModalOpen,
    weather
  } = useFarm();

  const [filterType, setFilterType] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterFarmId, setFilterFarmId] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredActivities = activities.filter(a => {
    if (filterType !== 'ALL' && a.activityType !== filterType) return false;
    if (filterStatus !== 'ALL' && a.status !== filterStatus) return false;
    if (filterFarmId !== 'ALL' && a.farmId !== filterFarmId) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const titleMatch = a.title.toLowerCase().includes(q);
      const notesMatch = a.notes?.toLowerCase().includes(q);
      const doseMatch = a.dosageOrVolume?.toLowerCase().includes(q);
      if (!titleMatch && !notesMatch && !doseMatch) return false;
    }
    return true;
  });

  const getActivityTypeColor = (type: ActivityType) => {
    switch (type) {
      case 'IRRIGATION': return 'bg-sky-100 text-sky-900 border-sky-300';
      case 'FERTILIZER': return 'bg-lime-100 text-lime-900 border-lime-300';
      case 'PESTICIDE': return 'bg-rose-100 text-rose-900 border-rose-300';
      case 'WEEDING': return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'HARVEST': return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      default: return 'bg-stone-100 text-stone-900 border-stone-300';
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-lime-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
              <CalendarCheck className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-extrabold text-emerald-950 font-serif">Field Activity Scheduler</h1>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Log and audit field operations (irrigation, fertilization, spraying, weeding, harvesting) with automatic rule conflict detection.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="export-activities-btn"
            onClick={() => setIsExportModalOpen(true)}
            className="flex items-center gap-1.5 bg-white hover:bg-lime-50 text-emerald-900 font-semibold px-3 py-2 rounded-xl border border-lime-300 shadow-xs transition text-xs cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
            <span>Export Log</span>
          </button>

          <button
            id="schedule-activity-btn"
            onClick={() => setIsAddActivityModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-4 py-2.5 rounded-xl shadow-xs transition active:scale-95 text-xs sm:text-sm cursor-pointer"
          >
            <Plus className="w-4 h-4 text-lime-400 stroke-[3]" />
            <span>Schedule Operation</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-lime-200 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search tasks, dosage, chemicals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-lg pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-700"
            />
          </div>

          {/* Type Filter */}
          <div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs font-medium text-emerald-950 focus:outline-none focus:ring-1 focus:ring-emerald-700"
            >
              <option value="ALL">All Activity Types</option>
              <option value="IRRIGATION">💧 Irrigation</option>
              <option value="FERTILIZER">🌱 Fertilizer / Fertigation</option>
              <option value="PESTICIDE">🛡️ Pesticide / Spraying</option>
              <option value="WEEDING">🌿 Weeding / Interculture</option>
              <option value="HARVEST">🌾 Harvesting</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs font-medium text-emerald-950 focus:outline-none focus:ring-1 focus:ring-emerald-700"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">⏳ Pending / In-Progress</option>
              <option value="COMPLETED">✅ Completed</option>
              <option value="CANCELLED">❌ Cancelled / Postponed</option>
            </select>
          </div>

          {/* Plot Filter */}
          <div>
            <select
              value={filterFarmId}
              onChange={(e) => setFilterFarmId(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs font-medium text-emerald-950 focus:outline-none focus:ring-1 focus:ring-emerald-700"
            >
              <option value="ALL">All Farm Plots</option>
              {farms.map(f => (
                <option key={f.id} value={f.id}>{f.farmName}</option>
              ))}
            </select>
          </div>

        </div>

        {/* Quick Filter Counts */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-100 text-xs text-stone-500">
          <span className="font-semibold text-emerald-950">Showing {filteredActivities.length} operations</span>
          <span>•</span>
          <span>Pending: <strong className="text-amber-700">{activities.filter(a => a.status === 'PENDING').length}</strong></span>
          <span>•</span>
          <span>Completed: <strong className="text-emerald-700">{activities.filter(a => a.status === 'COMPLETED').length}</strong></span>
        </div>
      </div>

      {/* Activity List / Table */}
      <div className="space-y-3">
        {filteredActivities.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-lime-300 p-6">
            <CalendarCheck className="w-10 h-10 text-emerald-600 mx-auto mb-2 opacity-60" />
            <h3 className="text-base font-bold text-emerald-950">No matching activities found</h3>
            <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
              Try adjusting your search criteria or schedule a new field operation using the button above.
            </p>
          </div>
        ) : (
          filteredActivities.map((act) => {
            const linkedFarm = farms.find(f => f.id === act.farmId);
            const linkedCrop = crops.find(c => c.id === act.cropId);
            
            const actDate = new Date(act.scheduledDate);
            actDate.setHours(0, 0, 0, 0);
            const isToday = act.scheduledDate === todayStr;
            const isOverdue = act.status === 'PENDING' && actDate < todayDate;

            // Check if this task has a live weather conflict
            const hasRainConflict = act.status === 'PENDING' && (
              (act.activityType === 'PESTICIDE' && weather.rainProbability >= 50) ||
              (act.activityType === 'IRRIGATION' && weather.rainfall24hMm >= 10)
            );

            return (
              <div
                key={act.id}
                className={`bg-white rounded-xl border p-4 shadow-xs transition flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isOverdue
                    ? 'border-rose-300 bg-rose-50/30'
                    : isToday
                    ? 'border-lime-400 bg-lime-50/20'
                    : 'border-lime-200/90'
                }`}
              >
                {/* Left details */}
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border ${getActivityTypeColor(act.activityType)}`}>
                      {act.activityType}
                    </span>

                    {isOverdue && (
                      <span className="text-[10px] font-bold bg-rose-600 text-white px-2 py-0.5 rounded animate-pulse">
                        OVERDUE
                      </span>
                    )}

                    {isToday && !isOverdue && (
                      <span className="text-[10px] font-bold bg-emerald-800 text-lime-300 px-2 py-0.5 rounded">
                        DUE TODAY
                      </span>
                    )}

                    {hasRainConflict && (
                      <span className="text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-amber-700" />
                        Weather Conflict Advisory
                      </span>
                    )}

                    <span className="text-xs text-stone-500 font-mono">
                      📅 {act.scheduledDate} {act.completedDate ? `(Done on ${act.completedDate})` : ''}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-emerald-950">{act.title}</h3>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-600">
                    <span className="flex items-center gap-1 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                      Plot: <strong className="text-emerald-950">{linkedFarm?.farmName || 'Unassigned'}</strong>
                    </span>
                    <span className="flex items-center gap-1 font-medium">
                      <Wheat className="w-3.5 h-3.5 text-emerald-700" />
                      Crop: <strong className="text-emerald-950">{linkedCrop?.cropName || 'Unassigned'}</strong>
                    </span>
                    {act.dosageOrVolume && (
                      <span className="text-stone-500">
                        Dosage / Volume: <strong className="text-stone-800">{act.dosageOrVolume}</strong>
                      </span>
                    )}
                    {act.cost && (
                      <span className="text-stone-500">
                        Cost: <strong className="text-stone-800 font-mono">₹{act.cost.toLocaleString('en-IN')}</strong>
                      </span>
                    )}
                  </div>

                  {act.notes && (
                    <p className="text-xs text-stone-600 italic bg-stone-50 p-2 rounded-lg border border-stone-100">
                      "{act.notes}"
                    </p>
                  )}
                </div>

                {/* Right Status Controls */}
                <div className="flex flex-wrap items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-stone-100">
                  {act.status === 'PENDING' ? (
                    <>
                      <button
                        onClick={() => updateActivityStatus(act.id, 'COMPLETED')}
                        className="bg-lime-500 hover:bg-lime-600 text-emerald-950 text-xs font-extrabold px-3.5 py-2 rounded-lg flex items-center gap-1.5 shadow-xs transition active:scale-95 cursor-pointer"
                      >
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>Mark Done</span>
                      </button>

                      <button
                        onClick={() => updateActivityStatus(act.id, 'CANCELLED')}
                        className="bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold px-3 py-2 rounded-lg transition cursor-pointer"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 ${
                        act.status === 'COMPLETED'
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          : 'bg-stone-200 text-stone-700'
                      }`}>
                        {act.status === 'COMPLETED' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" /> : <XCircle className="w-3.5 h-3.5" />}
                        <span>{act.status}</span>
                      </span>

                      <button
                        onClick={() => updateActivityStatus(act.id, 'PENDING')}
                        className="text-[11px] text-stone-500 hover:text-stone-800 underline"
                      >
                        Reopen
                      </button>
                    </div>
                  )}

                  <button
                    onClick={() => deleteActivity(act.id)}
                    className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                    title="Delete Activity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
