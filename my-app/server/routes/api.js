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

/* google maps routes
router.post('/maps/nearby-search', async (req, res) => {
    try {
      const response = await axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json', {
        params: {
          ...req.body,
          key: process.env.GOOGLE_MAPS_API_KEY
        }
      });
      res.json(response.data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  router.post('/maps/place-details', async (req, res) => {
    try {
      const response = await axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
        params: {
          ...req.body,
          key: process.env.GOOGLE_MAPS_API_KEY
        }
      });
      res.json(response.data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  router.post('/maps/directions', async (req, res) => {
    try {
      const response = await axios.get('https://maps.googleapis.com/maps/api/directions/json', {
        params: {
          ...req.body,
          key: process.env.GOOGLE_MAPS_API_KEY
        }
      });
      res.json(response.data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.get('/maps/init', (req, res) => {
    res.json({
        apiKey: process.env.GOOGLE_MAPS_API_KEY,
        defaultLocation: { lat: 1.3521, lng: 103.8198 },
        deafultZoom: 12
    });
  }); */

module.exports = router;