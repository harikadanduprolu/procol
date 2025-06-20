"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUnreadCount = exports.markAsRead = exports.markAllAsRead = exports.updateMessage = exports.deleteMessage = exports.removeReaction = exports.addReaction = exports.getProjectMessages = exports.getTeamMessages = exports.getMessages = exports.getConversations = exports.sendProjectMessage = exports.sendTeamMessage = exports.sendMessage = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const message_1 = require("../models/message");
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
            recipient = await User_1.User.findById(id);
            break;
        case 'team':
            recipient = await Team_1.Team.findById(id);
            break;
        case 'project':
            recipient = await Project_1.Project.findById(id);
            break;
    }
    if (!recipient) {
        throw new Error(`${type.charAt(0).toUpperCase() + type.slice(1)} not found`);
    }
    return recipient;
};
// Helper function to check membership in team or project
const checkMembership = async (userId, entityId, type) => {
    if (type === 'team') {
        const team = await Team_1.Team.findById(entityId);
        if (!team)
            throw new Error('Team not found');
        return team.members.includes(userId);
    }
    else {
        const project = await Project_1.Project.findById(entityId);
        if (!project)
            throw new Error('Project not found');
        return project.team.includes(userId);
    }
};
/**
 * Send a direct message to a user
 * @route POST /api/messages
 */
const sendMessage = async (req, res) => {
    try {
        const { recipient, content } = req.body;
        const sender = req.userId;
        // Validate recipient exists
        await getRecipient(recipient, 'user');
        // Create new message
        const message = new message_1.Message({
            sender,
            recipientId: recipient,
            recipientType: 'user',
            content,
        });
        await message.save();
        // Populate sender details for the response
        const populatedMessage = await message_1.Message.findById(message._id)
            .populate('sender', 'name avatar')
            .populate('readBy', 'name');
        // Emit socket event for real-time updates
        if (index_1.io) {
            index_1.io.to(recipient).emit('newMessage', populatedMessage);
        }
        res.status(201).json(populatedMessage);
    }
    catch (error) {
        console.error('Send message error:', error);
        res.status(500).json({ message: error.message || 'Error sending message' });
    }
};
exports.sendMessage = sendMessage;
/**
 * Send a message to a team
 * @route POST /api/messages/team/:teamId
 */
const sendTeamMessage = async (req, res) => {
    try {
        const teamId = req.params.teamId;
        const { content } = req.body;
        const sender = req.userId;
        // Check if team exists and user is a member
        const isMember = await checkMembership(sender, teamId, 'team');
        if (!isMember) {
            return res.status(403).json({ message: 'You must be a team member to send messages' });
        }
        // Create new message
        const message = new message_1.Message({
            sender,
            recipientId: teamId,
            recipientType: 'team',
            content,
        });
        await message.save();
        // Populate sender details for the response
        const populatedMessage = await message_1.Message.findById(message._id)
            .populate('sender', 'name avatar')
            .populate('readBy', 'name');
        // Get all team members to notify
        const team = await Team_1.Team.findById(teamId).populate('members');
        const teamMemberIds = team.members.map(member => member._id.toString());
        // Emit socket event to all team members
        if (index_1.io) {
            teamMemberIds.forEach(memberId => {
                if (memberId !== sender) {
                    index_1.io.to(memberId).emit('newMessage', populatedMessage);
                }
            });
        }
        res.status(201).json(populatedMessage);
    }
    catch (error) {
        console.error('Send team message error:', error);
        res.status(500).json({ message: error.message || 'Error sending team message' });
    }
};
exports.sendTeamMessage = sendTeamMessage;
/**
 * Send a message to a project
 * @route POST /api/messages/project/:projectId
 */
