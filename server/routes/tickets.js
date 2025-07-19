const express = require('express');
const router = express.Router();
const tickets = require('../models/Ticket');

// Submit a new ticket
router.post('/', (req, res) => {
  const { subject, description } = req.body;
  const newTicket = {
    id: tickets.length + 1,
    userId: req.user.id, // Assuming user is authenticated
    subject,
    description,
    status: 'Open',
    createdAt: new Date().toISOString(),
  };
  tickets.push(newTicket);
  res.status(201).json({ msg: 'Ticket submitted successfully', ticket: newTicket });
});

// Get all tickets for the authenticated user
router.get('/', (req, res) => {
  const userId = req.user.id;
  const userTickets = tickets.filter(ticket => ticket.userId === userId);
  res.json(userTickets);
});

module.exports = router;