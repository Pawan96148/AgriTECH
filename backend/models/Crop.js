const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    index: true,
    default: () => `crop_${Date.now()}_${Math.floor(100 + Math.random() * 900)}`
  },
  farmId: {
    type: String,
    required: [true, 'Farm ID is required for a crop entry'],
    index: true
  },
  cropName: {
    type: String,
    required: [true, 'Crop name is required'],
    trim: true,
    index: true
  },
  variety: {
    type: String,
    trim: true
  },
  plantingDate: {
    type: String,
    required: [true, 'Planting date is required (YYYY-MM-DD)'],
    default: () => new Date().toISOString().split('T')[0]
  },
  expectedHarvestDate: {
    type: String,
    required: [true, 'Expected harvest date is required (YYYY-MM-DD)']
  },
  actualHarvestDate: {
    type: String,
    default: null
  },
  stage: {
    type: String,
    enum: ['Sowing', 'Vegetative', 'Flowering', 'Maturity', 'Harvested'],
    default: 'Sowing',
    index: true
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'COMPLETED', 'ABANDONED'],
    default: 'ACTIVE',
    index: true
  },
  estimatedYieldKg: {
    type: Number,
    min: 0,
    default: 0
  },
  actualYieldKg: {
    type: Number,
    min: 0,
    default: null
  },
  healthScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 90
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

const Crop = mongoose.model('Crop', cropSchema);

module.exports = Crop;
