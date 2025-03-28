import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const features = [
  {
    id: 1,
    logo: <img src="/Tracker.jpeg" alt="Tracker" />, // Image logo
    description: 'What have you eaten today?',
    path: '/tracker',
  },
  {
    id: 2,
    logo: <img src="/Recipe.jpeg" alt="Recipe" />, // Image logo
    description: 'Sick and tired of eating out?.',
    path: '/recipes',
  },
  {
    id: 3,
    logo: <img src="/HawkerCentres.jpeg" alt="Hawker Centres" />, // Image logo
    description: 'Find the nearest hawker!',
    path: '/hawker-centres',
  },
  {
    id: 4,
    logo: <img src="/PersonalDetails.jpeg" alt="PersonalDetails" />, // Image logo
    description: 'Get personalized diet plans here!',
    path: '/personal-details',
  },
];

function LandingPage({ heroImage }) {
  const heroStyle = {
    backgroundImage: `url(${heroImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    minHeight: '50vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    position: 'relative',
    color: 'white', // Ensure text is visible on the background
  };

  return (
    <div className="App">

      {/* Hero Section */}
      <section className="hero" style={heroStyle}>
        <h1>Welcome to BitebyByte</h1>
        <p>Your personal diet assistant for a healthier lifestyle.</p>
        <Link to="/signin" className="signin-link">Get Started</Link>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>Features</h2>
        <div className="feature-list">
          {features.map((feature) => (
            <Link to={feature.path} className="feature-link" key={feature.id}>
              <div className="feature">
                <div className="logo">
                  {typeof feature.logo === 'string' ? feature.logo : feature.logo}
                </div>
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