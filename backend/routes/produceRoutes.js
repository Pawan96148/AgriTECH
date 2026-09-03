const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { isDbConnected } = require('../db');
const { mockProducts } = require('../mockStore');
const { optionalAuthMiddleware } = require('../jwt');

// GET /api/products
router.get('/', async (req, res) => {
  try {
    const { district, category, qualityGrade, stockStatus, search, farmerId } = req.query;

    if (isDbConnected()) {
      const query = {};
      if (district && district !== 'All Jharkhand') {
        query.location = { $regex: new RegExp(`^${district}`, 'i') };
      }
      if (category && category !== 'All') {
        query.category = category;
      }
      if (qualityGrade && qualityGrade !== 'All') {
        query.qualityGrade = qualityGrade;
      }
      if (stockStatus) {
        query.stockStatus = stockStatus;
      }
      if (farmerId) {
        query.farmerId = farmerId;
      }
      if (search) {
        query.$or = [
          { cropName: { $regex: search, $options: 'i' } },
          { variety: { $regex: search, $options: 'i' } },
          { location: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }

      let products = await Product.find(query).sort({ createdAt: -1 });

      if (products.length === 0 && Object.keys(query).length === 0) {
        await Product.insertMany(mockProducts);
        products = await Product.find({}).sort({ createdAt: -1 });
      }

      return res.json({
        success: true,
        count: products.length,
        products
      });
    } else {
      // In-memory filter
      let filtered = [...mockProducts];

      if (district && district !== 'All Jharkhand') {
        filtered = filtered.filter(p => p.location.toLowerCase().includes(district.toLowerCase()));
      }
      if (category && category !== 'All') {
        filtered = filtered.filter(p => p.category === category);
      }
      if (qualityGrade && qualityGrade !== 'All') {
        filtered = filtered.filter(p => p.qualityGrade === qualityGrade);
      }
      if (stockStatus) {
        filtered = filtered.filter(p => p.stockStatus === stockStatus);
      }
      if (farmerId) {
        filtered = filtered.filter(p => p.farmerId === farmerId);
      }
      if (search) {
        const s = search.toLowerCase();
        filtered = filtered.filter(p =>
          p.cropName.toLowerCase().includes(s) ||
          (p.variety && p.variety.toLowerCase().includes(s)) ||
          p.location.toLowerCase().includes(s)
        );
      }

      return res.json({
        success: true,
        count: filtered.length,
        products: filtered
      });
    }
  } catch (err) {
    console.error('[Produce GET Error]', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    if (isDbConnected()) {
      const product = await Product.findOne({ id: req.params.id });
      if (!product) return res.status(404).json({ success: false, error: 'Product not found' });
      return res.json({ success: true, product });
    } else {
      const product = mockProducts.find(p => p.id === req.params.id);
      if (!product) return res.status(404).json({ success: false, error: 'Product not found' });
      return res.json({ success: true, product });
    }
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/products (Create harvest listing)
router.post('/', optionalAuthMiddleware, async (req, res) => {
  try {
    const data = req.body;

    if (!data.cropName || data.pricePerUnit === undefined || data.availableQuantity === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Crop name, available quantity, and price per unit are required.'
      });
    }

    const newProdData = {
      id: `prod_jh_${Date.now()}`,
      farmerId: req.user?.id || data.farmerId || 'usr_farmer_jharkhand',
      farmerName: req.user?.name || data.farmerName || 'Jharkhand Cultivator',
      farmerPhone: data.farmerPhone || '+91 94311 55678',
      cropName: data.cropName.trim(),
      variety: data.variety ? data.variety.trim() : 'Local Desi',
      category: data.category || 'Vegetable',
      imageUrl: data.imageUrl || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
      availableQuantity: Number(data.availableQuantity) || 10,
      unit: data.unit || 'kg',
      pricePerUnit: Number(data.pricePerUnit) || 20,
      harvestDate: data.harvestDate || new Date().toISOString().split('T')[0],
      expectedAvailabilityDate: data.expectedAvailabilityDate || new Date().toISOString().split('T')[0],
      location: data.location || 'Ranchi',
      farmName: data.farmName || 'Jharkhand Plot',
      description: data.description || `Fresh organic ${data.cropName} harvested in ${data.location || 'Jharkhand'}.`,
      qualityGrade: data.qualityGrade || 'Grade A (Premium)',
      stockStatus: (Number(data.availableQuantity) || 0) > 0 ? 'IN_STOCK' : 'OUT_OF_STOCK'
    };

    if (isDbConnected()) {
      const newProduct = new Product(newProdData);
      await newProduct.save();
      return res.status(201).json({ success: true, message: 'Produce listed successfully', product: newProduct });
    } else {
      mockProducts.unshift(newProdData);
      return res.status(201).json({ success: true, message: 'Produce listed successfully (In-Memory)', product: newProdData });
    }
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/products/:id
router.patch('/:id', async (req, res) => {
  try {
    const updates = req.body;

    if (isDbConnected()) {
      const product = await Product.findOne({ id: req.params.id });
      if (!product) return res.status(404).json({ success: false, error: 'Product not found' });

      if (updates.availableQuantity !== undefined) {
        product.availableQuantity = Number(updates.availableQuantity);
        product.stockStatus = product.availableQuantity === 0 ? 'OUT_OF_STOCK' : product.availableQuantity < 30 ? 'LOW_STOCK' : 'IN_STOCK';
      }
      if (updates.pricePerUnit !== undefined) product.pricePerUnit = Number(updates.pricePerUnit);
      if (updates.stockStatus) product.stockStatus = updates.stockStatus;
      if (updates.description) product.description = updates.description;

      await product.save();
      return res.json({ success: true, product });
    } else {
      const index = mockProducts.findIndex(p => p.id === req.params.id);
      if (index === -1) return res.status(404).json({ success: false, error: 'Product not found' });

      const product = mockProducts[index];
      if (updates.availableQuantity !== undefined) {
        product.availableQuantity = Number(updates.availableQuantity);
        product.stockStatus = product.availableQuantity === 0 ? 'OUT_OF_STOCK' : product.availableQuantity < 30 ? 'LOW_STOCK' : 'IN_STOCK';
      }
      if (updates.pricePerUnit !== undefined) product.pricePerUnit = Number(updates.pricePerUnit);
      if (updates.stockStatus) product.stockStatus = updates.stockStatus;
      if (updates.description) product.description = updates.description;

      return res.json({ success: true, product });
    }
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/products/:id
router.delete('/:id', async (req, res) => {
  try {
    if (isDbConnected()) {
      const deleted = await Product.findOneAndDelete({ id: req.params.id });
      if (!deleted) return res.status(404).json({ success: false, error: 'Product not found' });
      return res.json({ success: true, message: 'Product removed' });
    } else {
      const idx = mockProducts.findIndex(p => p.id === req.params.id);
      if (idx === -1) return res.status(404).json({ success: false, error: 'Product not found' });
      mockProducts.splice(idx, 1);
      return res.json({ success: true, message: 'Product removed' });
    }
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
