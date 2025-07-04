import { Request, Response } from 'express';
import mongoose, { Types } from 'mongoose';
import { Message, IMessage, MessageMetadata, RecipientType } from '../models/Message';
import { User } from '../models/User';
import { Team, ITeam } from '../models/Team';
import { Project, IProject } from '../models/Project';
import { io } from '../index';

// Helper function to validate and get recipient
const getRecipient = async (id: string, type: RecipientType) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Invalid recipient ID');
  }

  let recipient;
  switch (type) {
    case 'user':
      recipient = await User.findById(new Types.ObjectId(id));
      break;
    case 'team':
      recipient = await Team.findById(new Types.ObjectId(id));
      break;
    case 'project':
      recipient = await Project.findById(new Types.ObjectId(id));
      break;
  }
  
  if (!recipient) {
    throw new Error(`${type.charAt(0).toUpperCase() + type.slice(1)} not found`);
  }
  
  return recipient;
};

// Helper function to check membership in team or project
const checkMembership = async (userId: string, entityId: string, type: 'team' | 'project') => {
  const objectId = new Types.ObjectId(userId);
  if (type === 'team') {
    const team = await Team.findById(new Types.ObjectId(entityId));
    if (!team) {
      throw new Error('Team not found');
    }
    return team.members.some(member => member.equals(objectId));
  } else {
    const project = await Project.findById(new Types.ObjectId(entityId));
    if (!project) {
      throw new Error('Project not found');
    }
    return project.team.some(member => member.equals(objectId));
  }
};

// Helper functions
const isTeamMember = async (teamId: string, userId: string): Promise<boolean> => {
  const team = await Team.findById(new Types.ObjectId(teamId));
  if (!team) {
    return false;
  }
  return team.members.some(member => member.equals(new Types.ObjectId(userId)));
};

const isProjectMember = async (projectId: string, userId: string): Promise<boolean> => {
  const project = await Project.findById(new Types.ObjectId(projectId));
  if (!project) {
    return false;
  }
  return project.team.some(member => member.equals(new Types.ObjectId(userId)));
};

// Fix the entity model findById calls
const getEntityModel = (type: RecipientType) => {
  switch (type) {
    case 'user':
      return User;
    case 'team':
      return Team;
    case 'project':
      return Project;
    default:
      throw new Error('Invalid recipient type');
  }
};

/**
 * Send a direct message to a user
 * @route POST /api/messages
 */
export const sendMessage = async (req: Request, res: Response) => {
  try {
    const sender = req.user && (req.user as any)._id;
    if (!sender) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const { recipientId, content } = req.body;

    const message = new Message({
      sender: new Types.ObjectId(sender),
      recipientId: new Types.ObjectId(recipientId),
      recipientType: 'user',
      content,
      metadata: {
        readBy: [new Types.ObjectId(sender)]
      }
    });

    await message.save();

    // Emit socket event
    io.to(recipientId).emit('newMessage', message);

    res.status(201).json(message);
  } catch (error: any) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Error sending message' });
  }
};

/**
 * Send a message to a team
 * @route POST /api/messages/team/:teamId
 */
export const sendTeamMessage = async (req: Request, res: Response) => {
  try {
    const sender = req.user && (req.user as any)._id;
    if (!sender) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const { teamId, content } = req.body;

    // Check if user is team member
    const isMember = await isTeamMember(teamId, sender?.toString());
    if (!isMember) {
      return res.status(403).json({ message: 'Not a team member' });
    }

    const team = await Team.findById(new Types.ObjectId(teamId));
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    const teamMemberIds = team.members ? team.members.map(member => member.toString()) : [];

    const message = new Message({
      sender: new Types.ObjectId(sender),
      recipientId: new Types.ObjectId(teamId),
      recipientType: 'team',
      content,
      metadata: {
        readBy: [new Types.ObjectId(sender)]
      }
    });

    await message.save();

    // Emit socket event to all team members
    teamMemberIds.forEach(memberId => {
      io.to(memberId).emit('newTeamMessage', message);
    });

    res.status(201).json(message);
  } catch (error: any) {
    console.error('Error sending team message:', error);
    res.status(500).json({ message: 'Error sending team message' });
  }
};

/**
 * Send a message to a project
 * @route POST /api/messages/project/:projectId
 */
