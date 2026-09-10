const mongoose = require('mongoose');

const farmSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    index: true,
    default: () => `farm_${Date.now()}`
  },
  ownerId: {
    type: String,
    required: true,
    index: true
  },
  farmName: {
    type: String,
    required: [true, 'Farm name is required'],
    trim: true
  },
  location: {
    type: String,
    default: 'Indore District (M.P.)'
  },
  area: {
    type: Number,
    required: true,
    min: 0.1,
    default: 5.0
  },
  areaUnit: {
    type: String,
    enum: ['Acre', 'Hectare', 'Decimal', 'Bigha'],
    default: 'Acre'
  },
  soilType: {
    type: String,
    enum: ['Loamy', 'Clayey', 'Sandy', 'Black Cotton', 'Red / Laterite', 'Silt'],
    default: 'Loamy'
  },
  irrigationType: {
    type: String,
    enum: ['Drip', 'Sprinkler', 'Canal / Flood', 'Rainfed', 'Borewell'],
    default: 'Drip'
  },
  latitude: {
    type: String,
    default: '22.7196'
  },
  longitude: {
    type: String,
    default: '75.8577'
  },
  farmNotes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

const Farm = mongoose.model('Farm', farmSchema);

module.exports = Farm;
