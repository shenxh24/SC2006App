import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

function HawkerCentres() {
  const navigate = useNavigate();
  const [hawkerCentres, setHawkerCentres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHawkerCentres = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/hawker-centres?lat=1.3521&lng=103.8198&radius=5001');
        setHawkerCentres(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchHawkerCentres();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

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

      <h1>Hawker Centres Near You</h1>
      <div className="hawker-list">
        {hawkerCentres.map((hawker) => (
          <div key={hawker.place_id} className="hawker-card">
            <h2>{hawker.name}</h2>
            <p>{hawker.vicinity}</p>
            <p>Rating: {hawker.rating || 'N/A'}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HawkerCentres;