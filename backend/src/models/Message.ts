import mongoose, { Schema, Document, Model } from 'mongoose';
import { IUser } from './User';

// Define recipient types
export type RecipientType = 'user' | 'team' | 'project';

// Define message status
export type MessageStatus = 'sent' | 'delivered' | 'read';

// Define reaction interface
interface Reaction {
  userId: mongoose.Types.ObjectId;
  reaction: string;
}

// Define metadata interface
export interface MessageMetadata {
  attachments?: string[];
  mentions?: mongoose.Types.ObjectId[];
  reactions?: Reaction[];
  isSystemMessage?: boolean;
}

// Message interface with enhanced functionality
export interface IMessage extends Document {
  sender: mongoose.Types.ObjectId;
  recipientId: mongoose.Types.ObjectId;
  recipientType: RecipientType;
  content: string;
  status: MessageStatus;
  readBy: mongoose.Types.ObjectId[];
  metadata: MessageMetadata;
  createdAt: Date;
  updatedAt: Date;
  
  // Methods
  markAsRead(userId: mongoose.Types.ObjectId): Promise<IMessage>;
  addReaction(userId: mongoose.Types.ObjectId, reaction: string): Promise<IMessage>;
  removeReaction(userId: mongoose.Types.ObjectId): Promise<IMessage>;
}

// Static methods interface
export interface IMessageModel extends Model<IMessage> {
  findConversation(
    userOrEntityId: mongoose.Types.ObjectId, 
    recipientId: mongoose.Types.ObjectId, 
    recipientType: RecipientType,
    limit?: number,
    skip?: number
  ): Promise<IMessage[]>;
  
  markAllAsRead(
    userId: mongoose.Types.ObjectId, 
    entityId: mongoose.Types.ObjectId, 
    entityType: RecipientType
  ): Promise<void>;
  
  findUnreadCount(
    userId: mongoose.Types.ObjectId, 
    entityId?: mongoose.Types.ObjectId, 
    entityType?: RecipientType
  ): Promise<number>;
}

const MessageSchema = new Schema(
  {
    sender: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    recipientId: { 
      type: Schema.Types.ObjectId, 
      required: true 
    },
    recipientType: { 
      type: String, 
      enum: ['user', 'team', 'project'], 
      required: true,
      default: 'user' 
    },
    content: { 
      type: String, 
      required: true 
    },
    status: { 
      type: String, 
      enum: ['sent', 'delivered', 'read'], 
      default: 'sent' 
    },
    readBy: [{ 
      type: Schema.Types.ObjectId, 
      ref: 'User' 
    }],
    metadata: {
      attachments: [String],
      mentions: [{ type: Schema.Types.ObjectId, ref: 'User' }],
      reactions: [{
        userId: { type: Schema.Types.ObjectId, ref: 'User' },
        reaction: String
      }],
      isSystemMessage: { type: Boolean, default: false }
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for determining the ref model based on recipientType
MessageSchema.virtual('recipient').get(function() {
  const refMap = {
    'user': 'User',
    'team': 'Team',
    'project': 'Project'
  };
  return mongoose.model(refMap[this.recipientType]).findById(this.recipientId);
});

// Indexes for efficient querying
MessageSchema.index({ sender: 1, recipientId: 1, recipientType: 1 });
MessageSchema.index({ recipientId: 1, recipientType: 1 });
MessageSchema.index({ createdAt: -1 });
MessageSchema.index({ 'metadata.mentions': 1 });
MessageSchema.index({ status: 1 });
MessageSchema.index({ readBy: 1 });

// Instance methods
MessageSchema.methods.markAsRead = async function(this: IMessage, userId: mongoose.Types.ObjectId): Promise<IMessage> {
  if (!this.readBy.includes(userId)) {
    this.readBy.push(userId);
    this.status = 'read';
    await this.save();
  }
  return this;
};

MessageSchema.methods.addReaction = async function(this: IMessage, userId: mongoose.Types.ObjectId, reaction: string): Promise<IMessage> {
  if (!this.metadata) {
    this.metadata = {};
  }
  if (!this.metadata.reactions) {
    this.metadata.reactions = [];
  }
  
  // Remove existing reaction from this user if any
  this.metadata.reactions = this.metadata.reactions.filter((r: Reaction) => !r.userId.equals(userId));
  
  // Add new reaction
  this.metadata.reactions.push({ userId, reaction });
  await this.save();
  return this;
};

MessageSchema.methods.removeReaction = async function(this: IMessage, userId: mongoose.Types.ObjectId): Promise<IMessage> {
  if (this.metadata?.reactions) {
    this.metadata.reactions = this.metadata.reactions.filter((r: Reaction) => !r.userId.equals(userId));
    await this.save();
  }
  return this;
};

// Static methods
MessageSchema.statics.findConversation = async function(
  userOrEntityId: mongoose.Types.ObjectId, 
  recipientId: mongoose.Types.ObjectId, 
  recipientType: RecipientType,
  limit = 50,
  skip = 0
): Promise<IMessage[]> {
  return this.find({
    $or: [
      { sender: userOrEntityId, recipientId, recipientType },
      { sender: recipientId, recipientId: userOrEntityId, recipientType: 'user' }
    ]
  })
  .sort({ createdAt: -1 })
  .skip(skip)
  .limit(limit)
  .populate('sender', 'name avatar')
  .populate({
    path: 'recipientId',
    select: 'name avatar',
    model: recipientType === 'user' ? 'User' : recipientType === 'team' ? 'Team' : 'Project'
  });
};

MessageSchema.statics.markAllAsRead = async function(
  userId: mongoose.Types.ObjectId, 
  entityId: mongoose.Types.ObjectId, 
  entityType: RecipientType
): Promise<void> {
  await this.updateMany(
    {
      recipientId: userId,
      recipientType: 'user',
      sender: entityId,
      readBy: { $ne: userId }
    },
    {
      $addToSet: { readBy: userId },
      $set: { status: 'read' }
    }
  );
};

MessageSchema.statics.findUnreadCount = async function(
  userId: mongoose.Types.ObjectId, 
  entityId?: mongoose.Types.ObjectId, 
  entityType?: RecipientType
): Promise<number> {
  const query: any = {
    recipientId: userId,
    recipientType: 'user',
    readBy: { $ne: userId }
  };
  
  if (entityId) {
    query.sender = entityId;
  }
  
  return this.countDocuments(query);
};

export const Message = mongoose.model<IMessage, IMessageModel>('Message', MessageSchema);
