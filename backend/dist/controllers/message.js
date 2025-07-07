"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConversation = exports.getUnreadCount = exports.markAsRead = exports.markAllAsRead = exports.updateMessage = exports.deleteMessage = exports.removeReaction = exports.addReaction = exports.getProjectMessages = exports.getTeamMessages = exports.getMessages = exports.getConversations = exports.sendProjectMessage = exports.sendTeamMessage = exports.sendMessage = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const Message_1 = require("../models/Message");
const User_1 = require("../models/User");
const Team_1 = require("../models/Team");
const Project_1 = require("../models/Project");
const index_1 = require("../index");
// Helper function to validate and get recipient
const getRecipient = async (id, type) => {
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid recipient ID');
    }
    let recipient;
    switch (type) {
        case 'user':
            recipient = await User_1.User.findById(new mongoose_1.Types.ObjectId(id));
            break;
        case 'team':
            recipient = await Team_1.Team.findById(new mongoose_1.Types.ObjectId(id));
            break;
        case 'project':
            recipient = await Project_1.Project.findById(new mongoose_1.Types.ObjectId(id));
            break;
    }
    if (!recipient) {
        throw new Error(`${type.charAt(0).toUpperCase() + type.slice(1)} not found`);
    }
    return recipient;
};
// Helper function to check membership in team or project
const checkMembership = async (userId, entityId, type) => {
    const objectId = new mongoose_1.Types.ObjectId(userId);
    if (type === 'team') {
        const team = await Team_1.Team.findById(new mongoose_1.Types.ObjectId(entityId));
        if (!team) {
            throw new Error('Team not found');
        }
        return team.members.some(member => member.equals(objectId));
    }
    else {
        const project = await Project_1.Project.findById(new mongoose_1.Types.ObjectId(entityId));
        if (!project) {
            throw new Error('Project not found');
        }
        return project.team.some(member => member.equals(objectId));
    }
};
// Helper functions
const isTeamMember = async (teamId, userId) => {
    const team = await Team_1.Team.findById(new mongoose_1.Types.ObjectId(teamId));
    if (!team) {
        return false;
    }
    return team.members.some(member => member.equals(new mongoose_1.Types.ObjectId(userId)));
};
const isProjectMember = async (projectId, userId) => {
    const project = await Project_1.Project.findById(new mongoose_1.Types.ObjectId(projectId));
    if (!project) {
        return false;
    }
    return project.team.some(member => member.equals(new mongoose_1.Types.ObjectId(userId)));
};
// Fix the entity model findById calls
const getEntityModel = (type) => {
    switch (type) {
        case 'user':
            return User_1.User;
        case 'team':
            return Team_1.Team;
        case 'project':
            return Project_1.Project;
        default:
            throw new Error('Invalid recipient type');
    }
};
/**
 * Send a direct message to a user
 * @route POST /api/messages
 */
const sendMessage = async (req, res) => {
    try {
        const sender = req.user && req.user._id;
        if (!sender) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        const { recipientId, content } = req.body;
        // Validate recipientId
        if (!recipientId || !mongoose_1.default.Types.ObjectId.isValid(recipientId)) {
            return res.status(400).json({ message: 'Invalid recipientId' });
        }
        const message = new Message_1.Message({
            sender: new mongoose_1.Types.ObjectId(sender),
            recipientId: new mongoose_1.Types.ObjectId(recipientId),
            recipientType: 'user',
            content,
            metadata: {
                readBy: [new mongoose_1.Types.ObjectId(sender)]
            }
        });
        await message.save();
        // Emit socket event
        index_1.io.to(recipientId).emit('newMessage', message);
        res.status(201).json(message);
    }
    catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ message: 'Error sending message' });
    }
};
exports.sendMessage = sendMessage;
/**
 * Send a message to a team
 * @route POST /api/messages/team/:teamId
 */
