const spoonacularService = require('../services/spoonacular');

// Get multiple recipes
const getRecipes = async (req, res, next) => {
  try {
    const { filter, searchQuery, selectedCuisine, number = 8 } = req.query;
    
    const recipes = await spoonacularService.getRecipes({
      filter,
      searchQuery,
      selectedCuisine,
      number: parseInt(number)
    });

    res.json(recipes);
  } catch (error) {
    next(error);
  }
};

const getRecipeDetails = async (req, res, next) => {
    try {
      console.log('Received request for recipe ID:', req.params.id);
      const recipe = await spoonacularService.getRecipeDetails(req.params.id);
      
      if (!recipe) {
        console.warn('No recipe found for ID:', req.params.id);
        return res.status(404).json({ error: 'Recipe not found' });
      }
      
      console.log('Sending recipe data for ID:', req.params.id);
      res.json(recipe);
    } catch (error) {
      console.error('Controller error:', error.stack);
      next(error);
    }
  };

  

module.exports = {
  getRecipes,
  getRecipeDetails
};