import React, { useState } from 'react';
import { useFarm } from '../context/FarmContext';
import {
  CloudSun,
  CloudRain,
  Sun,
  Wind,
  Droplets,
  Thermometer,
  Compass,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  MapPin,
  Calendar,
  Layers,
  Info,
  ShieldAlert
} from 'lucide-react';

export const WeatherView: React.FC = () => {
  const { 
    weather, 
    farms, 
    selectedFarm, 
    selectedFarmId, 
    setSelectedFarmId, 
    setWeatherScenario 
  } = useFarm();

  const [activePreset, setActivePreset] = useState<'rainy' | 'sunny' | 'heatwave' | 'windy'>('rainy');

  const handleScenarioChange = (s: 'rainy' | 'sunny' | 'heatwave' | 'windy') => {
    setActivePreset(s);
    setWeatherScenario(s);
  };

  const getSprayBadge = (suitability: string) => {
    switch (suitability) {
      case 'OPTIMAL':
        return {
          color: 'bg-lime-100 text-lime-900 border-lime-300',
          title: 'Optimal Spray Window',
          desc: 'Wind speed < 15 km/h and rain probability < 30%. High chemical efficacy.'
        };
      case 'CAUTION':
        return {
          color: 'bg-amber-100 text-amber-900 border-amber-300',
          title: 'Spray with Caution',
          desc: 'Marginal conditions. Monitor wind gusts to avoid aerosol spray drift.'
        };
      default:
        return {
          color: 'bg-rose-100 text-rose-900 border-rose-300',
          title: 'Unsuitable for Spraying',
          desc: 'Rain or high wind will wash away pesticide inputs. Postpone spraying by 24-48h.'
        };
    }
  };

  const sprayInfo = getSprayBadge(weather.spraySuitability);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header with Farm Location Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-lime-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-sky-100 text-sky-800 rounded-lg">
              <CloudSun className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-extrabold text-emerald-950 font-serif">Meteorological Feed & Field Advisories</h1>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Real-time agricultural weather forecasts driving deterministic irrigation and spraying rules.
          </p>
        </div>

        {/* Location Switcher */}
        <div className="flex items-center space-x-2 bg-white p-1.5 rounded-xl border border-lime-200 shadow-xs">
          <MapPin className="w-4 h-4 text-emerald-700 ml-1.5" />
          <span className="text-xs font-semibold text-stone-600">Active Location:</span>
          <select
            id="weather-farm-select"
            value={selectedFarmId}
            onChange={(e) => setSelectedFarmId(e.target.value)}
            className="bg-stone-50 border border-stone-300 rounded-lg px-2 py-1 text-xs font-bold text-emerald-950 focus:outline-none focus:ring-1 focus:ring-emerald-700"
          >
            {farms.map(f => (
              <option key={f.id} value={f.id}>{f.farmName} ({f.location})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Simulator Banner for Demo Evaluation */}
      <div className="bg-gradient-to-r from-lime-100/90 via-emerald-100/80 to-lime-50 rounded-2xl p-4 border border-lime-300 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-800 text-lime-300 flex items-center justify-center font-bold">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-emerald-950">Meteorological Rule Simulator</h3>
            <p className="text-[11px] text-emerald-800">Switch weather scenarios to see rule warnings trigger across your farm schedules</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {(['rainy', 'sunny', 'heatwave', 'windy'] as const).map((preset) => (
            <button
              key={preset}
              onClick={() => handleScenarioChange(preset)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                activePreset === preset
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-white hover:bg-lime-50 text-emerald-950 border border-lime-300'
              }`}
            >
              {preset === 'rainy' && <span>🌧️ Monsoon Rain (85%)</span>}
              {preset === 'sunny' && <span>☀️ Clear Sun (30°C)</span>}
              {preset === 'heatwave' && <span>🔥 Heatwave (40°C)</span>}
              {preset === 'windy' && <span>💨 High Winds (34 km/h)</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Primary Current Weather Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 8 Cols: Main Weather Overview Card */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-lime-200 shadow-xs p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-lime-100 pb-4">
            <div>
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider bg-lime-100 px-2.5 py-0.5 rounded-full border border-lime-200">
                {selectedFarm?.farmName || 'Primary Farm'}
              </span>
              <h2 className="text-2xl font-extrabold text-emerald-950 mt-1">{weather.location}</h2>
              <p className="text-xs text-stone-500">{weather.lastUpdated}</p>
            </div>

            <div className="text-right sm:text-right">
              <span className="text-4xl font-extrabold text-emerald-950 font-serif">{weather.currentTemp}°C</span>
              <span className="text-xs text-stone-500 block">Feels like {weather.feelsLike}°C</span>
              <span className="text-xs font-bold text-emerald-800 mt-0.5 block">{weather.condition}</span>
            </div>
          </div>

          {/* Meteorological Gauges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-lime-50/50 p-3 rounded-xl border border-lime-100">
              <div className="flex items-center gap-1.5 text-stone-500 text-xs mb-1">
                <CloudRain className="w-4 h-4 text-sky-600" />
                <span>Rain Probability</span>
              </div>
              <span className={`text-xl font-extrabold font-mono ${weather.rainProbability >= 50 ? 'text-amber-700' : 'text-emerald-950'}`}>
                {weather.rainProbability}%
              </span>
              <span className="text-[10px] text-stone-500 block">{weather.rainfall24hMm}mm in 24h</span>
            </div>

            <div className="bg-lime-50/50 p-3 rounded-xl border border-lime-100">
              <div className="flex items-center gap-1.5 text-stone-500 text-xs mb-1">
                <Droplets className="w-4 h-4 text-emerald-600" />
                <span>Relative Humidity</span>
              </div>
              <span className="text-xl font-extrabold font-mono text-emerald-950">
                {weather.humidity}%
              </span>
              <span className="text-[10px] text-stone-500 block">Atmospheric moisture</span>
            </div>

            <div className="bg-lime-50/50 p-3 rounded-xl border border-lime-100">
              <div className="flex items-center gap-1.5 text-stone-500 text-xs mb-1">
                <Wind className="w-4 h-4 text-teal-600" />
                <span>Wind Speed</span>
              </div>
              <span className="text-xl font-extrabold font-mono text-emerald-950">
                {weather.windSpeedKmH} <span className="text-xs font-sans font-normal text-stone-500">km/h</span>
              </span>
              <span className="text-[10px] text-stone-500 block">Dir: {weather.windDirection}</span>
            </div>

            <div className="bg-lime-50/50 p-3 rounded-xl border border-lime-100">
              <div className="flex items-center gap-1.5 text-stone-500 text-xs mb-1">
                <Sun className="w-4 h-4 text-amber-500" />
                <span>UV Index</span>
              </div>
              <span className="text-xl font-extrabold font-mono text-emerald-950">
                {weather.uvIndex} / 11
              </span>
              <span className="text-[10px] text-stone-500 block">Solar radiation</span>
            </div>
          </div>

          {/* Hourly Forecast Strip */}
          <div>
            <h3 className="text-xs font-bold text-emerald-950 uppercase tracking-wider mb-2.5">
              Hourly Rain Probability & Temperature
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {weather.hourly.map((h, i) => (
                <div key={i} className="bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-center text-xs space-y-1">
                  <span className="text-[11px] font-semibold text-stone-500 block">{h.time}</span>
                  <span className="text-sm font-extrabold text-emerald-950 block">{h.temp}°C</span>
                  <span className={`text-[10px] font-bold block ${h.rainProb >= 50 ? 'text-amber-700' : 'text-stone-500'}`}>
                    💧 {h.rainProb}%
                  </span>
                  <span className="text-[9px] text-stone-400 truncate block">{h.condition}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Agricultural Decision Advisories */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Advisory 1: Chemical Spraying Suitability */}
          <div className="bg-white rounded-2xl border border-lime-200 shadow-xs p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-emerald-950">Spraying Suitability</h3>
              <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border ${sprayInfo.color}`}>
                {weather.spraySuitability}
              </span>
            </div>
            <h4 className="font-bold text-xs text-stone-900">{sprayInfo.title}</h4>
            <p className="text-xs text-stone-600 leading-relaxed">{sprayInfo.desc}</p>
          </div>

          {/* Advisory 2: Irrigation Recommendation */}
          <div className="bg-white rounded-2xl border border-lime-200 shadow-xs p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-emerald-950">Irrigation Guidance</h3>
              <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border ${
                weather.irrigationRecommendation === 'SKIP_RAIN_PREDICTED'
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : 'bg-lime-100 text-lime-900 border-lime-300'
              }`}>
                {weather.irrigationRecommendation === 'SKIP_RAIN_PREDICTED' ? 'Skip Irrigation' : 'Normal Schedule'}
              </span>
            </div>
            <h4 className="font-bold text-xs text-stone-900">
              {weather.irrigationRecommendation === 'SKIP_RAIN_PREDICTED'
                ? 'Rain forecasted: Conserve Water & Pump Power'
                : 'Favorable Evapotranspiration: Proceed with Drip Schedule'}
            </h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              Soil moisture is estimated at <strong>{weather.soilMoisturePercent}%</strong>. Natural precipitation will sufficiently charge the topsoil layer.
            </p>
          </div>

          {/* Soil Moisture Health Note */}
          <div className="bg-emerald-900 text-white rounded-2xl p-5 space-y-2">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-lime-300" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-lime-300">Soil Moisture Model</h4>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-extrabold font-mono text-white">{weather.soilMoisturePercent}%</span>
              <span className="text-xs text-emerald-200">Field Capacity</span>
            </div>
            <div className="w-full h-2 bg-emerald-950 rounded-full overflow-hidden">
              <div className="h-full bg-lime-400 rounded-full" style={{ width: `${weather.soilMoisturePercent}%` }} />
            </div>
            <p className="text-[11px] text-emerald-200 pt-1">
              Deep black and loamy soils retain high capillary moisture up to 3 days following 15mm+ rainfall events.
            </p>
          </div>

        </div>

      </div>

      {/* 5-Day Detailed Forecast Section */}
      <div className="bg-white rounded-2xl border border-lime-200 shadow-xs p-6">
        <div className="flex items-center justify-between border-b border-lime-100 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-700" />
            <h3 className="text-base font-bold text-emerald-950">5-Day Meteorological Extended Forecast</h3>
          </div>
          <span className="text-xs text-stone-500">Includes agricultural advisories</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {weather.forecast.map((day) => (
            <div key={day.date} className="bg-stone-50/70 border border-stone-200 rounded-xl p-3.5 space-y-2 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-emerald-950">{day.dayName}</span>
                  <span className="text-[10px] text-stone-400">{day.date.slice(5)}</span>
                </div>
                <p className="text-xs font-semibold text-emerald-800 mt-1">{day.condition}</p>

                <div className="my-2 pt-2 border-t border-stone-200 flex items-baseline justify-between font-mono">
                  <span className="text-base font-extrabold text-stone-900">{day.tempMax}°C</span>
                  <span className="text-xs text-stone-500">{day.tempMin}°C Min</span>
                </div>

                <div className="space-y-1 text-xs text-stone-600">
                  <div className="flex justify-between">
                    <span>Rain Likelihood:</span>
                    <span className={`font-bold ${day.rainProbability >= 50 ? 'text-amber-700' : 'text-stone-700'}`}>
                      {day.rainProbability}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Precipitation:</span>
                    <span className="font-medium text-stone-900">{day.rainfallMm} mm</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Wind Speed:</span>
                    <span className="font-medium text-stone-900">{day.windSpeedKmH} km/h</span>
                  </div>
                </div>
              </div>

              {day.advisoryText && (
                <div className="mt-2 pt-2 border-t border-stone-200">
                  <p className="text-[10px] text-emerald-900 bg-lime-100/70 p-1.5 rounded border border-lime-200 leading-tight">
                    💡 {day.advisoryText}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
