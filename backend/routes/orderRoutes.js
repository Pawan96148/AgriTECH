const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const { isDbConnected } = require('../db');
const { mockOrders, mockProducts } = require('../mockStore');
const { optionalAuthMiddleware } = require('../jwt');

const JHARKHAND_DISTRICTS = [
  'Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Deoghar', 'Hazaribagh',
  'Giridih', 'Ramgarh', 'Dumka', 'Chaibasa', 'Palamu', 'Gumla',
  'Simdega', 'Latehar', 'Lohardaga', 'Koderma', 'Godda', 'Sahebganj',
  'Pakur', 'Jamtara', 'Khunti', 'Seraikela Kharsawan', 'Garhwa', 'Chatra'
];

// GET /api/orders
router.get('/', optionalAuthMiddleware, async (req, res) => {
  try {
    const { customerId, farmerId, deliveryBoyId, status } = req.query;
    const user = req.user;

    if (isDbConnected()) {
      const query = {};
      if (customerId) query.customerId = customerId;
      else if (user && user.role === 'CUSTOMER') query.customerId = user.id;

      if (farmerId) query.farmerId = farmerId;
      else if (user && user.role === 'FARM_OWNER') query.farmerId = user.id;

      if (deliveryBoyId) query.deliveryBoyId = deliveryBoyId;
      else if (user && user.role === 'DELIVERY_PARTNER') query.deliveryBoyId = user.id;

      if (status) query.deliveryStatus = status;

      let orders = await Order.find(query).sort({ createdAt: -1 });

      if (orders.length === 0 && Object.keys(query).length === 0) {
        await Order.insertMany(mockOrders);
        orders = await Order.find({}).sort({ createdAt: -1 });
      }

      return res.json({ success: true, count: orders.length, orders });
    } else {
      let filtered = [...mockOrders];
      const activeCustomerId = customerId || (user && user.role === 'CUSTOMER' ? user.id : null);
      const activeFarmerId = farmerId || (user && user.role === 'FARM_OWNER' ? user.id : null);
      const activeDeliveryBoyId = deliveryBoyId || (user && user.role === 'DELIVERY_PARTNER' ? user.id : null);

      if (activeCustomerId) filtered = filtered.filter(o => o.customerId === activeCustomerId);
      if (activeFarmerId) filtered = filtered.filter(o => o.farmerId === activeFarmerId);
      if (activeDeliveryBoyId) filtered = filtered.filter(o => o.deliveryBoyId === activeDeliveryBoyId);
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

// POST /api/orders (Create order with bulk validation & Jharkhand check)
router.post('/', optionalAuthMiddleware, async (req, res) => {
  try {
    const { customerAddress, paymentMethod, items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, error: 'Order must contain at least one agricultural produce item.' });
    }

    if (!customerAddress || !customerAddress.fullName || !customerAddress.phone || !customerAddress.street) {
      return res.status(400).json({ success: false, error: 'Complete delivery address details are required.' });
    }

    // Validate phone number
    const phoneDigits = (customerAddress.phone || '').replace(/\D/g, '');
    if (phoneDigits.length < 10) {
      return res.status(400).json({ success: false, error: 'Please enter a valid 10-digit mobile number for delivery coordination.' });
    }

    // Validate Jharkhand restriction
    const districtName = (customerAddress.district || '').trim();
    const isOutside = (customerAddress.state && customerAddress.state !== 'Jharkhand') ||
                      districtName.toLowerCase().includes('outside') ||
                      !JHARKHAND_DISTRICTS.some(d => d.toLowerCase() === districtName.toLowerCase());

    if (isOutside) {
      return res.status(400).json({
        success: false,
        error: 'Currently available only within Jharkhand. We only support intra-state farm-to-doorstep fulfillment.'
      });
    }

    // Validate each item for stock availability and bulk minimum order quantity (>= 5 kg for kg)
    for (const item of items) {
      let prod;
      if (isDbConnected()) {
        prod = await Product.findOne({ id: item.productId || item.id });
      } else {
        prod = mockProducts.find(p => p.id === (item.productId || item.id));
      }

      if (!prod) {
        return res.status(404).json({ success: false, error: `Product "${item.cropName || 'Item'}" not found in marketplace.` });
      }

      const minQty = prod.minimumOrderQuantity || 5;
      const requestedQty = Number(item.quantity) || 1;

      if (requestedQty < minQty) {
        return res.status(400).json({
          success: false,
          error: `Minimum agricultural order quantity for ${prod.cropName} is ${minQty} ${prod.unit}. Normal retail quantities below ${minQty} ${prod.unit} are not allowed.`
        });
      }

      if (prod.availableQuantity <= 0 || prod.stockStatus === 'OUT_OF_STOCK') {
        return res.status(400).json({
          success: false,
          error: `"${prod.cropName}" is currently Out of Stock.`
        });
      }

      if (requestedQty > prod.availableQuantity) {
        return res.status(400).json({
          success: false,
          error: `Requested quantity (${requestedQty} ${prod.unit}) exceeds available farm stock (${prod.availableQuantity} ${prod.unit}) for ${prod.cropName}.`
        });
      }
    }

    const subtotal = items.reduce((acc, it) => acc + (Number(it.pricePerUnit) * Number(it.quantity)), 0);
    const deliveryFee = 40;
    const totalAmount = subtotal + deliveryFee;

    const primaryFarmerId = items[0]?.farmerId || 'usr_farmer_jharkhand';
    const primaryFarmerName = items[0]?.farmerName || 'Ramesh Mahto';
    const primaryFarmerLocation = items[0]?.farmerLocation || 'Ranchi';

    const now = new Date();
    const formattedNow = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    const newOrderData = {
      id: `ORD-JH-${Math.floor(1000 + Math.random() * 9000)}`,
      customerId: req.user?.id || 'usr_customer_jharkhand',
      customerName: customerAddress.fullName,
      customerPhone: customerAddress.phone,
      deliveryAddress: {
        fullName: customerAddress.fullName,
        phone: customerAddress.phone,
        street: customerAddress.street,
        villageArea: customerAddress.villageArea || '',
        city: customerAddress.city || customerAddress.district || 'Ranchi',
        district: customerAddress.district,
        state: 'Jharkhand',
        pincode: customerAddress.pincode,
        landmark: customerAddress.landmark || ''
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
        quantity: Number(it.quantity) || 5,
        unit: it.unit || 'kg',
        pricePerUnit: Number(it.pricePerUnit),
        subtotal: Number(it.pricePerUnit) * (Number(it.quantity) || 5),
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
        { status: 'DELIVERY_BOY_ASSIGNED', label: 'Delivery Boy Assigned', timestamp: 'Pending', location: `${primaryFarmerLocation} Logistics Hub`, note: 'Assigned to verified AgriExpress delivery partner', completed: false },
        { status: 'PICKED_UP', label: 'Picked Up by Courier', timestamp: 'Pending', location: `${primaryFarmerLocation} Dispatch Hub`, note: 'AgriExpress local rural transit partner collected batch', completed: false },
        { status: 'IN_TRANSIT', label: 'In Transit', timestamp: 'Pending', location: 'Intra-Jharkhand Transit Corridor', note: 'Fast highway transportation direct to delivery district', completed: false },
        { status: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', timestamp: 'Pending', location: `${customerAddress.district || 'Ranchi'} Local Delivery Center`, note: 'Assigned to local field partner for doorstep delivery', completed: false },
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
            prod.availableQuantity = Math.max(0, prod.availableQuantity - (Number(item.quantity) || 5));
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
          prod.availableQuantity = Math.max(0, prod.availableQuantity - (Number(item.quantity) || 5));
          prod.stockStatus = prod.availableQuantity === 0 ? 'OUT_OF_STOCK' : prod.availableQuantity < 30 ? 'LOW_STOCK' : 'IN_STOCK';
        }
      }

      return res.status(201).json({ success: true, message: 'Order placed successfully (In-Memory)', order: newOrderData });
    }
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/orders/:id/assign (Assign Delivery Boy)
router.patch('/:id/assign', optionalAuthMiddleware, async (req, res) => {
  try {
    const { deliveryBoyId, deliveryBoyName, deliveryBoyPhone } = req.body;

    if (!deliveryBoyId || !deliveryBoyName) {
      return res.status(400).json({ success: false, error: 'Delivery Boy ID and Name are required.' });
    }

    const now = new Date();
    const formattedNow = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    const updateData = {
      deliveryBoyId,
      deliveryBoyName,
      deliveryBoyPhone: deliveryBoyPhone || '+91 94314 77889',
      assignedAt: formattedNow,
      deliveryStatus: 'DELIVERY_BOY_ASSIGNED'
    };

    if (isDbConnected()) {
      const order = await Order.findOne({ id: req.params.id });
      if (!order) return res.status(404).json({ success: false, error: 'Order not found' });

      order.deliveryBoyId = updateData.deliveryBoyId;
      order.deliveryBoyName = updateData.deliveryBoyName;
      order.deliveryBoyPhone = updateData.deliveryBoyPhone;
      order.assignedAt = updateData.assignedAt;
      order.deliveryStatus = 'DELIVERY_BOY_ASSIGNED';

      order.timeline = order.timeline.map((m) => {
        if (m.status === 'DELIVERY_BOY_ASSIGNED') {
          return { ...m.toObject(), completed: true, timestamp: formattedNow, note: `Assigned to ${deliveryBoyName} (${order.deliveryBoyPhone})` };
        }
        if (m.status === 'ORDER_PLACED' || m.status === 'FARMER_ACCEPTED' || m.status === 'PACKED') {
          return { ...m.toObject(), completed: true };
        }
        return m;
      });

      await order.save();
      return res.json({ success: true, message: `Assigned to Delivery Partner ${deliveryBoyName}`, order });
    } else {
      const order = mockOrders.find(o => o.id === req.params.id);
      if (!order) return res.status(404).json({ success: false, error: 'Order not found' });

      order.deliveryBoyId = updateData.deliveryBoyId;
      order.deliveryBoyName = updateData.deliveryBoyName;
      order.deliveryBoyPhone = updateData.deliveryBoyPhone;
      order.assignedAt = updateData.assignedAt;
      order.deliveryStatus = 'DELIVERY_BOY_ASSIGNED';

      order.timeline = order.timeline.map((m) => {
        if (m.status === 'DELIVERY_BOY_ASSIGNED') {
          return { ...m, completed: true, timestamp: formattedNow, note: `Assigned to ${deliveryBoyName} (${order.deliveryBoyPhone})` };
        }
        if (m.status === 'ORDER_PLACED' || m.status === 'FARMER_ACCEPTED' || m.status === 'PACKED') {
          return { ...m, completed: true };
        }
        return m;
      });

      return res.json({ success: true, message: `Assigned to Delivery Partner ${deliveryBoyName}`, order });
    }
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/orders/:id/location (Delivery Boy GPS periodic update)
router.post('/:id/location', optionalAuthMiddleware, async (req, res) => {
  try {
    const { latitude, longitude, timestamp } = req.body;

    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json({ success: false, error: 'Latitude and Longitude are required.' });
    }

    const now = new Date();
    const formattedNow = timestamp || `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    const handleOrderLocation = (order) => {
      // Privacy & safety: stop accepting GPS after delivery or cancellation
      if (order.deliveryStatus === 'DELIVERED' || order.deliveryStatus === 'CANCELLED') {
        if (order.currentLocation) order.currentLocation.isSharing = false;
        return { stopped: true };
      }

      const newLoc = {
        latitude: Number(latitude),
        longitude: Number(longitude),
        updatedAt: formattedNow,
        isSharing: true
      };

      order.currentLocation = newLoc;
      if (!order.locationHistory) order.locationHistory = [];
      order.locationHistory.push({
        latitude: Number(latitude),
        longitude: Number(longitude),
        timestamp: formattedNow,
        status: order.deliveryStatus
      });

      return { stopped: false, newLoc };
    };

    if (isDbConnected()) {
      const order = await Order.findOne({ id: req.params.id });
      if (!order) return res.status(404).json({ success: false, error: 'Order not found' });

      const result = handleOrderLocation(order);
      if (result.stopped) {
        await order.save();
        return res.json({ success: true, message: 'Location sharing is inactive for completed deliveries.', isSharing: false });
      }

      await order.save();
      return res.json({ success: true, currentLocation: result.newLoc });
    } else {
      const order = mockOrders.find(o => o.id === req.params.id);
      if (!order) return res.status(404).json({ success: false, error: 'Order not found' });

      const result = handleOrderLocation(order);
      if (result.stopped) {
        return res.json({ success: true, message: 'Location sharing is inactive for completed deliveries.', isSharing: false });
      }

      return res.json({ success: true, currentLocation: result.newLoc });
    }
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/orders/:id/location (Retrieve live GPS location for tracking map)
router.get('/:id/location', optionalAuthMiddleware, async (req, res) => {
  try {
    let order;
    if (isDbConnected()) {
      order = await Order.findOne({ id: req.params.id });
    } else {
      order = mockOrders.find(o => o.id === req.params.id);
    }

    if (!order) return res.status(404).json({ success: false, error: 'Order not found' });

    // Location privacy: only Customer, Farmer, assigned Delivery Boy, or Admin can access
    const user = req.user;
    if (user) {
      if (user.role === 'CUSTOMER' && order.customerId !== user.id) {
        return res.status(403).json({ success: false, error: 'Forbidden: You can only track your own order.' });
      }
      if (user.role === 'FARM_OWNER' && order.farmerId !== user.id) {
        return res.status(403).json({ success: false, error: 'Forbidden: You can only track orders for your farm.' });
      }
      if (user.role === 'DELIVERY_PARTNER' && order.deliveryBoyId !== user.id) {
        return res.status(403).json({ success: false, error: 'Forbidden: You can only track your assigned delivery.' });
      }
    }

    return res.json({
      success: true,
      orderId: order.id,
      deliveryStatus: order.deliveryStatus,
      currentLocation: order.currentLocation || null,
      locationHistory: order.locationHistory || [],
      isSharing: order.currentLocation?.isSharing || false
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/orders/:id/milestone (Advance milestone status)
router.patch('/:id/milestone', optionalAuthMiddleware, async (req, res) => {
  try {
    const { nextStatus, note } = req.body;
    const now = new Date();
    const formattedNow = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    const applyMilestone = (order) => {
      let foundCurrent = false;
      order.timeline = order.timeline.map((m) => {
        if (m.status === nextStatus) {
          foundCurrent = true;
          return { ...(typeof m.toObject === 'function' ? m.toObject() : m), completed: true, timestamp: formattedNow, note: note || m.note };
        }
        if (!foundCurrent) {
          return { ...(typeof m.toObject === 'function' ? m.toObject() : m), completed: true };
        }
        return m;
      });

      order.deliveryStatus = nextStatus;
      if (nextStatus === 'DELIVERED') {
        if (order.paymentMethod === 'COD') order.paymentStatus = 'PAID';
        if (order.currentLocation) order.currentLocation.isSharing = false;
      }
    };

    if (isDbConnected()) {
      const order = await Order.findOne({ id: req.params.id });
      if (!order) return res.status(404).json({ success: false, error: 'Order not found' });

      applyMilestone(order);
      await order.save();
      return res.json({ success: true, message: `Milestone advanced to ${nextStatus}`, order });
    } else {
      const order = mockOrders.find(o => o.id === req.params.id);
      if (!order) return res.status(404).json({ success: false, error: 'Order not found' });

      applyMilestone(order);
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
