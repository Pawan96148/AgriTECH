// Resilient In-Memory Data Store when local MongoDB is offline

const mockUsers = [
  {
    id: 'usr_01',
    name: 'Rajesh Patel',
    email: 'rajesh.farmer@agropulse.io',
    phone: '+91 98765 43210',
    password: 'Password@123',
    role: 'FARM_OWNER',
    roleTitle: 'Senior Farm Manager & Agronomist',
    region: 'Indore, Madhya Pradesh',
    farmSizeAcre: 15.2,
    primaryCropInterest: 'Wheat, Soybean, Gram',
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
    avatarBg: 'bg-amber-800',
    createdAt: '2026-02-05'
  }
];

const mockProducts = [
  {
    id: 'prod_jh_01',
    farmerId: 'usr_farmer_jharkhand',
    farmerName: 'Ramesh Mahto',
    farmerPhone: '+91 94311 55678',
    cropName: 'Organic Hybrid Tomato',
    variety: 'Roma Desi Hybrid',
    category: 'Vegetable',
    imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
    availableQuantity: 450,
    unit: 'kg',
    pricePerUnit: 28,
    harvestDate: '2026-03-28',
    expectedAvailabilityDate: '2026-03-29',
    location: 'Ranchi',
    farmName: 'Ormanjhi Organic Acres',
    description: 'Crisp, vine-ripened organic tomatoes grown with drip fertigation in Ormanjhi, Ranchi. Zero chemical pesticides.',
    qualityGrade: 'Organic Certified',
    stockStatus: 'IN_STOCK'
  },
  {
    id: 'prod_jh_02',
    farmerId: 'usr_farmer_jharkhand',
    farmerName: 'Ramesh Mahto',
    farmerPhone: '+91 94311 55678',
    cropName: 'Sweet Corn Cobs',
    variety: 'Sugar-75 Gold',
    category: 'Grain & Cereal',
    imageUrl: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=600&auto=format&fit=crop&q=80',
    availableQuantity: 600,
    unit: 'kg',
    pricePerUnit: 35,
    harvestDate: '2026-03-29',
    expectedAvailabilityDate: '2026-03-30',
    location: 'Ranchi',
    farmName: 'Ormanjhi Organic Acres',
    description: 'Juicy, high-brix golden sweet corn directly plucked from stalks. Ideal for roasting and household cooking.',
    qualityGrade: 'Grade A (Premium)',
    stockStatus: 'IN_STOCK'
  },
  {
    id: 'prod_jh_03',
    farmerId: 'usr_farmer_03',
    farmerName: 'Suresh Soren',
    farmerPhone: '+91 94315 11223',
    cropName: 'Snowball Cauliflower',
    variety: 'Snowball 16 Hybrid',
    category: 'Vegetable',
    imageUrl: 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=600&auto=format&fit=crop&q=80',
    availableQuantity: 280,
    unit: 'kg',
    pricePerUnit: 32,
    harvestDate: '2026-03-27',
    expectedAvailabilityDate: '2026-03-28',
    location: 'Hazaribagh',
    farmName: 'Barhi Green Valley Plot',
    description: 'Dense white curd cauliflower cultivated using organic vermicompost in cool plateau soils of Barhi.',
    qualityGrade: 'Grade A (Premium)',
    stockStatus: 'IN_STOCK'
  },
  {
    id: 'prod_jh_04',
    farmerId: 'usr_farmer_04',
    farmerName: 'Anil Munda',
    farmerPhone: '+91 98353 44556',
    cropName: 'Tender Green Peas',
    variety: 'GS-10 Sweet Pea',
    category: 'Pulse',
    imageUrl: 'https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=600&auto=format&fit=crop&q=80',
    availableQuantity: 150,
    unit: 'kg',
    pricePerUnit: 55,
    harvestDate: '2026-03-29',
    expectedAvailabilityDate: '2026-03-30',
    location: 'Khunti',
    farmName: 'Torpa Tribal Co-op Farm',
    description: 'Hand-picked green pea pods with plump sweet grains. Harvested early morning for optimal sweetness.',
    qualityGrade: 'Export Quality',
    stockStatus: 'IN_STOCK'
  }
];

