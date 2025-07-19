// server/routes/users.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register a new user
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

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

module.exports = router;