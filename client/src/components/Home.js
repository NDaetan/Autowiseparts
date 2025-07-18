// client/src/components/Home.js
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../store/actions';

function Home() {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>;
  if (error) return <div style={{ padding: '20px', textAlign: 'center' }}>Error: {error}</div>;

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Welcome to Autowise Parts</h1>
      <p>Find the best automotive parts for your vehicle.</p>
      <p>We have {products.length} products available.</p>
      <Link to="/products" style={{
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: 'white',
        textDecoration: 'none',
        borderRadius: '5px',
        display: 'inline-block',
        marginTop: '20px'
      }}>
        Browse Products
      </Link>
    </div>
  );
}

export default Home;