// server/routes/reviews.js
const express = require('express');
const router = express.Router();
const reviews = require('../models/Review');

// Get all reviews 
router.get('/', (req, res) => {
  res.json(reviews);
});

// Create a new review 
router.post('/', (req, res) => {
  const newReview = {
    id: reviews.length + 1,
    ...req.body,
  };
  reviews.push(newReview);
  res.status(201).json(newReview);
});

module.exports = router;