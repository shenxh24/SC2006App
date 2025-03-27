import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

function RecipeDetails() {
  const { id } = useParams(); // Get recipe ID from URL
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showIngredients, setShowIngredients] = useState(false);
  const [showRecipe, setShowRecipe] = useState(false);
  const API_KEY = '92f7abf67e7b49f0a04d4a265bccba27'; // Replace with your key

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      try {
        const response = await axios.get(
          `https://api.spoonacular.com/recipes/${id}/information`,
          {
            params: {
              apiKey: API_KEY,
              includeNutrition: true
            }
          }
        );
        
        setRecipe(response.data);
      } catch (err) {
        setError('Failed to load recipe details');
        console.error('Error fetching recipe:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipeDetails();
  }, [id]);

  if (loading) return <div className="loading">Loading recipe details...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!recipe) return <div className="error">Recipe not found</div>;

  // Extract nutrition data
  const calories = recipe.nutrition?.nutrients.find(n => n.name === 'Calories')?.amount || 0;
  const protein = recipe.nutrition?.nutrients.find(n => n.name === 'Protein')?.amount || 0;
  const fat = recipe.nutrition?.nutrients.find(n => n.name === 'Fat')?.amount || 0;

  return (
    <div className="recipe-details">
      <h1>{recipe.title}</h1>
      <img src={recipe.image} alt={recipe.title} className="recipe-main-image" />
      
      <div className="nutrition-summary">
        <p><strong>{Math.round(calories)} kCal</strong></p>
        <p>{Math.round(protein)} grams of protein in one serving</p>
        <p>{Math.round(fat)} grams of fat in one serving</p>
        <p>Ready in: {recipe.readyInMinutes} minutes</p>
        <p>Servings: {recipe.servings}</p>
      </div>

      {/* Toggle Ingredients */}
      <button 
        onClick={() => setShowIngredients(!showIngredients)}
        className="toggle-button"
      >
        {showIngredients ? "Hide Ingredients ▲" : "View Ingredients ▼"}
      </button>
      {showIngredients && (
        <div className="ingredient-list">
          <h3>Ingredient List</h3>
          <ul>
            {recipe.extendedIngredients.map((ingredient, index) => (
              <li key={index}>
                {ingredient.original}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Toggle Recipe Steps */}
      <button 
        onClick={() => setShowRecipe(!showRecipe)}
        className="toggle-button"
      >
        {showRecipe ? "Hide Recipe ▲" : "View Recipe ▼"}
      </button>
      {showRecipe && (
        <div className="recipe-steps">
          <h3>Preparation</h3>
          <ol>
            {recipe.analyzedInstructions[0]?.steps.map(step => (
              <li key={step.number}>{step.step}</li>
            ))}
          </ol>
        </div>
      )}

      <Link to="/recipes" className="back-link">← Back to recipes</Link>
    </div>
  );
}

export default RecipeDetails;