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
// import { upload } from '../middleware/upload';
import multer from 'multer';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Public routes
router.get('/', getProjects);
router.get('/:id', getProject);


// Protected routes
router.post('/', auth, upload.single('image'), createProject);
router.put('/:id', auth, upload.single('image'), updateProject);
router.delete('/:id', auth, deleteProject);
router.post('/:id/team', auth, addTeamMember);
router.delete('/:id/team', auth, removeTeamMember);

export default router; 