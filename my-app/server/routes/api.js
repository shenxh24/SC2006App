const express = require('express');
const router = express.Router();
const recipesController = require('../controllers/recipesControllers');
const trackerController = require('../controllers/trackerControllers');

// RecipeOverview routes
router.get('/recipes', recipesController.getRecipes);

// RecipeDetails routes
router.get('/recipes/:id', recipesController.getRecipeDetails);

// Tracker routes
router.get('/food/search', trackerController.searchFood);
router.get('/food/:id/nutrition', trackerController.getFoodNutrition);

module.exports = router;