// backend/server.js
const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for all routes
app.use(cors());

// API endpoint to fetch hawker centres
app.get('/api/hawker-centres', async (req, res) => {
  try {
    const { lat, lng, radius } = req.query;
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=food&key=${process.env.GOOGLE_MAPS_API_KEY}`
    );

    res.json(response.data.results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
app.get('/api/hawker-centres', async (req, res) => {
    try {
      const { lat, lng, radius } = req.query;
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=food&key=${process.env.GOOGLE_MAPS_API_KEY}`
      );
  
      res.json(response.data.results);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/directions', async (req, res) => {
    try {
      const { origin, destination } = req.query;
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${process.env.GOOGLE_MAPS_API_KEY}`
      );
  
      res.json(response.data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });