const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken')
const productsRoutes = require('./routes/products');
const usersRoutes = require('./routes/users');
const ordersRoutes = require('./routes/orders');
const reviewsRoutes = require('./routes/reviews');
const paymentsRoutes = require('./routes/payments');
const ticketsRoutes = require('./routes/tickets');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// Define auth middleware globally
const auth = (req, res, next) => {
  // Allow login and register routes to pass without token
  if (req.path === '/api/users/login' || req.path === '/api/users/register') {
    return next();
  }

  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }
  try {
    const decoded = jwt.verify(token, 'software testing is prefect');
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

// Public routes (no authentication required)
// Apply authentication middleware to all other routes
app.use(auth);

// Protected routes
app.use('/api/users', auth, usersRoutes);
app.use('/api/products', auth, productsRoutes);
app.use('/api/orders', auth, ordersRoutes);
app.use('/api/reviews', auth, reviewsRoutes);
app.use('/api/payments', auth, paymentsRoutes);
app.use('/api/tickets', auth, ticketsRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});