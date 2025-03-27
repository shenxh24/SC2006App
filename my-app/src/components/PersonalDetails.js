import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function PersonalDetails({ user, setDailyGoals }) {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [lifestyle, setLifestyle] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [calculatedGoals, setCalculatedGoals] = useState(null);
  const navigate = useNavigate();

  // Load saved details from local storage
  useEffect(() => {
    const savedDetails = JSON.parse(localStorage.getItem('personalDetails'));
    if (savedDetails) {
      setHeight(savedDetails.height);
      setWeight(savedDetails.weight);
      setLifestyle(savedDetails.lifestyle);
      setGender(savedDetails.gender);
      setAge(savedDetails.age);
    }
  }, []);

  const calculateGoals = () => {
    if (!height || !weight || !lifestyle || !gender || !age) return;

    // Basic BMR calculation (Harris-Benedict equation)
    let bmr;
    if (gender === 'male') {
      bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else {
      bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }

    // Adjust for activity level
    let activityMultiplier;
    switch(lifestyle) {
      case 'sedentary': activityMultiplier = 1.2; break;
      case 'active': activityMultiplier = 1.55; break;
      case 'very-active': activityMultiplier = 1.9; break;
      default: activityMultiplier = 1.2;
    }

    const calories = Math.round(bmr * activityMultiplier);
    
    // Macronutrient distribution (40% carbs, 30% protein, 30% fat)
    const protein = Math.round((calories * 0.3) / 4);
    const fat = Math.round((calories * 0.3) / 9);
    const carbs = Math.round((calories * 0.4) / 4);

    const goals = { calories, protein, fat, carbs };
    setCalculatedGoals(goals);
    return goals;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const personalDetails = { height, weight, lifestyle, gender, age };
    localStorage.setItem('personalDetails', JSON.stringify(personalDetails));
    
    const goals = calculateGoals();
    if (goals) {
      setDailyGoals(goals);
      localStorage.setItem('dailyGoals', JSON.stringify(goals));
      setCalculatedGoals(goals); // Make sure this is set
      alert('Details and goals saved successfully!');
    }
  };

  return (
    <div className="personal-details">
      <h1>BitebyByte</h1>
      <h2>Personal Details</h2>
      <p>Enter your details to calculate personalized daily nutrition goals</p>

      <form onSubmit={handleSubmit} className="details-form">
        <div className="form-group">
          <label>
            Height (cm):
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="Enter height"
              min="100"
              max="250"
              required
            />
          </label>
        </div>

        <div className="form-group">
          <label>
            Weight (kg):
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Enter weight"
              min="30"
              max="200"
              required
            />
          </label>
        </div>

        <div className="form-group">
          <label>
            Gender:
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              required
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other (uses female formula)</option>
            </select>
          </label>
        </div>

        <div className="form-group">
          <label>
            Age:
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Enter age"
              min="13"
              max="120"
              required
            />
          </label>
        </div>

        <div className="form-group">
          <label>
            Lifestyle:
            <select
              value={lifestyle}
              onChange={(e) => setLifestyle(e.target.value)}
              required
            >
              <option value="">Select activity level</option>
              <option value="sedentary">Sedentary (little or no exercise)</option>
              <option value="active">Active (moderate exercise 3-5 days/week)</option>
              <option value="very-active">Very Active (intense exercise 6-7 days/week)</option>
            </select>
          </label>
        </div>

        <button type="submit" className="save-button">
          Calculate & Save Goals
        </button>
      </form>

      {calculatedGoals && (
  <div className="calculated-goals">
    <h3>Your Recommended Daily Goals</h3>
    <div className="goals-grid">
      <div className="goal-item">
        <span className="goal-value">{calculatedGoals.calories}</span>
        <span className="goal-label">Calories (kcal)</span>
      </div>
      <div className="goal-item">
        <span className="goal-value">{calculatedGoals.protein}g</span>
        <span className="goal-label">Protein</span>
      </div>
      <div className="goal-item">
        <span className="goal-value">{calculatedGoals.fat}g</span>
        <span className="goal-label">Fat</span>
      </div>
      <div className="goal-item">
        <span className="goal-value">{calculatedGoals.carbs}g</span>
        <span className="goal-label">Carbs</span>
      </div>
    </div>
    <p className="goals-explanation">
      Based on your {age}-year-old {gender} profile at {height}cm and {weight}kg 
      with a {lifestyle.replace('-', ' ')} lifestyle.
    </p>
    <button 
      onClick={() => navigate('/tracker')} 
      className="tracker-button"
    >
      Start Tracking Now
    </button>
  </div>
)}

      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} BitebyByte. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default PersonalDetails;