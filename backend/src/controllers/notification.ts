import { Request, Response } from 'express';
import { Notification, INotification } from '../models/Notification';
import { z } from 'zod';
import { Types } from 'mongoose';

const notificationSchema = z.object({
  recipient: z.string().min(1),
  type: z.enum(['project', 'team', 'funding', 'message', 'system']),
  title: z.string().min(1),
  content: z.string().min(1),
  relatedProject: z.string().optional(),
  relatedTeam: z.string().optional(),
  relatedFunding: z.string().optional(),
  relatedUser: z.string().optional(),
});

export const createNotification = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const notificationData = notificationSchema.parse(req.body);

    const notification = new Notification({
      ...notificationData,
      recipient: new Types.ObjectId(notificationData.recipient),
      relatedProject: notificationData.relatedProject ? new Types.ObjectId(notificationData.relatedProject) : undefined,
      relatedTeam: notificationData.relatedTeam ? new Types.ObjectId(notificationData.relatedTeam) : undefined,
      relatedFunding: notificationData.relatedFunding ? new Types.ObjectId(notificationData.relatedFunding) : undefined,
      relatedUser: notificationData.relatedUser ? new Types.ObjectId(notificationData.relatedUser) : undefined,
      read: false
    });

    await notification.save();
    res.status(201).json(notification);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }
    console.error('Error creating notification:', error);
    res.status(500).json({ message: 'Error creating notification' });
  }
};

export const getNotifications = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const { read } = req.query;
    const query: any = { recipient: req.user._id };

    if (read !== undefined) {
      query.read = read === 'true';
    }

    const notifications = await Notification.find(query)
      .populate('relatedProject', 'title')
      .populate('relatedTeam', 'name')
      .populate('relatedFunding', 'title')
      .populate('relatedUser', 'name email avatar')
      .sort({ createdAt: -1 });

    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Error fetching notifications' });
  }
};

export const markAsRead = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const { id } = req.params;

    if (id === 'all') {
      // Mark all notifications as read
      await Notification.updateMany(
        { recipient: req.user._id, read: false },
        { $set: { read: true } }
      );
      res.json({ message: 'All notifications marked as read' });
    } else {
      // Mark a specific notification as read
      const notification = await Notification.findOne({
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
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ message: 'Error marking notification as read' });
  }
};

export const deleteNotification = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const { id } = req.params;

    const notification = await Notification.findOne({
      _id: id,
      recipient: req.user._id
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    await notification.deleteOne();
    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ message: 'Error deleting notification' });
  }
}; 