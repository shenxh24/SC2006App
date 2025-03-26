import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const features = [
  {
    id: 1,
    logo: '🍎', // Replace with actual logo or image path
    title: 'Tracker',
    description: 'Enter what you have consumed in the day and know how much calories/nutrients intake you have.',
    path: '/tracker',
  },
  {
    id: 2,
    logo: '📅', // Replace with actual logo or image path
    title: 'Recipes',
    description: 'Enter the expiry dates of the food you have in your fridge and get personalized recipes.',
    path: '/recipes',
  },
  {
    id: 3,
    logo: '📍', // Replace with actual logo or image path
    title: 'Find the Hawker',
    description: 'Use your live location to access nearby food centres.',
    path: '/hawker-centres',
  },
  {
    id: 4,
    logo: '👤', // Replace with actual logo or image path
    title: 'Update Personal Details',
    description: 'Enter your height, age, and other details for personalized recipes and diet plans.',
    path: '/personal-details',
  },
];

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
        <div className="feature-list">
          {features.map((feature) => (
            <Link to={feature.path} className="feature-link" key={feature.id}>
              <div className="feature">
                <div className="logo">{feature.logo}</div>
                <div className="description">
                  <h2>{feature.title}</h2>
                  <p>{feature.description}</p>
                </div>
              </div>
            </Link>
          ))}
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