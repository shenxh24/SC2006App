require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Client } = require('@googlemaps/google-maps-services-js');
const apiRouter = require('./routes/api');

const app = express();
const client = new Client({});
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', apiRouter);

// Google Maps API Routes
// Get user's location based on browser geolocation
app.post('/api/location', async (req, res) => {
  try {
    const { lat, lng } = req.body;
    if (!lat || !lng) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }
    res.json({ location: { lat, lng } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search for nearby restaurants
app.post('/api/nearby-search', async (req, res) => {
  try {
    const { location, keyword, minRating, priceRange, radius = 5000 } = req.body;
    
    const response = await client.placesNearby({
      params: {
        location: `${location.lat},${location.lng}`,
        radius,
        type: 'restaurant',
        keyword,
        min_price: priceRange,
        max_price: priceRange,
        key: GOOGLE_API_KEY
      }
    });

    const results = response.data.results.map(result => ({
      place_id: result.place_id,
      name: result.name,
      geometry: result.geometry,
      rating: result.rating,
      user_ratings_total: result.user_ratings_total,
      price_level: result.price_level
    }));

    res.json({ results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get place details
app.post('/api/place-details', async (req, res) => {
  try {
    const { placeId } = req.body;
    if (!placeId) {
      return res.status(400).json({ error: 'Place ID is required' });
    }

    const response = await client.placeDetails({
      params: {
        place_id: placeId,
        fields: ['name', 'formatted_address', 'geometry', 'rating', 'user_ratings_total', 'reviews'],
        key: GOOGLE_API_KEY
      }
    });

    res.json({ details: response.data.result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get directions
app.post('/api/directions', async (req, res) => {
  try {
    const { origin, destination, travelMode } = req.body;
    
    const response = await client.directions({
      params: {
        origin: `${origin.lat},${origin.lng}`,
        destination: `${destination.lat},${destination.lng}`,
        mode: travelMode.toLowerCase(),
        transit_mode: travelMode === 'TRANSIT' ? 'bus' : undefined,
        key: GOOGLE_API_KEY
      }
    });

    res.json({ directions: response.data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Server Error:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    originalError: err
  });
  res.status(500).json({
    error: 'Something went wrong',
    ...(process.env.NODE_ENV === 'development' && { details: err.message })
  });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});