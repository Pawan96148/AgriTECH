const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  cropName: { type: String, required: true },
  variety: { type: String },
  imageUrl: { type: String },
  quantity: { type: Number, required: true, min: 1 },
  unit: { type: String, default: 'kg' },
  pricePerUnit: { type: Number, required: true },
  subtotal: { type: Number, required: true },
  farmerId: { type: String },
  farmerName: { type: String },
  farmerLocation: { type: String }
}, { _id: false });

const milestoneSchema = new mongoose.Schema({
  status: { type: String, required: true },
  label: { type: String, required: true },
  timestamp: { type: String, required: true },
  location: { type: String, required: true },
  note: { type: String },
  completed: { type: Boolean, default: false }
}, { _id: false });

const reviewReplySchema = new mongoose.Schema({
  replyText: { type: String, required: true },
  repliedAt: { type: String, required: true }
}, { _id: false });

const orderReviewSchema = new mongoose.Schema({
  id: { type: String, default: () => `rev_${Date.now()}` },
  rating: { type: Number, required: true, min: 1, max: 5 },
  quality: { type: String, enum: ['EXCELLENT', 'GOOD', 'AVERAGE', 'BELOW_AVERAGE'], default: 'EXCELLENT' },
  deliverySpeed: { type: String, enum: ['FAST', 'ON_TIME', 'DELAYED'], default: 'ON_TIME' },
  comment: { type: String, required: true },
  createdAt: { type: String, default: () => new Date().toISOString().split('T')[0] },
  farmerReply: { type: reviewReplySchema }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    index: true,
    default: () => `ORD-JH-${Math.floor(1000 + Math.random() * 9000)}`
  },
  customerId: {
    type: String,
    required: true,
    index: true
  },
  customerName: {
    type: String,
    required: true
  },
  customerPhone: {
    type: String,
    required: true
  },
  deliveryAddress: {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    street: { type: String, required: true },
    district: { type: String, required: true },
    state: { type: String, default: 'Jharkhand' },
    pincode: { type: String, required: true },
    landmark: { type: String }
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
  farmerLocation: {
    type: String,
    default: 'Ranchi'
  },
  items: [orderItemSchema],
  subtotal: {
    type: Number,
    required: true
  },
  deliveryFee: {
    type: Number,
    default: 40
  },
  totalAmount: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['UPI', 'CARD', 'NETBANKING', 'COD'],
    default: 'UPI'
  },
  paymentStatus: {
    type: String,
    enum: ['PENDING', 'PAID', 'FAILED', 'REFUNDED'],
    default: 'PAID'
  },
  paymentId: {
    type: String
  },
  deliveryStatus: {
    type: String,
    enum: ['ORDER_PLACED', 'FARMER_ACCEPTED', 'PACKED', 'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'],
    default: 'ORDER_PLACED',
    index: true
  },
  timeline: [milestoneSchema],
  reviews: [orderReviewSchema]
}, {
  timestamps: true
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