const sendTeamMessage = async (req, res) => {
    try {
        const sender = req.user && req.user._id;
        if (!sender) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        const { teamId, content } = req.body;
        // Check if user is team member
        const isMember = await isTeamMember(teamId, sender?.toString());
        if (!isMember) {
            return res.status(403).json({ message: 'Not a team member' });
        }
        const team = await Team_1.Team.findById(new mongoose_1.Types.ObjectId(teamId));
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }
        const teamMemberIds = team.members ? team.members.map(member => member.toString()) : [];
        const message = new Message_1.Message({
            sender: new mongoose_1.Types.ObjectId(sender),
            recipientId: new mongoose_1.Types.ObjectId(teamId),
            recipientType: 'team',
            content,
            metadata: {
                readBy: [new mongoose_1.Types.ObjectId(sender)]
            }
        });
        await message.save();
        // Emit socket event to all team members
        teamMemberIds.forEach(memberId => {
            index_1.io.to(memberId).emit('newTeamMessage', message);
        });
        res.status(201).json(message);
    }
    catch (error) {
        console.error('Error sending team message:', error);
        res.status(500).json({ message: 'Error sending team message' });
    }
};
exports.sendTeamMessage = sendTeamMessage;
/**
 * Send a message to a project
 * @route POST /api/messages/project/:projectId
 */
const sendProjectMessage = async (req, res) => {
    try {
        const sender = req.user && req.user._id;
        if (!sender) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        const { projectId, content } = req.body;
        // Check if user is project member
        const isMember = await isProjectMember(projectId, sender?.toString());
        if (!isMember) {
            return res.status(403).json({ message: 'Not a project member' });
        }
        const project = await Project_1.Project.findById(new mongoose_1.Types.ObjectId(projectId));
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        const projectMemberIds = project.team ? project.team.map(member => member.toString()) : [];
        const message = new Message_1.Message({
            sender: new mongoose_1.Types.ObjectId(sender),
            recipientId: new mongoose_1.Types.ObjectId(projectId),
            recipientType: 'project',
            content,
            metadata: {
                readBy: [new mongoose_1.Types.ObjectId(sender)]
            }
        });
        await message.save();
        // Emit socket event to all project members
        projectMemberIds.forEach(memberId => {
            index_1.io.to(memberId).emit('newProjectMessage', message);
        });
        res.status(201).json(message);
    }
    catch (error) {
        console.error('Error sending project message:', error);
        res.status(500).json({ message: 'Error sending project message' });
    }
};
exports.sendProjectMessage = sendProjectMessage;
/**
 * Get all conversations for a user
 * @route GET /api/messages/conversations
 */
const getConversations = async (req, res) => {
    try {
        const userId = req.user && req.user._id;
        if (!userId) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        const conversations = await Message_1.Message.aggregate([
            {
                $match: {
                    $or: [
                        { sender: new mongoose_1.Types.ObjectId(userId.toString()), recipientType: 'user' },
                        { recipientId: new mongoose_1.Types.ObjectId(userId.toString()), recipientType: 'user' }
                    ]
                }
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $group: {
                    _id: {
                        $cond: [
                            { $eq: ['$sender', new mongoose_1.Types.ObjectId(userId.toString())] },
                            '$recipientId',
                            '$sender'
                        ]
                    },
                    lastMessage: { $first: '$$ROOT' },
                    unreadCount: {
                        $sum: {
                            $cond: [
                                {
                                    $and: [
                                        { $eq: ['$recipientId', new mongoose_1.Types.ObjectId(userId.toString())] },
                                        { $not: [{ $in: [new mongoose_1.Types.ObjectId(userId.toString()), '$metadata.readBy'] }] }
                                    ]
                                },
                                1,
                                0
                            ]
                        }
                    }
                }
            }
        ]);
        res.json(conversations);
    }
    catch (error) {
        console.error('Error fetching conversations:', error);
        res.status(500).json({ message: 'Error fetching conversations' });
    }
};
exports.getConversations = getConversations;
/**
 * Get messages between user and a specific recipient (user/team/project)
 * @route GET /api/messages/:recipientId
 */
const getMessages = async (req, res) => {
    try {
        const userId = req.user && req.user._id;
        if (!userId) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        const { otherUserId } = req.params;
        const messages = await Message_1.Message.find({
            $or: [
                { sender: new mongoose_1.Types.ObjectId(userId), recipientId: new mongoose_1.Types.ObjectId(otherUserId), recipientType: 'user' },
                { sender: new mongoose_1.Types.ObjectId(otherUserId), recipientId: new mongoose_1.Types.ObjectId(userId), recipientType: 'user' }
            ]
        }).sort({ createdAt: 1 });
        res.json(messages);
    }
    catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ message: 'Error fetching messages' });
    }
};
exports.getMessages = getMessages;
/**
 * Get messages from a specific team
 * @route GET /api/messages/team/:teamId
 */
