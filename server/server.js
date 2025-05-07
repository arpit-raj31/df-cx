// app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors'); // <--- import cors
const app = express();
const PORT = process.env.PORT || 5000;

const userRoutes = require('./routes/userRoutes');

 // <--- use cors middleware
app.use(cors({
  origin: 'https://tradecfd.in', // replace with your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());  
app.use('/api/v1/user', userRoutes);

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
