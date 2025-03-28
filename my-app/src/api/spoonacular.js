// src/api/spoonacular.js
import axios from 'axios';

const API_KEY = '92f7abf67e7b49f0a04d4a265bccba27';
const BASE_URL = 'https://api.spoonacular.com';

export const getRecipes = async ({ filter, searchQuery, cuisine }) => {
  try {
    const response = await axios.get(`${BASE_URL}/recipes/complexSearch`, {
      params: {
        apiKey: API_KEY,
        query: searchQuery,
        cuisine,
        diet: filter,
        number: 10,
        addRecipeInformation: true,
      },
    });
    return response.data.results;
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return [];
  }
};

export const searchRecipes = async (query) => {
  try {
    const response = await axios.get(`${BASE_URL}/recipes/complexSearch`, {
      params: {
        apiKey: API_KEY,
        query,
        number: 10, // Limit results
        addRecipeInformation: true,
      },
    });
    return response.data.results;
  } catch (error) {
    console.error('Error searching recipes:', error);
    return [];
  }
};

export const getRecipeDetails = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/recipes/${id}/information`, {
      params: {
        apiKey: API_KEY,
        includeNutrition: true,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching recipe details:', error);
    return null;
  }
};