import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function HawkerCentres() {
  const navigate = useNavigate();

  return (
    <div className="hawker-centres">
      
      <h1>Location</h1>
      <p>[Nearest to you] 500m</p>

      <div className="directions">
        <button>Public transport/Walk</button>
        <button>Private transport</button>
      </div>

      <button>View in Google Maps</button>

      {/* Add a button to navigate to the reviews page */}
      <button onClick={() => navigate('/reviews-page')}>View Reviews</button>

      <div className="newsletter">
        <p>Follow the latest trends with our daily newsletter</p>
        <input type="email" placeholder="Enter your email" />
        <button>Submit</button>
      </div>
    </div>
  );
}

export default HawkerCentres;