const mockOrders = [
  {
    id: 'ORD-JH-1001',
    customerId: 'usr_customer_jharkhand',
    customerName: 'Priya Sharma',
    customerPhone: '+91 98351 22345',
    deliveryAddress: {
      fullName: 'Priya Sharma',
      phone: '+91 98351 22345',
      street: 'Line Tank Road, Circular Area',
      district: 'Ranchi',
      state: 'Jharkhand',
      pincode: '834001',
      landmark: 'Near Albert Ekka Chowk'
    },
    farmerId: 'usr_farmer_jharkhand',
    farmerName: 'Ramesh Mahto',
    farmerPhone: '+91 94311 55678',
    farmerLocation: 'Ranchi',
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
        quantity: 4,
        unit: 'kg',
        pricePerUnit: 35,
        subtotal: 140,
        farmerId: 'usr_farmer_jharkhand',
        farmerName: 'Ramesh Mahto',
        farmerLocation: 'Ranchi'
      }
    ],
    subtotal: 280,
    deliveryFee: 40,
    totalAmount: 320,
    paymentMethod: 'UPI',
    paymentStatus: 'PAID',
    paymentId: 'PAY-MOCK-498212',
    deliveryStatus: 'IN_TRANSIT',
    timeline: [
      { status: 'ORDER_PLACED', label: 'Order Placed', timestamp: '2026-03-29 08:30 AM', location: 'Ranchi, Jharkhand', note: 'Order confirmed and verified via UPI', completed: true },
      { status: 'FARMER_ACCEPTED', label: 'Farmer Accepted', timestamp: '2026-03-29 09:15 AM', location: 'Ormanjhi Plot, Ranchi', note: 'Farmer Ramesh Mahto accepted order for harvesting', completed: true },
      { status: 'PACKED', label: 'Packed with Care', timestamp: '2026-03-29 11:30 AM', location: 'Ormanjhi Packing Shed', note: 'Vegetables graded, cleaned, and crated', completed: true },
      { status: 'PICKED_UP', label: 'Picked Up by Courier', timestamp: '2026-03-29 01:00 PM', location: 'Ranchi North Dispatch Center', note: 'Intra-Jharkhand AgriExpress vehicle collected produce', completed: true },
      { status: 'IN_TRANSIT', label: 'In Transit', timestamp: '2026-03-29 02:45 PM', location: 'NH-33 Corridor, Jharkhand', note: 'Direct highway transit under climate control', completed: true },
      { status: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', timestamp: 'Pending', location: 'Ranchi City Hub', note: 'Local delivery agent will deliver to doorstep', completed: false },
      { status: 'DELIVERED', label: 'Delivered', timestamp: 'Pending', location: 'Customer Doorstep', note: 'Fresh produce handover with OTP verification', completed: false }
    ],
    reviews: []
  }
];

const mockFarms = [
  {
    id: 'farm_01',
    ownerId: 'usr_01',
    farmName: 'Indore North Block (Plot A)',
    location: 'Indore District (M.P.)',
    area: 5.2,
    soilType: 'Loamy',
    irrigationType: 'Drip',
    latitude: '22.7196',
    longitude: '75.8577',
    farmNotes: 'Primary drip-fertigated block with soil sensors and drainage tiles.'
  },
  {
    id: 'farm_02',
    ownerId: 'usr_01',
    farmName: 'Rau Valley Expansion (Plot B)',
    location: 'Indore District (M.P.)',
    area: 10.0,
    soilType: 'Black Cotton',
    irrigationType: 'Sprinkler',
    latitude: '22.6284',
    longitude: '75.7952',
    farmNotes: 'Heavy clay soil, optimal for rainfed soybean and deep-root gram.'
  }
];

module.exports = {
  mockUsers,
  mockProducts,
  mockOrders,
  mockFarms
};
