import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import PersonalDetails from './components/PersonalDetails';
import RecipesOverview from './components/RecipesOverview';
import RecipeDetails from './components/RecipeDetails';
import Tracker from './components/Tracker';
import HawkerCentres from './components/HawkerCentres';
import AuthForm from './SignIn/AuthForm';
import ReviewsPage from './components/ReviewsPage';
import Header from './components/Header'; // Import the Header component
import './App.css';

function App() {
  return (
    <Router>
      <Header /> {/* Add the Header component here */}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/personal-details" element={<PersonalDetails />} />
        <Route path="/recipes" element={<RecipesOverview />} />
        <Route path="/recipe/:id" element={<RecipeDetails />} />
        <Route path="/tracker" element={<Tracker />} />
        <Route path="/hawker-centres" element={<HawkerCentres />} />
        <Route path="/signin" element={<AuthForm />} />
        <Route path="/reviews-page" element={<ReviewsPage />} />
      </Routes>
    </Router>
  );
}

export default App;