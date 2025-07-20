// client/src/components/OrderDetail.js
import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import Review from './Review';
import { useAuth } from '../context/AuthContext';

function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [returnLoading, setReturnLoading] = useState(false);
  const [showReturnForm, setShowReturnForm] = useState(false);
  const [returnReason, setReturnReason] = useState('');
  const { getUserId } = useAuth();
  const currentUserId = getUserId();

  const fetchOrder = useCallback(async () => {
    try {
      const res = await api.get(`/orders/${id}`);
      setOrder(res.data);
    } catch (err) {
      setError('Failed to fetch order details.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  const isReturnEligible = (orderDate) => {
    const orderDateTime = new Date(orderDate);
    const currentDate = new Date();
    const daysDifference = Math.floor((currentDate - orderDateTime) / (1000 * 60 * 60 * 24));
    return daysDifference <= 30;
  };

  const handleReturnRequest = async () => {
    if (!returnReason.trim()) {
      alert('Please provide a reason for the return');
      return;
    }

    const confirmReturn = window.confirm('Are you sure you want to request a return for this order?');
    if (!confirmReturn) {
      return;
    }

    setReturnLoading(true);
    try {
      const res = await api.post(`/orders/${id}/return`, { reason: returnReason });
      alert(res.data.message);
      setShowReturnForm(false);
      setReturnReason('');
      fetchOrder(); // Refresh order data
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit return request');
    } finally {
      setReturnLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  if (!order) {
    return <div>Order not found.</div>;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Order Details</h2>
      <p><strong>Order ID:</strong> {order.id}</p>
      <p><strong>Date:</strong> {new Date(order.date).toLocaleDateString()}</p>
      <p><strong>Total:</strong> ${order.total}</p>
      <p><strong>Status:</strong> {
        order.returnStatus === 'returned' ? 'Returned' : 
        order.returnStatus === 'pending' ? 'Return Pending' : 'Completed'
      }</p>
      
      {order.returnStatus === 'returned' && (
        <div style={{ 
          padding: '10px', 
          backgroundColor: '#f8f9fa', 
          border: '1px solid #dee2e6', 
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          <p style={{ margin: 0, color: '#6c757d' }}>
            This order was returned on {new Date(order.returnDate).toLocaleDateString()}
          </p>
        </div>
      )}

      {order.returnStatus === 'pending' && (
        <div style={{ 
          padding: '10px', 
          backgroundColor: '#fff3cd', 
          border: '1px solid #ffeaa7', 
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          <p style={{ margin: '0 0 5px 0', color: '#856404', fontWeight: 'bold' }}>
            Return Request Pending Admin Approval
          </p>
          <p style={{ margin: '0 0 5px 0', color: '#856404' }}>
            Submitted on: {new Date(order.returnRequestDate).toLocaleDateString()}
          </p>
          <p style={{ margin: 0, color: '#856404' }}>
            Reason: {order.returnReason}
          </p>
        </div>
      )}

      {order.returnStatus !== 'returned' && order.returnStatus !== 'pending' && (
        <div style={{ marginBottom: '20px' }}>
          {isReturnEligible(order.date) ? (
            <div>
              {!showReturnForm ? (
                <button
                  onClick={() => setShowReturnForm(true)}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                >
                  Request Return
                </button>
              ) : (
                <div style={{ 
                  padding: '15px', 
                  backgroundColor: '#f8f9fa', 
                  border: '1px solid #dee2e6', 
                  borderRadius: '4px'
                }}>
                  <h4 style={{ margin: '0 0 10px 0' }}>Return Request</h4>
                  <div style={{ marginBottom: '10px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>
                      Reason for return:
                    </label>
                    <textarea
                      value={returnReason}
                      onChange={(e) => setReturnReason(e.target.value)}
                      placeholder="Please explain why you want to return this order..."
                      rows="3"
                      style={{ 
                        width: '100%', 
                        padding: '8px', 
                        borderRadius: '4px', 
                        border: '1px solid #ccc',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={handleReturnRequest}
                      disabled={returnLoading}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: returnLoading ? '#ccc' : '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: returnLoading ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {returnLoading ? 'Submitting...' : 'Submit Request'}
                    </button>
                    <button
                      onClick={() => {
                        setShowReturnForm(false);
                        setReturnReason('');
                      }}
                      disabled={returnLoading}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: returnLoading ? 'not-allowed' : 'pointer'
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ 
              padding: '10px', 
              backgroundColor: '#fff3cd', 
              border: '1px solid #ffeaa7', 
              borderRadius: '4px'
            }}>
              <p style={{ margin: 0, color: '#856404' }}>
                Return period has expired. Returns are only allowed within 30 days of purchase.
              </p>
            </div>
          )}
        </div>
      )}
      
      <h3>Items</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {order.items.map(item => (
          <li key={item.id} style={{ borderBottom: '1px solid #eee', padding: '10px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>{item.name}</span>
              <span>${item.price}</span>
            </div>
            {(() => {
              const userReview = order.reviews.find(r => r.productId === item.id && r.userId === parseInt(currentUserId));
              if (userReview) {
                return (
                  <div style={{ marginTop: '10px' }}>
                    <h4>Your Review:</h4>
                    <p>Rating: {userReview.rating} / 5</p>
                    <p>{userReview.comment}</p>
                  </div>
                );
              } else {
                return <Review productId={item.id} productName={item.name} onReviewSubmitted={fetchOrder} />;
              }
            })()}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default OrderDetail;
