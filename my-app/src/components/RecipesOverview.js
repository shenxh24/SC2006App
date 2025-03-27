import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

const RecipesOverview = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('balanced'); // Default filter
  const API_KEY = '92f7abf67e7b49f0a04d4a265bccba27'; // Replace with your key

  // Fetch recipes based on filter
  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      try {
        let params = {
          apiKey: API_KEY,
          number: 8, // Number of recipes to fetch
          addRecipeNutrition: true,
        };

        // Adjust parameters based on filter
        switch (filter) {
          case 'low-calorie':
            params.maxCalories = 500;
            params.sort = 'calories';
            params.sortDirection = 'asc';
            break;
          case 'high-protein':
            params.minProtein = 20;
            params.sort = 'protein';
            params.sortDirection = 'desc';
            break;
          case 'low-fat':
            params.maxFat = 10;
            params.sort = 'fat';
            params.sortDirection = 'asc';
            break;
          case 'vegetarian':
            params.diet = 'vegetarian';
            break;
          default: // 'balanced'
            params.diet = 'balanced';
        }

        const response = await axios.get(
          'https://api.spoonacular.com/recipes/complexSearch',
          { params }
        );

        // Format recipes with nutrition data
        const formattedRecipes = response.data.results.map(recipe => ({
          id: recipe.id,
          name: recipe.title,
          image: recipe.image,
          calories: recipe.nutrition?.nutrients.find(n => n.name === 'Calories')?.amount || 0,
          fat: recipe.nutrition?.nutrients.find(n => n.name === 'Fat')?.amount || 0,
          protein: recipe.nutrition?.nutrients.find(n => n.name === 'Protein')?.amount || 0,
        }));

        setRecipes(formattedRecipes);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [filter]);

  return (
    <div className="recipes-overview">
      <h1>Recipe Recommendations</h1>

      {/* Category Filter */}
      <div className="category-filter">
        <h3>Filter by Dietary Preference:</h3>
        <div className="filter-buttons">
          <button 
            className={filter === 'balanced' ? 'active' : ''}
            onClick={() => setFilter('balanced')}
          >
            Balanced
          </button>
          <button 
            className={filter === 'low-calorie' ? 'active' : ''}
            onClick={() => setFilter('low-calorie')}
          >
            Low Calorie
          </button>
          <button 
            className={filter === 'high-protein' ? 'active' : ''}
            onClick={() => setFilter('high-protein')}
          >
            High Protein
          </button>
          <button 
            className={filter === 'low-fat' ? 'active' : ''}
            onClick={() => setFilter('low-fat')}
          >
            Low Fat
          </button>
          <button 
            className={filter === 'vegetarian' ? 'active' : ''}
            onClick={() => setFilter('vegetarian')}
          >
            Vegetarian
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && <div className="loading">Loading recipes...</div>}

      {/* Recipe List */}
      <div className="recipe-list">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="recipe-card">
            <img src={recipe.image} alt={recipe.name} className="recipe-image" />
            <div className="recipe-info">
              <h3>{recipe.name}</h3>
              <div className="nutrition-facts">
                <p><span className="label">Calories:</span> {Math.round(recipe.calories)} kcal</p>
                <p><span className="label">Protein:</span> {Math.round(recipe.protein)}g</p>
                <p><span className="label">Fat:</span> {Math.round(recipe.fat)}g</p>
              </div>
              <Link to={`/recipe/${recipe.id}`} className="view-details-button">
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecipesOverview;