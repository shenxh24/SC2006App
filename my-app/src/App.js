import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase'; // Make sure this path is correct
import LandingPage from './components/LandingPage';
import PersonalDetails from './components/PersonalDetails';
import RecipesOverview from './components/RecipesOverview';
import RecipeDetails from './components/RecipeDetails';
import Tracker from './components/Tracker';
import HawkerCentres from './components/HawkerCentres';
import AuthForm from './SignIn/AuthForm';
import ReviewsPage from './components/ReviewsPage';
import Header from './components/Header';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  return (
    <Router>
      <Header user={user} /> {/* Pass user state to Header */}
      <Routes>
        <Route path="/" element={<LandingPage user={user} />} />
        <Route path="/personal-details" element={<PersonalDetails user={user} />} />
        <Route path="/recipes" element={<RecipesOverview user={user} />} />
        <Route path="/recipe/:id" element={<RecipeDetails user={user} />} />
        <Route path="/tracker" element={<Tracker user={user} />} />
        <Route path="/hawker-centres" element={<HawkerCentres user={user} />} />
        <Route path="/signin" element={<AuthForm />} />
        <Route path="/reviews-page" element={<ReviewsPage user={user} />} />
      </Routes>
    </Router>
  );
}

export default App;