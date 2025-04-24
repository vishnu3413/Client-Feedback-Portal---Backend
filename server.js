import dotenv from 'dotenv';
import fs from 'fs';
import http from 'http';
import https from 'https';
import app from './src/index.js';  // Import the app from src/index.js
import { PrismaClient } from '@prisma/client';
import './src/utils/logger.js'; // Ensure logger is initialized
import './src/utils/createLogDirectory.js'; // Ensure logs directory exists
import { ENV_DEV } from './src/utils/constants.js';

// Load environment variables
const env = process.env.NODE_ENV || ENV_DEV;
dotenv.config({ path: `.env.${env}` });

// Check environment variable
console.log("Logging Enabled:", process.env.LOGGING_ENABLED);

const PORT = process.env.PORT || 3000;
const prisma = new PrismaClient();  // Initialize Prisma Client

// Function to check database connection
async function checkDatabaseConnection() {
  try {
    await prisma.$connect();
    console.log('Database connected successfully.');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1); // Exit if database connection fails
  }
}

// Create a server based on the environment
let server;
checkDatabaseConnection().then(() => {
  if (env === 'production') {
    // Load SSL certificates for HTTPS
    const privateKey = fs.readFileSync(process.env.SSL_KEY_PATH || './key.pem', 'utf8');
    const certificate = fs.readFileSync(process.env.SSL_CERT_PATH || './cert.pem', 'utf8');
    const credentials = { key: privateKey, cert: certificate };

    // Start HTTPS server
    server = https.createServer(credentials, app).listen(PORT, () => {
      console.log(`HTTPS Server is running on port ${PORT}`);
    });
  } else {
    // Start HTTP server for development
    server = http.createServer(app).listen(PORT, () => {
      console.log(`HTTP Server is running on port ${PORT}`);
    });
  }
});

// Graceful shutdown (optional)
const shutdown = (signal) => {
  console.log(`Received ${signal}. Closing HTTP/HTTPS server.`);
  server.close(() => {
    console.log('HTTP/HTTPS server closed.');
    prisma.$disconnect() // Disconnect from the database
      .then(() => {
        console.log('Database disconnected.');
        process.exit(0);
      })
      .catch((error) => {
        console.error('Error disconnecting from the database:', error);
        process.exit(1);
      });
  });
};

process.on('uncaughtException', err => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', err => {
  console.error('Unhandled Rejection:', err);
});

// Listen for termination signals
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));