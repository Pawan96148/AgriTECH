const path = require('path');
const mongoose = require('mongoose');

// Load environment variables
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

const User = require('./models/User');
const Farm = require('./models/Farm');
const Product = require('./models/Product');
const Order = require('./models/Order');

const mongoURL = (process.env.MONGODB_URL_LOCAL || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/AgriTech').trim();

const SEED_USERS = [
  {
    id: 'usr_farmer_01',
    name: 'Rajesh Verma',
    email: 'rajesh.farmer@jharkhandagro.in',
    phone: '+91 98765 43210',
    password: 'Password@123',
    role: 'FARM_OWNER',
    roleTitle: 'Senior Cultivator & Farm Manager',
    region: 'Ormanjhi, Ranchi (Jharkhand)',
    farmSizeAcre: 15.2,
    primaryCropInterest: 'Paddy (Rice), Tomato, Maize, Mustard',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    avatarBg: 'bg-emerald-700',
    createdAt: '2026-01-15'
  },
  {
    id: 'usr_farmer_jharkhand',
    name: 'Ramesh Mahto',
    email: 'ramesh.farmer@jharkhandagro.in',
    phone: '+91 94311 55678',
    password: 'Password@123',
    role: 'FARM_OWNER',
    roleTitle: 'Jharkhand Organic Cultivator & Producer',
    region: 'Ranchi, Jharkhand',
    farmSizeAcre: 8.5,
    primaryCropInterest: 'Tomato, Cauliflower, Sweet Corn',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    avatarBg: 'bg-emerald-800',
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
    farmSizeAcre: 0,
    primaryCropInterest: 'Fresh Organic Vegetables & Fruits',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    avatarBg: 'bg-lime-700',
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
    farmSizeAcre: 0,
    primaryCropInterest: 'Certified Seeds, Organic Fertilizers, Drip Kits',
    avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    avatarBg: 'bg-amber-800',
    createdAt: '2026-02-05'
  },
  {
    id: 'usr_delivery_01',
    name: 'Prince Chadda',
    email: 'prince.delivery@agritech.in',
    phone: '+91 94314 77889',
    password: 'Password@123',
    role: 'DELIVERY_PARTNER',
    roleTitle: 'Verified Jharkhand Delivery Partner',
    region: 'Ranchi, Jharkhand',
    farmSizeAcre: 0,
    primaryCropInterest: 'Cold-chain agri logistics & timely deliveries',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    avatarBg: 'bg-emerald-600',
    createdAt: '2026-02-15'
  }
];

const SEED_FARMS = [
  {
    id: 'farm_01',
    ownerId: 'usr_farmer_01',
    farmName: 'Ranchi Valley Plot A',
    location: 'Ormanjhi, Ranchi (Jharkhand)',
    area: 8.5,
    areaUnit: 'Acre',
    soilType: 'Loamy',
    irrigationType: 'Drip',
    latitude: '23.4833',
    longitude: '85.4833',
    farmNotes: 'Primary drip-fertigated parcel with soil sensors and drainage tiles.'
  },
  {
    id: 'farm_02',
    ownerId: 'usr_farmer_01',
    farmName: 'Riverside Organic Acres',
    location: 'Riverside Plot, Jamshedpur (East Singhbhum)',
    area: 4.2,
    areaUnit: 'Acre',
    soilType: 'Loamy',
    irrigationType: 'Sprinkler',
    latitude: '22.8046',
    longitude: '86.2029',
    farmNotes: 'Well-drained fertile alluvium loamy plot along Subarnarekha River dedicated to vegetables.'
  },
  {
    id: 'farm_03',
    ownerId: 'usr_farmer_01',
    farmName: 'Chota Nagpur Terrace Plot',
    location: 'Hazaribagh Plateau, Jharkhand',
    area: 2.5,
    areaUnit: 'Acre',
    soilType: 'Red / Laterite',
    irrigationType: 'Borewell',
    latitude: '23.9925',
    longitude: '85.3637',
    farmNotes: 'Terraced slope with red loamy soil, good for pulses, maize, and drought-tolerant legumes.'
  },
  {
    id: 'farm_04',
    ownerId: 'usr_farmer_01',
    farmName: 'Dhanbad Coal-Belt Agro Valley',
    location: 'Govindpur, Dhanbad (Jharkhand)',
    area: 3.8,
    areaUnit: 'Acre',
    soilType: 'Loamy',
    irrigationType: 'Borewell',
    latitude: '23.8343',
    longitude: '86.5244',
    farmNotes: 'High-yield vegetable and mustard production parcel in Dhanbad district.'
  },
  {
    id: 'farm_05',
    ownerId: 'usr_farmer_jharkhand',
    farmName: 'Ormanjhi Organic Acres (Plot A)',
    location: 'Ormanjhi, Ranchi (Jharkhand)',
    area: 5.5,
    areaUnit: 'Acre',
    soilType: 'Loamy',
    irrigationType: 'Drip',
    latitude: '23.4832',
    longitude: '85.4851',
    farmNotes: 'Primary drip-fertigated organic vegetable block with soil sensors and drainage tiles.'
  },
  {
    id: 'farm_06',
    ownerId: 'usr_farmer_jharkhand',
    farmName: 'Subarnarekha River Basin (Plot B)',
    location: 'Namkum, Ranchi (Jharkhand)',
    area: 3.0,
    areaUnit: 'Acre',
    soilType: 'Red / Laterite',
    irrigationType: 'Sprinkler',
    latitude: '23.3850',
    longitude: '85.3620',
    farmNotes: 'Alluvial terrace plot optimal for sweet corn, legumes, and pulses.'
  }
];

const SEED_PRODUCTS = [
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
    minimumOrderQuantity: 5,
    unit: 'kg',
    pricePerUnit: 28,
    harvestDate: '2026-03-28',
    expectedAvailabilityDate: '2026-03-29',
    location: 'Ranchi',
    farmName: 'Ormanjhi Organic Acres',
    description: 'Vine-ripened, naturally cultivated red hybrid tomatoes harvested at peak flavor. Free from synthetic growth stimulants.',
    qualityGrade: 'Grade A (Premium)',
    stockStatus: 'IN_STOCK'
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
    minimumOrderQuantity: 5,
    unit: 'kg',
    pricePerUnit: 35,
    harvestDate: '2026-03-29',
    expectedAvailabilityDate: '2026-03-30',
    location: 'Ramgarh',
    farmName: 'Damodar Basin Agro Plot',
    description: 'Crisp, sweet, juicy kernels filled uniformly to tip. Harvested early morning to retain natural sucrose content.',
    qualityGrade: 'Grade A (Premium)',
    stockStatus: 'IN_STOCK'
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
    minimumOrderQuantity: 5,
    unit: 'kg',
    pricePerUnit: 32,
    harvestDate: '2026-03-27',
    expectedAvailabilityDate: '2026-03-28',
    location: 'Ranchi',
    farmName: 'Kanke Valley Farm',
    description: 'Compact, immaculate white curds shielded from direct sun. 100% pesticide-free integrated pest management.',
    qualityGrade: 'Organic Certified',
    stockStatus: 'IN_STOCK'
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
    minimumOrderQuantity: 5,
    unit: 'kg',
    pricePerUnit: 48,
    harvestDate: '2026-03-29',
    expectedAvailabilityDate: '2026-03-30',
    location: 'Hazaribagh',
    farmName: 'Plateau Breeze Farm',
    description: 'Sweet, bright green pods hand-picked at dawn. Plump seeds with exceptional tenderness and natural sweetness.',
    qualityGrade: 'Grade A (Premium)',
    stockStatus: 'IN_STOCK'
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
    minimumOrderQuantity: 5,
    unit: 'kg',
    pricePerUnit: 55,
    harvestDate: '2026-03-26',
    expectedAvailabilityDate: '2026-03-28',
    location: 'Deoghar',
    farmName: 'Baidyanath Orchards',
    description: 'Famous Deoghar white flesh guavas with rich aroma and high vitamin C. Organically fertilized with farm compost.',
    qualityGrade: 'Grade A (Premium)',
    stockStatus: 'LOW_STOCK'
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
    minimumOrderQuantity: 5,
    unit: 'kg',
    pricePerUnit: 65,
    harvestDate: '2026-03-10',
    expectedAvailabilityDate: '2026-03-15',
    location: 'Dumka',
    farmName: 'Santhal Heritage Paddy Fields',
    description: 'Fine-grained traditional aromatic rice grown with indigenous bio-manures. Excellent non-sticky texture and fragrant aroma.',
    qualityGrade: 'Organic Certified',
    stockStatus: 'IN_STOCK'
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
    minimumOrderQuantity: 5,
    unit: 'kg',
    pricePerUnit: 25,
    harvestDate: '2026-03-29',
    expectedAvailabilityDate: '2026-03-29',
    location: 'Bokaro',
    farmName: 'Bokaro Peri-Urban Greens',
    description: 'Crisp and tender hydroponic-style organic spinach. Washed with clean borewell water and eco-crate packed.',
    qualityGrade: 'Grade A (Premium)',
    stockStatus: 'IN_STOCK'
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
    minimumOrderQuantity: 5,
    unit: 'kg',
    pricePerUnit: 70,
    harvestDate: '2026-03-28',
    expectedAvailabilityDate: '2026-03-29',
    location: 'Giridih',
    farmName: 'Parasnath Foothills Farm',
    description: 'Intensely fiery chillies with vibrant color and long shelf life. Excellent for spice blends and fresh curries.',
    qualityGrade: 'Grade A (Premium)',
    stockStatus: 'LOW_STOCK'
  }
];

