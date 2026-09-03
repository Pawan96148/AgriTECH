const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const { isDbConnected } = require('../db');
const { mockOrders, mockProducts } = require('../mockStore');
const { optionalAuthMiddleware } = require('../jwt');

// GET /api/orders
router.get('/', optionalAuthMiddleware, async (req, res) => {
  try {
    const { customerId, farmerId, status } = req.query;

    if (isDbConnected()) {
      const query = {};
      if (customerId) query.customerId = customerId;
      if (farmerId) query.farmerId = farmerId;
      if (status) query.deliveryStatus = status;

      let orders = await Order.find(query).sort({ createdAt: -1 });

      if (orders.length === 0 && Object.keys(query).length === 0) {
        await Order.insertMany(mockOrders);
        orders = await Order.find({}).sort({ createdAt: -1 });
      }

      return res.json({ success: true, count: orders.length, orders });
    } else {
      let filtered = [...mockOrders];
      if (customerId) filtered = filtered.filter(o => o.customerId === customerId);
      if (farmerId) filtered = filtered.filter(o => o.farmerId === farmerId);
      if (status) filtered = filtered.filter(o => o.deliveryStatus === status);

      return res.json({ success: true, count: filtered.length, orders: filtered });
    }
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/orders/:id
router.get('/:id', async (req, res) => {
  try {
    if (isDbConnected()) {
      const order = await Order.findOne({ id: req.params.id });
      if (!order) return res.status(404).json({ success: false, error: 'Order not found' });
      return res.json({ success: true, order });
    } else {
      const order = mockOrders.find(o => o.id === req.params.id);
      if (!order) return res.status(404).json({ success: false, error: 'Order not found' });
      return res.json({ success: true, order });
    }
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/orders (Create order)
router.post('/', optionalAuthMiddleware, async (req, res) => {
  try {
    const { customerAddress, paymentMethod, items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, error: 'Order must contain at least one item.' });
    }

    if (!customerAddress || !customerAddress.fullName || !customerAddress.phone || !customerAddress.street) {
      return res.status(400).json({ success: false, error: 'Delivery address details are required.' });
    }

    const subtotal = items.reduce((acc, it) => acc + (it.pricePerUnit * it.quantity), 0);
    const deliveryFee = 40;
    const totalAmount = subtotal + deliveryFee;

    const primaryFarmerId = items[0]?.farmerId || 'usr_farmer_jharkhand';
    const primaryFarmerName = items[0]?.farmerName || 'Jharkhand Cultivator';
    const primaryFarmerLocation = items[0]?.farmerLocation || 'Ranchi';

    const now = new Date();
    const formattedNow = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    const newOrderData = {
      id: `ORD-JH-${Math.floor(1000 + Math.random() * 9000)}`,
      customerId: req.user?.id || 'usr_customer_jharkhand',
      customerName: customerAddress.fullName,
      customerPhone: customerAddress.phone,
      deliveryAddress: {
        ...customerAddress,
        state: 'Jharkhand'
      },
      farmerId: primaryFarmerId,
      farmerName: primaryFarmerName,
      farmerPhone: '+91 94311 55678',
      farmerLocation: primaryFarmerLocation,
      items: items.map(it => ({
        productId: it.productId || it.id,
        cropName: it.cropName,
        variety: it.variety,
        imageUrl: it.imageUrl,
        quantity: Number(it.quantity) || 1,
        unit: it.unit || 'kg',
        pricePerUnit: Number(it.pricePerUnit),
        subtotal: Number(it.pricePerUnit) * Number(it.quantity || 1),
        farmerId: it.farmerId || primaryFarmerId,
        farmerName: it.farmerName || primaryFarmerName,
        farmerLocation: it.farmerLocation || primaryFarmerLocation
      })),
      subtotal,
      deliveryFee,
      totalAmount,
      paymentMethod: paymentMethod || 'UPI',
      paymentStatus: paymentMethod === 'COD' ? 'PENDING' : 'PAID',
      paymentId: paymentMethod === 'COD' ? undefined : `PAY-MOCK-${Math.floor(100000 + Math.random() * 900000)}`,
      deliveryStatus: 'ORDER_PLACED',
      timeline: [
        { status: 'ORDER_PLACED', label: 'Order Placed', timestamp: formattedNow, location: `${customerAddress.district || 'Ranchi'}, Jharkhand`, note: `Direct farm order confirmed via ${paymentMethod || 'UPI'}`, completed: true },
        { status: 'FARMER_ACCEPTED', label: 'Farmer Accepted', timestamp: 'Pending', location: `${primaryFarmerLocation}, Jharkhand`, note: 'Farmer verification of harvest & dispatch readiness', completed: false },
        { status: 'PACKED', label: 'Packed with Care', timestamp: 'Pending', location: `${primaryFarmerLocation} Farm Plot`, note: 'Fresh harvesting, grading, and moisture-controlled packaging', completed: false },
        { status: 'PICKED_UP', label: 'Picked Up by Courier', timestamp: 'Pending', location: `${primaryFarmerLocation} Dispatch Hub`, note: 'AgriExpress local rural transit vehicle dispatch', completed: false },
        { status: 'IN_TRANSIT', label: 'In Transit', timestamp: 'Pending', location: 'Intra-Jharkhand Transit Corridor', note: 'Fast highway transportation direct to delivery district', completed: false },
        { status: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', timestamp: 'Pending', location: `${customerAddress.district || 'Ranchi'} Local Delivery Center`, note: 'Assigned to local field agent for doorstep delivery', completed: false },
        { status: 'DELIVERED', label: 'Delivered', timestamp: 'Pending', location: customerAddress.street, note: 'Fresh farm-to-table handover completed', completed: false }
      ],
      reviews: []
    };

    if (isDbConnected()) {
      const newOrder = new Order(newOrderData);
      await newOrder.save();

      // Deduct stock from products collection
      for (const item of items) {
        try {
          const prod = await Product.findOne({ id: item.productId || item.id });
          if (prod) {
            prod.availableQuantity = Math.max(0, prod.availableQuantity - (Number(item.quantity) || 1));
            prod.stockStatus = prod.availableQuantity === 0 ? 'OUT_OF_STOCK' : prod.availableQuantity < 30 ? 'LOW_STOCK' : 'IN_STOCK';
            await prod.save();
          }
        } catch (e) {
          // benign
        }
      }

      return res.status(201).json({ success: true, message: 'Order placed successfully', order: newOrder });
    } else {
      mockOrders.unshift(newOrderData);

      // Deduct from in-memory products
      for (const item of items) {
        const prod = mockProducts.find(p => p.id === (item.productId || item.id));
        if (prod) {
          prod.availableQuantity = Math.max(0, prod.availableQuantity - (Number(item.quantity) || 1));
          prod.stockStatus = prod.availableQuantity === 0 ? 'OUT_OF_STOCK' : prod.availableQuantity < 30 ? 'LOW_STOCK' : 'IN_STOCK';
        }
      }

      return res.status(201).json({ success: true, message: 'Order placed successfully (In-Memory)', order: newOrderData });
    }
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/orders/:id/milestone (Advance milestone status)
router.patch('/:id/milestone', async (req, res) => {
  try {
    const { nextStatus, note } = req.body;
    const now = new Date();
    const formattedNow = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    if (isDbConnected()) {
      const order = await Order.findOne({ id: req.params.id });
      if (!order) return res.status(404).json({ success: false, error: 'Order not found' });

      let foundCurrent = false;
      order.timeline = order.timeline.map((m) => {
        if (m.status === nextStatus) {
          foundCurrent = true;
          return { ...m.toObject(), completed: true, timestamp: formattedNow, note: note || m.note };
        }
        if (!foundCurrent) {
          return { ...m.toObject(), completed: true };
        }
        return m;
      });

      order.deliveryStatus = nextStatus;
      if (nextStatus === 'DELIVERED' && order.paymentMethod === 'COD') {
        order.paymentStatus = 'PAID';
      }
      await order.save();
      return res.json({ success: true, message: `Milestone advanced to ${nextStatus}`, order });
    } else {
      const order = mockOrders.find(o => o.id === req.params.id);
      if (!order) return res.status(404).json({ success: false, error: 'Order not found' });

      let foundCurrent = false;
      order.timeline = order.timeline.map((m) => {
        if (m.status === nextStatus) {
          foundCurrent = true;
          return { ...m, completed: true, timestamp: formattedNow, note: note || m.note };
        }
        if (!foundCurrent) {
          return { ...m, completed: true };
        }
        return m;
      });

      order.deliveryStatus = nextStatus;
      if (nextStatus === 'DELIVERED' && order.paymentMethod === 'COD') {
        order.paymentStatus = 'PAID';
      }
      return res.json({ success: true, message: `Milestone advanced to ${nextStatus}`, order });
    }
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/orders/:id/review (Submit rating & review)
router.post('/:id/review', async (req, res) => {
  try {
    const { rating, quality, deliverySpeed, comment } = req.body;
    const newReview = {
      id: `rev_${Date.now()}`,
      rating: Number(rating) || 5,
      quality: quality || 'EXCELLENT',
      deliverySpeed: deliverySpeed || 'ON_TIME',
      comment: comment || 'Produce arrived fresh directly from farm.',
      createdAt: new Date().toISOString().split('T')[0]
    };

    if (isDbConnected()) {
      const order = await Order.findOne({ id: req.params.id });
      if (!order) return res.status(404).json({ success: false, error: 'Order not found' });
      order.reviews.push(newReview);
      await order.save();
      return res.status(201).json({ success: true, review: newReview, order });
    } else {
      const order = mockOrders.find(o => o.id === req.params.id);
      if (!order) return res.status(404).json({ success: false, error: 'Order not found' });
      order.reviews.push(newReview);
      return res.status(201).json({ success: true, review: newReview, order });
    }
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/orders/:id/reply (Farmer reply to review)
router.post('/:id/reply', async (req, res) => {
  try {
    const { replyText } = req.body;
    const replyData = {
      replyText: replyText || 'Thank you for supporting our organic harvest!',
      repliedAt: new Date().toISOString().split('T')[0]
    };

    if (isDbConnected()) {
      const order = await Order.findOne({ id: req.params.id });
      if (!order || order.reviews.length === 0) return res.status(404).json({ success: false, error: 'Review not found' });
      order.reviews[0].farmerReply = replyData;
      await order.save();
      return res.json({ success: true, order });
    } else {
      const order = mockOrders.find(o => o.id === req.params.id);
      if (!order || order.reviews.length === 0) return res.status(404).json({ success: false, error: 'Review not found' });
      order.reviews[0].farmerReply = replyData;
      return res.json({ success: true, order });
    }
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
