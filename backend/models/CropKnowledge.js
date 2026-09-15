const mongoose = require('mongoose');

const keyStageSchema = new mongoose.Schema({
  stage: {
    type: String,
    enum: ['Sowing', 'Vegetative', 'Flowering', 'Maturity', 'Harvested'],
    required: true
  },
  dayOffset: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  recommendedActivities: [{
    type: String
  }]
}, { _id: false });

const cropKnowledgeSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    index: true,
    default: () => `ck_${Date.now()}_${Math.floor(100 + Math.random() * 900)}`
  },
  name: {
    type: String,
    required: [true, 'Crop name is required'],
    trim: true,
    index: true
  },
  scientificName: {
    type: String,
    required: [true, 'Scientific botanical name is required'],
    trim: true
  },
  category: {
    type: String,
    enum: ['Cereal', 'Vegetable', 'Pulse', 'Cash Crop', 'Fruit'],
    required: true,
    index: true
  },
  idealSoil: [{
    type: String,
    enum: ['Clay', 'Sandy', 'Loamy', 'Silt', 'Black', 'Red']
  }],
  durationDays: {
    type: Number,
    required: true
  },
  sowingMonths: {
    type: String,
    required: true
  },
  waterDemand: {
    type: String,
    enum: ['Low', 'Moderate', 'High'],
    default: 'Moderate'
  },
  idealTempRange: {
    type: String,
    default: '20°C - 30°C'
  },
  averageYieldPerAcre: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  fertilizerPlan: {
    type: String,
    default: ''
  },
  pestRisks: [{
    type: String
  }],
  harvestingSigns: {
    type: String,
    default: ''
  },
  keyStages: [keyStageSchema]
}, {
  timestamps: true
});

const CropKnowledge = mongoose.model('CropKnowledge', cropKnowledgeSchema);

module.exports = CropKnowledge;
