// client/src/components/Checkout.js
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart, createOrder, processPayment } from '../store/actions';
import { useHistory } from 'react-router-dom';

function Checkout() {
  const cartItems = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheckout = async () => {
    setLoading(true);
    setError('');

    try {
      // Calculate total
      const total = calculateTotal();

      // Create order
      const orderData = {
        items: cartItems,
        total,
        date: new Date().toISOString()
      };

      const order = await dispatch(createOrder(orderData));

      // Process payment
      const paymentData = {
        orderId: order.id,
        amount: total,
        method: 'credit_card'
      };

      const paymentResult = await dispatch(processPayment(paymentData));

      if (paymentResult.success) {
        dispatch(clearCart());
        history.push(`/order/${order.id}`);
      } else {
        setError('Payment failed. Please try again.');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price, 0).toFixed(2);
  };

  if (cartItems.length === 0) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Your cart is empty</h2>
        <p>Please add some items to your cart before checkout.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Checkout</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div style={{ marginBottom: '20px' }}>
        <h3>Order Summary</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {cartItems.map((item) => (
            <li key={item.id} style={{ borderBottom: '1px solid #eee', padding: '10px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{item.name}</span>
                <span>${item.price}</span>
              </div>
            </li>
          ))}
        </ul>
        <div style={{ marginTop: '20px', textAlign: 'right', fontSize: '18px', fontWeight: 'bold' }}>
          Total: ${calculateTotal()}
        </div>
      </div>
      <button
        onClick={handleCheckout}
        disabled={loading}
        style={{
          padding: '12px 30px',
          backgroundColor: loading ? '#ccc' : '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          fontSize: '16px',
          width: '100%'
        }}
      >
        {loading ? 'Processing...' : 'Complete Purchase'}
      </button>
    </div>
  );
}

export default Checkout;