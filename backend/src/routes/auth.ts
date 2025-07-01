import express from 'express';
import { register, login, getProfile, updateProfile, searchUsers } from '../controllers/auth';
import { auth } from '../middleware/auth';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);
router.get('/users/search', searchUsers);

export default router; 