const sendProjectMessage = async (req, res) => {
    try {
        const projectId = req.params.projectId;
        const { content } = req.body;
        const sender = req.userId;
        // Check if project exists and user is a member
        const isMember = await checkMembership(sender, projectId, 'project');
        if (!isMember) {
            return res.status(403).json({ message: 'You must be a project member to send messages' });
        }
        // Create new message
        const message = new message_1.Message({
            sender,
            recipientId: projectId,
            recipientType: 'project',
            content,
        });
        await message.save();
        // Populate sender details for the response
        const populatedMessage = await message_1.Message.findById(message._id)
            .populate('sender', 'name avatar')
            .populate('readBy', 'name');
        // Get all project members to notify
        const project = await Project_1.Project.findById(projectId).populate('team');
        const projectMemberIds = project.team.map(member => member._id.toString());
        // Emit socket event to all project members
        if (index_1.io) {
            projectMemberIds.forEach(memberId => {
                if (memberId !== sender) {
                    index_1.io.to(memberId).emit('newMessage', populatedMessage);
                }
            });
        }
        res.status(201).json(populatedMessage);
    }
    catch (error) {
        console.error('Send project message error:', error);
        res.status(500).json({ message: error.message || 'Error sending project message' });
    }
};
exports.sendProjectMessage = sendProjectMessage;
/**
 * Get all conversations for a user
 * @route GET /api/messages/conversations
 */
const getConversations = async (req, res) => {
    try {
        const userId = req.userId;
        // Find direct message conversations (user-to-user)
        const userConversations = await message_1.Message.aggregate([
            {
                $match: {
                    $or: [
                        { sender: mongoose_1.default.Types.ObjectId(userId), recipientType: 'user' },
                        { recipientId: mongoose_1.default.Types.ObjectId(userId), recipientType: 'user' }
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
                            { $eq: ['$sender', mongoose_1.default.Types.ObjectId(userId)] },
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
                                        { $eq: ['$recipientId', mongoose_1.default.Types.ObjectId(userId)] },
                                        { $not: [{ $in: [mongoose_1.default.Types.ObjectId(userId), '$readBy'] }] }
                                    ]
                                },
                                1,
                                0
                            ]
                        }
                    }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'userDetails'
                }
            },
            {
                $project: {
                    _id: 1,
                    type: { $literal: 'user' },
                    name: { $arrayElemAt: ['$userDetails.name', 0] },
                    avatar: { $arrayElemAt: ['$userDetails.avatar', 0] },
                    lastMessage: 1,
                    unreadCount: 1
                }
            }
        ]);
        // Find team conversations
        const teams = await Team_1.Team.find({ members: userId });
        const teamIds = teams.map(team => team._id);
        const teamConversations = await message_1.Message.aggregate([
            {
                $match: {
                    recipientType: 'team',
                    recipientId: { $in: teamIds }
                }
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $group: {
                    _id: '$recipientId',
                    lastMessage: { $first: '$$ROOT' },
                    unreadCount: {
                        $sum: {
                            $cond: [
                                { $not: [{ $in: [mongoose_1.default.Types.ObjectId(userId), '$readBy'] }] },
                                1,
                                0
                            ]
                        }
                    }
                }
            },
            {
                $lookup: {
                    from: 'teams',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'teamDetails'
                }
            },
            {
                $project: {
                    _id: 1,
                    type: { $literal: 'team' },
                    name: { $arrayElemAt: ['$teamDetails.name', 0] },
                    avatar: { $arrayElemAt: ['$teamDetails.avatar', 0] },
                    lastMessage: 1,
                    unreadCount: 1
                }
            }
        ]);
        // Find project conversations
        const projects = await Project_1.Project.find({ team: userId });
        const projectIds = projects.map(project => project._id);
        const projectConversations = await message_1.Message.aggregate([
            {
                $match: {
                    recipientType: 'project',
                    recipientId: { $in: projectIds }
                }
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $group: {
                    _id: '$recipientId',
                    lastMessage: { $first: '$$ROOT' },
                    unreadCount: {
                        $sum: {
                            $cond: [
                                { $not: [{ $in: [mongoose_1.default.Types.ObjectId(userId), '$readBy'] }] },
                                1,
                                0
                            ]
                        }
                    }
                }
            },
            {
                $lookup: {
                    from: 'projects',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'projectDetails'
                }
            },
            {
                $project: {
                    _id: 1,
                    type: { $literal: 'project' },
                    name: { $arrayElemAt: ['$projectDetails.name', 0] },
                    avatar: { $arrayElemAt: ['$projectDetails.avatar', 0] },
                    lastMessage: 1,
                    unreadCount: 1
                }
            }
        ]);
        // Combine all conversations
        const allConversations = [
            ...userConversations,
            ...teamConversations,
            ...projectConversations
        ].sort((a, b) => new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime());
        res.json(allConversations);
    }
    catch (error) {
        console.error('Get conversations error:', error);
        res.status(500).json({ message: error.message || 'Error fetching conversations' });
    }
};
exports.getConversations = getConversations;
/**
 * Get messages between user and a specific recipient (user/team/project)
 * @route GET /api/messages/:recipientId
 */
