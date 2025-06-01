import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

const RecipesOverview = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('balanced');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('');

  // Cuisine options for dropdown
  const cuisineOptions = [
    'African', 'American', 'British', 'Cajun', 'Caribbean',
    'Chinese', 'Eastern European', 'European', 'French', 'German',
    'Greek', 'Indian', 'Irish', 'Italian', 'Japanese',
    'Jewish', 'Korean', 'Latin American', 'Mediterranean', 'Mexican',
    'Middle Eastern', 'Nordic', 'Southern', 'Spanish', 'Thai', 'Vietnamese'
  ];

  const getNutritionValue = (nutrients, nutrientName) => {
    if (!nutrients) return 0;
    const nutrient = nutrients.find(n => 
      n.name && n.name.toLowerCase().includes(nutrientName.toLowerCase())
    );
    return nutrient ? Math.round(nutrient.amount) : 0;
  };

  // Fetch recipes from our backend
  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/api/recipes', {
          params: {
            filter,
            searchQuery,
            selectedCuisine,
            number: 8 // Request only 8 recipes from the backend
          }
        });

        setRecipes(response.data);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [filter, searchQuery, selectedCuisine]);

  const handleSearch = (e) => {
    e.preventDefault();
    // The useEffect will trigger automatically when searchQuery changes
  };

  return (
    <div className="recipes-overview">
      <h1>Recipe Recommendations</h1>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="search-bar">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for recipes..."
        />
        <button type="submit">Search</button>
      </form>

      {/* Filters Row */}
      <div className="filters-row">
        {/* Dietary Filter Buttons */}
        <div className="category-filter">
          <h3>Dietary Preference:</h3>
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

        {/* Cuisine Dropdown */}
        <div className="cuisine-filter">
          <h3>Cuisine:</h3>
          <select
            value={selectedCuisine}
            onChange={(e) => setSelectedCuisine(e.target.value)}
          >
            <option value="">All Cuisines</option>
            {cuisineOptions.map(cuisine => (
              <option key={cuisine} value={cuisine.toLowerCase()}>
                {cuisine}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Loading State */}
      {loading && <div className="loading">Loading recipes...</div>}

      <div className="recipe-list">
        {recipes.length > 0 ? (
          recipes.map((recipe) => {
            // Extract nutrition values for each recipe
            const calories = getNutritionValue(recipe.nutrition?.nutrients, 'calories');
            const protein = getNutritionValue(recipe.nutrition?.nutrients, 'protein');
            const fat = getNutritionValue(recipe.nutrition?.nutrients, 'fat');
            
            return (
              <div key={recipe.id} className="recipe-card">
                <img src={recipe.image} alt={recipe.name} className="recipe-image" />
                <div className="recipe-info">
                  <h3>{recipe.name}</h3>
                  <div className="nutrition-facts">
                    <p><span className="label">Calories:</span> {calories} kcal</p>
                    <p><span className="label">Protein:</span> {protein}g</p>
                    <p><span className="label">Fat:</span> {fat}g</p>
                  </div>
                  <Link to={`/recipe/${recipe.id}`} className="view-details-button">
                    View Details
                  </Link>
                </div>
              </div>
            );
          })
        ) : (
          !loading && <div className="no-results">No recipes found. Try a different search.</div>
        )}
      </div>
    </div>
  );
};

export default RecipesOverview;