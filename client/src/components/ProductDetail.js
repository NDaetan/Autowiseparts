// client/src/components/ProductDetail.js
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart } from '../store/actions';
import ReviewList from './ReviewList'; // Import ReviewList
import api from '../services/api';

function ProductDetail() {
  const { id } = useParams();
  const products = useSelector((state) => state.products);
  const cart = useSelector((state) => state.cart);
  const product = products.find((p) => p.id === parseInt(id));
  const dispatch = useDispatch();
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await api.get(`/reviews?productId=${id}`);
        setReviews(response.data);
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
      }
    };
    fetchReviews();
  }, [id]);

  if (!product) {
    return <div style={{ padding: '20px' }}>Product not found.</div>;
  }

  const handleAddToCart = () => {
    const cartItem = cart.find(item => item.id === product.id);
    const currentQuantityInCart = cartItem ? cartItem.quantity : 0;
    
    if (currentQuantityInCart >= product.stock) {
      alert(`Cannot add more items. Only ${product.stock} available in stock.`);
      return;
    }
    
    dispatch(addToCart(product));
    alert(`${product.name} added to cart!`);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>{product.name}</h2>
      <p>${product.price}</p>
      <p>{product.description}</p>
      <p><strong>Availability:</strong> {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</p>
      <button onClick={handleAddToCart} disabled={product.stock === 0}>
        {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
      </button>
      
      <ReviewList productId={product.id} reviews={reviews} />
    </div>
  );
}

export default ProductDetail;