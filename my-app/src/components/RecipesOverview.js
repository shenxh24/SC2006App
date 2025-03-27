import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const RecipesOverview = () => {
  const [recipes] = useState([
    { id: 1, name: 'Recipe 1', calories: 300, fat: 10, protein: 20, image: 'https://via.placeholder.com/150' },
    { id: 2, name: 'Recipe 2', calories: 250, fat: 5, protein: 15, image: 'https://via.placeholder.com/150' },
    { id: 3, name: 'Recipe 3', calories: 400, fat: 15, protein: 25, image: 'https://via.placeholder.com/150' },
    { id: 4, name: 'Recipe 4', calories: 350, fat: 12, protein: 18, image: 'https://via.placeholder.com/150' },
  ]);

  const [filter, setFilter] = useState('recommended'); // Default filter

  // Function to sort recipes based on the selected filter
  const sortRecipes = (recipes, filter) => {
    switch (filter) {
      case 'calories-asc':
        return [...recipes].sort((a, b) => a.calories - b.calories);
      case 'fat-asc':
        return [...recipes].sort((a, b) => a.fat - b.fat);
      case 'protein-asc':
        return [...recipes].sort((a, b) => a.protein - b.protein);
      case 'recommended':
      default:
        return recipes; // No sorting for recommended
    }
  };

  const sortedRecipes = sortRecipes(recipes, filter);

  return (
    <div className="recipes-overview">
      <h1>Recipes Overview</h1>

      {/* Filter Options */}
      <div className="filter-options">
        <label>
          Sort by:
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="recommended">Recommended</option>
            <option value="calories-asc">Calories (Low to High)</option>
            <option value="fat-asc">Fat (Low to High)</option>
            <option value="protein-asc">Protein (Low to High)</option>
          </select>
        </label>
      </div>

      {/* Recipe List */}
      <div className="recipe-list">
        {sortedRecipes.map((recipe) => (
          <div key={recipe.id} className="recipe-item">
            <img src={recipe.image} alt={recipe.name} className="recipe-image" />
            <h3>{recipe.name}</h3>
            <p>Calories: {recipe.calories} kcal</p>
            <p>Fat: {recipe.fat} g</p>
            <p>Protein: {recipe.protein} g</p>
            <Link to={`/recipe/${recipe.id}`} className="view-details-button">
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecipesOverview;