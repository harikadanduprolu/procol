import express from 'express';
import { 
  createNotification, 
  getNotifications, 
  markAsRead,
  deleteNotification
} from '../controllers/notification';
import { auth } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(auth);

router.post('/', createNotification);
router.get('/', getNotifications);
router.put('/:id/read', markAsRead);
router.put('/all/read', markAsRead);
router.delete('/:id', deleteNotification);

export default router; 