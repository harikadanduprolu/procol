import express from 'express';
import { auth } from '../middleware/auth';
import {
  sendMessage,
  sendTeamMessage,
  sendProjectMessage,
  getMessages,
  getTeamMessages,
  getProjectMessages,
  getConversations,
  addReaction,
  removeReaction,
  deleteMessage,
  updateMessage,
  markAllAsRead,
  markAsRead,
  getUnreadCount,
  createConversation
} from '../controllers/message';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(auth);

// Direct messages
router.post('/', sendMessage);
router.get('/conversations', getConversations);
router.get('/:recipientId', getMessages);
router.put('/:recipientId/read', markAsRead);

// Team messages
router.post('/team/:teamId', sendTeamMessage);
router.get('/team/:teamId', getTeamMessages);

// Project messages
router.post('/project/:projectId', sendProjectMessage);
router.get('/project/:projectId', getProjectMessages);

// Message actions
router.put('/:messageId', updateMessage);
router.delete('/:messageId', deleteMessage);

// Reactions
router.post('/:messageId/reaction', addReaction);
router.delete('/:messageId/reaction', removeReaction);

// Read status
router.put('/all/read', markAllAsRead);
router.get('/unread/count', getUnreadCount);

// New route
router.post('/conversations', createConversation);

export default router;
