// server/routes/users.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register a new user
router.post('/register', async (req, res) => {
  const { username, password, email, address, phone } = req.body;

  // Server-side validation
  if (!/^[a-zA-Z0-9_]{6,20}$/.test(username)) {
    return res.status(400).json({ msg: 'Username must be 6-20 alphanumeric characters or underscores.' });
  }
  if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}/.test(password)) {
    return res.status(400).json({ msg: 'Password must be at least 8 characters, include uppercase, lowercase, number, and special character.' });
  }

  try {
    let user = User.find(u => u.username === username);
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }
    const newUser = {
      id: User.length + 1,
      username,
      password,
      email,
      address,
      phone,
    };
    User.push(newUser);
    const payload = {
      user: {
        id: newUser.id,
      },
    };
    jwt.sign(
      payload,
      'software testing is prefect',
      { expiresIn: 3600 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Login a user
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  try {
    let user = User.find(u => u.username === username);
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
    const isMatch = password === user.password;
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
    const payload = {
      user: {
        id: user.id,
      },
    };
    jwt.sign(
      payload,
      'software testing is prefect',
      { expiresIn: 3600 },
      (err, token) => {
        if (err) throw err;
        res.json({ token, username: user.username });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get user profile
router.get('/profile', auth, (req, res) => {
  const userId = req.user.id;
  const user = User.find(u => u.id === userId);
  if (user) {
    // Exclude password for security
    const { password, ...userProfile } = user;
    res.json(userProfile);
  } else {
    res.status(404).json({ msg: 'User not found' });
  }
});

// Update user profile
router.put('/profile', (req, res) => {
  const { email, address, phone } = req.body;
  const userId = req.user.id;

  let userIndex = User.findIndex(u => u.id === userId);

  if (userIndex !== -1) {
    User[userIndex] = { ...User[userIndex], email, address, phone };
    res.json({ msg: 'Profile updated successfully' });
  } else {
    res.status(404).json({ msg: 'User not found' });
  }
});

// Change user password
router.put('/change-password', (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user.id; // From auth middleware

  let user = User.find(u => u.id === userId);

  if (!user) {
    return res.status(404).json({ msg: 'User not found' });
  }

  // In a real application, you would hash and compare passwords securely
  if (user.password !== oldPassword) {
    return res.status(400).json({ msg: 'Old password is incorrect' });
  }

  // Server-side validation for new password
  if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}/.test(newPassword)) {
    return res.status(400).json({ msg: 'New password must be at least 8 characters, include uppercase, lowercase, number, and special character.' });
  }

  user.password = newPassword; // In a real app, hash and save new password
  res.json({ msg: 'Password updated successfully' });
});

module.exports = router;
