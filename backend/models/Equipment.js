const mongoose = require('mongoose');

const maintenanceLogSchema = new mongoose.Schema({
  id: {
    type: String,
    default: () => `maint_${Date.now()}_${Math.floor(100 + Math.random() * 900)}`
  },
  date: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  serviceType: {
    type: String,
    enum: [
      'Routine Service',
      'Part Replacement',
      'Calibration',
      'Emergency Repair',
      'Pre-Season Overhaul'
    ],
    default: 'Routine Service'
  },
  technician: {
    type: String,
    required: true
  },
  costInr: {
    type: Number,
    default: 0
  },
  details: {
    type: String,
    required: true
  }
}, { _id: false });

const equipmentSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    index: true,
    default: () => `eq_${Date.now()}_${Math.floor(100 + Math.random() * 900)}`
  },
  qrCode: {
    type: String,
    required: [true, 'QR Code is required for equipment registry'],
    unique: true,
    index: true
  },
  assetTag: {
    type: String,
    required: [true, 'Asset Tag is required'],
    index: true
  },
  name: {
    type: String,
    required: [true, 'Equipment name is required'],
    trim: true
  },
  model: {
    type: String,
    required: [true, 'Model name/number is required'],
    trim: true
  },
  category: {
    type: String,
    enum: [
      'Tractor & Tillage',
      'Sprayers & Protection',
      'Irrigation & Pumps',
      'Harvesting & Threshing',
      'Sensors & Testing'
    ],
    required: [true, 'Equipment category is required'],
    index: true
  },
  serialNumber: {
    type: String,
    trim: true
  },
  purchaseYear: {
    type: Number
  },
  operatingHours: {
    type: Number,
    default: 0
  },
  acreageServiced: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: [
      'Optimal',
      'Due for Service',
      'Inspection Required',
      'Critical Maintenance'
    ],
    default: 'Optimal',
    index: true
  },
  lastServiceDate: {
    type: String
  },
  nextServiceDue: {
    type: String
  },
  oilAndFilterStatus: {
    type: String,
    default: 'Normal'
  },
  batteryOrPressureStatus: {
    type: String,
    default: 'Normal'
  },
  maintenanceHistory: [maintenanceLogSchema],
  preOperationChecklist: [{
    type: String
  }],
  safetyNotes: {
    type: String,
    default: ''
  },
  linkedPlotOrCrop: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

const Equipment = mongoose.model('Equipment', equipmentSchema);

module.exports = Equipment;
