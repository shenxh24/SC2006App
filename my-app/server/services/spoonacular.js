const axios = require('axios');
const API_KEY = process.env.SPOONACULAR_API_KEY;
const BASE_URL = 'https://api.spoonacular.com';

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

    const response = await axios.get(`${BASE_URL}/recipes/complexSearch`, { 
      params,
      timeout: 10000 // 10 second timeout
    });

    if (!response.data?.results) {
      throw new Error('Invalid response format from Spoonacular');
    }

    return response.data.results.map(recipe => ({
      id: recipe.id,
      name: recipe.title,
      image: recipe.image,
      nutrition: {
        nutrients: recipe.nutrition?.nutrients || [
          { name: 'Calories', amount: 0 },
          { name: 'Protein', amount: 0 },
          { name: 'Fat', amount: 0 }
        ]
      }
    }));
  } catch (error) {
    console.error('Error fetching recipes:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      config: error.config
    });
    throw new Error('Failed to fetch recipes');
  }
};

// Get detailed recipe information
const getRecipeDetails = async (id) => {
  try {
    if (!id || isNaN(id)) {
      throw new Error('Invalid recipe ID');
    }

    const response = await axios.get(`${BASE_URL}/recipes/${id}/information`, {
      params: {
        apiKey: API_KEY,
        includeNutrition: true
      },
      timeout: 10000
    });
    
    if (!response.data) {
      throw new Error('Empty response from Spoonacular');
    }
    
    return response.data;
  } catch (error) {
    console.error('Recipe details API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      config: error.config
    });
    throw new Error('Failed to get recipe details');
  }
};

// Search for food ingredients
const searchFood = async (query, number = 1) => {
  try {
    if (!query || typeof query !== 'string') {
      throw new Error('Invalid search query');
    }

    const response = await axios.get(`${BASE_URL}/food/ingredients/search`, {
      params: {
        apiKey: API_KEY,
        query: query.trim(),
        number: Math.min(number, 5) // Limit to 5 results max
      },
      timeout: 8000
    });

    if (!response.data?.results) {
      return [];
    }

    return response.data.results.map(item => ({
      id: item.id,
      name: item.name,
      image: `https://spoonacular.com/cdn/ingredients_100x100/${item.image}`
    }));
  } catch (error) {
    console.error('Food search API error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      config: error.config
    });
    throw new Error('Failed to search food ingredients');
  }
};

// Get nutrition data for specific food ingredient
const getFoodNutrition = async (id, amount, unit) => {
  try {
    if (!id || isNaN(id)) {
      throw new Error('Invalid food ID');
    }

    if (!amount || isNaN(amount)) {
      throw new Error('Amount must be a number');
    }

    // Normalize unit values
    const normalizedUnit = unit.toLowerCase().replace(/s$/, '');
    const validUnits = ['gram', 'ounce', 'cup', 'tablespoon', 'teaspoon', 'piece', 'ml', 'liter'];
    
    if (!validUnits.includes(normalizedUnit)) {
      throw new Error(`Invalid unit. Valid units are: ${validUnits.join(', ')}`);
    }

    const response = await axios.get(
      `${BASE_URL}/food/ingredients/${id}/information`,
      {
        params: {
          apiKey: API_KEY,
          amount: parseFloat(amount),
          unit: normalizedUnit
        },
        timeout: 8000
      }
    );

    if (!response.data?.nutrition) {
      throw new Error('Invalid nutrition data format');
    }

    // Standardize the nutrition data structure
    return {
      id: response.data.id,
      name: response.data.name,
      image: response.data.image,
      nutrition: {
        nutrients: response.data.nutrition.nutrients.map(nutrient => ({
          name: nutrient.name,
          amount: nutrient.amount,
          unit: nutrient.unit
        })),
        properties: response.data.nutrition.properties || [],
        caloricBreakdown: response.data.nutrition.caloricBreakdown || {}
      }
    };
  } catch (error) {
    console.error('Nutrition API Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      config: error.config
    });
    throw error;
  }
};

module.exports = {
  // Recipe services
  getRecipes,
  getRecipeDetails,

  // Tracker services
  searchFood,
  getFoodNutrition
};