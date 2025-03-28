const axios = require('axios');
const API_KEY = process.env.SPOONACULAR_API_KEY;
const BASE_URL = 'https://api.spoonacular.com/recipes';

// Get multiple recipes
const getRecipes = async ({ filter, searchQuery, selectedCuisine, number }) => {
  try {
    let params = {
      apiKey: API_KEY,
      number: number || 8,
      addRecipeNutrition: true,
    };

    if (searchQuery) params.query = searchQuery;
    if (selectedCuisine) params.cuisine = selectedCuisine;

    // Apply dietary filters
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

    const response = await axios.get(`${BASE_URL}/complexSearch`, { params });

return response.data.results.map(recipe => ({
      id: recipe.id,
      name: recipe.title,
      image: recipe.image,
      nutrition: {  // Ensure consistent structure
        nutrients: recipe.nutrition?.nutrients || [
          { name: 'Calories', amount: 0 },
          { name: 'Protein', amount: 0 },
          { name: 'Fat', amount: 0 }
        ]
      }
    }));
  } catch (error) {
    console.error('Error fetching recipes:', error);
    throw error;
  }
};

const getRecipeDetails = async (id) => {
  try {
    console.log(`Calling Spoonacular API for recipe ${id}`);
    const response = await axios.get(`${BASE_URL}/${id}/information`, {
      params: {
        apiKey: process.env.SPOONACULAR_API_KEY,
        includeNutrition: true
      }
    });
    
    if (!response.data) {
      throw new Error('Empty response from Spoonacular');
    }
    
    return response.data;
  } catch (error) {
    console.error('Spoonacular API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    throw error;
  }
};

module.exports = {
  getRecipes,
  getRecipeDetails
};