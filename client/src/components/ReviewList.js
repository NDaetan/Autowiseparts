import React, { useEffect, useState } from 'react';
import api from '../services/api';

function ReviewList({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await api.get(`/reviews?productId=${productId}`);
        setReviews(response.data);
      } catch (err) {
        setError('Failed to load reviews.');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [productId]);

  if (loading) return <div style={{ textAlign: 'center' }}>Loading reviews...</div>;
  if (error) return <div style={{ textAlign: 'center', color: 'red' }}>Error: {error}</div>;

  return (
    <div style={{ marginTop: '30px' }}>
      <h3>Customer Reviews</h3>
      {reviews.length === 0 ? (
        <p>No reviews yet. Be the first to review this product!</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {reviews.map((review) => (
            <li key={review.id} style={{ borderBottom: '1px solid #eee', padding: '10px 0' }}>
              <p><strong>Rating:</strong> {review.rating} / 5</p>
              <p>{review.comment}</p>
              <p style={{ fontSize: '0.8em', color: '#777' }}>By Anonymous on {new Date(review.date).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ReviewList;