import { Activity, Crop, Farm, Reminder, WeatherData } from '../types';
import { CROP_KNOWLEDGE_BASE } from '../data/cropKnowledgeBase';

export function calculateCropProgress(plantingDateStr: string, expectedHarvestDateStr: string): {
  daysElapsed: number;
  totalDays: number;
  daysRemaining: number;
  progressPercent: number;
} {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const plantDate = new Date(plantingDateStr);
  plantDate.setHours(0, 0, 0, 0);

  const harvestDate = new Date(expectedHarvestDateStr);
  harvestDate.setHours(0, 0, 0, 0);

  const msPerDay = 1000 * 60 * 60 * 24;
  const totalDays = Math.max(1, Math.round((harvestDate.getTime() - plantDate.getTime()) / msPerDay));
  const daysElapsed = Math.max(0, Math.round((today.getTime() - plantDate.getTime()) / msPerDay));
  const daysRemaining = Math.max(0, Math.round((harvestDate.getTime() - today.getTime()) / msPerDay));
  
  const rawPercent = Math.round((daysElapsed / totalDays) * 100);
  const progressPercent = Math.min(100, Math.max(0, rawPercent));

  return { daysElapsed, totalDays, daysRemaining, progressPercent };
}

export function evaluateDeterministicRules(
  farms: Farm[],
  crops: Crop[],
  activities: Activity[],
  weather: WeatherData,
  currentUserId: string = 'usr_farmer_01'
): Reminder[] {
  const generatedReminders: Reminder[] = [];
  const todayStr = new Date().toISOString().split('T')[0];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const farmMap = new Map<string, Farm>();
  farms.forEach(f => farmMap.set(f.id, f));

  const cropMap = new Map<string, Crop>();
  crops.forEach(c => cropMap.set(c.id, c));

  // Today's & 2-day forecast metrics
  const todayForecast = weather.forecast[0] || { rainProbability: weather.rainProbability, rainfallMm: weather.rainfall24hMm };
  const rainProb = Math.max(weather.rainProbability, todayForecast.rainProbability);
  const rainfallMm = Math.max(weather.rainfall24hMm, todayForecast.rainfallMm);

  // 1. Evaluate Activities against Dates & Weather Conditions
  activities.forEach(activity => {
    if (activity.status !== 'PENDING') return;

    const actDate = new Date(activity.scheduledDate);
    actDate.setHours(0, 0, 0, 0);
    const linkedCrop = cropMap.get(activity.cropId);
    const cropName = linkedCrop ? linkedCrop.cropName : 'Assigned Crop';

    // RULE 1: Activity Due Today
    if (activity.scheduledDate === todayStr) {
      generatedReminders.push({
        id: `rem_due_${activity.id}`,
        userId: currentUserId,
        activityId: activity.id,
        cropId: activity.cropId,
        farmId: activity.farmId,
        title: `Task Due Today: ${activity.title}`,
        message: `Field operation (${activity.activityType}) is scheduled for ${cropName} today. Please execute and mark as completed.`,
        priority: activity.priority === 'HIGH' ? 'HIGH' : 'MEDIUM',
        triggerDate: todayStr,
        ruleCode: 'DUE_TODAY',
        isRead: false,
        createdAt: new Date().toISOString()
      });
    }

    // RULE 2: Overdue Activities
    if (actDate < today) {
      const daysOverdue = Math.round((today.getTime() - actDate.getTime()) / (1000 * 60 * 60 * 24));
      generatedReminders.push({
        id: `rem_overdue_${activity.id}`,
        userId: currentUserId,
        activityId: activity.id,
        cropId: activity.cropId,
        farmId: activity.farmId,
        title: `OVERDUE (${daysOverdue}d): ${activity.title}`,
        message: `Scheduled ${activity.activityType} on ${cropName} was due on ${activity.scheduledDate}. Timely intervention is critical for optimum yield.`,
        priority: 'CRITICAL',
        triggerDate: todayStr,
        ruleCode: 'OVERDUE',
        isRead: false,
        createdAt: new Date().toISOString()
      });
    }

    // RULE 3: Pesticide Spraying vs Rain Conflict (> 50% rain probability)
    const isDueSoon = activity.scheduledDate === todayStr || Math.abs(actDate.getTime() - today.getTime()) <= 86400000;
    if (activity.activityType === 'PESTICIDE' && isDueSoon && rainProb >= 50) {
      generatedReminders.push({
        id: `rem_rain_spray_${activity.id}`,
        userId: currentUserId,
        activityId: activity.id,
        cropId: activity.cropId,
        farmId: activity.farmId,
        title: `Weather Advisory: Postpone Chemical Spraying`,
        message: `High rain probability (${rainProb}%) detected for your farm region. Spraying ${cropName} now risks chemical wash-off and environmental leaching. Postpone by 24-48h.`,
        priority: 'HIGH',
        triggerDate: todayStr,
        ruleCode: 'RAIN_SPRAY_CONFLICT',
        isRead: false,
        createdAt: new Date().toISOString()
      });
    }

    // RULE 4: Irrigation vs Heavy Rainfall Conflict (> 10mm rain expected)
    if (activity.activityType === 'IRRIGATION' && isDueSoon && rainfallMm >= 10) {
      generatedReminders.push({
        id: `rem_rain_irrig_${activity.id}`,
        userId: currentUserId,
        activityId: activity.id,
        cropId: activity.cropId,
        farmId: activity.farmId,
        title: `Water Saving Advisory: Heavy Rain Expected (${rainfallMm}mm)`,
        message: `Precipitation forecast (${rainfallMm}mm) will fulfill crop water requirements. Skip scheduled irrigation for ${cropName} to conserve pump energy and prevent root aeration stress.`,
        priority: 'MEDIUM',
        triggerDate: todayStr,
        ruleCode: 'RAIN_IRRIGATION_SKIP',
        isRead: false,
        createdAt: new Date().toISOString()
      });
    }
  });

  // 2. Evaluate Active Crops for Maturity & Life-Cycle Thresholds
  crops.forEach(crop => {
    if (crop.status !== 'ACTIVE') return;

    const { daysElapsed, totalDays, daysRemaining, progressPercent } = calculateCropProgress(
      crop.plantingDate,
      crop.expectedHarvestDate
    );

    // RULE 5: Crop Maturity Window Reached (>= 90% or daysRemaining <= 7)
    if (progressPercent >= 90 || daysRemaining <= 7) {
      generatedReminders.push({
        id: `rem_maturity_${crop.id}`,
        userId: currentUserId,
        cropId: crop.id,
        farmId: crop.farmId,
        title: `Harvest Maturity Window: ${crop.cropName}`,
        message: `${crop.cropName} is at ${progressPercent}% growth cycle (${daysRemaining} days until expected harvest). Scout grain/fruit hardness and prepare harvest machinery & storage.`,
        priority: 'HIGH',
        triggerDate: todayStr,
        ruleCode: 'HARVEST_MATURITY',
        isRead: false,
        createdAt: new Date().toISOString()
      });
    }
  });

  // RULE 6: Heat Stress Check
  if (weather.currentTemp >= 36) {
    generatedReminders.push({
      id: `rem_heat_stress`,
      userId: currentUserId,
      title: `High Temperature Alert (${weather.currentTemp}°C)`,
      message: `Extreme daytime heat detected. High evapotranspiration rate. Ensure early-morning watering and avoid mid-day foliar treatments to prevent leaf scorch.`,
      priority: 'MEDIUM',
      triggerDate: todayStr,
      ruleCode: 'HEAT_STRESS',
      isRead: false,
      createdAt: new Date().toISOString()
    });
  }

  return generatedReminders;
}
