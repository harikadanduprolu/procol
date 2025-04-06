import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User';

export interface IProject extends Document {
  title: string;
  description: string;
  owner: IUser['_id'];
  team: IUser['_id'][];
  mentors: IUser['_id'][];
  status: 'draft' | 'in-progress' | 'completed' | 'archived';
  category: string;
  tags: string[];
  githubUrl?: string;
  demoUrl?: string;
  fundingGoal?: number;
  currentFunding?: number;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  team: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  mentors: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  status: {
    type: String,
    enum: ['draft', 'in-progress', 'completed', 'archived'],
    default: 'draft'
  },
  category: {
    type: String,
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  githubUrl: {
    type: String,
    trim: true
  },
  demoUrl: {
    type: String,
    trim: true
  },
  fundingGoal: {
    type: Number,
    min: 0
  },
  currentFunding: {
    type: Number,
    min: 0,
    default: 0
  }
}, {
  timestamps: true
});

// Index for searching projects
projectSchema.index({ title: 'text', description: 'text', tags: 'text' });

export const Project = mongoose.model<IProject>('Project', projectSchema); 