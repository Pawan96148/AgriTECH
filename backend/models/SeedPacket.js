const mongoose = require('mongoose');

const stageGuideSchema = new mongoose.Schema({
  stage: {
    type: String,
    enum: ['Sowing', 'Vegetative', 'Flowering', 'Maturity', 'Harvested']
  },
  dayRange: {
    type: String
  },
  advice: {
    type: String
  },
  criticalTask: {
    type: String
  }
}, { _id: false });

const seedPacketSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    index: true,
    default: () => `seed_${Date.now()}_${Math.floor(100 + Math.random() * 900)}`
  },
  qrCode: {
    type: String,
    required: [true, 'QR Code is required for seed authentication'],
    unique: true,
    index: true
  },
  lotNumber: {
    type: String,
    required: [true, 'Lot number is required'],
    index: true
  },
  brand: {
    type: String,
    required: [true, 'Brand name is required'],
    trim: true
  },
  variety: {
    type: String,
    required: [true, 'Variety name is required'],
    trim: true
  },
  cropName: {
    type: String,
    required: [true, 'Crop name is required'],
    trim: true,
    index: true
  },
  category: {
    type: String,
    enum: ['Cereal', 'Vegetable', 'Pulse', 'Cash Crop', 'Fruit'],
    required: true,
    index: true
  },
  knowledgeBaseId: {
    type: String,
    default: ''
  },
  germinationRate: {
    type: Number,
    min: 0,
    max: 100
  },
  physicalPurity: {
    type: Number,
    min: 0,
    max: 100
  },
  geneticPurity: {
    type: Number,
    min: 0,
    max: 100
  },
  moisturePercent: {
    type: Number,
    min: 0,
    max: 100
  },
  seedTreatment: {
    type: String,
    default: ''
  },
  recommendedSeedRateKgPerAcre: {
    type: Number,
    default: 0
  },
  idealSowingDepthCm: {
    type: String,
    default: ''
  },
  recommendedSpacing: {
    type: String,
    default: ''
  },
  packingDate: {
    type: String
  },
  expiryDate: {
    type: String
  },
  certificationAgency: {
    type: String,
    default: 'Jharkhand State Seed Certification Agency (JSSCA)'
  },
  certifiedTagColor: {
    type: String,
    default: 'Blue'
  },
  lifecycleOverview: {
    type: String,
    default: ''
  },
  stageGuide: [stageGuideSchema],
  preHarvestIntervalDays: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const SeedPacket = mongoose.model('SeedPacket', seedPacketSchema);

module.exports = SeedPacket;
