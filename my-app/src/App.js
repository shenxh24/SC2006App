import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
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
  const [dailyGoals, setDailyGoals] = useState(() => {
    const savedGoals = localStorage.getItem('dailyGoals');
    return savedGoals ? JSON.parse(savedGoals) : {
      calories: 2000,
      protein: 50,
      fat: 65,
      carbs: 300
    };
  });

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
      <Header user={user} />
      <Routes>
        <Route path="/" element={<LandingPage user={user} />} />
        <Route 
          path="/personal-details" 
          element={
            <PersonalDetails 
              user={user} 
              setDailyGoals={setDailyGoals} 
            />
          } 
        />
        <Route 
          path="/tracker" 
          element={
            <Tracker 
              user={user} 
              dailyGoals={dailyGoals} 
            />
          } 
        />
        <Route path="/recipes" element={<RecipesOverview user={user} />} />
        <Route path="/recipe/:id" element={<RecipeDetails user={user} />} />
        <Route path="/hawker-centres" element={<HawkerCentres user={user} />} />
        <Route path="/signin" element={<AuthForm />} />
        <Route path="/reviews-page" element={<ReviewsPage user={user} />} />
      </Routes>
    </Router>
  );
}

export default App;