const getMessages = async (req, res) => {
    try {
        const recipientId = req.params.recipientId;
        const userId = req.userId;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const skip = (page - 1) * limit;
        // Check if recipient exists and determine type
        let recipientType = 'user';
        // Try to find recipient and determine its type
        let recipient = await User_1.User.findById(recipientId);
        if (recipient) {
            recipientType = 'user';
        }
        else {
            recipient = await Team_1.Team.findById(recipientId);
            if (recipient) {
                recipientType = 'team';
                // Check if user is a member of the team
                const isMember = await checkMembership(userId, recipientId, 'team');
                if (!isMember) {
                    return res.status(403).json({ message: 'You must be a team member to view these messages' });
                }
            }
            else {
                recipient = await Project_1.Project.findById(recipientId);
                if (recipient) {
                    recipientType = 'project';
                    // Check if user is a member of the project
                    const isMember = await checkMembership(userId, recipientId, 'project');
                    if (!isMember) {
                        return res.status(403).json({ message: 'You must be a project member to view these messages' });
                    }
                }
                else {
                    return res.status(404).json({ message: 'Recipient not found' });
                }
            }
        }
        // Fetch messages according to recipient type
        let messages;
        if (recipientType === 'user') {
            // Direct messages between two users
            messages = await message_1.Message.find({
                $or: [
                    { sender: userId, recipientId, recipientType },
                    { sender: recipientId, recipientId: userId, recipientType: 'user' }
                ]
            })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('sender', 'name avatar')
                .populate('readBy', 'name')
                .lean();
            // Add isMine property for frontend convenience
            messages = messages.map(msg => ({
                ...msg,
                isMine: msg.sender._id.toString() === userId
            }));
        }
        else {
            // Team or project messages
            messages = await message_1.Message.find({
                recipientId,
                recipientType
            })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('sender', 'name avatar')
                .populate('readBy', 'name')
                .lean();
            // Add isMine property for frontend convenience
            messages = messages.map(msg => ({
                ...msg,
                isMine: msg.sender._id.toString() === userId
            }));
        }
        // Mark messages as read
        if (recipientType === 'user') {
            await message_1.Message.updateMany({
                sender: recipientId,
                recipientId: userId,
                recipientType: 'user',
                readBy: { $ne: userId }
            }, {
                $addToSet: { readBy: userId },
                $set: { status: 'read' }
            });
        }
        else {
            await message_1.Message.updateMany({
                recipientId,
                recipientType,
                readBy: { $ne: userId }
            }, {
                $addToSet: { readBy: userId }
            });
        }
        res.json(messages);
    }
    catch (error) {
        console.error('Get messages error:', error);
        res.status(500).json({ message: error.message || 'Error fetching messages' });
    }
};
exports.getMessages = getMessages;
/**
 * Get messages from a specific team
 * @route GET /api/messages/team/:teamId
 */
