"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNotification = exports.markAsRead = exports.getNotifications = exports.createNotification = void 0;
const Notification_1 = require("../models/Notification");
const zod_1 = require("zod");
const mongoose_1 = require("mongoose");
const notificationSchema = zod_1.z.object({
    recipient: zod_1.z.string().min(1),
    type: zod_1.z.enum(['project', 'team', 'funding', 'message', 'system']),
    title: zod_1.z.string().min(1),
    content: zod_1.z.string().min(1),
    relatedProject: zod_1.z.string().optional(),
    relatedTeam: zod_1.z.string().optional(),
    relatedFunding: zod_1.z.string().optional(),
    relatedUser: zod_1.z.string().optional(),
});
const createNotification = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        const notificationData = notificationSchema.parse(req.body);
        const notification = new Notification_1.Notification({
            ...notificationData,
            recipient: new mongoose_1.Types.ObjectId(notificationData.recipient),
            relatedProject: notificationData.relatedProject ? new mongoose_1.Types.ObjectId(notificationData.relatedProject) : undefined,
            relatedTeam: notificationData.relatedTeam ? new mongoose_1.Types.ObjectId(notificationData.relatedTeam) : undefined,
            relatedFunding: notificationData.relatedFunding ? new mongoose_1.Types.ObjectId(notificationData.relatedFunding) : undefined,
            relatedUser: notificationData.relatedUser ? new mongoose_1.Types.ObjectId(notificationData.relatedUser) : undefined,
            read: false
        });
        await notification.save();
        res.status(201).json(notification);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ message: error.errors[0].message });
        }
        console.error('Error creating notification:', error);
        res.status(500).json({ message: 'Error creating notification' });
    }
};
exports.createNotification = createNotification;
const getNotifications = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        const { read } = req.query;
        const query = { recipient: req.user._id };
        if (read !== undefined) {
            query.read = read === 'true';
        }
        const notifications = await Notification_1.Notification.find(query)
            .populate('relatedProject', 'title')
            .populate('relatedTeam', 'name')
            .populate('relatedFunding', 'title')
            .populate('relatedUser', 'name email avatar')
            .sort({ createdAt: -1 });
        res.json(notifications);
    }
    catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ message: 'Error fetching notifications' });
    }
};
exports.getNotifications = getNotifications;
const markAsRead = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        const { id } = req.params;
        if (id === 'all') {
            // Mark all notifications as read
            await Notification_1.Notification.updateMany({ recipient: req.user._id, read: false }, { $set: { read: true } });
            res.json({ message: 'All notifications marked as read' });
        }
        else {
            // Mark a specific notification as read
            const notification = await Notification_1.Notification.findOne({
                _id: id,
                recipient: req.user._id
            });
            if (!notification) {
                return res.status(404).json({ message: 'Notification not found' });
            }
            notification.read = true;
            await notification.save();
            res.json(notification);
        }
    }
    catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({ message: 'Error marking notification as read' });
    }
};
exports.markAsRead = markAsRead;
const deleteNotification = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        const { id } = req.params;
        const notification = await Notification_1.Notification.findOne({
            _id: id,
            recipient: req.user._id
        });
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }
        await notification.deleteOne();
        res.json({ message: 'Notification deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting notification:', error);
        res.status(500).json({ message: 'Error deleting notification' });
    }
};
exports.deleteNotification = deleteNotification;
