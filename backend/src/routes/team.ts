import express from 'express';
import { 
  createTeam, 
  getTeams, 
  getTeam, 
  updateTeam, 
  deleteTeam,
  addTeamMember,
  removeTeamMember,
  getUserTeams
} from '../controllers/team';
import { auth } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/', getTeams);

router.get('/my', auth, getUserTeams);

router.get('/:id', getTeam);

// Protected routes
router.post('/', auth, createTeam);
router.put('/:id', auth, updateTeam);
router.delete('/:id', auth, deleteTeam);
router.post('/:id/members', auth, addTeamMember);
router.delete('/:id/members', auth, removeTeamMember);

// Public routes

export default router; 