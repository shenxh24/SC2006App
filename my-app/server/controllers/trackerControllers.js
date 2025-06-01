const spoonacularService = require('../services/spoonacular');

// Search for food ingredients
const searchFood = async (req, res, next) => {
  try {
    const { query, number = 1 } = req.query;
    const results = await spoonacularService.searchFood(query, number);
    
    if (!results || results.length === 0) {
      return res.status(404).json({ error: 'No food items found' });
    }
    
    res.json(results);
  } catch (error) {
    console.error('Search food error:', error);
    next(error);
  }
};

// Get nutrition data for specific food
const getFoodNutrition = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { amount, unit } = req.query;
  
      if (!id || isNaN(id)) {
        return res.status(400).json({ error: 'Invalid food ID' });
      }
  
      if (!amount || isNaN(amount)) {
        return res.status(400).json({ error: 'Amount must be a number' });
      }
  
      // Make unit validation more flexible
      const validUnits = ['g', 'gram', 'grams', 'oz', 'ounce', 'ounces', 'cup', 'cups', 'tbsp', 'tablespoon', 'tablespoons'];
      if (!unit || !validUnits.some(u => unit.toLowerCase().includes(u))) {
        return res.status(400).json({ error: `Invalid unit. Valid units are: ${validUnits.join(', ')}` });
      }
  
      const nutrition = await spoonacularService.getFoodNutrition(id, amount, unit);
      res.json(nutrition);
    } catch (error) {
      console.error('Controller error:', error.message);
      res.status(500).json({ 
        error: 'Failed to get nutrition data',
        details: error.message 
      });
    }
  };

module.exports = {
  searchFood,
  getFoodNutrition
};