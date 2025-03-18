import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const reviews = [
  { 
    title: "Amazing food!", 
    body: "The variety of stalls here is fantastic! Highly recommend.", 
    reviewer: "Alice Johnson", 
    date: "March 18, 2025", 
    rating: 5 
  },
  { 
    title: "Good but crowded", 
    body: "The food was great, but the place was too crowded during lunch.", 
    reviewer: "John Doe", 
    date: "March 16, 2025", 
    rating: 4 
  },
  { 
    title: "Not worth the hype", 
    body: "Long waiting time, and the food was just okay.", 
    reviewer: "Emily Smith", 
    date: "March 14, 2025", 
    rating: 3 
  }
];

function ReviewsPage() {
  const navigate = useNavigate();

  return (
    <div className="reviews-page">
      <h1>Reviews</h1>
      <button onClick={() => navigate('/hawker-centres')}>Back to Location</button>

      <div className="reviews-section">
        {reviews.map((review, index) => (
          <div key={index} className="review-card">
            <div className="review-header">
              <h3>{review.title}</h3>
              <div className="star-rating">
                {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
              </div>
            </div>
            <p className="review-body">{review.body}</p>
            <p className="review-footer">
              <strong>{review.reviewer}</strong> - {review.date}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ReviewsPage;