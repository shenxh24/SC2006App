import React, { useState} from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const PersonalDetails = ({ user, setDailyGoals }) => {
  // Initialize state with localStorage data or defaults
  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem('personalDetails');
    return savedData ? JSON.parse(savedData) : {
      age: '',
      height: '',
      weight: '',
      gender: '',
      activityLevel: '',
      dietaryPreferences: [],
      calorieGoal: 2000,
      proteinGoal: 50,
      fatGoal: 65,
      carbGoal: 300
    };
  });

  const activityLevels = [
    'Sedentary (little or no exercise)',
    'Lightly active (light exercise 1-3 days/week)',
    'Moderately active (moderate exercise 3-5 days/week)',
    'Very active (hard exercise 6-7 days/week)',
    'Extremely active (very hard exercise & physical job)'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    
    // Save to localStorage
    localStorage.setItem('personalDetails', JSON.stringify(formData));
    
    // Update daily goals if they've changed
    setDailyGoals({
      calories: Number(formData.calorieGoal),
      protein: Number(formData.proteinGoal),
      fat: Number(formData.fatGoal),
      carbs: Number(formData.carbGoal)
    });
    
    alert('Personal details saved successfully!');
  };

  const calculateGoals = () => {
    // Basic Harris-Benedict equation for demonstration
    if (!formData.weight || !formData.height || !formData.age) return;
    
    const weightKg = parseFloat(formData.weight);
    const heightCm = parseFloat(formData.height);
    const age = parseInt(formData.age);
    
    let bmr;
    if (formData.gender === 'male') {
      bmr = 88.362 + (13.397 * weightKg) + (4.799 * heightCm) - (5.677 * age);
    } else {
      bmr = 447.593 + (9.247 * weightKg) + (3.098 * heightCm) - (4.330 * age);
    }
    
    // Apply activity multiplier
    const activityMultipliers = [1.2, 1.375, 1.55, 1.725, 1.9];
    const activityIndex = activityLevels.indexOf(formData.activityLevel);
    const tdee = bmr * (activityMultipliers[activityIndex] || 1.2);
    
    // Update form data with calculated goals
    setFormData(prev => ({
      ...prev,
      calorieGoal: Math.round(tdee),
      proteinGoal: Math.round(weightKg * 1.8), // 1.8g per kg of body weight
      fatGoal: Math.round((tdee * 0.25) / 9), // 25% of calories from fat
      carbGoal: Math.round((tdee * 0.5) / 4) // 50% of calories from carbs
    }));
  };

  return (
    <div className="personal-details-container">
      <h1>Personal Details</h1>
      
      <form onSubmit={handleSave} className="details-form">
        <div className="form-section">
          <h2>Basic Information</h2>
          <div className="form-row">
            <div className="form-group">
              <label>Age</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                min="10"
                max="120"
              />
            </div>
            <div className="form-group">
              <label>Height (cm)</label>
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleChange}
                min="100"
                max="250"
              />
            </div>
            <div className="form-group">
              <label>Weight (kg)</label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                min="30"
                max="300"
                step="0.1"
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Activity Level</label>
              <select
                name="activityLevel"
                value={formData.activityLevel}
                onChange={handleChange}
              >
                <option value="">Select</option>
                {activityLevels.map((level, index) => (
                  <option key={index} value={level}>{level}</option>
                ))}
              </select>
            </div>
          </div>
          
          <button 
            type="button" 
            className="calculate-btn"
            onClick={calculateGoals}
            disabled={!formData.weight || !formData.height || !formData.age || !formData.gender}
          >
            Calculate Recommended Goals
          </button>
        </div>

        <div className="form-section">
          <h2>Nutrition Goals</h2>
          <div className="form-row">
            <div className="form-group">
              <label>Calories (kcal)</label>
              <input
                type="number"
                name="calorieGoal"
                value={formData.calorieGoal}
                onChange={handleChange}
                min="1000"
                max="10000"
              />
            </div>
            <div className="form-group">
              <label>Protein (g)</label>
              <input
                type="number"
                name="proteinGoal"
                value={formData.proteinGoal}
                onChange={handleChange}
                min="20"
                max="500"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Fat (g)</label>
              <input
                type="number"
                name="fatGoal"
                value={formData.fatGoal}
                onChange={handleChange}
                min="20"
                max="300"
              />
            </div>
            <div className="form-group">
              <label>Carbs (g)</label>
              <input
                type="number"
                name="carbGoal"
                value={formData.carbGoal}
                onChange={handleChange}
                min="50"
                max="800"
              />
            </div>
          </div>
        </div>

        <div className="form-actions">
          <Link to="/profile" className="cancel-btn">
            Back to Profile
          </Link>
          <button type="submit" className="save-btn">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default PersonalDetails;