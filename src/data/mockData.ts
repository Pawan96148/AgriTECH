import { Farm, Crop, Activity, Reminder, WeatherData, User, ExpenseItem, ProductListing, Order } from '../types';

export const JHARKHAND_DISTRICTS = [
  'Ranchi',
  'Jamshedpur (East Singhbhum)',
  'Dhanbad',
  'Bokaro',
  'Deoghar',
  'Hazaribagh',
  'Giridih',
  'Ramgarh',
  'Dumka',
  'Chaibasa (West Singhbhum)',
  'Palamu (Medininagar)',
  'Gumla',
  'Simdega',
  'Latehar',
  'Lohardaga',
  'Koderma',
  'Godda',
  'Sahebganj',
  'Pakur',
  'Jamtara',
  'Khunti',
  'Seraikela Kharsawan',
  'Garhwa',
  'Chatra'
];

export const INITIAL_USER: User = {
  id: 'usr_farmer_01',
  name: 'Rajesh Verma',
  email: 'rajesh.farmer@agropulse.io',
  phone: '+91 98765 43210',
  password: 'Password@123',
  role: 'FARM_OWNER',
  roleTitle: 'Lead Cultivator & Farm Owner',
  region: 'Ranchi, Jharkhand',
  preferredLanguage: 'English',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  avatarBg: 'bg-emerald-700',
  farmSizeAcre: 15.2,
  primaryCropInterest: 'Paddy (Rice), Tomato, Maize, Mustard',
  lastLoginAt: '2026-03-30 08:15 AM',
  isEmailVerified: true,
  createdAt: '2026-01-15'
};