const getTeamMessages = async (req, res) => {
    try {
        const teamId = req.params.teamId;
        const userId = req.userId;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const skip = (page - 1) * limit;
        // Check if user is a member of the team
        const isMember = await checkMembership(userId, teamId, 'team');
        if (!isMember) {
            return res.status(403).json({ message: 'You must be a team member to view these messages' });
        }
        // Fetch team messages
        const messages = await message_1.Message.find({
            recipientId: teamId,
            recipientType: 'team'
        })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('sender', 'name avatar')
            .populate('readBy', 'name')
            .lean();
        // Add isMine property
        const messagesWithIsMine = messages.map(msg => ({
            ...msg,
            isMine: msg.sender._id.toString() === userId
        }));
        // Mark messages as read
        await message_1.Message.updateMany({
            recipientId: teamId,
            recipientType: 'team',
            readBy: { $ne: userId }
        }, {
            $addToSet: { readBy: userId }
        });
        res.json(messagesWithIsMine);
    }
    catch (error) {
        console.error('Get team messages error:', error);
        res.status(500).json({ message: error.message || 'Error fetching team messages' });
    }
};
exports.getTeamMessages = getTeamMessages;
/**
 * Get messages from a specific project
 * @route GET /api/messages/project/:projectId
 */
const getProjectMessages = async (req, res) => {
    try {
        const projectId = req.params.projectId;
        const userId = req.userId;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const skip = (page - 1) * limit;
        // Check if user is a member of the project
        const isMember = await checkMembership(userId, projectId, 'project');
        if (!isMember) {
            return res.status(403).json({ message: 'You must be a project member to view these messages' });
        }
        // Fetch project messages
        const messages = await message_1.Message.find({
            recipientId: projectId,
            recipientType: 'project'
        })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('sender', 'name avatar')
            .populate('readBy', 'name')
            .lean();
        // Add isMine property
        const messagesWithIsMine = messages.map(msg => ({
            ...msg,
            isMine: msg.sender._id.toString() === userId
        }));
        // Mark messages as read
        await message_1.Message.updateMany({
            recipientId: projectId,
            recipientType: 'project',
            readBy: { $ne: userId }
        }, {
            $addToSet: { readBy: userId }
        });
        res.json(messagesWithIsMine);
    }
    catch (error) {
        console.error('Get project messages error:', error);
        res.status(500).json({ message: error.message || 'Error fetching project messages' });
    }
};
exports.getProjectMessages = getProjectMessages;
/**
 * Add reaction to a message
 * @route POST /api/messages/:messageId/reaction
 */
const addReaction = async (req, res) => {
    try {
        const messageId = req.params.messageId;
        const userId = req.userId;
        const { reaction } = req.body;
        if (!mongoose_1.default.Types.ObjectId.isValid(messageId)) {
            return res.status(400).json({ message: 'Invalid message ID' });
        }
        const message = await message_1.Message.findById(messageId);
        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }
        // Check if user can react to this message
        if (message.recipientType !== 'user' && message.recipientType !== 'team' && message.recipientType !== 'project') {
            return res.status(400).json({ message: 'Cannot react to this message type' });
        }
        // If team or project message, check if user is a member
        if (message.recipientType === 'team') {
            const isMember = await checkMembership(userId, message.recipientId.toString(), 'team');
            if (!isMember) {
                return res.status(403).json({ message: 'You must be a team member to react to this message' });
            }
        }
        else if (message.recipientType === 'project') {
            const isMember = await checkMembership(userId, message.recipientId.toString(), 'project');
            if (!isMember) {
                return res.status(403).json({ message: 'You must be a project member to react to this message' });
            }
        }
        else if (message.recipientType === 'user' &&
            message.sender.toString() !== userId &&
            message.recipientId.toString() !== userId) {
            return res.status(403).json({ message: 'You cannot react to this message' });
        }
        // Add the reaction
        const updatedMessage = await message.addReaction(userId, reaction);
        // Populate message for response
        const populatedMessage = await message_1.Message.findById(updatedMessage._id)
            .populate('sender', 'name avatar')
            .populate('readBy', 'name');
        // Notify other users about the reaction
        if (index_1.io) {
            if (message.recipientType === 'user') {
                const recipientId = message.sender.toString() === userId
                    ? message.recipientId.toString()
                    : message.sender.toString();
                index_1.io.to(recipientId).emit('messageUpdated', populatedMessage);
            }
            else if (message.recipientType === 'team') {
                const team = await Team_1.Team.findById(message.recipientId).populate('members');
                team.members.forEach(member => {
                    const memberId = member._id.toString();
                    if (memberId !== userId) {
                        index_1.io.to(memberId).emit('messageUpdated', populatedMessage);
                    }
                });
            }
            else if (message.recipientType === 'project') {
                const project = await Project_1.Project.findById(message.recipientId).populate('team');
                project.team.forEach(member => {
                    const memberId = member._id.toString();
                    if (memberId !== userId) {
                        index_1.io.to(memberId).emit('messageUpdated', populatedMessage);
                    }
                });
            }
        }
        res.json(populatedMessage);
    }
    catch (error) {
        console.error('Add reaction error:', error);
        res.status(500).json({ message: error.message || 'Error adding reaction' });
    }
};
exports.addReaction = addReaction;
/**
 * Remove reaction from a message
 * @route DELETE /api/messages/:messageId/reaction
 */
