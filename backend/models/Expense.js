const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    index: true,
    default: () => `exp_${Date.now()}_${Math.floor(100 + Math.random() * 900)}`
  },
  farmId: {
    type: String,
    required: [true, 'Farm ID is required'],
    index: true
  },
  cropId: {
    type: String,
    index: true,
    default: null
  },
  category: {
    type: String,
    enum: [
      'Seeds',
      'Fertilizer',
      'Pesticides',
      'Labor',
      'Machinery / Fuel',
      'Irrigation',
      'Other'
    ],
    required: [true, 'Expense category is required'],
    index: true
  },
  description: {
    type: String,
    required: [true, 'Expense description is required'],
    trim: true
  },
  amount: {
    type: Number,
    required: [true, 'Expense amount is required'],
    min: [0, 'Expense amount cannot be negative']
  },
  date: {
    type: String,
    required: [true, 'Expense date is required (YYYY-MM-DD)'],
    index: true,
    default: () => new Date().toISOString().split('T')[0]
  }
}, {
  timestamps: true
});

const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;
