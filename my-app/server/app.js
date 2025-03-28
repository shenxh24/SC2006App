require('dotenv').config();
const express = require('express');
const cors = require('cors');
const apiRouter = require('./routes/api');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', apiRouter);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});