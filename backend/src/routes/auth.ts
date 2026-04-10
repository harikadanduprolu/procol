import express, { Router } from 'express';
import { 
  register, 
  login, 
  getProfile, 
  updateProfile, 
  searchUsers,
  getAllUsers,
  getUserById,
  otp
} from '../controllers/auth';
import { auth } from '../middleware/auth';

const router = Router();

// Authentication routes
router.post('/otp', otp);
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);
router.get('/search', auth, searchUsers);
router.get('/users/search', auth, searchUsers);
// Public route for fetching all users (for Connect page)
router.get('/users', getAllUsers);
router.get('/users/:id', auth, getUserById);

export default router;