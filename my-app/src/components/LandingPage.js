import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

function LandingPage() {
  return (
    <div className="App">

      {/* Hero Section */}
      <section className="hero">
        <h1>Your Personalized Diet Assistant</h1>
        <p>Ever wanted someone to tell you how to use your close-to-expiring eggs in your fridge?</p>
        <Link to="/signin" className="cta-button">Get Started</Link>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="feature-grid">
          {/* Top Row: Three Boxes */}
          <Link to="/tracker" className="feature-link">
            <div className="feature">
              <h2>Tracker</h2>
              <p>Enter what you have consumed in the day and know how much calories/nutrients intake you have.</p>
              <div className="image-placeholder"></div> {/* Placeholder for image */}
            </div>
          </Link>
          <Link to="/recipes" className="feature-link">
            <div className="feature">
              <h2>Recipes</h2>
              <p>Enter the expiry dates of the food you have in your fridge and get personalized recipes.</p>
              <div className="image-placeholder"></div> {/* Placeholder for image */}
            </div>
          </Link>
          <Link to="/hawker-centres" className="feature-link">
            <div className="feature">
              <h2>Find the Hawker</h2>
              <p>Use your live location to access nearby food centres.</p>
              <div className="image-placeholder"></div> {/* Placeholder for image */}
            </div>
          </Link>

          {/* Bottom Row: Two Boxes */}
          <Link to="/personal-details" className="feature-link">
            <div className="feature">
              <h2>Update Personal Details</h2>
              <p>Enter your height, age, and other details for personalized recipes and diet plans.</p>
              <div className="image-placeholder"></div> {/* Placeholder for image */}
            </div>
          </Link>
          <Link to="/" className="feature-link">
            <div className="feature">
              <h2>Friends</h2>
              <p>Link with your friends and see who eats the healthiest.</p>
              <div className="image-placeholder"></div> {/* Placeholder for image */}
            </div>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2023 BitebyByte. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default LandingPage;