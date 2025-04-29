import express from 'express';
import { getProfile, updateProfile, getPublicProfile } from '../controllers/profile';
import { auth } from '../middleware/auth';

const router = express.Router();

// Protected routes (require authentication)
router.get('/me', auth, getProfile);
router.put('/me', auth, updateProfile);

// Public routes
router.get('/:id', getPublicProfile);

export default router; 