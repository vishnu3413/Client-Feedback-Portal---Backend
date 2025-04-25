import express from 'express';
import { register, login } from '../controllers/authController.js';

const router = express.Router();

// Route to register user
router.post('/register', register);

// Route to login user
router.post('/login', login);

export default router;