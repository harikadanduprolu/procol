import express from 'express';
import { 
  createProject, 
  getProjects, 
  getProject, 
  updateProject, 
  deleteProject,
  addTeamMember,
  removeTeamMember
} from '../controllers/project';
import { auth } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/', getProjects);
router.get('/:id', getProject);

// Protected routes
router.post('/', auth, createProject);
router.put('/:id', auth, updateProject);
router.delete('/:id', auth, deleteProject);
router.post('/:id/team', auth, addTeamMember);
router.delete('/:id/team', auth, removeTeamMember);

export default router; 