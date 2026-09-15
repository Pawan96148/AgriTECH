const mongoose = require('mongoose');

const chemicalTreatmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dosage: { type: String, required: true },
  application: { type: String, required: true }
}, { _id: false });

const plantScanSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    index: true,
    default: () => `scan_${Date.now()}_${Math.floor(100 + Math.random() * 900)}`
  },
  userId: {
    type: String,
    required: [true, 'User ID is required'],
    index: true
  },
  timestamp: {
    type: String,
    default: () => new Date().toISOString()
  },
  cropIdentified: {
    type: String,
    required: [true, 'Identified crop is required'],
    trim: true,
    index: true
  },
  healthStatus: {
    type: String,
    required: [true, 'Health status or disease diagnosis is required'],
    trim: true,
    index: true
  },
  isHealthy: {
    type: Boolean,
    default: false
  },
  confidenceScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 90
  },
  severityLevel: {
    type: String,
    enum: ['Healthy', 'Low', 'Moderate', 'High', 'Severe'],
    default: 'Moderate',
    index: true
  },
  symptoms: [{
    type: String
  }],
  possibleCauses: [{
    type: String
  }],
  organicTreatments: [{
    type: String
  }],
  chemicalTreatments: [chemicalTreatmentSchema],
  preventiveMeasures: [{
    type: String
  }],
  expertAdvice: {
    type: String,
    default: ''
  },
  disclaimer: {
    type: String,
    default: 'AI-assisted diagnosis based on visual agronomic markers.'
  },
  imageUrl: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

const PlantScan = mongoose.model('PlantScan', plantScanSchema);

module.exports = PlantScan;
