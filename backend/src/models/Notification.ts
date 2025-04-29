import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User';
import { IProject } from './Project';
import { ITeam } from './Team';
import { IFunding } from './Funding';

export interface INotification extends Document {
  recipient: IUser['_id'];
  type: 'project' | 'team' | 'funding' | 'message' | 'system';
  title: string;
  content: string;
  read: boolean;
  relatedProject?: IProject['_id'];
  relatedTeam?: ITeam['_id'];
  relatedFunding?: IFunding['_id'];
  relatedUser?: IUser['_id'];
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>({
  recipient: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['project', 'team', 'funding', 'message', 'system'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  read: {
    type: Boolean,
    default: false
  },
  relatedProject: {
    type: Schema.Types.ObjectId,
    ref: 'Project'
  },
  relatedTeam: {
    type: Schema.Types.ObjectId,
    ref: 'Team'
  },
  relatedFunding: {
    type: Schema.Types.ObjectId,
    ref: 'Funding'
  },
  relatedUser: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Index for querying notifications
notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ read: 1 });

export const Notification = mongoose.model<INotification>('Notification', notificationSchema); 