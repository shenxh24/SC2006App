require('dotenv').config();
const express = require('express');
const OAuth = require('oauth-1.0a');
const crypto = require('crypto');
const axios = require('axios');
const cors = require('cors');
const qs = require('querystring');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  credentials: true,
}));
app.use(express.json());

// FatSecret OAuth Configuration
const oauth = OAuth({
  consumer: {
    key: process.env.FATSECRET_CONSUMER_KEY,
    secret: process.env.FATSECRET_CONSUMER_SECRET,
  },
  signature_method: 'HMAC-SHA1',
  hash_function: (base_string, key) => {
    return crypto.createHmac('sha1', key).update(base_string).digest('base64');
  }
});

const makeFatSecretRequest = async (method, params = {}) => {
  const requestData = {
    url: 'https://platform.fatsecret.com/rest/server.api',
    method: 'POST',
    data: {
      method,
      format: 'json',
      ...params
    }
  };

  const authHeaders = oauth.toHeader(oauth.authorize(requestData));
  
  try {
    const response = await axios.post(
      requestData.url,
      qs.stringify(requestData.data), // Using qs.stringify instead of URLSearchParams
      {
        headers: {
          ...authHeaders,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error("FatSecret API Error:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      config: error.config
    });
    throw error;
  }
};

// Nutrition Endpoint
app.get('/api/nutrition', async (req, res) => {
  try {
    const { food, amount = 100 } = req.query;

    if (!food) {
      return res.status(400).json({ error: 'Food name is required' });
    }

    // Step 1: Search for food ID
    const searchData = await makeFatSecretRequest('foods.search', {
      search_expression: food,
      max_results: 1,
    });

    if (!searchData.foods?.food?.length) {
      return res.status(404).json({ error: 'Food not found' });
    }

    const foodId = searchData.foods.food[0].food_id;

    // Step 2: Get detailed nutrition
    const nutritionData = await makeFatSecretRequest('food.get', {
      food_id: foodId,
    });

    const serving = nutritionData.food.servings.serving[0];
    const servingSize = parseFloat(serving.metric_serving_amount);
    const ratio = parseFloat(amount) / servingSize;

    const result = {
      food: nutritionData.food.food_name,
      calories: (parseFloat(serving.calories) * ratio).toFixed(1),
      protein: (parseFloat(serving.protein) * ratio).toFixed(1),
      fat: (parseFloat(serving.fat) * ratio).toFixed(1),
      carbs: (parseFloat(serving.carbohydrate) * ratio).toFixed(1),
    };

    res.json(result);
  } catch (error) {
    console.error('Server Error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch nutrition data',
      details: error.message 
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});