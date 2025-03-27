import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

function Tracker() {
  const [foodItems, setFoodItems] = useState([]);
  const [foodName, setFoodName] = useState('');
  const [amount, setAmount] = useState('');
  const [lessOilSalt, setLessOilSalt] = useState(false);
  const [others, setOthers] = useState(false);

  const handleAddFood = (e) => {
    e.preventDefault();
    if (foodName && amount) {
      const newFoodItem = {
        foodName,
        amount: `${amount}g`,
        lessOilSalt,
        others,
      };
      setFoodItems([...foodItems, newFoodItem]);
      setFoodName('');
      setAmount('');
      setLessOilSalt(false);
      setOthers(false);
    }
  };

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
          Less oil/Less salt
        </label>
        <label>
          <input
            type="checkbox"
            checked={others}
            onChange={(e) => setOthers(e.target.checked)}
          />
          Others
        </label>
        <button type="submit">Add Food</button>
      </form>

      {/* Display Added Food Items */}
      <div className="food-list">
        <h2>Food Items Consumed</h2>
        {foodItems.length > 0 ? (
          foodItems.map((item, index) => (
            <div key={index} className="food-item">
              <p><strong>{item.foodName}</strong> - {item.amount}</p>
              <p>{item.lessOilSalt && 'Less oil/Less salt'}</p>
              <p>{item.others && 'Others'}</p>
            </div>
          ))
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