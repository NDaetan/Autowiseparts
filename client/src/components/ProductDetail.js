// client/src/components/ProductDetail.js
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart } from '../store/actions';

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
      <button onClick={handleAddToCart}>Add to Cart</button>
      <div style={{ marginTop: '20px' }}>
        <Link to={`/review/${product.id}`}>Write a Review</Link>
      </div>
    </div>
  );
}

export default ProductDetail;