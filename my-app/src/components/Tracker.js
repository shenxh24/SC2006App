import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

function Tracker({ dailyGoals: initialDailyGoals = null }) {  // Add default prop value
  const [foodItems, setFoodItems] = useState([]);
  const [foodName, setFoodName] = useState('');
  const [amount, setAmount] = useState('');
  const [unit, setUnit] = useState('grams');
  const [lessOilSalt, setLessOilSalt] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Use the passed dailyGoals or fallback to defaults
  const [dailyGoals, setDailyGoals] = useState(() => {
    // Check localStorage first, then props, then use defaults
    const savedGoals = localStorage.getItem('dailyGoals');
    return savedGoals 
      ? JSON.parse(savedGoals)
      : (initialDailyGoals || {  // Use the prop if available
          calories: 2000,
          protein: 50,
          fat: 65,
          carbs: 300
        });
  });

  // Spoonacular API key
  const API_KEY = '92f7abf67e7b49f0a04d4a265bccba27';

  // Load saved items from localStorage
  useEffect(() => {
    const savedItems = localStorage.getItem('foodItems');
    if (savedItems) {
      setFoodItems(JSON.parse(savedItems));
    }

    const savedGoals = localStorage.getItem('dailyGoals');
    if (savedGoals) {
      setDailyGoals(JSON.parse(savedGoals));
    }
  }, []);

  // Save items to localStorage when they change
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
      // Step 1: Search for the food to get its ID
      const searchResponse = await axios.get(
        'https://api.spoonacular.com/food/ingredients/search',
        {
          params: {
            apiKey: API_KEY,
            query: foodName,
            number: 1
          }
        }
      );

      if (!searchResponse.data.results || searchResponse.data.results.length === 0) {
        throw new Error('Food not found. Try a different name.');
      }

      const foodId = searchResponse.data.results[0].id;
      const foodNameFromAPI = searchResponse.data.results[0].name;

      // Step 2: Get nutrition data for the specific food
      const nutritionResponse = await axios.get(
        `https://api.spoonacular.com/food/ingredients/${foodId}/information`,
        {
          params: {
            apiKey: API_KEY,
            amount: amount,
            unit: unit
          }
        }
      );

      const nutrients = nutritionResponse.data.nutrition.nutrients;
      
      // Extract specific nutrients
      const getNutrientValue = (name) => {
        const nutrient = nutrients.find(n => n.name.toLowerCase() === name.toLowerCase());
        return nutrient ? nutrient.amount : 0;
      };

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

      setFoodItems(prevItems => [...prevItems, newFoodItem]);
      setFoodName('');
      setAmount('');
      setUnit('grams');
      setLessOilSalt(false);

    } catch (err) {
      setError(err.message || 'Failed to fetch nutrition data. Please try again.');
      console.error('API Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFood = (id) => {
    setFoodItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  // Calculate totals
  const totals = foodItems.reduce((acc, item) => {
    acc.calories += item.calories || 0;
    acc.protein += item.protein || 0;
    acc.fat += item.fat || 0;
    acc.carbs += item.carbs || 0;
    return acc;
  }, { calories: 0, protein: 0, fat: 0, carbs: 0 });

  // Calculate progress percentages
  const progress = {
    calories: Math.min((totals.calories / dailyGoals.calories) * 100, 100),
    protein: Math.min((totals.protein / dailyGoals.protein) * 100, 100),
    fat: Math.min((totals.fat / dailyGoals.fat) * 100, 100),
    carbs: Math.min((totals.carbs / dailyGoals.carbs) * 100, 100)
  };

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
                  <span>Carbohydrates: {item.carbs.toFixed(1)}g</span>
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