const getTeamMessages = async (req, res) => {
    try {
        const userId = req.user && req.user._id;
        if (!userId) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        const { teamId } = req.params;
        // Check if user is team member
        const isMember = await isTeamMember(teamId, userId?.toString());
        if (!isMember) {
            return res.status(403).json({ message: 'Not a team member' });
        }
        const messages = await Message_1.Message.find({
            recipientId: new mongoose_1.Types.ObjectId(teamId),
            recipientType: 'team'
        }).sort({ createdAt: 1 });
        res.json(messages);
    }
    catch (error) {
        console.error('Error fetching team messages:', error);
        res.status(500).json({ message: 'Error fetching team messages' });
    }
};
exports.getTeamMessages = getTeamMessages;
/**
 * Get messages from a specific project
 * @route GET /api/messages/project/:projectId
 */
const getProjectMessages = async (req, res) => {
    try {
        const userId = req.user && req.user._id;
        if (!userId) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        const { projectId } = req.params;
        // Check if user is project member
        const isMember = await isProjectMember(projectId, userId?.toString());
        if (!isMember) {
            return res.status(403).json({ message: 'Not a project member' });
        }
        const messages = await Message_1.Message.find({
            recipientId: new mongoose_1.Types.ObjectId(projectId),
            recipientType: 'project'
        }).sort({ createdAt: 1 });
        res.json(messages);
    }
    catch (error) {
        console.error('Error fetching project messages:', error);
        res.status(500).json({ message: 'Error fetching project messages' });
    }
};
exports.getProjectMessages = getProjectMessages;
/**
 * Add reaction to a message
 * @route POST /api/messages/:messageId/reaction
 */
const addReaction = async (req, res) => {
    try {
        const userId = req.user && req.user._id;
        if (!userId) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        const { messageId } = req.params;
        const { emoji } = req.body;
        const message = await Message_1.Message.findById(new mongoose_1.Types.ObjectId(messageId));
        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }
        // Check if user has permission to see the message
        if (message.recipientType === 'team') {
            const team = await Team_1.Team.findById(message.recipientId);
            if (!team) {
                return res.status(404).json({ message: 'Team not found' });
            }
            team.members.forEach((member) => {
                index_1.io.to(member.toString()).emit('messageReaction', { messageId, userId, emoji });
            });
        }
        else if (message.recipientType === 'project') {
            const project = await Project_1.Project.findById(message.recipientId);
            if (!project) {
                return res.status(404).json({ message: 'Project not found' });
            }
            project.team.forEach((member) => {
                index_1.io.to(member.toString()).emit('messageReaction', { messageId, userId, emoji });
            });
        }
        else {
            index_1.io.to(message.recipientId.toString()).emit('messageReaction', { messageId, userId, emoji });
        }
        // Add reaction
        if (!message.metadata) {
            message.metadata = {};
        }
        if (!message.metadata.reactions) {
            message.metadata.reactions = [];
        }
        message.metadata.reactions.push({
            userId: new mongoose_1.Types.ObjectId(userId),
            reaction: emoji
        });
        await message.save();
        res.json(message);
    }
    catch (error) {
        console.error('Error adding reaction:', error);
        res.status(500).json({ message: 'Error adding reaction' });
    }
};
exports.addReaction = addReaction;
/**
 * Remove reaction from a message
 * @route DELETE /api/messages/:messageId/reaction
 */
