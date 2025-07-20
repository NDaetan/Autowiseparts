// client/src/components/NotificationBox.js
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import api from '../services/api';

function NotificationBox() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await api.get('/notifications');
      setNotifications(response.data);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = async (notification) => {
    try {
      // Mark as read
      await api.post(`/notifications/mark-read/${notification.type}/${notification.orderId || notification.ticketId}`);
      
      // Remove from local state
      setNotifications(notifications.filter(n => n.id !== notification.id));
      
      // Navigate to the relevant page
      history.push(notification.link);
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      // Still navigate even if marking as read fails
      history.push(notification.link);
    }
  };

  if (notifications.length === 0) {
    return null; // Don't show anything if no notifications
  }

  return (
    <div style={{
      position: 'fixed',
      top: '80px',
      right: '20px',
      backgroundColor: '#fff',
      border: '1px solid #ccc',
      borderRadius: '6px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      maxWidth: '300px',
      zIndex: 1000
    }}>
      <div style={{
        padding: '10px',
        borderBottom: '1px solid #eee',
        backgroundColor: '#f8f9fa',
        fontWeight: 'bold',
        fontSize: '14px'
      }}>
        Notifications ({notifications.length})
      </div>
      
      <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
        {notifications.map((notification, index) => (
          <div
            key={notification.id}
            onClick={() => handleNotificationClick(notification)}
            style={{
              padding: '10px',
              borderBottom: index < notifications.length - 1 ? '1px solid #f0f0f0' : 'none',
              cursor: 'pointer',
              backgroundColor: 'white',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
          >
            <div style={{
              fontWeight: 'bold',
              fontSize: '12px',
              marginBottom: '3px',
              color: notification.type === 'return' ? '#28a745' : '#007bff'
            }}>
              {notification.title}
            </div>
            <div style={{
              fontSize: '11px',
              color: '#666',
              lineHeight: '1.3'
            }}>
              {notification.message}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NotificationBox;
