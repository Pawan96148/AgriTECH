import { Farm, Crop, Activity, Reminder, WeatherData, User, ExpenseItem } from '../types';

export const INITIAL_USER: User = {
  id: 'usr_farmer_01',
  name: 'Rajesh Verma',
  email: 'rajesh.farmer@agropulse.io',
  phone: '+91 98765 43210',
  password: 'Password@123',
  role: 'FARM_OWNER',
  roleTitle: 'Lead Cultivator & Farm Owner',
  region: 'Indore, Madhya Pradesh / Northern Plains',
  preferredLanguage: 'English',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  avatarBg: 'bg-emerald-700',
  farmSizeAcre: 15.2,
  primaryCropInterest: 'Soybean, Cotton, Wheat',
  lastLoginAt: '2026-03-30 08:15 AM',
  isEmailVerified: true,
  createdAt: '2026-01-15'
};

export const DEFAULT_REGISTERED_ACCOUNTS: User[] = [
  INITIAL_USER,
  {
    id: 'usr_agronomist_02',
    name: 'Dr. Sunita Patel',
    email: 'sunita.patel@agritech.org',
    phone: '+91 98111 22334',
    password: 'Password@123',
    role: 'AGRONOMIST',
    roleTitle: 'Senior Agronomy & Plant Health Consultant',
    region: 'Pune, Maharashtra / Western Ghats',
    preferredLanguage: 'English',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    avatarBg: 'bg-teal-700',
    farmSizeAcre: 45.0,
    primaryCropInterest: 'Tomato, Grapes, Sugarcane',
    lastLoginAt: '2026-03-29 04:30 PM',
    isEmailVerified: true,
    createdAt: '2026-02-01'
  },
  {
    id: 'usr_manager_03',
    name: 'Aarav Deshmukh',
    email: 'aarav.vineyards@agripulse.io',
    phone: '+91 97654 11223',
    password: 'Password@123',
    role: 'FIELD_MANAGER',
    roleTitle: 'Organic Horticulture Operations Manager',
    region: 'Nashik, Maharashtra / Deccan Plateau',
    preferredLanguage: 'English',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    avatarBg: 'bg-amber-700',
    farmSizeAcre: 22.5,
    primaryCropInterest: 'Maize, Groundnut, Mustard',
    lastLoginAt: '2026-03-28 11:45 AM',
    isEmailVerified: true,
    createdAt: '2026-02-14'
  }
];


