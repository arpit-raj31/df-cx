require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

const userRoutes = require('./routes/userRoutes');

// Enable CORS for a specific domain or for all origins (for development)
app.use(cors({
  origin: 'https://tradecfd.in', // change this to your actual frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Middleware for parsing JSON request bodies
app.use(express.json());

// Use user routes
app.use('/api/v1/user', userRoutes);

// Route for testing if the backend is up and running
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
