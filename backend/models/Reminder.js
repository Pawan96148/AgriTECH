const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    index: true,
    default: () => `rem_${Date.now()}_${Math.floor(100 + Math.random() * 900)}`
  },
  userId: {
    type: String,
    required: [true, 'User ID is required'],
    index: true
  },
  activityId: {
    type: String,
    index: true,
    default: null
  },
  cropId: {
    type: String,
    index: true,
    default: null
  },
  farmId: {
    type: String,
    index: true,
    default: null
  },
  title: {
    type: String,
    required: [true, 'Reminder title is required'],
    trim: true
  },
  message: {
    type: String,
    required: [true, 'Reminder message is required'],
    trim: true
  },
  priority: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
    default: 'MEDIUM',
    index: true
  },
  triggerDate: {
    type: String,
    required: [true, 'Trigger date is required (YYYY-MM-DD)'],
    index: true
  },
  ruleCode: {
    type: String,
    enum: [
      'DUE_TODAY',
      'OVERDUE',
      'RAIN_SPRAY_CONFLICT',
      'RAIN_IRRIGATION_SKIP',
      'HARVEST_MATURITY',
      'HEAT_STRESS',
      'GENERAL'
    ],
    default: 'GENERAL',
    index: true
  },
  isRead: {
    type: Boolean,
    default: false,
    index: true
  }
}, {
  timestamps: true
});

const Reminder = mongoose.model('Reminder', reminderSchema);

module.exports = Reminder;
