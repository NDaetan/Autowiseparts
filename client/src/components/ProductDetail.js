// client/src/components/ProductDetail.js
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart } from '../store/actions';
import ReviewList from './ReviewList'; // Import ReviewList

function ProductDetail() {
  const { id } = useParams();
  const products = useSelector((state) => state.products);
  const product = products.find((p) => p.id === parseInt(id));
  const dispatch = useDispatch();

  if (!product) {
    return <div style={{ padding: '20px' }}>Product not found.</div>;
  }

  const handleAddToCart = () => {
    dispatch(addToCart(product));
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
      <div style={{ marginTop: '20px' }}>
        <Link to={`/review/${product.id}`}>Write a Review</Link>
      </div>
      <ReviewList productId={product.id} /> {/* Add ReviewList component */}
    </div>
  );
}

export default ProductDetail;