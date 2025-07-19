import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get('/orders');
        setOrders(response.data);
      } catch (error) {
        setError('Failed to fetch orders.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>Loading orders...</div>;
  if (error) return <div style={{ padding: '20px', textAlign: 'center' }}>Error: {error}</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Your Order History</h2>
      {orders.length === 0 ? (
        <p>You have no past orders.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {orders.map((order) => (
            <li key={order.id} style={{ border: '1px solid #eee', marginBottom: '10px', padding: '15px', borderRadius: '5px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <strong>Order ID: {order.id}</strong>
                <span>Date: {new Date(order.date).toLocaleDateString()}</span>
              </div>
              <div>
                <strong>Total: ${order.total}</strong>
              </div>
              <ul style={{ listStyle: 'none', padding: '10px 0 0 0', borderTop: '1px dashed #eee', marginTop: '10px' }}>
                {order.items.map((item, index) => (
                  <li key={index} style={{ fontSize: '0.9em', color: '#555' }}>
                    {item.name} - ${item.price}
                  </li>
                ))}
              </ul>
              <div style={{ textAlign: 'right', marginTop: '10px' }}>
                <Link to={`/order/${order.id}`} style={{ textDecoration: 'none', color: '#007bff' }}>View Details</Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default OrderHistory;