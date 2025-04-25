/*
 * File: src/routes/index.js
 * Description:
 * This module defines the main routing for the application, connecting various 
 * sub-routes for different resources such as organizations, plans, features, 
 * tenants, subscriptions, roles, and users. Each route module handles its specific 
 * operations and database interactions, utilizing Prisma as the ORM.
*/

import express from 'express'; 
import authRoutes from './authRoutes.js';
import feedbackRoutes from './feedbackRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);

router.use('/feedback', feedbackRoutes);

export default router;