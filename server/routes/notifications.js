// server/routes/notifications.js
const express = require('express');
const router = express.Router();
const orders = require('../models/Order');
const tickets = require('../models/Ticket');

// Get unread notifications for current user
router.get('/', (req, res) => {
  const userId = req.user.id;
  const notifications = [];

  // Check for unread return notifications
  const userOrders = orders.filter(order => 
    order.userId === userId && 
    (order.returnStatus === 'returned' || order.returnStatus === 'rejected') &&
    order.returnNotificationRead === false
  );

  userOrders.forEach(order => {
    notifications.push({
      id: `return-${order.id}`,
      type: 'return',
      title: `Return ${order.returnStatus === 'returned' ? 'Approved' : 'Rejected'}`,
      message: `Your return request for Order #${order.id} has been ${order.returnStatus}`,
      link: `/order/${order.id}`,
      createdAt: order.returnStatus === 'returned' ? order.returnDate : order.returnRejectedDate,
      orderId: order.id
    });
  });

  // Check for unread ticket notifications
  const userTickets = tickets.filter(ticket => 
    ticket.userId === userId && 
    (ticket.status === 'Resolved' || ticket.status === 'Closed') &&
    ticket.notificationRead === false
  );

  userTickets.forEach(ticket => {
    notifications.push({
      id: `ticket-${ticket.id}`,
      type: 'ticket',
      title: `Ticket ${ticket.status}`,
      message: `Your ticket "${ticket.subject}" has been ${ticket.status.toLowerCase()}`,
      link: `/tickets`,
      createdAt: ticket.status === 'Resolved' ? ticket.resolvedAt : ticket.closedAt,
      ticketId: ticket.id
    });
  });

  // Sort by creation date (newest first)
  notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  res.json(notifications);
});

// Mark notification as read
router.post('/mark-read/:type/:id', (req, res) => {
  const { type, id } = req.params;
  const userId = req.user.id;

  if (type === 'return') {
    const orderIndex = orders.findIndex(order => 
      order.id === parseInt(id) && order.userId === userId
    );
    if (orderIndex !== -1) {
      orders[orderIndex] = { ...orders[orderIndex], returnNotificationRead: true };
    }
  } else if (type === 'ticket') {
    const ticketIndex = tickets.findIndex(ticket => 
      ticket.id === parseInt(id) && ticket.userId === userId
    );
    if (ticketIndex !== -1) {
      tickets[ticketIndex] = { ...tickets[ticketIndex], notificationRead: true };
    }
  }

  res.json({ message: 'Notification marked as read' });
});

module.exports = router;