// server/routes/users.js
const express = require('express');
const router = express.Router();
const users = require('../models/User');

// Get all users 
router.get('/', (req, res) => {
  res.json(users);
});

// Create a new user
router.post('/', (req, res) => {
  const newUser = {
    id: users.length + 1,
    ...req.body,
  };
  users.push(newUser);
  res.status(201).json(newUser);
});

module.exports = router;