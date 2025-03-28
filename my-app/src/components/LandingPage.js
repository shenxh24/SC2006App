import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { FavouritesContext } from './FavouritesContext';
import '../App.css';

const features = [
  {
    id: 1,
    logo: <img src="/Tracker.jpeg" alt="Tracker" />,
    title: "Nutrition Tracker",
    description: 'Track your daily food intake and nutrition',
    path: '/tracker',
  },
  {
    id: 2,
    logo: <img src="/Recipe.jpeg" alt="Recipe" />,
    title: "Recipes",
    description: 'Discover healthy recipes tailored for you',
    path: '/recipes',
  },
  {
    id: 3,
    logo: <img src="/HawkerCentres.jpeg" alt="Hawker Centres" />,
    title: "Hawker Centres",
    description: 'Find the nearest hawker centers',
    path: '/hawker-centres',
  },
  {
    id: 4,
    logo: <img src="/PersonalDetails.jpeg" alt="PersonalDetails" />,
    title: "Profile",
    description: 'Manage your personal details and goals',
    path: '/personal-details',
  },
];

function LandingPage({ heroImage }) {
  const { favourites } = useContext(FavouritesContext);
  const heroStyle = {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${heroImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    minHeight: '60vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    position: 'relative',
    color: 'white',
  };

  return (
    <div className="App">
      {/* Hero Section */}
      <section className="hero" style={heroStyle}>
        <h1>Welcome to BitebyByte</h1>
        <p className="hero-subtitle">Your personal diet assistant for a healthier lifestyle</p>
        <div className="hero-buttons">
          <Link to="/signin" className="signin-link">Get Started</Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2 className="section-title">Explore Our Features</h2>
        <div className="feature-list">
          {features.map((feature) => (
            <Link to={feature.path} className="feature-link" key={feature.id}>
              <div className="feature-card">
                <div className="feature-logo">
                  {feature.logo}
                </div>
                <div className="feature-content">
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Favourites Preview */}
      {favourites.length > 0 && (
        <section className="favourites-preview">
          <h2 className="section-title">Your favourite Recipes</h2>
          <div className="preview-grid">
            {favourites.slice(0, 3).map(recipe => (
              <Link to={`/recipe/${recipe.id}`} key={recipe.id} className="preview-card">
                <img src={recipe.image} alt={recipe.title} />
                <h3>{recipe.title}</h3>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} BitebyByte. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default LandingPage;