const SEED_ORDERS = [
  {
    id: 'ORD-JH-1001',
    customerId: 'usr_customer_jharkhand',
    customerName: 'Priya Sharma',
    customerPhone: '+91 98351 22345',
    deliveryAddress: {
      fullName: 'Priya Sharma',
      phone: '+91 98351 22345',
      street: 'Line Tank Road, Circular Area',
      villageArea: 'Circular Area',
      city: 'Ranchi',
      district: 'Ranchi',
      state: 'Jharkhand',
      pincode: '834001',
      landmark: 'Near Albert Ekka Chowk'
    },
    farmerId: 'usr_farmer_jharkhand',
    farmerName: 'Ramesh Mahto',
    farmerPhone: '+91 94311 55678',
    farmerLocation: 'Ranchi',
    deliveryBoyId: 'usr_delivery_01',
    deliveryBoyName: 'Prince Chadda',
    deliveryBoyPhone: '+91 94314 77889',
    assignedAt: '2026-03-29 11:45 AM',
    currentLocation: {
      latitude: 23.3752,
      longitude: 85.3340,
      updatedAt: '2026-03-29 02:45 PM',
      isSharing: true
    },
    locationHistory: [
      { latitude: 23.4832, longitude: 85.4851, timestamp: '2026-03-29 01:00 PM', status: 'PICKED_UP' },
      { latitude: 23.4210, longitude: 85.4020, timestamp: '2026-03-29 01:45 PM', status: 'IN_TRANSIT' },
      { latitude: 23.3752, longitude: 85.3340, timestamp: '2026-03-29 02:45 PM', status: 'IN_TRANSIT' }
    ],
    items: [
      {
        productId: 'prod_jh_01',
        cropName: 'Organic Hybrid Tomato',
        variety: 'Roma Desi Hybrid',
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
        cropName: 'Sweet Corn Cobs',
        variety: 'Sugar-75 Gold',
        imageUrl: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=600&auto=format&fit=crop&q=80',
        quantity: 5,
        unit: 'kg',
        pricePerUnit: 35,
        subtotal: 175,
        farmerId: 'usr_farmer_jharkhand',
        farmerName: 'Ramesh Mahto',
        farmerLocation: 'Ranchi'
      }
    ],
    subtotal: 315,
    deliveryFee: 40,
    totalAmount: 355,
    paymentMethod: 'UPI',
    paymentStatus: 'PAID',
    paymentId: 'PAY-MOCK-498212',
    deliveryStatus: 'IN_TRANSIT',
    timeline: [
      { status: 'ORDER_PLACED', label: 'Order Placed', timestamp: '2026-03-29 08:30 AM', location: 'Ranchi, Jharkhand', note: 'Order confirmed and verified via UPI', completed: true },
      { status: 'FARMER_ACCEPTED', label: 'Farmer Accepted', timestamp: '2026-03-29 09:15 AM', location: 'Ormanjhi Plot, Ranchi', note: 'Farmer Ramesh Mahto accepted order for harvesting', completed: true },
      { status: 'PACKED', label: 'Packed with Care', timestamp: '2026-03-29 11:30 AM', location: 'Ormanjhi Packing Shed', note: 'Vegetables graded, cleaned, and crated', completed: true },
      { status: 'DELIVERY_BOY_ASSIGNED', label: 'Delivery Boy Assigned', timestamp: '2026-03-29 11:45 AM', location: 'Ranchi North Dispatch Center', note: 'Assigned to Prince Chadda (+91 94314 77889)', completed: true },
      { status: 'PICKED_UP', label: 'Picked Up by Courier', timestamp: '2026-03-29 01:00 PM', location: 'Ranchi North Dispatch Center', note: 'AgriExpress vehicle collected produce', completed: true },
      { status: 'IN_TRANSIT', label: 'In Transit', timestamp: '2026-03-29 02:45 PM', location: 'NH-33 Corridor, Jharkhand', note: 'Direct highway transit under climate control', completed: true },
      { status: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', timestamp: 'Pending', location: 'Ranchi City Hub', note: 'Local delivery agent will deliver to doorstep', completed: false },
      { status: 'DELIVERED', label: 'Delivered', timestamp: 'Pending', location: 'Customer Doorstep', note: 'Fresh produce handover with OTP verification', completed: false }
    ],
    reviews: []
  },
  {
    id: 'ORD-JH-8891',
    customerId: 'usr_customer_jharkhand',
    customerName: 'Priya Sharma',
    customerPhone: '+91 98351 22345',
    deliveryAddress: {
      fullName: 'Priya Sharma',
      phone: '9835122345',
      street: 'Flat 4B, Hill View Residency',
      villageArea: 'Circuit House Area',
      city: 'Jamshedpur',
      district: 'Jamshedpur (East Singhbhum)',
      state: 'Jharkhand',
      pincode: '831001',
      landmark: 'Near Jubilee Park Gate'
    },
    farmerId: 'usr_farmer_jharkhand',
    farmerName: 'Ramesh Mahto',
    farmerPhone: '+91 94311 55678',
    farmerLocation: 'Ranchi',
    deliveryBoyId: 'usr_delivery_01',
    deliveryBoyName: 'Prince Chadda',
    deliveryBoyPhone: '+91 98355 44321',
    assignedAt: '2026-03-27 02:30 PM',
    currentLocation: {
      latitude: 22.8046,
      longitude: 86.2029,
      speed: 0,
      heading: 0,
      lastUpdated: '2026-03-28 02:45 PM'
    },
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
      { status: 'ORDER_PLACED', label: 'Order Placed', timestamp: '2026-03-27 09:15 AM', location: 'Jamshedpur (East Singhbhum)', note: 'Customer placed order via direct UPI checkout', completed: true },
      { status: 'FARMER_ACCEPTED', label: 'Farmer Accepted', timestamp: '2026-03-27 10:30 AM', location: 'Ormanjhi, Ranchi', note: 'Farmer Ramesh Mahto confirmed fresh morning harvest', completed: true },
      { status: 'PACKED', label: 'Packed at Farm', timestamp: '2026-03-27 02:00 PM', location: 'Ormanjhi, Ranchi', note: 'Inspected, weighed, and packed into eco-crates', completed: true },
      { status: 'PICKED_UP', label: 'Picked Up', timestamp: '2026-03-27 04:30 PM', location: 'Ranchi Dispatch Bay', note: 'AgriTech Fresh Courier picked up batch', completed: true },
      { status: 'IN_TRANSIT', label: 'In Transit', timestamp: '2026-03-28 06:00 AM', location: 'NH-33 Ranchi-Tata Corridor', note: 'Produce moving through regional cold transit', completed: true },
      { status: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', timestamp: '2026-03-28 11:30 AM', location: 'Jamshedpur Hub', note: 'Courier vehicle out for doorstep delivery', completed: true },
      { status: 'DELIVERED', label: 'Delivered', timestamp: '2026-03-28 02:45 PM', location: 'Circuit House Area, Jamshedpur', note: 'Delivered fresh directly to Priya Sharma', completed: true }
    ],
    reviews: [
      {
        id: 'rev_01',
        rating: 5,
        quality: 'EXCELLENT',
        deliverySpeed: 'ON_TIME',
        comment: 'Unbelievably fresh tomatoes and super crisp sweet corn! Directly from Ormanjhi to Jamshedpur in under 24 hours. Will order weekly!',
        createdAt: '2026-03-28',
        farmerReply: {
          replyText: 'Dhanyawad Priya Ji! Ramesh Mahto here. Really delighted that our harvest reached you in peak freshness. Looking forward to serving your family again!',
          repliedAt: '2026-03-28'
        }
      }
    ]
  }
];

async function seedDatabase() {
  try {
    console.log(`[Seed] Connecting to MongoDB at ${mongoURL}...`);
    await mongoose.connect(mongoURL, { serverSelectionTimeoutMS: 4000 });
    console.log('[Seed] Connected to MongoDB.');

    // 1. Seed Users
    console.log('[Seed] Syncing users...');
    for (const u of SEED_USERS) {
      await User.findOneAndUpdate({ $or: [{ id: u.id }, { email: u.email }] }, u, { upsert: true, new: true });
    }
    console.log(`[Seed] Users seeded successfully (${SEED_USERS.length} accounts).`);

    // 2. Seed Farms
    console.log('[Seed] Syncing farms...');
    for (const f of SEED_FARMS) {
      await Farm.findOneAndUpdate({ id: f.id }, f, { upsert: true, new: true });
    }
    console.log(`[Seed] Farms seeded successfully (${SEED_FARMS.length} parcels).`);

    // 3. Seed Products
    console.log('[Seed] Syncing products...');
    for (const p of SEED_PRODUCTS) {
      await Product.findOneAndUpdate({ id: p.id }, p, { upsert: true, new: true });
    }
    console.log(`[Seed] Products seeded successfully (${SEED_PRODUCTS.length} listings).`);

    // 4. Seed Orders
    console.log('[Seed] Syncing orders...');
    for (const o of SEED_ORDERS) {
      await Order.findOneAndUpdate({ id: o.id }, o, { upsert: true, new: true });
    }
    console.log(`[Seed] Orders seeded successfully (${SEED_ORDERS.length} orders).`);

    console.log('\n✅ All mocked data has been successfully restored to MongoDB!');
  } catch (err) {
    console.error('[Seed Error]', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('[Seed] Disconnected from MongoDB.');
  }
}

if (require.main === module) {
  seedDatabase();
}

module.exports = {
  SEED_USERS,
  SEED_FARMS,
  SEED_PRODUCTS,
  SEED_ORDERS,
  seedDatabase
};