const removeReaction = async (req, res) => {
    try {
        const messageId = req.params.messageId;
        const userId = req.userId;
        if (!mongoose_1.default.Types.ObjectId.isValid(messageId)) {
            return res.status(400).json({ message: 'Invalid message ID' });
        }
        const message = await message_1.Message.findById(messageId);
        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }
        // Remove the reaction
        const updatedMessage = await message.removeReaction(userId);
        // Populate message for response
        const populatedMessage = await message_1.Message.findById(updatedMessage._id)
            .populate('sender', 'name avatar')
            .populate('readBy', 'name');
        // Notify other users about the removed reaction
        if (index_1.io) {
            if (message.recipientType === 'user') {
                const recipientId = message.sender.toString() === userId
                    ? message.recipientId.toString()
                    : message.sender.toString();
                index_1.io.to(recipientId).emit('messageUpdated', populatedMessage);
            }
            else if (message.recipientType === 'team' || message.recipientType === 'project') {
                // For team or project, notify all members except the current user
                const entityModel = message.recipientType === 'team' ? Team_1.Team : Project_1.Project;
                const membersField = message.recipientType === 'team' ? 'members' : 'team';
                const entity = await entityModel.findById(message.recipientId).populate(membersField);
                entity[membersField].forEach(member => {
                    const memberId = member._id.toString();
                    if (memberId !== userId) {
                        index_1.io.to(memberId).emit('messageUpdated', populatedMessage);
                    }
                });
            }
        }
        res.json(populatedMessage);
    }
    catch (error) {
        console.error('Remove reaction error:', error);
        res.status(500).json({ message: error.message || 'Error removing reaction' });
    }
};
exports.removeReaction = removeReaction;
/**
 * Delete a message
 * @route DELETE /api/messages/:messageId
 */
