// server/models/Order.js
// Simulate Order model
const orders = [
  {
    id: 1,
    userId: 1, // Assuming a test user ID
    items: [
      {
        id: 101,
        name: 'Test Product A',
        price: 10.00,
        quantity: 1
      }
    ],
    total: 10.00,
    date: '2024-01-01T12:00:00.000Z', // ISO string for 2024-01-01
    shippingAddress: {
      street: '123 Test St',
      city: 'Test City',
      state: 'TS',
      zip: '12345'
    },
    paymentInfo: {
      card: '**** **** **** 1234'
    }
  }
];

module.exports = orders;