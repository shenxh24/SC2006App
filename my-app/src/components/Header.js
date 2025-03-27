import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import '../App.css';

function Header({ user }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/'); // Redirect to home after sign out
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="header">
      <div className="logo">
        <Link to="/" className="logo-link">BitebyByte</Link>
      </div>
      <nav className="nav">
        <Link to="/personal-details" className="nav-link">Personal Details</Link>
        <Link to="/recipes" className="nav-link">Recipes</Link>
        <Link to="/tracker" className="nav-link">Tracker</Link>
        <Link to="/hawker-centres" className="nav-link">Hawker Centres</Link>
        
        {user ? (
          <div className="profile-container" onMouseEnter={() => setShowDropdown(true)} 
               onMouseLeave={() => setShowDropdown(false)}>
            <div className="profile-trigger">
              <img 
                src={user.photoURL || '/default-profile.png'} 
                alt="Profile" 
                className="profile-icon"
              />
              <span className="username">{user.displayName || 'My Account'}</span>
            </div>
            
            {showDropdown && (
              <div className="profile-dropdown">
                <Link to="/profile" className="dropdown-item">Profile</Link>
                <Link to="/settings" className="dropdown-item">Settings</Link>
                <button onClick={handleSignOut} className="dropdown-item sign-out-btn">
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/signin" className="signin-link">Sign In</Link>
        )}
      </nav>
    </header>
  );
}

export default Header;