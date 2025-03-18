import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

function RecipeDetails() {
  const [showIngredients, setShowIngredients] = useState(false);
  const [showRecipe, setShowRecipe] = useState(false);

  return (
    <div className="recipe-details">
      <h1>Food</h1>
      <h2>Low calorie option</h2>
      <p><strong>xxx kCal</strong></p>
      <p>xxx grams of protein in one serving</p>
      <p>xxx grams of fat in one serving</p>

      {/* Toggle Ingredients */}
      <button onClick={() => setShowIngredients(!showIngredients)}>
        {showIngredients ? "Hide Ingredients ▲" : "View Ingredients ▼"}
      </button>
      {showIngredients && (
        <div className="ingredient-list">
          <h3>Ingredient List</h3>
          <ul>
            <li>Ingredient 1</li>
            <li>Ingredient 2</li>
            <li>Ingredient 3</li>
          </ul>
        </div>
      )}

      {/* Toggle Recipe Steps */}
      <button onClick={() => setShowRecipe(!showRecipe)}>
        {showRecipe ? "Hide Recipe ▲" : "View Recipe ▼"}
      </button>
      {showRecipe && (
        <div className="recipe-steps">
          <h3>Recipe</h3>
          <ol>
            <li>Step 1</li>
            <li>Step 2</li>
            <li>Step 3</li>
          </ol>
        </div>
      )}

      <Link to="/recipes" className="back-link">Back to recipes</Link>
    </div>
  );
}

export default RecipeDetails;