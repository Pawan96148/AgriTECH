const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    index: true,
    default: () => `act_${Date.now()}_${Math.floor(100 + Math.random() * 900)}`
  },
  cropId: {
    type: String,
    required: [true, 'Crop ID is required'],
    index: true
  },
  farmId: {
    type: String,
    required: [true, 'Farm ID is required'],
    index: true
  },
  activityType: {
    type: String,
    enum: ['IRRIGATION', 'FERTILIZER', 'PESTICIDE', 'WEEDING', 'HARVEST'],
    required: [true, 'Activity type is required'],
    index: true
  },
  title: {
    type: String,
    required: [true, 'Activity title is required'],
    trim: true
  },
  scheduledDate: {
    type: String,
    required: [true, 'Scheduled date is required (YYYY-MM-DD)'],
    index: true
  },
  completedDate: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['PENDING', 'COMPLETED', 'CANCELLED'],
    default: 'PENDING',
    index: true
  },
  notes: {
    type: String,
    default: ''
  },
  priority: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
    default: 'MEDIUM',
    index: true
  },
  dosageOrVolume: {
    type: String,
    default: ''
  },
  cost: {
    type: Number,
    min: 0,
    default: 0
  }
}, {
  timestamps: true
});

const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;
