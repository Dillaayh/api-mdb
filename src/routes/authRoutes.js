import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route for User Registration
router.post('/register', registerUser, verifyToken);

// Route for User Login
router.post('/login', loginUser);

export default router;
