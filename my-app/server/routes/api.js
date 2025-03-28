const express = require('express');
const router = express.Router();
const recipesController = require('../controllers/recipesControllers');

// RecipeOverview routes
router.get('/recipes', recipesController.getRecipes);

// RecipeDetails routes
router.get('/recipes/:id', recipesController.getRecipeDetails);

module.exports = router;