export const sendProjectMessage = async (req: Request, res: Response) => {
  try {
    const sender = req.user && (req.user as any)._id;
    if (!sender) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const { projectId, content } = req.body;

    // Check if user is project member
    const isMember = await isProjectMember(projectId, sender?.toString());
    if (!isMember) {
      return res.status(403).json({ message: 'Not a project member' });
    }

    const project = await Project.findById(new Types.ObjectId(projectId));
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const projectMemberIds = project.team ? project.team.map(member => member.toString()) : [];

    const message = new Message({
      sender: new Types.ObjectId(sender),
      recipientId: new Types.ObjectId(projectId),
      recipientType: 'project',
      content,
      metadata: {
        readBy: [new Types.ObjectId(sender)]
      }
    });

    await message.save();

    // Emit socket event to all project members
    projectMemberIds.forEach(memberId => {
      io.to(memberId).emit('newProjectMessage', message);
    });

    res.status(201).json(message);
  } catch (error: any) {
    console.error('Error sending project message:', error);
    res.status(500).json({ message: 'Error sending project message' });
  }
};

/**
 * Get all conversations for a user
 * @route GET /api/messages/conversations
 */
export const getConversations = async (req: Request, res: Response) => {
  try {
    const userId = req.user && (req.user as any)._id;
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: new Types.ObjectId(userId.toString()), recipientType: 'user' },
            { recipientId: new Types.ObjectId(userId.toString()), recipientType: 'user' }
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
              { $eq: ['$sender', new Types.ObjectId(userId.toString())] },
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
                    { $eq: ['$recipientId', new Types.ObjectId(userId.toString())] },
                    { $not: [{ $in: [new Types.ObjectId(userId.toString()), '$metadata.readBy'] }] }
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
  } catch (error: any) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ message: 'Error fetching conversations' });
  }
};

/**
 * Get messages between user and a specific recipient (user/team/project)
 * @route GET /api/messages/:recipientId
 */
