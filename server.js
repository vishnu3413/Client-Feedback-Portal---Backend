import dotenv from "dotenv";
import fs from "fs";
import http from "http";
import https from "https";
import app from "./src/index.js"; // Import the app from src/index.js
import { PrismaClient } from "@prisma/client";
// Load environment variables
const env = process.env.NODE_ENV || 'development';
dotenv.config({ path: `.env.${env}` });

const PORT = process.env.PORT || 3000;
const prisma = new PrismaClient(); // Initialize Prisma Client

// Function to check database connection
async function checkDatabaseConnection() {
  try {
    await prisma.$connect();
    console.log("Database connected successfully.");
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1); // Exit if database connection fails
  }
}

// Create a server based on the environment
let server;
checkDatabaseConnection().then(() => {
  // Start HTTP server for development
  server = http.createServer(app).listen(PORT, () => {
    console.log(`HTTP Server is running on port ${PORT}`);
  });
});

// Graceful shutdown (optional)
const shutdown = (signal) => {
  console.log(`Received ${signal}. Closing HTTP/HTTPS server.`);
  server.close(() => {
    console.log("HTTP/HTTPS server closed.");
    prisma
      .$disconnect() // Disconnect from the database
      .then(() => {
        console.log("Database disconnected.");
        process.exit(0);
      })
      .catch((error) => {
        console.error("Error disconnecting from the database:", error);
        process.exit(1);
      });
  });
};

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
});

// Listen for termination signals
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
