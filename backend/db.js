const path = require('path');
const mongoose = require('mongoose');

// Disable Mongoose query buffering when disconnected
mongoose.set('bufferCommands', false);

// Load environment variables from backend/.env or root .env
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

const mongoURL = (process.env.MONGODB_URL_LOCAL || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/AgriTech').trim();

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return mongoose.connection;

  try {
    const conn = await mongoose.connect(mongoURL, {
      serverSelectionTimeoutMS: 2500 // Don't hang indefinitely if local daemon is not running
    });
    isConnected = true;
    console.log(`[MongoDB] Connected successfully to: ${conn.connection.host}/${conn.connection.name}`);
    return conn.connection;
  } catch (err) {
    console.warn(`[MongoDB Notice] Local MongoDB is currently offline or unreachable at ${mongoURL}.`);
    console.warn(`[MongoDB Notice] The AgriTech REST API will continue serving in hybrid resilient mode.`);
    return null;
  }
};

// Initial connection attempt
connectDB();

const db = mongoose.connection;

db.on('connected', () => {
  isConnected = true;
  console.log('[MongoDB Event] Connection established.');
});

db.on('error', (err) => {
  isConnected = false;
  console.warn('[MongoDB Event] Connection error occurred:', err.message);
});

db.on('disconnected', () => {
  isConnected = false;
  console.log('[MongoDB Event] Disconnected from server.');
});

module.exports = {
  db,
  connectDB,
  isDbConnected: () => isConnected
};