export const getMessages = async (req: Request, res: Response) => {
  try {
    const userId = req.user && (req.user as any)._id;
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const { otherUserId } = req.params;

    const messages = await Message.find({
      $or: [
        { sender: new Types.ObjectId(userId), recipientId: new Types.ObjectId(otherUserId), recipientType: 'user' },
        { sender: new Types.ObjectId(otherUserId), recipientId: new Types.ObjectId(userId), recipientType: 'user' }
      ]
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (error: any) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Error fetching messages' });
  }
};

/**
 * Get messages from a specific team
 * @route GET /api/messages/team/:teamId
 */
export const getTeamMessages = async (req: Request, res: Response) => {
  try {
    const userId = req.user && (req.user as any)._id;
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const { teamId } = req.params;

    // Check if user is team member
    const isMember = await isTeamMember(teamId, userId?.toString());
    if (!isMember) {
      return res.status(403).json({ message: 'Not a team member' });
    }

    const messages = await Message.find({
      recipientId: new Types.ObjectId(teamId),
      recipientType: 'team'
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (error: any) {
    console.error('Error fetching team messages:', error);
    res.status(500).json({ message: 'Error fetching team messages' });
  }
};

/**
 * Get messages from a specific project
 * @route GET /api/messages/project/:projectId
 */
export const getProjectMessages = async (req: Request, res: Response) => {
  try {
    const userId = req.user && (req.user as any)._id;
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const { projectId } = req.params;

    // Check if user is project member
    const isMember = await isProjectMember(projectId, userId?.toString());
    if (!isMember) {
      return res.status(403).json({ message: 'Not a project member' });
    }

    const messages = await Message.find({
      recipientId: new Types.ObjectId(projectId),
      recipientType: 'project'
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (error: any) {
    console.error('Error fetching project messages:', error);
    res.status(500).json({ message: 'Error fetching project messages' });
  }
};

/**
 * Add reaction to a message
 * @route POST /api/messages/:messageId/reaction
 */
export const addReaction = async (req: Request, res: Response) => {
  try {
    const userId = req.user && (req.user as any)._id;
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const { messageId } = req.params;
    const { emoji } = req.body;

    const message = await Message.findById(new Types.ObjectId(messageId));
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Check if user has permission to see the message
    if (message.recipientType === 'team') {
      const team = await Team.findById(message.recipientId);
      if (!team) {
        return res.status(404).json({ message: 'Team not found' });
      }
      team.members.forEach((member: Types.ObjectId) => {
        io.to(member.toString()).emit('messageReaction', { messageId, userId, emoji });
      });
    } else if (message.recipientType === 'project') {
      const project = await Project.findById(message.recipientId);
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
      project.team.forEach((member: Types.ObjectId) => {
        io.to(member.toString()).emit('messageReaction', { messageId, userId, emoji });
      });
    } else {
      io.to(message.recipientId.toString()).emit('messageReaction', { messageId, userId, emoji });
    }

    // Add reaction
    if (!message.metadata) {
      message.metadata = {};
    }
    if (!message.metadata.reactions) {
      message.metadata.reactions = [];
    }
    message.metadata.reactions.push({
      userId: new Types.ObjectId(userId),
      reaction: emoji
    });

    await message.save();
    res.json(message);
  } catch (error: any) {
    console.error('Error adding reaction:', error);
    res.status(500).json({ message: 'Error adding reaction' });
  }
};

/**
 * Remove reaction from a message
 * @route DELETE /api/messages/:messageId/reaction
 */
export const removeReaction = async (req: Request, res: Response) => {
  try {
    const userId = req.user && (req.user as any)._id;
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const { messageId } = req.params;
    const { emoji } = req.body;

    const message = await Message.findById(new Types.ObjectId(messageId));
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Check if user has permission to see the message
    if (message.recipientType === 'team') {
      const team = await Team.findById(message.recipientId);
      if (team) {
        team.members.forEach((member: Types.ObjectId) => {
          io.to(member.toString()).emit('messageReactionRemoved', { messageId, userId, emoji });
        });
      }
    } else if (message.recipientType === 'project') {
      const project = await Project.findById(message.recipientId);
      if (project) {
        project.team.forEach((member: Types.ObjectId) => {
          io.to(member.toString()).emit('messageReactionRemoved', { messageId, userId, emoji });
        });
      }
    }

    // Remove reaction
    if (message.metadata?.reactions) {
      message.metadata.reactions = message.metadata.reactions.filter(
        reaction => !(reaction.userId.toString() === userId.toString() && reaction.reaction === emoji)
      );
    }

    await message.save();
    res.json(message);
  } catch (error: any) {
    console.error('Error removing reaction:', error);
    res.status(500).json({ message: 'Error removing reaction' });
  }
};

/**
 * Delete a message
 * @route DELETE /api/messages/:messageId
 */
export const deleteMessage = async (req: Request, res: Response) => {
  try {
    const userId = req.user && (req.user as any)._id;
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const { messageId } = req.params;

    const message = await Message.findById(new Types.ObjectId(messageId));
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Check if user is the sender
    if (!message.sender.equals(new Types.ObjectId(userId))) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Notify recipients
    if (message.recipientType === 'team') {
      const team = await Team.findById(message.recipientId);
      if (!team) {
        return res.status(404).json({ message: 'Team not found' });
      }
      team.members.forEach((member: Types.ObjectId) => {
        io.to(member.toString()).emit('messageDeleted', messageId);
      });
    } else if (message.recipientType === 'project') {
      const project = await Project.findById(message.recipientId);
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
      project.team.forEach((member: Types.ObjectId) => {
        io.to(member.toString()).emit('messageDeleted', messageId);
      });
    } else {
      io.to(message.recipientId.toString()).emit('messageDeleted', messageId);
    }

    await message.deleteOne();
    res.json({ message: 'Message deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting message:', error);
    res.status(500).json({ message: 'Error deleting message' });
  }
};

/**
 * Update a message
 * @route PUT /api/messages/:messageId
 */
export const updateMessage = async (req: Request, res: Response) => {
  try {
    const userId = req.user && (req.user as any)._id;
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const { messageId } = req.params;
    const { content } = req.body;

    const message = await Message.findById(new Types.ObjectId(messageId));
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Check if user is the sender
    if (!message.sender.equals(new Types.ObjectId(userId))) {
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
      const team = await Team.findById(message.recipientId);
      if (team) {
        team.members.forEach((member: Types.ObjectId) => {
          io.to(member.toString()).emit('messageUpdated', message);
        });
      }
    } else if (message.recipientType === 'project') {
      const project = await Project.findById(message.recipientId);
      if (project) {
        project.team.forEach((member: Types.ObjectId) => {
          io.to(member.toString()).emit('messageUpdated', message);
        });
      }
    }

    await message.save();
    res.json(message);
  } catch (error: any) {
    console.error('Error updating message:', error);
    res.status(500).json({ message: 'Error updating message' });
  }
};

/**
 * Mark all messages as read
 * @route PUT /api/messages/all/read
 */
export const markAllAsRead = async (req: Request, res: Response) => {
  try {
    const userId = req.user && (req.user as any)._id;
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Mark all direct messages to the user as read
    await Message.updateMany(
      {
        recipientId: new Types.ObjectId(userId),
        recipientType: 'user',
        'metadata.readBy': { $ne: new Types.ObjectId(userId) }
      },
      {
        $addToSet: { 'metadata.readBy': new Types.ObjectId(userId) },
        $set: { status: 'read' }
      }
    );
    
    // Mark all team messages as read
    const userTeams = await Team.find({ members: new Types.ObjectId(userId) });
    for (const team of userTeams) {
      await Message.updateMany(
        {
          recipientId: team._id,
          recipientType: 'team',
          'metadata.readBy': { $ne: new Types.ObjectId(userId) }
        },
        {
          $addToSet: { 'metadata.readBy': new Types.ObjectId(userId) }
        }
      );
    }
    
    // Mark all project messages as read
    const userProjects = await Project.find({ team: new Types.ObjectId(userId) });
    for (const project of userProjects) {
      await Message.updateMany(
        {
          recipientId: project._id,
          recipientType: 'project',
          'metadata.readBy': { $ne: new Types.ObjectId(userId) }
        },
        {
          $addToSet: { 'metadata.readBy': new Types.ObjectId(userId) }
        }
      );
    }
    
    res.json({ message: 'All messages marked as read' });
  } catch (error: any) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({ message: 'Error marking messages as read' });
  }
};

/**
 * Mark specific conversation messages as read
 * @route PUT /api/messages/:recipientId/read
 */
export const markAsRead = async (req: Request, res: Response) => {
  try {
    const userId = req.user && (req.user as any)._id;
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const { messageIds } = req.body;

    await Message.updateMany(
      {
        _id: { $in: messageIds },
        recipientId: new Types.ObjectId(userId),
        'metadata.readBy': { $ne: new Types.ObjectId(userId) }
      },
      {
        $addToSet: { 'metadata.readBy': new Types.ObjectId(userId) }
      }
    );

    res.json({ message: 'Messages marked as read' });
  } catch (error: any) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({ message: 'Error marking messages as read' });
  }
};

/**
 * Get unread message count
 * @route GET /api/messages/unread/count
 */
export const getUnreadCount = async (req: Request, res: Response) => {
  try {
    const userId = req.user && (req.user as any)._id;
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const count = await Message.countDocuments({
      recipientId: new Types.ObjectId(userId),
      'metadata.readBy': { $ne: new Types.ObjectId(userId) }
    });

    res.json({ count });
  } catch (error: any) {
    console.error('Error getting unread count:', error);
    res.status(500).json({ message: 'Error getting unread count' });
  }
};

/**
 * Create a conversation
 * @route POST /api/messages/conversation
 */
export const createConversation = async (req: Request, res: Response) => {
  try {
    const userId = req.user && (req.user as any)._id;
    const { userId: otherUserId } = req.body;
    if (!userId || !otherUserId) {
      return res.status(400).json({ message: 'Missing userId' });
    }
    if (userId.toString() === otherUserId) {
      return res.status(400).json({ message: 'Cannot start a conversation with yourself' });
    }
    // Find existing messages between the two users
    const messages = await Message.find({
      recipientType: 'user',
      $or: [
        { sender: userId, recipientId: otherUserId },
        { sender: otherUserId, recipientId: userId }
      ]
    }).sort({ createdAt: 1 });
    // Get the other user's info
    const otherUser = await User.findById(otherUserId).select('name avatar email');
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
  } catch (error) {
    res.status(500).json({ message: 'Error creating conversation' });
  }
};
