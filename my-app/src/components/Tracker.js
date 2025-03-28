import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

function Tracker({ dailyGoals: initialDailyGoals = null }) {
  const [foodItems, setFoodItems] = useState([]);
  const [foodName, setFoodName] = useState('');
  const [amount, setAmount] = useState('');
  const [unit, setUnit] = useState('grams');
  const [lessOilSalt, setLessOilSalt] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Initialize daily goals
  const [dailyGoals, setDailyGoals] = useState(() => {
    const savedGoals = localStorage.getItem('dailyGoals');
    return savedGoals 
      ? JSON.parse(savedGoals)
      : (initialDailyGoals || {
          calories: 2000,
          protein: 50,
          fat: 65,
          carbs: 300
        });
  });

  // Load saved items from localStorage
  useEffect(() => {
    const savedItems = localStorage.getItem('foodItems');
    if (savedItems) setFoodItems(JSON.parse(savedItems));
    
    const savedGoals = localStorage.getItem('dailyGoals');
    if (savedGoals) setDailyGoals(JSON.parse(savedGoals));
  }, []);

  // Save to localStorage when changes occur
  useEffect(() => {
    localStorage.setItem('foodItems', JSON.stringify(foodItems));
  }, [foodItems]);

  useEffect(() => {
    if (initialDailyGoals) {
      setDailyGoals(initialDailyGoals);
      localStorage.setItem('dailyGoals', JSON.stringify(initialDailyGoals));
    }
  }, [initialDailyGoals]);

  const handleAddFood = async (e) => {
    e.preventDefault();
    if (!foodName || !amount) {
      setError('Please enter both food name and amount');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // 1. Search for food via backend
      const searchResponse = await axios.get('/api/food/search', {
        params: {
          query: foodName,
          number: 1
        }
      });

      if (!searchResponse.data || searchResponse.data.length === 0) {
        throw new Error('Food not found. Try a different name.');
      }

      const foodId = searchResponse.data[0].id;
      const foodNameFromAPI = searchResponse.data[0].name;

      // 2. Get nutrition data via backend
      const nutritionResponse = await axios.get(`/api/food/${foodId}/nutrition`, {
        params: {
          amount,
          unit
        }
      });

      const nutrients = nutritionResponse.data.nutrition.nutrients;
      
      // Helper to extract nutrient values
      const getNutrientValue = (name) => {
        const nutrient = nutrients.find(n => n.name.toLowerCase() === name.toLowerCase());
        return nutrient ? nutrient.amount : 0;
      };

      // Create new food item
      const newFoodItem = {
        id: Date.now(),
        foodName: foodNameFromAPI,
        amount: `${amount} ${unit}`,
        calories: getNutrientValue('calories'),
        protein: getNutrientValue('protein'),
        fat: getNutrientValue('fat'),
        carbs: getNutrientValue('carbohydrates'),
        lessOilSalt,
        date: new Date().toISOString().split('T')[0]
      };

      setFoodItems(prev => [...prev, newFoodItem]);
      setFoodName('');
      setAmount('');
      setUnit('grams');
      setLessOilSalt(false);

    } catch (err) {
      let errorMessage = 'Failed to add food';
      
      if (err.response) {
        // Backend returned an error response
        errorMessage = err.response.data?.error || 
                      err.response.data?.message || 
                      `Server error (${err.response.status})`;
      } else if (err.request) {
        // No response received
        errorMessage = 'No response from server';
      } else {
        // Other errors
        errorMessage = err.message;
      }
  
      setError(errorMessage);
      console.error('Full error:', {
        message: err.message,
        response: err.response?.data,
        request: err.config
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFood = (id) => {
    setFoodItems(prev => prev.filter(item => item.id !== id));
  };

  // Calculate totals
  const totals = foodItems.reduce((acc, item) => ({
    calories: acc.calories + (item.calories || 0),
    protein: acc.protein + (item.protein || 0),
    fat: acc.fat + (item.fat || 0),
    carbs: acc.carbs + (item.carbs || 0)
  }), { calories: 0, protein: 0, fat: 0, carbs: 0 });

  // Calculate progress percentages
  const progress = Object.fromEntries(
    Object.entries(totals).map(([key, value]) => [
      key,
      Math.min((value / dailyGoals[key]) * 100, 100)
    ])
  );

  return (
    <div className="tracker">
      <h1>Nutrition Tracker</h1>
      <p>Track your daily nutrient intake</p>

      {/* Food Input Form */}
      <form onSubmit={handleAddFood} className="food-form">
        <div className="form-group">
          <label>
            Food Name:
            <input
              type="text"
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
              placeholder="e.g., chicken breast, banana"
              required
            />
          </label>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>
              Amount:
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g., 100"
                min="1"
                required
              />
            </label>
          </div>
          <div className="form-group">
            <label>
              Unit:
              <select value={unit} onChange={(e) => setUnit(e.target.value)}>
                <option value="grams">grams</option>
                <option value="ounces">ounces</option>
                <option value="cups">cups</option>
                <option value="tablespoons">tablespoons</option>
              </select>
            </label>
          </div>
        </div>
        <div className="form-group checkbox">
          <label>
            <input
              type="checkbox"
              checked={lessOilSalt}
              onChange={(e) => setLessOilSalt(e.target.checked)}
            />
            Less oil/salt version
          </label>
        </div>
        <button type="submit" disabled={isLoading} className="add-button">
          {isLoading ? 'Loading...' : 'Add Food'}
        </button>
        {error && <p className="error-message">{error}</p>}
      </form>

      {/* Progress Bars */}
      <div className="progress-bars">
        <h3>Daily Progress</h3>
        {Object.entries(progress).map(([key, value]) => (
          <div key={key} className="progress-item">
            <label>
              {key.charAt(0).toUpperCase() + key.slice(1)}: {totals[key].toFixed(1)}/{dailyGoals[key]}
              {key === 'calories' ? 'kcal' : 'g'}
            </label>
            <div className="progress-container">
              <div 
                className={`progress-bar ${key}`}
                style={{ width: `${value}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Food Items List */}
      <div className="food-list">
        <h2>Today's Food Log</h2>
        {foodItems.length > 0 ? (
          foodItems.map((item) => (
            <div key={item.id} className="food-item">
              <div className="food-info">
                <h4>{item.foodName}</h4>
                <p>{item.amount}</p>
                <div className="nutrient-facts">
                  <span>{item.calories.toFixed(0)} kcal</span>
                  <span>Protein: {item.protein.toFixed(1)}g</span>
                  <span>Fats: {item.fat.toFixed(1)}g</span>
                  <span>Carbs: {item.carbs.toFixed(1)}g</span>
                </div>
                {item.lessOilSalt && <span className="tag">Low oil/salt</span>}
              </div>
              <button 
                onClick={() => handleRemoveFood(item.id)}
                className="remove-button"
              >
                ×
              </button>
            </div>
          ))
        ) : (
          <p className="empty-message">No food items added yet.</p>
        )}
      </div>

      <Link to="/" className="back-button">
        ← Back to Home
      </Link>
    </div>
  );
}

export default Tracker;