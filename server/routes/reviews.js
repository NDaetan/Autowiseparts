// server/routes/reviews.js
const express = require('express');
const router = express.Router();
const reviews = require('../models/Review');
const orders = require('../models/Order');
const users = require('../models/User');

// Get all reviews 
router.get('/', (req, res) => {
  const reviewsWithUserInfo = reviews.map(review => {
    const user = users.find(u => u.id === review.userId);
    return {
      ...review,
      username: user ? user.username : 'Anonymous'
    };
  });
  res.json(reviewsWithUserInfo);
});

// Create a new review 
router.post('/', (req, res) => {
  const { productId, rating, comment } = req.body;
  const userId = req.user.id;

  const hasPurchased = orders.some(order => 
    order.userId === userId && order.items.some(item => item.id === productId)
  );

  if (!hasPurchased) {
    return res.status(403).json({ msg: 'You can only review products you have purchased.' });
  }

  const newReview = {
    id: reviews.length + 1,
    productId,
    userId,
    rating,
    comment,
    date: new Date().toISOString(),
  };
  reviews.push(newReview);
  res.status(201).json(newReview);
});

module.exports = router;