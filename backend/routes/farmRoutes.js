const express = require('express');
const router = express.Router();
const Farm = require('../models/Farm');
const { isDbConnected } = require('../db');
const { mockFarms } = require('../mockStore');
const { optionalAuthMiddleware } = require('../jwt');

// GET /api/farms
router.get('/', optionalAuthMiddleware, async (req, res) => {
  try {
    const ownerId = req.query.ownerId || req.user?.id;

    if (isDbConnected()) {
      const query = ownerId ? { ownerId } : {};
      let farms = await Farm.find(query).sort({ createdAt: -1 });

      if (farms.length === 0 && Object.keys(query).length === 0) {
        await Farm.insertMany(mockFarms);
        farms = await Farm.find({}).sort({ createdAt: -1 });
      }

      return res.json({ success: true, count: farms.length, farms });
    } else {
      let filtered = [...mockFarms];
      if (ownerId) filtered = filtered.filter(f => f.ownerId === ownerId);
      return res.json({ success: true, count: filtered.length, farms: filtered });
    }
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/farms
router.post('/', optionalAuthMiddleware, async (req, res) => {
  try {
    const { farmName, location, area, soilType, irrigationType, latitude, longitude, farmNotes } = req.body;

    if (!farmName) {
      return res.status(400).json({ success: false, error: 'Farm name is required.' });
    }

    const farmData = {
      id: `farm_${Date.now()}`,
      ownerId: req.user?.id || 'usr_01',
      farmName: farmName.trim(),
      location: location || 'Ranchi District, Jharkhand',
      area: Number(area) || 5.0,
      soilType: soilType || 'Loamy',
      irrigationType: irrigationType || 'Drip',
      latitude: latitude || '23.3441',
      longitude: longitude || '85.3096',
      farmNotes: farmNotes || ''
    };

    if (isDbConnected()) {
      const newFarm = new Farm(farmData);
      await newFarm.save();
      return res.status(201).json({ success: true, message: 'Farm registered', farm: newFarm });
    } else {
      mockFarms.push(farmData);
      return res.status(201).json({ success: true, message: 'Farm registered (In-Memory)', farm: farmData });
    }
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
