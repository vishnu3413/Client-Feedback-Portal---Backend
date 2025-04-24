/*
 * File: config/dotenv.config.js
 * Description: This module handles the configuration and initialization of environment variables 
 * for the application based on the current environment (e.g., development, production).
 * It also sets up the Express application and integrates Swagger documentation 
 * for API endpoints.
 */

import dotenv from "dotenv";

// Determine the current environment (default to 'development' if not specified)
const environment = process.env.NODE_ENV || 'development';

// Set the path to the environment file based on the current environment
const envPath = `.env.${environment}`;

/**
 * Loads environment variables from a specified file and returns the updated process.env.
 * @param {string} filePath - Path to the environment file.
 * @returns {NodeJS.ProcessEnv} - The process.env object with loaded environment variables.
 */
const initConfig = (filePath) => {
    dotenv.config({ path: filePath });
    return process.env;
};

// Load environment variables
const config = initConfig(envPath);

// Export the initialized Express app and the environment config
export { config };