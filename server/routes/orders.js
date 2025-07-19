// server/routes/orders.js
const express = require('express');
const router = express.Router();
const orders = require('../models/Order');
const products = require('../models/Product'); // Import products model

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
    res.json(order);
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
});

// Create a new order
router.post('/', (req, res) => {
  const { items, total } = req.body;

  // Check stock for each item
  for (const item of items) {
    const product = products.find(p => p.id === item.id);
    if (!product || product.stock < item.quantity) { // Assuming item has a quantity property
      return res.status(400).json({ message: `Insufficient stock for ${item.name}` });
    }
  }

  const newOrder = {
    id: orders.length + 1,
    userId: req.user.id, // Associate order with the authenticated user
    items,
    total,
    date: new Date().toISOString(),
  };
  orders.push(newOrder);

  // Decrease stock for each item
  for (const item of items) {
    const productIndex = products.findIndex(p => p.id === item.id);
    if (productIndex !== -1) {
      products[productIndex].stock -= item.quantity; // Assuming item has a quantity property
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

module.exports = router;