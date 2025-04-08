const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes.js');
const programRoutes = require('./routes/programRoutes.js');
const volunteerRoutes = require('./routes/volunteerRoutes');
const donationRoutes = require('./routes/donationRoutes');
const achievementRoutes = require('./routes/achievementRoutes');

dotenv.config();

const app = express();

// Configure CORS for development
const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:5173'], // Add your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token']
};

// Enhanced logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} | ${req.method} ${req.originalUrl}`);
  next();
});

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Preflight OPTIONS handling
app.options('*', cors(corsOptions));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/programs', programRoutes);
app.use('/api/volunteers', volunteerRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/achievements', achievementRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong on the server',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler - after all routes
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: `Route not found: ${req.method} ${req.originalUrl}` 
  });
});

// Database connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Basic route
app.get('/', (req, res) => {
  res.send('PARVARISH NGO Backend');
});

const Program = require('./models/Program');
app.post('/api/test-program', async (req, res) => {
  const testProgram = new Program({
    title: "Child Education",
    description: "Free schooling for underprivileged children",
    startDate: new Date(),
    isActive: true
  });
  await testProgram.save();
  res.send('Test program created!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION:', err);
  process.exit(1);
});