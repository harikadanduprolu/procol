"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const message_1 = require("../controllers/message");
const router = express_1.default.Router();
// Apply authentication middleware to all routes
router.use(auth_1.auth);
// Direct messages
router.post('/', message_1.sendMessage);
router.get('/conversations', message_1.getConversations);
router.get('/:recipientId', message_1.getMessages);
router.put('/:recipientId/read', message_1.markAsRead);
// Team messages
router.post('/team/:teamId', message_1.sendTeamMessage);
router.get('/team/:teamId', message_1.getTeamMessages);
// Project messages
router.post('/project/:projectId', message_1.sendProjectMessage);
router.get('/project/:projectId', message_1.getProjectMessages);
// Message actions
router.put('/:messageId', message_1.updateMessage);
router.delete('/:messageId', message_1.deleteMessage);
// Reactions
router.post('/:messageId/reaction', message_1.addReaction);
router.delete('/:messageId/reaction', message_1.removeReaction);
// Read status
router.put('/all/read', message_1.markAllAsRead);
router.get('/unread/count', message_1.getUnreadCount);
exports.default = router;