const getRelativeDate = (offsetDays: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

export const INITIAL_FARMS: Farm[] = [
  {
    id: 'farm_01',
    userId: 'usr_farmer_01',
    farmName: 'Green Valley Plot A',
    location: 'Indore North Sector (M.P.)',
    latitude: 22.7196,
    longitude: 75.8577,
    area: 8.5,
    soilType: 'Black',
    irrigationType: 'Drip',
    notes: 'Primary deep black cotton soil parcel with solar-powered drip filtration system.',
    createdAt: getRelativeDate(-120)
  },
  {
    id: 'farm_02',
    userId: 'usr_farmer_01',
    farmName: 'Riverside Organic Acres',
    location: 'Narmada Basin Sub-district',
    latitude: 22.1852,
    longitude: 75.9873,
    area: 4.2,
    soilType: 'Loamy',
    irrigationType: 'Sprinkler',
    notes: 'Well-drained fertile alluvium loamy plot dedicated to horticulture and high-value vegetables.',
    createdAt: getRelativeDate(-90)
  },
  {
    id: 'farm_03',
    userId: 'usr_farmer_01',
    farmName: 'Highland Terrace Plot',
    location: 'Malwa Plateau Hilltop',
    latitude: 22.8421,
    longitude: 76.0125,
    area: 2.5,
    soilType: 'Red',
    irrigationType: 'Borewell',
    notes: 'Terraced slope with red loamy soil, good for pulses and drought-tolerant legumes.',
    createdAt: getRelativeDate(-60)
  }
];

export const INITIAL_CROPS: Crop[] = [
  {
    id: 'crop_01',
    farmId: 'farm_01',
    cropName: 'Soybean (JS 335)',
    variety: 'Certified Breeder Seed',
    plantingDate: getRelativeDate(-75),
    expectedHarvestDate: getRelativeDate(20),
    stage: 'Flowering',
    status: 'ACTIVE',
    estimatedYieldKg: 9500,
    healthScore: 92,
    notes: 'Excellent nodulation. Canopy coverage 90%. Monitoring for girdle beetle.',
    createdAt: getRelativeDate(-75)
  },
  {
    id: 'crop_02',
    farmId: 'farm_02',
    cropName: 'Tomato (Hybrid Roma)',
    variety: 'Seminis Bella Rosa',
    plantingDate: getRelativeDate(-80),
    expectedHarvestDate: getRelativeDate(15),
    stage: 'Maturity',
    status: 'ACTIVE',
    estimatedYieldKg: 42000,
    healthScore: 88,
    notes: 'Breaker stage fruit visible on bottom clusters. Staking in place.',
    createdAt: getRelativeDate(-80)
  },
  {
    id: 'crop_03',
    farmId: 'farm_01',
    cropName: 'Cotton (Bt Hybrid RCH-2)',
    variety: 'Long Staple Bollgard II',
    plantingDate: getRelativeDate(-50),
    expectedHarvestDate: getRelativeDate(110),
    stage: 'Vegetative',
    status: 'ACTIVE',
    estimatedYieldKg: 11000,
    healthScore: 95,
    notes: 'Square formation started. Drip fertigation scheduled weekly.',
    createdAt: getRelativeDate(-50)
  },
  {
    id: 'crop_04',
    farmId: 'farm_03',
    cropName: 'Maize / Sweet Corn (Pioneer 3396)',
    variety: 'High Yield Single Cross',
    plantingDate: getRelativeDate(-98),
    expectedHarvestDate: getRelativeDate(7),
    stage: 'Maturity',
    status: 'ACTIVE',
    estimatedYieldKg: 6800,
    healthScore: 90,
    notes: 'Cobs well-filled to the tip. Silk turned dark brown.',
    createdAt: getRelativeDate(-98)
  },
  {
    id: 'crop_05',
    farmId: 'farm_02',
    cropName: 'Wheat (HD 2967)',
    variety: 'Certified Gold Standard',
    plantingDate: getRelativeDate(-160),
    expectedHarvestDate: getRelativeDate(-35),
    actualHarvestDate: getRelativeDate(-32),
    stage: 'Harvested',
    status: 'COMPLETED',
    estimatedYieldKg: 18500,
    actualYieldKg: 19200,
    healthScore: 96,
    notes: 'Successfully harvested with combine thresher at 12.8% moisture.',
    createdAt: getRelativeDate(-160)
  }
];

export const INITIAL_ACTIVITIES: Activity[] = [
  {
    id: 'act_01',
    cropId: 'crop_01',
    farmId: 'farm_01',
    activityType: 'PESTICIDE',
    title: 'Preventive Spray for Spodoptera & Girdle Beetle',
    scheduledDate: getRelativeDate(0), // Today
    status: 'PENDING',
    priority: 'HIGH',
    dosageOrVolume: 'Emamectin Benzoate 5% SG @ 80g/acre',
    notes: 'Ensure complete foliar coverage before peak sun.',
    cost: 1400,
    createdAt: getRelativeDate(-4)
  },
  {
    id: 'act_02',
    cropId: 'crop_02',
    farmId: 'farm_02',
    activityType: 'FERTILIZER',
    title: 'Potassium Nitrate 13:0:45 Fertigation',
    scheduledDate: getRelativeDate(0), // Today
    status: 'PENDING',
    priority: 'MEDIUM',
    dosageOrVolume: '5 kg/acre via Venturi drip injector',
    notes: 'Enhances fruit size and sugar content during color break.',
    cost: 850,
    createdAt: getRelativeDate(-3)
  },
  {
    id: 'act_03',
    cropId: 'crop_03',
    farmId: 'farm_01',
    activityType: 'WEEDING',
    title: 'Interculture Mechanical Hoeing & Weeding',
    scheduledDate: getRelativeDate(-1), // Overdue by 1 day
    status: 'PENDING',
    priority: 'HIGH',
    dosageOrVolume: 'Manual field laborer crew (4 workers)',
    notes: 'Remove weed competition before second split of Nitrogen.',
    cost: 1800,
    createdAt: getRelativeDate(-6)
  },
  {
    id: 'act_04',
    cropId: 'crop_04',
    farmId: 'farm_03',
    activityType: 'IRRIGATION',
    title: 'Supplemental Furrow Irrigation (Grain Fill)',
    scheduledDate: getRelativeDate(1), // Tomorrow
    status: 'PENDING',
    priority: 'MEDIUM',
    dosageOrVolume: 'Borewell pump run for 3.5 hours',
    notes: 'Critical moisture to ensure full kernel swelling.',
    cost: 300,
    createdAt: getRelativeDate(-2)
  },
  {
    id: 'act_05',
    cropId: 'crop_02',
    farmId: 'farm_02',
    activityType: 'HARVEST',
    title: 'First Stage Tomato Picking (Breaker Red)',
    scheduledDate: getRelativeDate(4),
    status: 'PENDING',
    priority: 'HIGH',
    dosageOrVolume: 'Crate harvesting (target 1,500 kg)',
    notes: 'Harvest into sanitized 20kg plastic crates in morning.',
    cost: 2500,
    createdAt: getRelativeDate(-2)
  },
  {
    id: 'act_06',
    cropId: 'crop_01',
    farmId: 'farm_01',
    activityType: 'IRRIGATION',
    title: 'Scheduled Drip Zone 2 Cycle',
    scheduledDate: getRelativeDate(-4),
    completedDate: getRelativeDate(-4),
    status: 'COMPLETED',
    priority: 'LOW',
    dosageOrVolume: '18,000 Liters via lateral drip lines',
    notes: 'Completed smoothly with 1.2 bar line pressure.',
    cost: 200,
    createdAt: getRelativeDate(-7)
  },
  {
    id: 'act_07',
    cropId: 'crop_03',
    farmId: 'farm_01',
    activityType: 'FERTILIZER',
    title: 'Basal Phosphate & Zinc Placement',
    scheduledDate: getRelativeDate(-45),
    completedDate: getRelativeDate(-45),
    status: 'COMPLETED',
    priority: 'MEDIUM',
    dosageOrVolume: 'NPK 12:32:16 (50kg) + ZnSO4 (10kg)',
    notes: 'Drilled 5cm below seed furrow.',
    cost: 3200,
    createdAt: getRelativeDate(-50)
  }
];

export const INITIAL_EXPENSES: ExpenseItem[] = [
  {
    id: 'exp_01',
    farmId: 'farm_01',
    cropId: 'crop_01',
    category: 'Seeds',
    description: 'Certified Soybean JS 335 seed bags (80 kg)',
    amount: 6400,
    date: getRelativeDate(-75),
    createdAt: getRelativeDate(-75)
  },
  {
    id: 'exp_02',
    farmId: 'farm_01',
    cropId: 'crop_01',
    category: 'Fertilizer',
    description: 'Single Super Phosphate (SSP) + Potash basal',
    amount: 4800,
    date: getRelativeDate(-70),
    createdAt: getRelativeDate(-70)
  },
  {
    id: 'exp_03',
    farmId: 'farm_02',
    cropId: 'crop_02',
    category: 'Seeds',
    description: 'Hybrid Tomato Bella Rosa seedling plugs (6,000 seedlings)',
    amount: 9000,
    date: getRelativeDate(-80),
    createdAt: getRelativeDate(-80)
  },
  {
    id: 'exp_04',
    farmId: 'farm_02',
    cropId: 'crop_02',
    category: 'Machinery / Fuel',
    description: 'Drip line installation, filtration servicing & tractor bed preparation',
    amount: 5500,
    date: getRelativeDate(-82),
    createdAt: getRelativeDate(-82)
  },
  {
    id: 'exp_05',
    farmId: 'farm_03',
    cropId: 'crop_04',
    category: 'Labor',
    description: 'Interculture weeding and earthing up labor (2 shifts)',
    amount: 3200,
    date: getRelativeDate(-40),
    createdAt: getRelativeDate(-40)
  }
];

export const INITIAL_WEATHER: WeatherData = {
  location: 'Indore North Sector (M.P.)',
  currentTemp: 29,
  feelsLike: 31,
  humidity: 68,
  rainProbability: 72, // Simulates incoming rain to trigger weather conflicts!
  rainfall24hMm: 16.5,
  windSpeedKmH: 14,
  windDirection: 'SW 220°',
  uvIndex: 7,
  soilMoisturePercent: 64,
  condition: 'Scattered Rain Showers',
  spraySuitability: 'UNSUITABLE',
  irrigationRecommendation: 'SKIP_RAIN_PREDICTED',
  hourly: [
    { time: '06:00', temp: 24, rainProb: 20, condition: 'Partly Cloudy', icon: 'CloudSun' },
    { time: '09:00', temp: 27, rainProb: 40, condition: 'Cloudy', icon: 'Cloud' },
    { time: '12:00', temp: 31, rainProb: 65, condition: 'Rain Shower', icon: 'CloudRain' },
    { time: '15:00', temp: 29, rainProb: 75, condition: 'Heavy Showers', icon: 'CloudLightning' },
    { time: '18:00', temp: 27, rainProb: 60, condition: 'Rain Shower', icon: 'CloudRain' },
    { time: '21:00', temp: 25, rainProb: 35, condition: 'Overcast', icon: 'Cloud' }
  ],
  forecast: [
    {
      date: getRelativeDate(0),
      dayName: 'Today',
      tempMax: 31,
      tempMin: 23,
      humidity: 75,
      rainProbability: 72,
      rainfallMm: 18.0,
      windSpeedKmH: 16,
      uvIndex: 6,
      condition: 'Heavy Thunderstorm',
      icon: 'CloudLightning',
      advisoryText: 'Postpone chemical spraying. Heavy rain likely to wash away active ingredients.'
    },
    {
      date: getRelativeDate(1),
      dayName: 'Tomorrow',
      tempMax: 30,
      tempMin: 22,
      humidity: 78,
      rainProbability: 60,
      rainfallMm: 12.5,
      windSpeedKmH: 14,
      uvIndex: 7,
      condition: 'Light Rain',
      icon: 'CloudRain',
      advisoryText: 'High soil moisture. Skip scheduled supplemental irrigation.'
    },
    {
      date: getRelativeDate(2),
      dayName: 'Wed',
      tempMax: 32,
      tempMin: 23,
      humidity: 62,
      rainProbability: 25,
      rainfallMm: 2.0,
      windSpeedKmH: 11,
      uvIndex: 8,
      condition: 'Partly Cloudy',
      icon: 'CloudSun',
      advisoryText: 'Weather clears. Favorable window for fertilizer top-dressing.'
    },
    {
      date: getRelativeDate(3),
      dayName: 'Thu',
      tempMax: 33,
      tempMin: 24,
      humidity: 55,
      rainProbability: 10,
      rainfallMm: 0.0,
      windSpeedKmH: 10,
      uvIndex: 9,
      condition: 'Sunny',
      icon: 'Sun',
      advisoryText: 'Optimal clear morning window for field spraying and weeding.'
    },
    {
      date: getRelativeDate(4),
      dayName: 'Fri',
      tempMax: 34,
      tempMin: 24,
      humidity: 50,
      rainProbability: 5,
      rainfallMm: 0.0,
      windSpeedKmH: 12,
      uvIndex: 9,
      condition: 'Sunny',
      icon: 'Sun',
      advisoryText: 'Dry warm condition. Perfect for harvesting and crate dispatch.'
    }
  ],
  lastUpdated: 'Just now (Cached 12m ago)'
};
