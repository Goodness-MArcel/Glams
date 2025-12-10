import express from 'express';
import { AdminLogin, getProfile } from '../controller/authcontroller.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Public route - no token required for login
router.post('/admin/login', AdminLogin);

// Protected routes - require valid token
router.get('/profile', verifyToken, getProfile);

export default router;