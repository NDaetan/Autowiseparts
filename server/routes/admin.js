// server/routes/admin.js
const express = require('express');
const router = express.Router();
const orders = require('../models/Order');
const products = require('../models/Product');
const tickets = require('../models/Ticket');
const users = require('../models/User');

// Admin access middleware
const requireAdmin = (req, res, next) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user || user.username !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

// Apply admin middleware to all routes
router.use(requireAdmin);

// Get pending return requests
router.get('/pending-returns', (req, res) => {
  const pendingReturns = orders.filter(order => order.returnStatus === 'pending');
  res.json(pendingReturns);
});

// Get all tickets for admin
router.get('/tickets', (req, res) => {
  res.json(tickets);
});

// Approve return request
router.post('/returns/:id/approve', (req, res) => {
  const orderId = parseInt(req.params.id);
  const orderIndex = orders.findIndex(o => o.id === orderId);
  
  if (orderIndex === -1) {
    return res.status(404).json({ message: 'Order not found' });
  }

  const order = orders[orderIndex];
  if (order.returnStatus !== 'pending') {
    return res.status(400).json({ message: 'Return request is not pending' });
  }

  // Update order status to returned
  orders[orderIndex] = {
    ...order,
    returnStatus: 'returned',
    returnDate: new Date().toISOString(),
    returnNotificationRead: false
  };

  // Restore stock for returned items
  for (const item of order.items) {
    const productIndex = products.findIndex(p => p.id === item.id);
    if (productIndex !== -1) {
      const quantity = item.quantity || 1;
      products[productIndex].stock += quantity;
    }
  }

  res.json({ message: 'Return approved successfully', order: orders[orderIndex] });
});

// Reject return request
router.post('/returns/:id/reject', (req, res) => {
  const orderId = parseInt(req.params.id);
  const orderIndex = orders.findIndex(o => o.id === orderId);
  
  if (orderIndex === -1) {
    return res.status(404).json({ message: 'Order not found' });
  }

  const order = orders[orderIndex];
  if (order.returnStatus !== 'pending') {
    return res.status(400).json({ message: 'Return request is not pending' });
  }

  // Update order status to rejected
  orders[orderIndex] = {
    ...order,
    returnStatus: 'rejected',
    returnRejectedDate: new Date().toISOString(),
    returnNotificationRead: false
  };

  res.json({ message: 'Return rejected successfully', order: orders[orderIndex] });
});

// Add new product
router.post('/products', (req, res) => {
  const { name, price, description, stock } = req.body;
  
  if (!name || !price || !description || stock === undefined) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const newProduct = {
    id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
    name,
    price: parseFloat(price),
    description,
    stock: parseInt(stock)
  };

  products.push(newProduct);
  res.status(201).json({ message: 'Product added successfully', product: newProduct });
});

// Update product stock
router.put('/products/:id/stock', (req, res) => {
  const productId = parseInt(req.params.id);
  const { stock } = req.body;
  const productIndex = products.findIndex(p => p.id === productId);
  
  if (productIndex === -1) {
    return res.status(404).json({ message: 'Product not found' });
  }

  if (stock < 0) {
    return res.status(400).json({ message: 'Stock cannot be negative' });
  }

  products[productIndex].stock = parseInt(stock);
  res.json({ message: 'Stock updated successfully', product: products[productIndex] });
});

// Delete product
router.delete('/products/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  const productIndex = products.findIndex(p => p.id === productId);
  
  if (productIndex === -1) {
    return res.status(404).json({ message: 'Product not found' });
  }

  products.splice(productIndex, 1);
  res.json({ message: 'Product deleted successfully' });
});

// Resolve ticket
router.post('/tickets/:id/resolve', (req, res) => {
  const ticketId = parseInt(req.params.id);
  const ticketIndex = tickets.findIndex(t => t.id === ticketId);
  
  if (ticketIndex === -1) {
    return res.status(404).json({ message: 'Ticket not found' });
  }

  tickets[ticketIndex] = {
    ...tickets[ticketIndex],
    status: 'Resolved',
    resolvedAt: new Date().toISOString(),
    notificationRead: false
  };

  res.json({ message: 'Ticket resolved successfully', ticket: tickets[ticketIndex] });
});

// Close ticket
router.post('/tickets/:id/close', (req, res) => {
  const ticketId = parseInt(req.params.id);
  const ticketIndex = tickets.findIndex(t => t.id === ticketId);
  
  if (ticketIndex === -1) {
    return res.status(404).json({ message: 'Ticket not found' });
  }

  tickets[ticketIndex] = {
    ...tickets[ticketIndex],
    status: 'Closed',
    closedAt: new Date().toISOString(),
    notificationRead: false
  };

  res.json({ message: 'Ticket closed successfully', ticket: tickets[ticketIndex] });
});

module.exports = router;