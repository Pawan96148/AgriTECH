// Resilient In-Memory Data Store when local MongoDB is offline
const { SEED_USERS, SEED_FARMS, SEED_PRODUCTS, SEED_ORDERS } = require('./seedMockData');

const mockUsers = JSON.parse(JSON.stringify(SEED_USERS));
const mockProducts = JSON.parse(JSON.stringify(SEED_PRODUCTS));
const mockOrders = JSON.parse(JSON.stringify(SEED_ORDERS));
const mockFarms = JSON.parse(JSON.stringify(SEED_FARMS));

module.exports = {
  mockUsers,
  mockProducts,
  mockOrders,
  mockFarms
};