const deleteMessage = async (req, res) => {
    try {
        const messageId = req.params.messageId;
        const userId = req.userId;
        if (!mongoose_1.default.Types.ObjectId.isValid(messageId)) {
            return res.status(400).json({ message: 'Invalid message ID' });
        }
        // Find the message
        const message = await message_1.Message.findById(messageId);
        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }
        // Check if user is the sender of the message
        if (message.sender.toString() !== userId) {
            return res.status(403).json({ message: 'You can only delete your own messages' });
        }
        // Delete the message
        await message_1.Message.findByIdAndDelete(messageId);
        // Notify others about the deleted message
        if (index_1.io) {
            if (message.recipientType === 'user') {
                index_1.io.to(message.recipientId.toString()).emit('messageDeleted', { messageId });
            }
            else if (message.recipientType === 'team') {
                const team = await Team_1.Team.findById(message.recipientId).populate('members');
                team.members.forEach(member => {
                    const memberId = member._id.toString();
                    if (memberId !== userId) {
                        index_1.io.to(memberId).emit('messageDeleted', { messageId });
                    }
                });
            }
            else if (message.recipientType === 'project') {
                const project = await Project_1.Project.findById(message.recipientId).populate('team');
                project.team.forEach(member => {
                    const memberId = member._id.toString();
                    if (memberId !== userId) {
                        index_1.io.to(memberId).emit('messageDeleted', { messageId });
                    }
                });
            }
        }
        res.json({ message: 'Message deleted successfully' });
    }
    catch (error) {
        console.error('Delete message error:', error);
        res.status(500).json({ message: error.message || 'Error deleting message' });
    }
};
exports.deleteMessage = deleteMessage;
/**
 * Update a message
 * @route PUT /api/messages/:messageId
 */
const updateMessage = async (req, res) => {
    try {
        const messageId = req.params.messageId;
        const userId = req.userId;
        const { content } = req.body;
        if (!mongoose_1.default.Types.ObjectId.isValid(messageId)) {
            return res.status(400).json({ message: 'Invalid message ID' });
        }
        // Find the message
        const message = await message_1.Message.findById(messageId);
        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }
        // Check if user is the sender of the message
        if (message.sender.toString() !== userId) {
            return res.status(403).json({ message: 'You can only edit your own messages' });
        }
        // Update the message
        message.content = content;
        message.metadata = {
            ...message.metadata,
            edited: true
        };
        await message.save();
        // Populate message for response
        const populatedMessage = await message_1.Message.findById(message._id)
            .populate('sender', 'name avatar')
            .populate('readBy', 'name');
        // Notify others about the updated message
        if (index_1.io) {
            if (message.recipientType === 'user') {
                index_1.io.to(message.recipientId.toString()).emit('messageUpdated', populatedMessage);
            }
            else if (message.recipientType === 'team' || message.recipientType === 'project') {
                // For team or project, notify all members except the current user
                const entityModel = message.recipientType === 'team' ? Team_1.Team : Project_1.Project;
                const membersField = message.recipientType === 'team' ? 'members' : 'team';
                const entity = await entityModel.findById(message.recipientId).populate(membersField);
                entity[membersField].forEach(member => {
                    const memberId = member._id.toString();
                    if (memberId !== userId) {
                        index_1.io.to(memberId).emit('messageUpdated', populatedMessage);
                    }
                });
            }
        }
        res.json(populatedMessage);
    }
    catch (error) {
        console.error('Update message error:', error);
        res.status(500).json({ message: error.message || 'Error updating message' });
    }
};
exports.updateMessage = updateMessage;
/**
 * Mark all messages as read
 * @route PUT /api/messages/all/read
 */
const markAllAsRead = async (req, res) => {
    try {
        const userId = req.userId;
        // Mark all direct messages to the user as read
        await message_1.Message.updateMany({
            recipientId: userId,
            recipientType: 'user',
            readBy: { $ne: userId }
        }, {
            $addToSet: { readBy: userId },
            $set: { status: 'read' }
        });
        // Mark all team messages as read
        const userTeams = await Team_1.Team.find({ members: userId });
        for (const team of userTeams) {
            await message_1.Message.updateMany({
                recipientId: team._id,
                recipientType: 'team',
                readBy: { $ne: userId }
            }, {
                $addToSet: { readBy: userId }
            });
        }
        // Mark all project messages as read
        const userProjects = await Project_1.Project.find({ team: userId });
        for (const project of userProjects) {
            await message_1.Message.updateMany({
                recipientId: project._id,
                recipientType: 'project',
                readBy: { $ne: userId }
            }, {
                $addToSet: { readBy: userId }
            });
        }
        res.json({ message: 'All messages marked as read' });
    }
    catch (error) {
        console.error('Mark all as read error:', error);
        res.status(500).json({ message: error.message || 'Error marking messages as read' });
    }
};
exports.markAllAsRead = markAllAsRead;
/**
 * Mark specific conversation messages as read
 * @route PUT /api/messages/:recipientId/read
 */
