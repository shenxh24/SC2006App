import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

function Header() {
  return (
    <header className="header">
      <div className="logo">
        {/* Clickable logo/text to navigate back to Landing Page */}
        <Link to="/">BitebyByte</Link>
      </div>
      <nav className="nav">
        <Link to="/personal-details">Personal Details</Link>
        <Link to="/recipes">Recipes</Link>
        <Link to="/tracker">Tracker</Link>
        <Link to="/hawker-centres">Hawker Centres</Link>
        <Link to="/signin" className="signin-link">Sign In</Link>
      </nav>
    </header>
  );
}

export default Header;