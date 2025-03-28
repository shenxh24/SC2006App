import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FavouritesContext } from './FavouritesContext';
import axios from 'axios';
import '../App.css';

function RecipeDetails() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showIngredients, setShowIngredients] = useState(false);
  const [showRecipe, setShowRecipe] = useState(false);
  

  const {addfavourite, removefavourite, isfavourite } = useContext(FavouritesContext);
  const [isfavourited, setIsfavourited] = useState(false);

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      try {
        console.log(`Fetching details for recipe ID: ${id}`);
        const response = await axios.get(`/api/recipes/${id}`);
        console.log('API Response:', response.data);
        
        if (!response.data) {
          throw new Error('Empty response from server');
        }
        
        setRecipe(response.data);
        // Check if this recipe is already favourited
        setIsfavourited(isfavourite(response.data.id));
      } catch (err) {
        console.error('Full error details:', {
          message: err.message,
          status: err.response?.status,
          data: err.response?.data,
          url: err.config?.url
        });
        setError(`Failed to load: ${err.response?.data?.message || err.message}`);
      } finally {
        setLoading(false);
      }
    };
  
    fetchRecipeDetails();
  }, [id, isfavourite]);

  const handlefavouriteClick = () => {
    if (isfavourited) {
      removefavourite(recipe.id);
    } else {
      addfavourite(recipe);
    }
    setIsfavourited(!isfavourited);
  };

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

      {/* favourite Button */}
      <button 
        onClick={handlefavouriteClick}
        className={`favourite-btn ${isfavourited ? 'active' : ''}`}
      >
        {isfavourited ? '❤️ Remove from Favourites' : '♡ Add to Favourites'}
      </button>

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