const markAsRead = async (req, res) => {
    try {
        const recipientId = req.params.recipientId;
        const userId = req.userId;
        if (!mongoose_1.default.Types.ObjectId.isValid(recipientId)) {
            return res.status(400).json({ message: 'Invalid recipient ID' });
        }
        // Check if recipient exists and determine type
        let recipientType = 'user';
        let recipient;
        recipient = await User_1.User.findById(recipientId);
        if (recipient) {
            recipientType = 'user';
            // Mark direct messages as read
            await message_1.Message.updateMany({
                sender: recipientId,
                recipientId: userId,
                recipientType: 'user',
                readBy: { $ne: userId }
            }, {
                $addToSet: { readBy: userId },
                $set: { status: 'read' }
            });
        }
        else {
            recipient = await Team_1.Team.findById(recipientId);
            if (recipient) {
                recipientType = 'team';
                // Check if user is a member of the team
                const isMember = await checkMembership(userId, recipientId, 'team');
                if (!isMember) {
                    return res.status(403).json({ message: 'You must be a team member to mark these messages as read' });
                }
                // Mark team messages as read
                await message_1.Message.updateMany({
                    recipientId,
                    recipientType: 'team',
                    readBy: { $ne: userId }
                }, {
                    $addToSet: { readBy: userId }
                });
            }
            else {
                recipient = await Project_1.Project.findById(recipientId);
                if (recipient) {
                    recipientType = 'project';
                    // Check if user is a member of the project
                    const isMember = await checkMembership(userId, recipientId, 'project');
                    if (!isMember) {
                        return res.status(403).json({ message: 'You must be a project member to mark these messages as read' });
                    }
                    // Mark project messages as read
                    await message_1.Message.updateMany({
                        recipientId,
                        recipientType: 'project',
                        readBy: { $ne: userId }
                    }, {
                        $addToSet: { readBy: userId }
                    });
                }
                else {
                    return res.status(404).json({ message: 'Recipient not found' });
                }
            }
        }
        res.json({ message: 'Messages marked as read' });
    }
    catch (error) {
        console.error('Mark messages as read error:', error);
        res.status(500).json({ message: error.message || 'Error marking messages as read' });
    }
};
exports.markAsRead = markAsRead;
/**
 * Get unread message count
 * @route GET /api/messages/unread/count
 */
const getUnreadCount = async (req, res) => {
    try {
        const userId = req.userId;
        // Get count of unread direct messages
        const directMessageCount = await message_1.Message.countDocuments({
            recipientId: userId,
            recipientType: 'user',
            readBy: { $ne: userId }
        });
        // Get count of unread team messages
        const userTeams = await Team_1.Team.find({ members: userId });
        let teamMessageCount = 0;
        for (const team of userTeams) {
            const count = await message_1.Message.countDocuments({
                recipientId: team._id,
                recipientType: 'team',
                readBy: { $ne: userId }
            });
            teamMessageCount += count;
        }
        // Get count of unread project messages
        const userProjects = await Project_1.Project.find({ team: userId });
        let projectMessageCount = 0;
        for (const project of userProjects) {
            const count = await message_1.Message.countDocuments({
                recipientId: project._id,
                recipientType: 'project',
                readBy: { $ne: userId }
            });
            projectMessageCount += count;
        }
        // Total unread count
        const totalUnread = directMessageCount + teamMessageCount + projectMessageCount;
        res.json({
            total: totalUnread,
            direct: directMessageCount,
            team: teamMessageCount,
            project: projectMessageCount
        });
    }
    catch (error) {
        console.error('Get unread count error:', error);
        res.status(500).json({ message: error.message || 'Error getting unread count' });
    }
};
exports.getUnreadCount = getUnreadCount;