export const DEFAULT_REGISTERED_ACCOUNTS: User[] = [
  INITIAL_USER,
  {
    id: 'usr_farmer_jharkhand',
    name: 'Ramesh Mahto',
    email: 'ramesh.farmer@jharkhandagro.in',
    phone: '+91 94311 55678',
    password: 'Password@123',
    role: 'FARM_OWNER',
    roleTitle: 'Jharkhand Organic Cultivator & Producer',
    region: 'Ranchi, Jharkhand',
    preferredLanguage: 'Hindi / English',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    avatarBg: 'bg-emerald-800',
    farmSizeAcre: 8.5,
    primaryCropInterest: 'Tomato, Cauliflower, Sweet Corn',
    lastLoginAt: '2026-03-30 09:00 AM',
    isEmailVerified: true,
    createdAt: '2026-01-20'
  },
  {
    id: 'usr_customer_jharkhand',
    name: 'Priya Sharma',
    email: 'priya.customer@gmail.com',
    phone: '+91 98351 22345',
    password: 'Password@123',
    role: 'CUSTOMER',
    roleTitle: 'Direct Agro Consumer & Buyer',
    region: 'Jamshedpur, Jharkhand',
    preferredLanguage: 'English',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    avatarBg: 'bg-lime-700',
    farmSizeAcre: 0,
    primaryCropInterest: 'Fresh Organic Vegetables & Fruits',
    lastLoginAt: '2026-03-30 09:30 AM',
    isEmailVerified: true,
    createdAt: '2026-02-10'
  },
  {
    id: 'usr_dealer_jharkhand',
    name: 'Birsa Krishi Kendra',
    email: 'contact@birsakrishi.jh',
    phone: '+91 94313 88990',
    password: 'Password@123',
    role: 'DEALER',
    roleTitle: 'Authorized Farm Inputs & Equipment Dealer',
    region: 'Bokaro Steel City, Jharkhand',
    preferredLanguage: 'Hindi / English',
    avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    avatarBg: 'bg-amber-800',
    farmSizeAcre: 0,
    primaryCropInterest: 'Certified Seeds, Organic Fertilizers, Drip Kits',
    lastLoginAt: '2026-03-29 02:15 PM',
    isEmailVerified: true,
    createdAt: '2026-02-05'
  },
  {
    id: 'usr_agronomist_02',
    name: 'Dr. Sunita Patel',
    email: 'sunita.patel@agritech.org',
    phone: '+91 98111 22334',
    password: 'Password@123',
    role: 'AGRONOMIST',
    roleTitle: 'Senior Agronomy & Plant Health Consultant',
    region: 'Hazaribagh, Jharkhand',
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
    region: 'Deoghar, Jharkhand',
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
    farmName: 'Ranchi Valley Plot A',
    location: 'Ranchi District, Jharkhand',
    latitude: 23.3441,
    longitude: 85.3096,
    area: 8.5,
    soilType: 'Red',
    irrigationType: 'Drip',
    notes: 'Primary fertile red loam parcel with solar-powered drip filtration system in Ranchi.',
    createdAt: getRelativeDate(-120)
  },
  {
    id: 'farm_02',
    userId: 'usr_farmer_01',
    farmName: 'Subarnarekha Organic Acres',
    location: 'Ormanjhi, Ranchi (Jharkhand)',
    latitude: 23.4833,
    longitude: 85.4833,
    area: 4.2,
    soilType: 'Loamy',
    irrigationType: 'Sprinkler',
    notes: 'Well-drained fertile alluvium loamy plot dedicated to horticulture and high-value vegetables near Subarnarekha basin.',
    createdAt: getRelativeDate(-90)
  },
  {
    id: 'farm_03',
    userId: 'usr_farmer_01',
    farmName: 'Chota Nagpur Terrace Plot',
    location: 'Hazaribagh Plateau, Jharkhand',
    latitude: 23.9925,
    longitude: 85.3637,
    area: 2.5,
    soilType: 'Red',
    irrigationType: 'Borewell',
    notes: 'Terraced slope with red loamy soil, good for pulses, maize, and drought-tolerant legumes.',
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
    cropName: 'Paddy / Rice (Sahbhagi Dhan)',
    variety: 'BAU Certified Drought-Tolerant',
    plantingDate: getRelativeDate(-50),
    expectedHarvestDate: getRelativeDate(70),
    stage: 'Vegetative',
    status: 'ACTIVE',
    estimatedYieldKg: 11000,
    healthScore: 95,
    notes: 'Tillering stage active. Drip fertigation and water level monitored regularly.',
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
  location: 'Ranchi District, Jharkhand',
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

export const INITIAL_PRODUCTS: ProductListing[] = [
  {
    id: 'prod_jh_01',
    farmerId: 'usr_farmer_jharkhand',
    farmerName: 'Ramesh Mahto',
    farmerPhone: '+91 94311 55678',
    cropName: 'Tomato (Hybrid Roma)',
    variety: 'Seminis Bella Rosa',
    category: 'Vegetable',
    imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
    availableQuantity: 450,
    unit: 'kg',
    pricePerUnit: 28,
    harvestDate: getRelativeDate(-1),
    expectedAvailabilityDate: getRelativeDate(0),
    location: 'Ranchi',
    farmName: 'Ormanjhi Organic Acres',
    description: 'Vine-ripened, naturally cultivated red hybrid tomatoes harvested at peak flavor. Free from synthetic growth stimulants. Perfect for fresh cooking and salads.',
    qualityGrade: 'Grade A (Premium)',
    stockStatus: 'IN_STOCK',
    rating: 4.9,
    reviewCount: 14,
    createdAt: getRelativeDate(-3)
  },
  {
    id: 'prod_jh_02',
    farmerId: 'usr_farmer_jharkhand',
    farmerName: 'Ramesh Mahto',
    farmerPhone: '+91 94311 55678',
    cropName: 'Sweet Corn (Golden Bantam)',
    variety: 'Pioneer Single Cross 3396',
    category: 'Grain & Cereal',
    imageUrl: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=600&auto=format&fit=crop&q=80',
    availableQuantity: 300,
    unit: 'kg',
    pricePerUnit: 35,
    harvestDate: getRelativeDate(-2),
    expectedAvailabilityDate: getRelativeDate(0),
    location: 'Ramgarh',
    farmName: 'Damodar Basin Agro Plot',
    description: 'Crisp, sweet, juicy kernels filled uniformly to tip. Harvested early morning to retain natural sucrose content.',
    qualityGrade: 'Grade A (Premium)',
    stockStatus: 'IN_STOCK',
    rating: 4.8,
    reviewCount: 9,
    createdAt: getRelativeDate(-4)
  },
  {
    id: 'prod_jh_03',
    farmerId: 'usr_farmer_01',
    farmerName: 'Rajesh Verma',
    farmerPhone: '+91 98765 43210',
    cropName: 'Snowball Cauliflower',
    variety: 'Pusa Snowball K-1',
    category: 'Vegetable',
    imageUrl: 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=600&auto=format&fit=crop&q=80',
    availableQuantity: 180,
    unit: 'kg',
    pricePerUnit: 32,
    harvestDate: getRelativeDate(-1),
    expectedAvailabilityDate: getRelativeDate(0),
    location: 'Ranchi',
    farmName: 'Kanke Valley Farm',
    description: 'Compact, immaculate white curds shielded from direct sun. 100% pesticide-free integrated pest management.',
    qualityGrade: 'Organic Certified',
    stockStatus: 'IN_STOCK',
    rating: 4.7,
    reviewCount: 8,
    createdAt: getRelativeDate(-2)
  },
  {
    id: 'prod_jh_04',
    farmerId: 'usr_farmer_jharkhand',
    farmerName: 'Ramesh Mahto',
    farmerPhone: '+91 94311 55678',
    cropName: 'Fresh Tender Green Peas',
    variety: 'Arkel Early Dwarf',
    category: 'Pulse',
    imageUrl: 'https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=600&auto=format&fit=crop&q=80',
    availableQuantity: 120,
    unit: 'kg',
    pricePerUnit: 48,
    harvestDate: getRelativeDate(0),
    expectedAvailabilityDate: getRelativeDate(1),
    location: 'Hazaribagh',
    farmName: 'Plateau Breeze Farm',
    description: 'Sweet, bright green pods hand-picked at dawn. Plump seeds with exceptional tenderness and natural sweetness.',
    qualityGrade: 'Grade A (Premium)',
    stockStatus: 'IN_STOCK',
    rating: 5.0,
    reviewCount: 6,
    createdAt: getRelativeDate(-1)
  },
  {
    id: 'prod_jh_05',
    farmerId: 'usr_farmer_01',
    farmerName: 'Rajesh Verma',
    farmerPhone: '+91 98765 43210',
    cropName: 'Deoghar Sweet Allahabad Guava',
    variety: 'Safeda Round Seedless',
    category: 'Fruit',
    imageUrl: 'https://images.unsplash.com/photo-1536511135899-73895e6382ca?w=600&auto=format&fit=crop&q=80',
    availableQuantity: 80,
    unit: 'kg',
    pricePerUnit: 55,
    harvestDate: getRelativeDate(-3),
    expectedAvailabilityDate: getRelativeDate(0),
    location: 'Deoghar',
    farmName: 'Baidyanath Orchards',
    description: 'Famous Deoghar white flesh guavas with rich aroma and high vitamin C. Organically fertilized with farm compost.',
    qualityGrade: 'Grade A (Premium)',
    stockStatus: 'LOW_STOCK',
    rating: 4.9,
    reviewCount: 12,
    createdAt: getRelativeDate(-5)
  },
  {
    id: 'prod_jh_06',
    farmerId: 'usr_farmer_jharkhand',
    farmerName: 'Ramesh Mahto',
    farmerPhone: '+91 94311 55678',
    cropName: 'Aromatic Sonachur Paddy (Rice)',
    variety: 'Indigenous Fragrant Grain',
    category: 'Grain & Cereal',
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80',
    availableQuantity: 850,
    unit: 'kg',
    pricePerUnit: 65,
    harvestDate: getRelativeDate(-20),
    expectedAvailabilityDate: getRelativeDate(0),
    location: 'Dumka',
    farmName: 'Santhal Heritage Paddy Fields',
    description: 'Fine-grained traditional aromatic rice grown with indigenous bio-manures. Excellent non-sticky texture and fragrant aroma.',
    qualityGrade: 'Organic Certified',
    stockStatus: 'IN_STOCK',
    rating: 4.8,
    reviewCount: 11,
    createdAt: getRelativeDate(-10)
  },
  {
    id: 'prod_jh_07',
    farmerId: 'usr_farmer_jharkhand',
    farmerName: 'Ramesh Mahto',
    farmerPhone: '+91 94311 55678',
    cropName: 'Farm Fresh Palak (Baby Spinach)',
    variety: 'All Green Broad Leaf',
    category: 'Vegetable',
    imageUrl: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&auto=format&fit=crop&q=80',
    availableQuantity: 60,
    unit: 'kg',
    pricePerUnit: 25,
    harvestDate: getRelativeDate(0),
    expectedAvailabilityDate: getRelativeDate(0),
    location: 'Bokaro',
    farmName: 'Bokaro Peri-Urban Greens',
    description: 'Crisp and tender hydroponic-style organic spinach. Washed with clean borewell water and eco-crate packed.',
    qualityGrade: 'Grade A (Premium)',
    stockStatus: 'IN_STOCK',
    rating: 4.6,
    reviewCount: 5,
    createdAt: getRelativeDate(-2)
  },
  {
    id: 'prod_jh_08',
    farmerId: 'usr_farmer_01',
    farmerName: 'Rajesh Verma',
    farmerPhone: '+91 98765 43210',
    cropName: 'Spicy Green & Red Chilli',
    variety: 'Jwala Pungent Hybrid',
    category: 'Spices',
    imageUrl: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=600&auto=format&fit=crop&q=80',
    availableQuantity: 40,
    unit: 'kg',
    pricePerUnit: 70,
    harvestDate: getRelativeDate(-1),
    expectedAvailabilityDate: getRelativeDate(0),
    location: 'Giridih',
    farmName: 'Parasnath Foothills Farm',
    description: 'Intensely fiery chillies with vibrant color and long shelf life. Excellent for spice blends and fresh curries.',
    qualityGrade: 'Grade A (Premium)',
    stockStatus: 'LOW_STOCK',
    rating: 4.7,
    reviewCount: 4,
    createdAt: getRelativeDate(-3)
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-JH-8891',
    customerId: 'usr_customer_jharkhand',
    customerName: 'Priya Sharma',
    customerPhone: '+91 98351 22345',
    deliveryAddress: {
      fullName: 'Priya Sharma',
      phone: '+91 98351 22345',
      street: 'Flat 4B, Hill View Residency, Circuit House Area',
      district: 'Jamshedpur (East Singhbhum)',
      state: 'Jharkhand',
      pincode: '831001',
      landmark: 'Near Jubilee Park Gate'
    },
    farmerId: 'usr_farmer_jharkhand',
    farmerName: 'Ramesh Mahto',
    farmerPhone: '+91 94311 55678',
    farmerLocation: 'Ranchi',
    items: [
      {
        productId: 'prod_jh_01',
        cropName: 'Tomato (Hybrid Roma)',
        variety: 'Seminis Bella Rosa',
        imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
        quantity: 5,
        unit: 'kg',
        pricePerUnit: 28,
        subtotal: 140,
        farmerId: 'usr_farmer_jharkhand',
        farmerName: 'Ramesh Mahto',
        farmerLocation: 'Ranchi'
      },
      {
        productId: 'prod_jh_02',
        cropName: 'Sweet Corn (Golden Bantam)',
        variety: 'Pioneer Single Cross 3396',
        imageUrl: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=600&auto=format&fit=crop&q=80',
        quantity: 3,
        unit: 'kg',
        pricePerUnit: 35,
        subtotal: 105,
        farmerId: 'usr_farmer_jharkhand',
        farmerName: 'Ramesh Mahto',
        farmerLocation: 'Ramgarh'
      }
    ],
    subtotal: 245,
    deliveryFee: 40,
    totalAmount: 285,
    paymentMethod: 'UPI',
    paymentStatus: 'PAID',
    paymentId: 'UPI-MOCK-JH-9921',
    deliveryStatus: 'DELIVERED',
    timeline: [
      {
        status: 'ORDER_PLACED',
        label: 'Order Placed',
        timestamp: `${getRelativeDate(-2)} 09:15 AM`,
        location: 'Jamshedpur (East Singhbhum)',
        note: 'Customer placed order via direct UPI checkout',
        completed: true
      },
      {
        status: 'FARMER_ACCEPTED',
        label: 'Farmer Accepted',
        timestamp: `${getRelativeDate(-2)} 10:30 AM`,
        location: 'Ormanjhi, Ranchi',
        note: 'Farmer Ramesh Mahto confirmed fresh morning harvest',
        completed: true
      },
      {
        status: 'PACKED',
        label: 'Packed at Farm',
        timestamp: `${getRelativeDate(-2)} 02:00 PM`,
        location: 'Ormanjhi, Ranchi',
        note: 'Inspected, weighed, and packed into eco-crates',
        completed: true
      },
      {
        status: 'PICKED_UP',
        label: 'Picked Up',
        timestamp: `${getRelativeDate(-2)} 04:30 PM`,
        location: 'Ranchi Dispatch Bay',
        note: 'AgriTech Fresh Courier picked up batch',
        completed: true
      },
      {
        status: 'IN_TRANSIT',
        label: 'In Transit',
        timestamp: `${getRelativeDate(-1)} 06:00 AM`,
        location: 'NH-33 Ranchi-Tata Corridor',
        note: 'Produce moving through regional cold transit',
        completed: true
      },
      {
        status: 'OUT_FOR_DELIVERY',
        label: 'Out for Delivery',
        timestamp: `${getRelativeDate(-1)} 11:30 AM`,
        location: 'Jamshedpur Hub',
        note: 'Courier vehicle out for doorstep delivery',
        completed: true
      },
      {
        status: 'DELIVERED',
        label: 'Delivered',
        timestamp: `${getRelativeDate(-1)} 02:45 PM`,
        location: 'Circuit House Area, Jamshedpur',
        note: 'Delivered fresh directly to Priya Sharma',
        completed: true
      }
    ],
    estimatedDeliveryDate: getRelativeDate(-1),
    createdAt: `${getRelativeDate(-2)} 09:15:00`,
    updatedAt: `${getRelativeDate(-1)} 02:45:00`,
    review: {
      id: 'rev_01',
      orderId: 'ORD-JH-8891',
      productId: 'prod_jh_01',
      customerId: 'usr_customer_jharkhand',
      customerName: 'Priya Sharma',
      rating: 5,
      reviewText: 'Incredible freshness! The tomatoes tasted sweet and farm-fresh, nothing like regular market stock. The corn was sweet and juicy. So proud to support Ramesh Ji directly in Ranchi!',
      productQuality: 'Excellent',
      deliveryExperience: 'Fast & Fresh',
      createdAt: `${getRelativeDate(-1)} 05:20 PM`,
      farmerReply: {
        text: 'Dhanyawad Priya Ji! Knowing our produce reached your family crisp and fresh makes all the early morning harvest worthwhile. Looking forward to serving you again!',
        repliedAt: `${getRelativeDate(0)} 08:30 AM`,
        farmerName: 'Ramesh Mahto'
      }
    }
  },
  {
    id: 'ORD-JH-8902',
    customerId: 'usr_customer_jharkhand',
    customerName: 'Priya Sharma',
    customerPhone: '+91 98351 22345',
    deliveryAddress: {
      fullName: 'Priya Sharma',
      phone: '+91 98351 22345',
      street: 'Flat 4B, Hill View Residency, Circuit House Area',
      district: 'Jamshedpur (East Singhbhum)',
      state: 'Jharkhand',
      pincode: '831001',
      landmark: 'Near Jubilee Park Gate'
    },
    farmerId: 'usr_farmer_jharkhand',
    farmerName: 'Ramesh Mahto',
    farmerPhone: '+91 94311 55678',
    farmerLocation: 'Hazaribagh',
    items: [
      {
        productId: 'prod_jh_04',
        cropName: 'Fresh Tender Green Peas',
        variety: 'Arkel Early Dwarf',
        imageUrl: 'https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=600&auto=format&fit=crop&q=80',
        quantity: 4,
        unit: 'kg',
        pricePerUnit: 48,
        subtotal: 192,
        farmerId: 'usr_farmer_jharkhand',
        farmerName: 'Ramesh Mahto',
        farmerLocation: 'Hazaribagh'
      },
      {
        productId: 'prod_jh_07',
        cropName: 'Farm Fresh Palak (Baby Spinach)',
        variety: 'All Green Broad Leaf',
        imageUrl: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&auto=format&fit=crop&q=80',
        quantity: 2,
        unit: 'kg',
        pricePerUnit: 25,
        subtotal: 50,
        farmerId: 'usr_farmer_jharkhand',
        farmerName: 'Ramesh Mahto',
        farmerLocation: 'Bokaro'
      }
    ],
    subtotal: 242,
    deliveryFee: 40,
    totalAmount: 282,
    paymentMethod: 'CARD',
    paymentStatus: 'PAID',
    paymentId: 'CARD-MOCK-JH-4402',
    deliveryStatus: 'IN_TRANSIT',
    timeline: [
      {
        status: 'ORDER_PLACED',
        label: 'Order Placed',
        timestamp: `${getRelativeDate(-1)} 08:30 AM`,
        location: 'Jamshedpur (East Singhbhum)',
        note: 'Customer order confirmed via Card payment',
        completed: true
      },
      {
        status: 'FARMER_ACCEPTED',
        label: 'Farmer Accepted',
        timestamp: `${getRelativeDate(-1)} 09:15 AM`,
        location: 'Hazaribagh Farm Hub',
        note: 'Produce allocated from morning harvest',
        completed: true
      },
      {
        status: 'PACKED',
        label: 'Packed at Farm',
        timestamp: `${getRelativeDate(-1)} 01:00 PM`,
        location: 'Hazaribagh Farm Hub',
        note: 'Inspected for Grade A quality & boxed',
        completed: true
      },
      {
        status: 'PICKED_UP',
        label: 'Picked Up',
        timestamp: `${getRelativeDate(-1)} 05:00 PM`,
        location: 'Hazaribagh Logistics Center',
        note: 'Consolidated into regional delivery vehicle',
        completed: true
      },
      {
        status: 'IN_TRANSIT',
        label: 'In Transit',
        timestamp: `${getRelativeDate(0)} 06:15 AM`,
        location: 'Ranchi Transit Distribution Center',
        note: 'Dispatched towards Jamshedpur East Singhbhum',
        completed: true
      },
      {
        status: 'OUT_FOR_DELIVERY',
        label: 'Out for Delivery',
        timestamp: 'Pending',
        location: 'Jamshedpur Delivery Station',
        note: 'Scheduled for local delivery run',
        completed: false
      },
      {
        status: 'DELIVERED',
        label: 'Delivered',
        timestamp: 'Pending',
        location: 'Circuit House Area, Jamshedpur',
        note: 'Direct recipient verification',
        completed: false
      }
    ],
    estimatedDeliveryDate: getRelativeDate(1),
    createdAt: `${getRelativeDate(-1)} 08:30:00`,
    updatedAt: `${getRelativeDate(0)} 06:15:00`
  },
  {
    id: 'ORD-JH-8915',
    customerId: 'usr_customer_jharkhand',
    customerName: 'Priya Sharma',
    customerPhone: '+91 98351 22345',
    deliveryAddress: {
      fullName: 'Priya Sharma',
      phone: '+91 98351 22345',
      street: 'Flat 4B, Hill View Residency, Circuit House Area',
      district: 'Jamshedpur (East Singhbhum)',
      state: 'Jharkhand',
      pincode: '831001',
      landmark: 'Near Jubilee Park Gate'
    },
    farmerId: 'usr_farmer_jharkhand',
    farmerName: 'Ramesh Mahto',
    farmerPhone: '+91 94311 55678',
    farmerLocation: 'Ranchi',
    items: [
      {
        productId: 'prod_jh_03',
        cropName: 'Snowball Cauliflower',
        variety: 'Pusa Snowball K-1',
        imageUrl: 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=600&auto=format&fit=crop&q=80',
        quantity: 3,
        unit: 'kg',
        pricePerUnit: 32,
        subtotal: 96,
        farmerId: 'usr_farmer_01',
        farmerName: 'Rajesh Verma',
        farmerLocation: 'Ranchi'
      }
    ],
    subtotal: 96,
    deliveryFee: 40,
    totalAmount: 136,
    paymentMethod: 'COD',
    paymentStatus: 'PENDING',
    deliveryStatus: 'FARMER_ACCEPTED',
    timeline: [
      {
        status: 'ORDER_PLACED',
        label: 'Order Placed',
        timestamp: `${getRelativeDate(0)} 07:45 AM`,
        location: 'Jamshedpur (East Singhbhum)',
        note: 'Customer placed order via Cash on Delivery (COD)',
        completed: true
      },
      {
        status: 'FARMER_ACCEPTED',
        label: 'Farmer Accepted',
        timestamp: `${getRelativeDate(0)} 08:30 AM`,
        location: 'Ranchi Farm Plot',
        note: 'Farmer accepted order; preparing harvest batch',
        completed: true
      },
      {
        status: 'PACKED',
        label: 'Packed at Farm',
        timestamp: 'Pending',
        location: 'Ranchi Farm Plot',
        note: 'Scheduled packaging',
        completed: false
      },
      {
        status: 'PICKED_UP',
        label: 'Picked Up',
        timestamp: 'Pending',
        location: 'Ranchi Dispatch Bay',
        note: 'Awaiting courier collection',
        completed: false
      },
      {
        status: 'IN_TRANSIT',
        label: 'In Transit',
        timestamp: 'Pending',
        location: 'Jharkhand AgriTech Logistics Route',
        note: 'Pending transit',
        completed: false
      },
      {
        status: 'OUT_FOR_DELIVERY',
        label: 'Out for Delivery',
        timestamp: 'Pending',
        location: 'Jamshedpur Hub',
        note: 'Pending final delivery run',
        completed: false
      },
      {
        status: 'DELIVERED',
        label: 'Delivered',
        timestamp: 'Pending',
        location: 'Jamshedpur Delivery Point',
        note: 'Pending handover',
        completed: false
      }
    ],
    estimatedDeliveryDate: getRelativeDate(2),
    createdAt: `${getRelativeDate(0)} 07:45:00`,
    updatedAt: `${getRelativeDate(0)} 08:30:00`
  }
];

