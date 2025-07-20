// client/src/components/Checkout.js
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart, createOrder, processPayment, fetchProducts } from '../store/actions';
import { useHistory } from 'react-router-dom';

function Checkout() {
  const cartItems = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [address, setAddress] = useState({ street: '', city: '', state: '', zip: '' });
  const [card, setCard] = useState({ number: '', expiry: '', cvv: '' });
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);

  const handleAddressChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleCardChange = (e) => {
    setCard({ ...card, [e.target.name]: e.target.value });
  };

  const handlePromoCodeChange = (e) => {
    const code = e.target.value.toUpperCase();
    setPromoCode(code);
    
    // Apply discount if code is SAIT
    if (code === 'SAIT') {
      setDiscount(0.05); // 5% discount
    } else {
      setDiscount(0);
    }
  };

  // Validate address fields
  const validateAddress = () => {
    const { street, city, state, zip } = address;
    if (!street.trim() || !city.trim() || !state.trim() || !zip.trim()) {
      return 'Please fill in all address fields';
    }
    return null;
  };

  // Validate payment card information
  const validateCard = () => {
    const { number, expiry, cvv } = card;
    
    // Check card number is not empty and has 16 digits
    if (!number.trim()) {
      return 'Please enter card number';
    }
    if (!/^\d{16}$/.test(number.replace(/\s/g, ''))) {
      return 'Card number must be 16 digits';
    }
    
    // Check expiry date format MM/YY
    if (!expiry.trim()) {
      return 'Please enter expiry date';
    }
    if (!/^\d{4}$/.test(expiry)) {
      return 'Expiry date format should be 4 digits';
    }
    
    // Check if card is not expired
    const [month, year] = expiry.split('/').map(Number);
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;
    
    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      return 'Card expired, Transaction Failed';
    }
    
    // Check CVV
    if (!cvv.trim()) {
      return 'Please enter CVV';
    }
    if (!/^\d{3}$/.test(cvv)) {
      return 'CVV must be 3 digits';
    }
    
    return null;
  };

  const handleCheckout = async () => {
    setLoading(true);
    setError('');

    // Validate address
    const addressError = validateAddress();
    if (addressError) {
      setError(addressError);
      setLoading(false);
      return;
    }

    // Validate payment card information
    const cardError = validateCard();
    if (cardError) {
      setError(cardError);
      setLoading(false);
      return;
    }

    try {
      // Calculate total
      const total = calculateTotal();

      // Create order
      const orderData = {
        items: cartItems,
        total,
        date: new Date().toISOString(),
        shippingAddress: address,
        paymentInfo: { card: card.number } // Example, don't store full card details
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
        // Refresh products to update stock availability
        dispatch(fetchProducts());
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

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discountAmount = subtotal * discount;
    return (subtotal - discountAmount).toFixed(2);
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
                <span>{item.name} x {item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            </li>
          ))}
        </ul>
        <div style={{ marginTop: '20px', textAlign: 'right' }}>
          <div style={{ fontSize: '16px', marginBottom: '5px' }}>
            Subtotal: ${calculateSubtotal().toFixed(2)}
          </div>
          {discount > 0 && (
            <div style={{ fontSize: '16px', color: 'green', marginBottom: '5px' }}>
              Discount (SAIT 5%): -${(calculateSubtotal() * discount).toFixed(2)}
            </div>
          )}
          <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
            Total: ${calculateTotal()}
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Shipping Address</h3>
        <input type="text" name="street" placeholder="Street" onChange={handleAddressChange} style={{ width: '100%', padding: '8px', boxSizing: 'border-box', marginBottom: '10px' }} />
        <input type="text" name="city" placeholder="City" onChange={handleAddressChange} style={{ width: '100%', padding: '8px', boxSizing: 'border-box', marginBottom: '10px' }} />
        <input type="text" name="state" placeholder="State" onChange={handleAddressChange} style={{ width: '100%', padding: '8px', boxSizing: 'border-box', marginBottom: '10px' }} />
        <input type="text" name="zip" placeholder="Zip Code" onChange={handleAddressChange} style={{ width: '100%', padding: '8px', boxSizing: 'border-box', marginBottom: '10px' }} />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Promo Code</h3>
        <input 
          type="text" 
          placeholder="Enter promo code (e.g., SAIT)" 
          value={promoCode}
          onChange={handlePromoCodeChange} 
          style={{ width: '100%', padding: '8px', boxSizing: 'border-box', marginBottom: '10px' }} 
        />
        {discount > 0 && (
          <div style={{ color: 'green', fontSize: '14px' }}>
            ✓ Promo code applied! 5% discount
          </div>
        )}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Credit Card</h3>
        <input type="text" name="number" placeholder="Card Number" onChange={handleCardChange} style={{ width: '100%', padding: '8px', boxSizing: 'border-box', marginBottom: '10px' }} />
        <input type="text" name="expiry" placeholder="MM/YY" onChange={handleCardChange} style={{ width: '100%', padding: '8px', boxSizing: 'border-box', marginBottom: '10px' }} />
        <input type="text" name="cvv" placeholder="CVV" onChange={handleCardChange} style={{ width: '100%', padding: '8px', boxSizing: 'border-box', marginBottom: '10px' }} />
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
