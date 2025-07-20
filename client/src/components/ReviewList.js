import React, { useEffect, useState } from 'react';
import api from '../services/api';

function ReviewList({ productId, reviews }) {
  const filteredReviews = reviews.filter(review => review.productId === productId);

  return (
    <div style={{ marginTop: '30px' }}>
      <h3>Customer Reviews</h3>
      {filteredReviews.length === 0 ? (
        <p>No reviews yet. Be the first to review this product!</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {filteredReviews.map((review) => (
            <li key={review.id} style={{ borderBottom: '1px solid #eee', padding: '10px 0' }}>
              <p><strong>Rating:</strong> {review.rating} / 5</p>
              <p>{review.comment}</p>
              <p style={{ fontSize: '0.8em', color: '#777' }}>
                By {review.username || 'Anonymous'} on {review.date ? new Date(review.date).toLocaleDateString() : 'Unknown date'}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ReviewList;