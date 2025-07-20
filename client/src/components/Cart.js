// client/src/components/Cart.js
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateCartQuantity } from '../store/actions';
import { Link } from 'react-router-dom';

function Cart() {
  const cartItems = useSelector((state) => state.cart);
  const products = useSelector((state) => state.products);
  const dispatch = useDispatch();

  const handleRemoveFromCart = (productId) => {
    dispatch(removeFromCart(productId));
  };

  const handleQuantityChange = (productId, newQuantity) => {
    dispatch(updateCartQuantity(productId, newQuantity));
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  if (cartItems.length === 0) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Your Cart is Empty</h2>
        <Link to="/products">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Shopping Cart</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {cartItems.map((item) => (
          <li
            key={item.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid #eee',
              padding: '10px 0',
            }}
          >
            <div>
              <strong>{item.name}</strong> - ${item.price} each
              <br />
              <span style={{ fontSize: '14px', color: '#666' }}>
                Subtotal: ${(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <button 
                  onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                  style={{ 
                    padding: '5px 10px', 
                    backgroundColor: '#f8f9fa', 
                    border: '1px solid #ddd',
                    borderRadius: '3px',
                    cursor: 'pointer'
                  }}
                >
                  -
                </button>
                <span style={{ padding: '0 10px', fontSize: '16px', fontWeight: 'bold' }}>
                  {item.quantity}
                </span>
                <button 
                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                  style={{ 
                    padding: '5px 10px', 
                    backgroundColor: '#f8f9fa', 
                    border: '1px solid #ddd',
                    borderRadius: '3px',
                    cursor: 'pointer'
                  }}
                >
                  +
                </button>
              </div>
              <button 
                onClick={() => handleRemoveFromCart(item.id)}
                style={{
                  padding: '5px 10px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '3px',
                  cursor: 'pointer'
                }}
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
      <div style={{ marginTop: '20px', textAlign: 'right' }}>
        <strong>Total: ${calculateTotal()}</strong>
      </div>
      <div style={{ marginTop: '20px', textAlign: 'right' }}>
        <Link to="/checkout">Proceed to Checkout</Link>
      </div>
    </div>
  );
}

export default Cart;