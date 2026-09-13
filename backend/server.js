const path = require('path');
const express = require('express');
const cors = require('cors');

// Load environment variables
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

const { db, connectDB, isDbConnected } = require('./db');
const authRoutes = require('./routes/authRoutes');
const produceRoutes = require('./routes/produceRoutes');
const orderRoutes = require('./routes/orderRoutes');
const farmRoutes = require('./routes/farmRoutes');
const weatherRoutes = require('./routes/weatherRoutes');
const communityRoutes = require('./routes/communityRoutes');
const scannerRoutes = require('./routes/scannerRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend Vite dev server (localhost:3000, localhost:5173, etc.)
app.use(cors({
  origin: 'https://agri-tech-lilac.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsers with 25mb limit for camera and plant scan images
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (req.originalUrl.startsWith('/api')) {
      console.log(`[API] ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
    }
  });
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'AgriTech Smart Monitoring & Agricultural Commerce REST API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    database: {
      connected: isDbConnected(),
      state: db.readyState === 1 ? 'connected' : 'connecting/fallback'
    },
    endpoints: {
      auth: '/api/auth',
      products: '/api/products',
      orders: '/api/orders',
      farms: '/api/farms',
      weather: '/api/weather',
      community: '/api/community',
      scanner: '/api/scanner'
    }
  });
});

// Register API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', produceRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/farms', farmRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/scanner', scannerRoutes);

// Endpoint to restore/seed all mock data on demand
const { seedDatabase } = require('./seedMockData');
app.post('/api/seed', async (req, res) => {
  try {
    await seedDatabase();
    res.json({ success: true, message: 'All mocked data has been restored to MongoDB.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Optional: Serve frontend static build if present in dist
const distPath = path.resolve(__dirname, '..', 'dist');
app.use(express.static(distPath));

// Fallback for SPA routing if serving dist directly
app.get('*', (req, res, next) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(404).json({
      success: false,
      error: `API route not found: ${req.method} ${req.originalUrl}`
    });
  }
  const indexPath = path.join(distPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(200).send('AgriTech Node.js REST API Server is running. Access endpoints at /api/health');
    }
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Unhandled Server Error]', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

// Start Server
const server = app.listen(PORT, () => {
  console.log('====================================================');
  console.log(`🌱 AGRITECH Node.js Express REST API Server`);
  console.log(`🚀 Running at: http://localhost:${PORT}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`🛒 Products API: http://localhost:${PORT}/api/products`);
  console.log(`📦 Orders API: http://localhost:${PORT}/api/orders`);
  console.log(`🔑 Auth API: http://localhost:${PORT}/api/auth/profiles`);
  console.log('====================================================');
});

module.exports = { app, server };
