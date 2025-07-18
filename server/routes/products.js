// server/routes/products.js
const express = require('express');
const router = express.Router();
const products = require('../models/Product');

// Get all products
router.get('/', (req, res) => {
  res.json(products);
});

// Get a specific product by ID 
router.get('/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  const product = products.find((p) => p.id === productId);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

module.exports = router;