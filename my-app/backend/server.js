// backend/server.js
const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;

// Enable CORS for all routes
app.use(cors());

// API endpoint to fetch hawker centres
app.get('/api/hawker-centres', async (req, res) => {
  try {
    const { lat, lng, radius } = req.query;

    // Validate required query parameters
    if (!lat || !lng || !radius) {
      return res.status(400).json({ error: 'Missing required query parameters: lat, lng, radius' });
    }

    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=food&key=${process.env.GOOGLE_MAPS_API_KEY}`
    );

    // Check if the API returned results
    if (response.data.results) {
      res.json(response.data.results);
    } else {
      res.status(404).json({ error: 'No results found' });
    }
  } catch (err) {
    console.error('Error fetching hawker centres:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// API endpoint to fetch directions
app.get('/api/directions', async (req, res) => {
  try {
    const { origin, destination } = req.query;

    // Validate required query parameters
    if (!origin || !destination) {
      return res.status(400).json({ error: 'Missing required query parameters: origin, destination' });
    }

    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${process.env.GOOGLE_MAPS_API_KEY}`
    );

    // Check if the API returned directions
    if (response.data.routes) {
      res.json(response.data);
    } else {
      res.status(404).json({ error: 'No directions found' });
    }
  } catch (err) {
    console.error('Error fetching directions:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});