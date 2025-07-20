// server/routes/orders.js
const express = require('express');
const router = express.Router();
const orders = require('../models/Order');
const products = require('../models/Product'); // Import products model
const reviews = require('../models/Review');

// Get all orders for the authenticated user
router.get('/', (req, res) => {
  const userId = req.user.id;
  const userOrders = orders.filter(order => order.userId === userId);
  res.json(userOrders);
});

// Get a specific order by ID 
router.get('/:id', (req, res) => {
  const orderId = parseInt(req.params.id);
  const userId = req.user.id;
  const order = orders.find((o) => o.id === orderId && o.userId === userId);
  if (order) {
    const productIds = order.items.map(item => item.id);
    const relatedReviews = reviews.filter(review => productIds.includes(review.productId));
    res.json({ ...order, reviews: relatedReviews });
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
});

// Create a new order
router.post('/', (req, res) => {
  const { items, total, shippingAddress, paymentInfo } = req.body;

  // Check stock for each item
  for (const item of items) {
    const product = products.find(p => p.id === item.id);
    const quantity = item.quantity || 1; // Default to 1 if quantity not specified
    if (!product || product.stock < quantity) {
      return res.status(400).json({ message: `Only ${product ? product.stock : 0} in stock for ${item.name}` });
    }
  }

  const newOrder = {
    id: orders.length + 1,
    userId: req.user.id, // Associate order with the authenticated user
    items,
    total,
    date: new Date().toISOString(),
    shippingAddress,
    paymentInfo
  };
  orders.push(newOrder);

  // Decrease stock for each item
  for (const item of items) {
    const productIndex = products.findIndex(p => p.id === item.id);
    if (productIndex !== -1) {
      const quantity = item.quantity || 1; // Default to 1 if quantity not specified
      products[productIndex].stock -= quantity;
    }
  }

  res.status(201).json(newOrder);
});

// Update an existing order
router.put('/:id', (req, res) => {
  const orderId = parseInt(req.params.id);
  const userId = req.user.id;
  const orderIndex = orders.findIndex((o) => o.id === orderId && o.userId === userId);
  if (orderIndex !== -1) {
    orders[orderIndex] = { ...orders[orderIndex], ...req.body };
    res.json(orders[orderIndex]);
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
});

// Delete an order
router.delete('/:id', (req, res) => {
  const orderId = parseInt(req.params.id);
  const userId = req.user.id;
  const orderIndex = orders.findIndex((o) => o.id === orderId && o.userId === userId);
  if (orderIndex !== -1) {
    orders.splice(orderIndex, 1);
    res.status(204).send();
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
});

// Request return for an order
router.post('/:id/return', (req, res) => {
  const orderId = parseInt(req.params.id);
  const userId = req.user.id;
  const { reason } = req.body;
  const order = orders.find((o) => o.id === orderId && o.userId === userId);
  
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  // Check if order is already returned or has a pending return request
  if (order.returnStatus === 'returned') {
    return res.status(400).json({ message: 'Order has already been returned' });
  }
  
  if (order.returnStatus === 'pending') {
    return res.status(400).json({ message: 'Return request is already pending admin approval' });
  }

  // Check if order is within 1 month (30 days)
  const orderDate = new Date(order.date);
  const currentDate = new Date();
  const daysDifference = Math.floor((currentDate - orderDate) / (1000 * 60 * 60 * 24));
  
  if (daysDifference > 30) {
    return res.status(400).json({ message: 'Return period has expired. Returns are only allowed within 30 days of purchase.' });
  }

  // Create return request pending admin approval
  const orderIndex = orders.findIndex((o) => o.id === orderId && o.userId === userId);
  orders[orderIndex] = { 
    ...orders[orderIndex], 
    returnStatus: 'pending',
    returnRequestDate: new Date().toISOString(),
    returnReason: reason || 'No reason provided'
  };

  res.json({ message: 'Return request submitted successfully. Awaiting admin approval.', order: orders[orderIndex] });
});

module.exports = router;