const removeReaction = async (req, res) => {
    try {
        const userId = req.user && req.user._id;
        if (!userId) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        const { messageId } = req.params;
        const { emoji } = req.body;
        const message = await Message_1.Message.findById(new mongoose_1.Types.ObjectId(messageId));
        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }
        // Check if user has permission to see the message
        if (message.recipientType === 'team') {
            const team = await Team_1.Team.findById(message.recipientId);
            if (team) {
                team.members.forEach((member) => {
                    index_1.io.to(member.toString()).emit('messageReactionRemoved', { messageId, userId, emoji });
                });
            }
        }
        else if (message.recipientType === 'project') {
            const project = await Project_1.Project.findById(message.recipientId);
            if (project) {
                project.team.forEach((member) => {
                    index_1.io.to(member.toString()).emit('messageReactionRemoved', { messageId, userId, emoji });
                });
            }
        }
        // Remove reaction
        if (message.metadata?.reactions) {
            message.metadata.reactions = message.metadata.reactions.filter(reaction => !(reaction.userId.toString() === userId.toString() && reaction.reaction === emoji));
        }
        await message.save();
        res.json(message);
    }
    catch (error) {
        console.error('Error removing reaction:', error);
        res.status(500).json({ message: 'Error removing reaction' });
    }
};
exports.removeReaction = removeReaction;
/**
 * Delete a message
 * @route DELETE /api/messages/:messageId
 */
const deleteMessage = async (req, res) => {
    try {
        const userId = req.user && req.user._id;
        if (!userId) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        const { messageId } = req.params;
        const message = await Message_1.Message.findById(new mongoose_1.Types.ObjectId(messageId));
        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }
        // Check if user is the sender
        if (!message.sender.equals(new mongoose_1.Types.ObjectId(userId))) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        // Notify recipients
        if (message.recipientType === 'team') {
            const team = await Team_1.Team.findById(message.recipientId);
            if (!team) {
                return res.status(404).json({ message: 'Team not found' });
            }
            team.members.forEach((member) => {
                index_1.io.to(member.toString()).emit('messageDeleted', messageId);
            });
        }
        else if (message.recipientType === 'project') {
            const project = await Project_1.Project.findById(message.recipientId);
            if (!project) {
                return res.status(404).json({ message: 'Project not found' });
            }
            project.team.forEach((member) => {
                index_1.io.to(member.toString()).emit('messageDeleted', messageId);
            });
        }
        else {
            index_1.io.to(message.recipientId.toString()).emit('messageDeleted', messageId);
        }
        await message.deleteOne();
        res.json({ message: 'Message deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting message:', error);
        res.status(500).json({ message: 'Error deleting message' });
    }
};
exports.deleteMessage = deleteMessage;
/**
 * Update a message
 * @route PUT /api/messages/:messageId
 */
const updateMessage = async (req, res) => {
    try {
        const userId = req.user && req.user._id;
        if (!userId) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        const { messageId } = req.params;
        const { content } = req.body;
        const message = await Message_1.Message.findById(new mongoose_1.Types.ObjectId(messageId));
        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }
        // Check if user is the sender
        if (!message.sender.equals(new mongoose_1.Types.ObjectId(userId))) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        // Update message
        message.content = content;
        message.metadata = {
            ...message.metadata,
            isSystemMessage: false
        };
        // Notify recipients
        if (message.recipientType === 'team') {
            const team = await Team_1.Team.findById(message.recipientId);
            if (team) {
                team.members.forEach((member) => {
                    index_1.io.to(member.toString()).emit('messageUpdated', message);
                });
            }
        }
        else if (message.recipientType === 'project') {
            const project = await Project_1.Project.findById(message.recipientId);
            if (project) {
                project.team.forEach((member) => {
                    index_1.io.to(member.toString()).emit('messageUpdated', message);
                });
            }
        }
        await message.save();
        res.json(message);
    }
    catch (error) {
        console.error('Error updating message:', error);
        res.status(500).json({ message: 'Error updating message' });
    }
};
exports.updateMessage = updateMessage;
/**
 * Mark all messages as read
 * @route PUT /api/messages/all/read
 */
