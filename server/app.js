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
const adminRoutes = require('./routes/admin');
const notificationsRoutes = require('./routes/notifications');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// Public routes (no authentication required)
app.use('/api/users', usersRoutes);

// Define auth middleware
const auth = require('./middleware/auth');

// Protected routes (authentication required)
app.use('/api/products', auth, productsRoutes);
app.use('/api/orders', auth, ordersRoutes);
app.use('/api/reviews', auth, reviewsRoutes);
app.use('/api/payments', auth, paymentsRoutes);
app.use('/api/tickets', auth, ticketsRoutes);
app.use('/api/admin', auth, adminRoutes);
app.use('/api/notifications', auth, notificationsRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});