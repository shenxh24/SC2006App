import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

// Mock data for when API fails
const mockRecipeData = {
  id: 12345,
  title: "Sample Chicken Recipe",
  image: "https://spoonacular.com/recipeImages/12345-312x231.jpg",
  readyInMinutes: 35,
  servings: 4,
  nutrition: {
    nutrients: [
      { name: "Calories", amount: 420 },
      { name: "Protein", amount: 35 },
      { name: "Fat", amount: 15 }
    ]
  },
  extendedIngredients: [
    { original: "1 lb chicken breast" },
    { original: "2 tbsp olive oil" },
    { original: "1 tsp salt" },
    { original: "1/2 tsp black pepper" }
  ],
  analyzedInstructions: [{
    steps: [
      { number: 1, step: "Preheat oven to 375°F (190°C)" },
      { number: 2, step: "Season chicken with salt and pepper" },
      { number: 3, step: "Bake for 25-30 minutes until internal temperature reaches 165°F (74°C)" }
    ]
  }]
};


function RecipeDetails() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showIngredients, setShowIngredients] = useState(false);
  const [showRecipe, setShowRecipe] = useState(false);
  const [usingMockData, setUsingMockData] = useState(false);

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/recipes/${id}`
        );
        setRecipe(response.data);
        setUsingMockData(false);
      } catch (err) {
        console.error('API Error, using mock data:', err);
        
        // Check if it's an API limit error
        if (err.response?.status === 429) {
          setError('API limit exceeded - showing sample recipe');
        } else {
          setError('Failed to load recipe details - showing sample recipe');
        }
        
        // Fallback to mock data
        setRecipe({
          ...mockRecipeData,
          title: `Sample Recipe (ID: ${id})`
        });
        setUsingMockData(true);
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
      {usingMockData && (
        <div className="mock-warning">
          {error} - Some features may be limited
        </div>
      )}
      
      <h1>{recipe.title}</h1>
      <img 
        src={recipe.image} 
        alt={recipe.title} 
        className="recipe-main-image"
        onError={(e) => {
          e.target.src = 'https://via.placeholder.com/400x300?text=Recipe+Image';
        }} 
      />
      
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