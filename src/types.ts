export type SoilType = 'Clay' | 'Sandy' | 'Loamy' | 'Silt' | 'Black' | 'Red';

export type CropStage = 'Sowing' | 'Vegetative' | 'Flowering' | 'Maturity' | 'Harvested';

export type CropStatus = 'ACTIVE' | 'COMPLETED' | 'ABANDONED';

export type ActivityType = 'IRRIGATION' | 'FERTILIZER' | 'PESTICIDE' | 'WEEDING' | 'HARVEST';

export type ActivityStatus = 'PENDING' | 'COMPLETED' | 'CANCELLED';

export type AlertPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type UserRole = 
  | 'FARM_OWNER' 
  | 'AGRONOMIST' 
  | 'FIELD_MANAGER' 
  | 'RESEARCHER' 
  | 'TENANT_FARMER';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
  role?: UserRole;
  roleTitle?: string;
  region: string;
  preferredLanguage: string;
  avatarUrl?: string;
  avatarBg?: string;
  farmSizeAcre?: number;
  primaryCropInterest?: string;
  lastLoginAt?: string;
  isEmailVerified?: boolean;
  createdAt: string;
}

export type AuthMode = 'LOGIN' | 'SIGNUP' | 'FORGOT_PASSWORD' | 'SWITCH_ACCOUNT';


export interface Farm {
  id: string;
  userId: string;
  farmName: string;
  location: string;
  latitude: number;
  longitude: number;
  area: number; // in Acres
  soilType: SoilType;
  irrigationType: 'Drip' | 'Sprinkler' | 'Canal / Flood' | 'Rainfed' | 'Borewell';
  notes?: string;
  createdAt: string;
}

export interface Crop {
  id: string;
  farmId: string;
  cropName: string;
  variety?: string;
  plantingDate: string; // YYYY-MM-DD
  expectedHarvestDate: string; // YYYY-MM-DD
  actualHarvestDate?: string;
  stage: CropStage;
  status: CropStatus;
  estimatedYieldKg?: number;
  actualYieldKg?: number;
  healthScore?: number; // 0 - 100
  notes?: string;
  createdAt: string;
}

export interface Activity {
  id: string;
  cropId: string;
  farmId: string;
  activityType: ActivityType;
  title: string;
  scheduledDate: string; // YYYY-MM-DD
  completedDate?: string | null;
  status: ActivityStatus;
  notes?: string;
  priority?: AlertPriority;
  dosageOrVolume?: string; // e.g. "50 kg/acre Urea" or "2000L drip"
  cost?: number; // in currency units
  createdAt: string;
}

export interface Reminder {
  id: string;
  userId: string;
  activityId?: string;
  cropId?: string;
  farmId?: string;
  title: string;
  message: string;
  priority: AlertPriority;
  triggerDate: string;
  ruleCode: 'DUE_TODAY' | 'OVERDUE' | 'RAIN_SPRAY_CONFLICT' | 'RAIN_IRRIGATION_SKIP' | 'HARVEST_MATURITY' | 'HEAT_STRESS' | 'GENERAL';
  isRead: boolean;
  createdAt: string;
}

export interface HourlyWeather {
  time: string;
  temp: number;
  rainProb: number;
  condition: string;
  icon: string;
}

export interface DailyForecast {
  date: string;
  dayName: string;
  tempMax: number;
  tempMin: number;
  humidity: number;
  rainProbability: number;
  rainfallMm: number;
  windSpeedKmH: number;
  uvIndex: number;
  condition: 'Sunny' | 'Partly Cloudy' | 'Overcast' | 'Light Rain' | 'Heavy Thunderstorm' | 'Windy';
  icon: string;
  advisoryText?: string;
}

