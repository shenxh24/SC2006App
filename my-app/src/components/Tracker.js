import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

function Tracker() {
  const [foodItems, setFoodItems] = useState([]);
  const [foodName, setFoodName] = useState('');
  const [amount, setAmount] = useState('');
  const [lessOilSalt, setLessOilSalt] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAddFood = async (e) => {
    e.preventDefault();
    if (foodName && amount) {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch nutrition data from your API
        const response = await fetch(
          `http://localhost:5001/api/nutrition?food=${encodeURIComponent(foodName)}&amount=${amount}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch nutrition data');
        }
        
        const nutritionData = await response.json();
        
        const newFoodItem = {
          foodName,
          amount: `${amount}g`,
          calories: nutritionData.calories,
          protein: nutritionData.protein,
          fat: nutritionData.fat,
          carbs: nutritionData.carbs,
          lessOilSalt,
        };
        
        setFoodItems([...foodItems, newFoodItem]);
        setFoodName('');
        setAmount('');
        setLessOilSalt(false);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching nutrition data:', err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Calculate totals
  const totalCalories = foodItems.reduce((sum, item) => sum + parseFloat(item.calories || 0), 0).toFixed(1);
  const totalProtein = foodItems.reduce((sum, item) => sum + parseFloat(item.protein || 0), 0).toFixed(1);
  const totalFat = foodItems.reduce((sum, item) => sum + parseFloat(item.fat || 0), 0).toFixed(1);
  const totalCarbs = foodItems.reduce((sum, item) => sum + parseFloat(item.carbs || 0), 0).toFixed(1);

  return (
    <div className="tracker">
      <h1>Tracker</h1>
      <p>Track your calorie, protein, and fat intake</p>

      {/* Food Input Form */}
      <form onSubmit={handleAddFood} className="food-form">
        <label>
          Food Name:
          <input
            type="text"
            value={foodName}
            onChange={(e) => setFoodName(e.target.value)}
            placeholder="Enter food name"
            required
          />
        </label>
        <label>
          Amount (in grams):
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            required
          />
        </label>
        <label>
          <input
            type="checkbox"
            checked={lessOilSalt}
            onChange={(e) => setLessOilSalt(e.target.checked)}
          />
          Less oil / Less salt
        </label>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Add Food'}
        </button>
        {error && <p className="error-message">{error}</p>}
      </form>

      {/* Display Added Food Items */}
      <div className="food-list">
        <h2>Food Items Consumed</h2>
        {foodItems.length > 0 ? (
          <>
            {foodItems.map((item, index) => (
              <div key={index} className="food-item">
                <p><strong>{item.foodName}</strong> - {item.amount}</p>
                <p>Calories: {item.calories} kcal</p>
                <p>Protein: {item.protein}g</p>
                <p>Fat: {item.fat}g</p>
                <p>Carbs: {item.carbs}g</p>
                {item.lessOilSalt && <p>Less oil/Less salt</p>}
              </div>
            ))}
            <div className="nutrition-totals">
              <h3>Daily Totals</h3>
              <p>Total Calories: {totalCalories} kcal</p>
              <p>Total Protein: {totalProtein}g</p>
              <p>Total Fat: {totalFat}g</p>
              <p>Total Carbs: {totalCarbs}g</p>
            </div>
          </>
        ) : (
          <p>No food items added yet.</p>
        )}
      </div>

      {/* Buttons */}
      <div className="buttons">
        <Link to="/" className="back-button">
          Back
        </Link>
        <button className="enter-button">Enter</button>
      </div>
    </div>
  );
}

export default Tracker;