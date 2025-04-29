import express from 'express';
import { 
  sendMessage, 
  getMessages, 
  getConversations,
  markAsRead
} from '../controllers/message';
import { auth } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(auth);

router.post('/', sendMessage);
router.get('/conversations', getConversations);
router.get('/:userId', getMessages);
router.put('/:userId/read', markAsRead);

export default router; 