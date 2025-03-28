import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getRecipes } from '../services/recipeService';
import '../App.css';

// Mock data for when API fails
const mockRecipes = [
  {
    id: 1,
    name: "Classic Chicken Salad",
    image: "https://spoonacular.com/recipeImages/1-312x231.jpg",
    calories: 320,
    protein: 28,
    fat: 12,
    readyInMinutes: 20
  },
  {
    id: 2,
    name: "Vegetable Stir Fry",
    image: "https://spoonacular.com/recipeImages/2-312x231.jpg",
    calories: 240,
    protein: 8,
    fat: 10,
    readyInMinutes: 15
  },
  {
    id: 3,
    name: "Beef and Broccoli",
    image: "https://spoonacular.com/recipeImages/3-312x231.jpg",
    calories: 380,
    protein: 32,
    fat: 18,
    readyInMinutes: 25
  }
];

const RecipesOverview = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('balanced');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [usingMockData, setUsingMockData] = useState(false);
  const [error, setError] = useState(null);

  const cuisineOptions = [
    'African', 'American', 'British', 'Cajun', 'Caribbean',
    'Chinese', 'Eastern European', 'European', 'French', 'German',
    'Greek', 'Indian', 'Irish', 'Italian', 'Japanese',
    'Jewish', 'Korean', 'Latin American', 'Mediterranean', 'Mexican',
    'Middle Eastern', 'Nordic', 'Southern', 'Spanish', 'Thai', 'Vietnamese'
  ];

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      setError(null);
      try {
        const recipes = await getRecipes(filter, searchQuery, selectedCuisine);
        setRecipes(recipes);
        setUsingMockData(false);
      } catch (error) {
        console.error('Error fetching recipes:', error);
        setError('API limit may be exceeded - showing sample recipes');
        setRecipes(mockRecipes);
        setUsingMockData(true);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [filter, searchQuery, selectedCuisine]);

  const handleSearch = (e) => {
    e.preventDefault();
    // The useEffect will trigger automatically
  };

  return (
    <div className="recipes-overview">
      <h1>Recipe Recommendations</h1>
      
      {usingMockData && (
        <div className="mock-warning">
          {error} - Some features may be limited
        </div>
      )}

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="search-bar">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for recipes..."
          disabled={usingMockData}
        />
        <button type="submit" disabled={usingMockData}>
          Search
        </button>
      </form>

      {/* Filters Row */}
      <div className="filters-row">
        {/* Dietary Filter Buttons */}
        <div className="category-filter">
          <h3>Dietary Preference:</h3>
          <div className="filter-buttons">
            {['balanced', 'low-calorie', 'high-protein', 'low-fat', 'vegetarian'].map((filterType) => (
              <button 
                key={filterType}
                className={filter === filterType ? 'active' : ''}
                onClick={() => setFilter(filterType)}
                disabled={usingMockData}
              >
                {filterType.split('-').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Cuisine Dropdown */}
        <div className="cuisine-filter">
          <h3>Cuisine:</h3>
          <select
            value={selectedCuisine}
            onChange={(e) => setSelectedCuisine(e.target.value)}
            disabled={usingMockData}
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

      {/* Recipe List */}
      <div className="recipe-list">
        {recipes.length > 0 ? (
          recipes.map((recipe) => (
            <div key={recipe.id} className="recipe-card">
              <img 
                src={recipe.image} 
                alt={recipe.name} 
                className="recipe-image"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/312x231?text=Recipe+Image';
                }}
              />
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
          ))
        ) : (
          !loading && <div className="no-results">No recipes found. Try a different search.</div>
        )}
      </div>
    </div>
  );
};

export default RecipesOverview;