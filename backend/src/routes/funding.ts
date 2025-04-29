import express from 'express';
import { 
  createFunding, 
  getFundings, 
  getFunding, 
  updateFunding, 
  deleteFunding,
  backFunding
} from '../controllers/funding';
import { auth } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/', getFundings);
router.get('/:id', getFunding);

// Protected routes
router.post('/', auth, createFunding);
router.put('/:id', auth, updateFunding);
router.delete('/:id', auth, deleteFunding);
router.post('/:id/back', auth, backFunding);

export default router; 