const markAllAsRead = async (req, res) => {
    try {
        const userId = req.user && req.user._id;
        if (!userId) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        // Mark all direct messages to the user as read
        await Message_1.Message.updateMany({
            recipientId: new mongoose_1.Types.ObjectId(userId),
            recipientType: 'user',
            'metadata.readBy': { $ne: new mongoose_1.Types.ObjectId(userId) }
        }, {
            $addToSet: { 'metadata.readBy': new mongoose_1.Types.ObjectId(userId) },
            $set: { status: 'read' }
        });
        // Mark all team messages as read
        const userTeams = await Team_1.Team.find({ members: new mongoose_1.Types.ObjectId(userId) });
        for (const team of userTeams) {
            await Message_1.Message.updateMany({
                recipientId: team._id,
                recipientType: 'team',
                'metadata.readBy': { $ne: new mongoose_1.Types.ObjectId(userId) }
            }, {
                $addToSet: { 'metadata.readBy': new mongoose_1.Types.ObjectId(userId) }
            });
        }
        // Mark all project messages as read
        const userProjects = await Project_1.Project.find({ team: new mongoose_1.Types.ObjectId(userId) });
        for (const project of userProjects) {
            await Message_1.Message.updateMany({
                recipientId: project._id,
                recipientType: 'project',
                'metadata.readBy': { $ne: new mongoose_1.Types.ObjectId(userId) }
            }, {
                $addToSet: { 'metadata.readBy': new mongoose_1.Types.ObjectId(userId) }
            });
        }
        res.json({ message: 'All messages marked as read' });
    }
    catch (error) {
        console.error('Error marking messages as read:', error);
        res.status(500).json({ message: 'Error marking messages as read' });
    }
};
exports.markAllAsRead = markAllAsRead;
/**
 * Mark specific conversation messages as read
 * @route PUT /api/messages/:recipientId/read
 */
const markAsRead = async (req, res) => {
    try {
        const userId = req.user && req.user._id;
        if (!userId) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        const { messageIds } = req.body;
        await Message_1.Message.updateMany({
            _id: { $in: messageIds },
            recipientId: new mongoose_1.Types.ObjectId(userId),
            'metadata.readBy': { $ne: new mongoose_1.Types.ObjectId(userId) }
        }, {
            $addToSet: { 'metadata.readBy': new mongoose_1.Types.ObjectId(userId) }
        });
        res.json({ message: 'Messages marked as read' });
    }
    catch (error) {
        console.error('Error marking messages as read:', error);
        res.status(500).json({ message: 'Error marking messages as read' });
    }
};
exports.markAsRead = markAsRead;
/**
 * Get unread message count
 * @route GET /api/messages/unread/count
 */
const getUnreadCount = async (req, res) => {
    try {
        const userId = req.user && req.user._id;
        if (!userId) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        const count = await Message_1.Message.countDocuments({
            recipientId: new mongoose_1.Types.ObjectId(userId),
            'metadata.readBy': { $ne: new mongoose_1.Types.ObjectId(userId) }
        });
        res.json({ count });
    }
    catch (error) {
        console.error('Error getting unread count:', error);
        res.status(500).json({ message: 'Error getting unread count' });
    }
};
exports.getUnreadCount = getUnreadCount;
/**
 * Create a conversation
 * @route POST /api/messages/conversation
 */
const createConversation = async (req, res) => {
    try {
        const userId = req.user && req.user._id;
        const { userId: otherUserId } = req.body;
        if (!userId || !otherUserId) {
            return res.status(400).json({ message: 'Missing userId' });
        }
        if (userId.toString() === otherUserId) {
            return res.status(400).json({ message: 'Cannot start a conversation with yourself' });
        }
        // Find existing messages between the two users
        const messages = await Message_1.Message.find({
            recipientType: 'user',
            $or: [
                { sender: userId, recipientId: otherUserId },
                { sender: otherUserId, recipientId: userId }
            ]
        }).sort({ createdAt: 1 });
        // Get the other user's info
        const otherUser = await User_1.User.findById(otherUserId).select('name avatar email');
        if (!otherUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Compose conversation object
        const conversation = {
            _id: [userId, otherUserId].sort().join('-'),
            name: otherUser.name,
            avatar: otherUser.avatar,
            type: 'direct',
            participants: [
                { id: userId, name: req.user?.name, avatar: req.user?.avatar },
                { id: otherUserId, name: otherUser.name, avatar: otherUser.avatar }
            ],
            messages,
            lastMessage: messages.length ? messages[messages.length - 1] : null
        };
        res.json({ conversation });
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating conversation' });
    }
};
exports.createConversation = createConversation;
