const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    index: true,
    default: () => `usr_${Date.now()}`
  },
  name: {
    type: String,
    required: [true, 'User name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email address is required'],
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required']
  },
  role: {
    type: String,
    enum: ['FARM_OWNER', 'CUSTOMER', 'DEALER', 'DELIVERY_PARTNER'],
    default: 'FARM_OWNER',
    index: true
  },
  roleTitle: {
    type: String,
    default: 'Verified Farm Manager'
  },
  region: {
    type: String,
    default: 'Ranchi, Jharkhand'
  },
  preferredLanguage: {
    type: String,
    default: 'English'
  },
  avatarBg: {
    type: String,
    default: 'bg-emerald-700'
  },
  avatarUrl: {
    type: String
  },
  farmSizeAcre: {
    type: Number,
    default: 5.0
  },
  primaryCropInterest: {
    type: String,
    default: 'Wheat, Tomato, Pulses'
  },
  isEmailVerified: {
    type: Boolean,
    default: true
  },
  lastLoginAt: {
    type: String
  },
  createdAt: {
    type: String,
    default: () => new Date().toISOString().split('T')[0]
  }
}, {
  timestamps: true
});

// Pre-save hook: Hash password with bcrypt before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Instance method: verify candidate password
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch {
    return false;
  }
};

// Safe JSON serialization: omit sensitive password hash
userSchema.methods.toSafeObject = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
