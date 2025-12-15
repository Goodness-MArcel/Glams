// Import dependencies
import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';

// import './seedDb.js'

// Import routes
import authRoute from './route/auth.route.js';
import productsRoute from './route/products.route.js';
import paymentsRoute from './route/payments.route.js';

// Initialize environment variables
dotenv.config();

// Create Express app
const app = express();

// Security and logging middleware
app.use(helmet());
app.use(morgan('dev'));

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
};
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api/auth', authRoute);
app.use('/api/products', productsRoute);
app.use('/api/payments', paymentsRoute);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Glams API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});



// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});