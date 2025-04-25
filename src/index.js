/*
 * File: src/index.js
 * Description:
 * This module initializes an Express application, sets up middleware for request logging,
 * CORS handling, and authentication, and defines API routes. It also includes error handling,
 * a health check endpoint, and integrates Swagger for API documentation.
 */

import express from 'express';
import dotenv from 'dotenv';
import routes from './routes/index.js'; // Import centralized routes
import cors from 'cors'; // Optional: For handling CORS
import bodyParser from 'body-parser'; 

// Initialize dotenv
dotenv.config();

const app = express();

// Middleware
// app.use(express.json());
app.use(cors()); // Enable CORS

// Middleware to parse JSON bodies with a limit of 50MB
app.use(bodyParser.json({ limit: "2mb" }));

// Middleware to parse URL-encoded bodies with a limit of 50MB and extended options
app.use(bodyParser.urlencoded({ limit: "2mb", extended: true}));

// Custom error handling middleware for large payloads
app.use((err, req, res, next) => {
  if (err.type === 'entity.too.large') {  // 413 is the status code for payload too large
    return res.status(413).json({
      status: 'error',
      message: 'Request entity too large. Please ensure the payload size is under 2MB.'
    });
  }
  next(err);  // Pass on other errors to the default error handler
});

//app.use(authMiddleware); // Apply the middleware to all routes

// Routes
app.use('/api', routes);

export default app;