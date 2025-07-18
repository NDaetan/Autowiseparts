// client/src/components/OrderTracking.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

function OrderTracking() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await api.get(`/orders/${id}`);
        setOrder(response.data);
      } catch (error) {
        setError('Order not found');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>Loading order...</div>;
  if (error) return <div style={{ padding: '20px', textAlign: 'center' }}>Error: {error}</div>;
  if (!order) return <div style={{ padding: '20px', textAlign: 'center' }}>Order not found</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Order Tracking</h2>
      <div style={{ marginBottom: '20px' }}>
        <p><strong>Order ID:</strong> {order.id}</p>
        <p><strong>Date:</strong> {new Date(order.date).toLocaleDateString()}</p>
        <p><strong>Status:</strong> <span style={{ color: '#28a745' }}>Shipped</span></p>
        <p><strong>Total:</strong> ${order.total}</p>
      </div>

      <h3>Order Items</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {order.items && order.items.map((item, index) => (
          <li key={index} style={{ borderBottom: '1px solid #eee', padding: '10px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>{item.name}</span>
              <span>${item.price}</span>
            </div>
          </li>
        ))}
      </ul>

      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
        <h4>Tracking Information</h4>
        <p>Your order is on its way! Expected delivery: 3-5 business days</p>
        <p>Tracking number: AWP{order.id}2024</p>
      </div>
    </div>
  );
}

export default OrderTracking;