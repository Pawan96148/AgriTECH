const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    index: true,
    default: () => `prod_jh_${Date.now()}`
  },
  farmerId: {
    type: String,
    required: true,
    index: true
  },
  farmerName: {
    type: String,
    required: true
  },
  farmerPhone: {
    type: String,
    default: '+91 94311 55678'
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
  category: {
    type: String,
    enum: ['Vegetable', 'Fruit', 'Grain & Cereal', 'Pulse', 'Cash Crop', 'Spices'],
    default: 'Vegetable',
    index: true
  },
  imageUrl: {
    type: String,
    default: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80'
  },
  availableQuantity: {
    type: Number,
    required: true,
    min: 0,
    default: 10
  },
  minimumOrderQuantity: {
    type: Number,
    default: 5,
    min: 1
  },
  unit: {
    type: String,
    enum: ['kg', 'quintal', 'ton', 'crate', 'bag'],
    default: 'kg'
  },
  pricePerUnit: {
    type: Number,
    required: true,
    min: 0
  },
  harvestDate: {
    type: String,
    default: () => new Date().toISOString().split('T')[0]
  },
  expectedAvailabilityDate: {
    type: String,
    default: () => new Date().toISOString().split('T')[0]
  },
  location: {
    type: String,
    default: 'Ranchi',
    index: true
  },
  farmName: {
    type: String,
    default: 'Ormanjhi Organic Farm'
  },
  description: {
    type: String,
    default: 'Freshly harvested Jharkhand produce grown using sustainable organic cultivation.'
  },
  qualityGrade: {
    type: String,
    enum: ['Grade A (Premium)', 'Organic Certified', 'Export Quality', 'Grade B (Standard)'],
    default: 'Grade A (Premium)',
    index: true
  },
  stockStatus: {
    type: String,
    enum: ['IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK'],
    default: 'IN_STOCK',
    index: true
  }
}, {
  timestamps: true
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