export interface WeatherData {
  location: string;
  currentTemp: number;
  feelsLike: number;
  humidity: number;
  rainProbability: number;
  rainfall24hMm: number;
  windSpeedKmH: number;
  windDirection: string;
  uvIndex: number;
  soilMoisturePercent: number;
  condition: string;
  spraySuitability: 'OPTIMAL' | 'CAUTION' | 'UNSUITABLE';
  irrigationRecommendation: 'PROCEED' | 'REDUCE' | 'SKIP_RAIN_PREDICTED';
  hourly: HourlyWeather[];
  forecast: DailyForecast[];
  lastUpdated: string;
}

export interface CropPresetKnowledge {
  id: string;
  name: string;
  scientificName: string;
  category: 'Cereal' | 'Vegetable' | 'Pulse' | 'Cash Crop' | 'Fruit';
  idealSoil: SoilType[];
  durationDays: number;
  sowingMonths: string;
  waterDemand: 'Low' | 'Moderate' | 'High';
  idealTempRange: string;
  keyStages: {
    stage: CropStage;
    dayOffset: number;
    description: string;
    recommendedActivities: string[];
  }[];
  fertilizerPlan: string;
  pestRisks: string[];
  harvestingSigns: string;
  averageYieldPerAcre: string;
  description: string;
}

export interface SeedPacketData {
  qrCode: string;
  lotNumber: string;
  brand: string;
  variety: string;
  cropName: string;
  category: 'Cereal' | 'Vegetable' | 'Pulse' | 'Cash Crop' | 'Fruit';
  knowledgeBaseId: string;
  germinationRate: number; // e.g. 96 (%)
  physicalPurity: number; // e.g. 98 (%)
  geneticPurity: number; // e.g. 99 (%)
  moisturePercent: number; // e.g. 10.5 (%)
  seedTreatment: string;
  recommendedSeedRateKgPerAcre: number;
  idealSowingDepthCm: string;
  recommendedSpacing: string;
  packingDate: string;
  expiryDate: string;
  certificationAgency: string;
  certifiedTagColor: string;
  lifecycleOverview: string;
  stageGuide: {
    stage: CropStage;
    dayRange: string;
    advice: string;
    criticalTask: string;
  }[];
  preHarvestIntervalDays: number;
}

export interface MaintenanceLog {
  id: string;
  date: string;
  title: string;
  serviceType: 'Routine Service' | 'Part Replacement' | 'Calibration' | 'Emergency Repair' | 'Pre-Season Overhaul';
  technician: string;
  costInr: number;
  details: string;
}

export interface EquipmentData {
  qrCode: string;
  assetTag: string;
  name: string;
  model: string;
  category: 'Tractor & Tillage' | 'Sprayers & Protection' | 'Irrigation & Pumps' | 'Harvesting & Threshing' | 'Sensors & Testing';
  serialNumber: string;
  purchaseYear: number;
  operatingHours: number;
  acreageServiced: number;
  status: 'Optimal' | 'Due for Service' | 'Inspection Required' | 'Critical Maintenance';
  lastServiceDate: string;
  nextServiceDue: string;
  oilAndFilterStatus: string;
  batteryOrPressureStatus: string;
  maintenanceHistory: MaintenanceLog[];
  preOperationChecklist: string[];
  safetyNotes: string;
  linkedPlotOrCrop?: string;
}

export type ScannedQRResult = 
  | { type: 'SEED'; data: SeedPacketData }
  | { type: 'EQUIPMENT'; data: EquipmentData }
  | { type: 'FARM_CROP'; data: Crop }
  | { type: 'RAW_DATA'; text: string };

export interface ExpenseItem {
  id: string;
  farmId: string;
  cropId?: string;
  category: 'Seeds' | 'Fertilizer' | 'Pesticides' | 'Labor' | 'Machinery / Fuel' | 'Irrigation' | 'Other';
  description: string;
  amount: number;
  date: string;
  createdAt: string;
}

export type ActiveTab = 
  | 'landing' 
  | 'dashboard' 
  | 'farms' 
  | 'crops' 
  | 'activities' 
  | 'weather' 
  | 'reminders' 
  | 'knowledge' 
  | 'expenses' 
  | 'profile';
