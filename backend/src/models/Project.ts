import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User';

export interface IProject extends Document {
  title: string;
  description: string;
  category: string;
  tags: string[];
  owner: mongoose.Types.ObjectId;
  team: mongoose.Types.ObjectId[];
  mentors: mongoose.Types.ObjectId[];
  status: 'planning' | 'in-progress' | 'completed' | 'on-hold';
  githubUrl?: string;
  demoUrl?: string;
  fundingGoal?: number;
  currentFunding?: number;
  deadline?: Date;
  difficulty?: 'easy' | 'medium' | 'hard';
  duration?: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    tags: [{ type: String }],
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    team: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    mentors: [{ type: Schema.Types.ObjectId, ref: 'Mentor' }],
    status: { 
      type: String, 
      enum: ['planning', 'in-progress', 'completed', 'on-hold'],
      default: 'planning'
    },
    githubUrl: { type: String },
    demoUrl: { type: String },
    fundingGoal: { type: Number },
    currentFunding: { type: Number, default: 0 },
    deadline: { type: Date },
    difficulty: { 
      type: String, 
      enum: ['easy', 'medium', 'hard'],
      default: 'medium'
    },
    duration: { type: String },
    image: { type: String }
  },
  { timestamps: true }
);

// Index for searching projects
ProjectSchema.index({ title: 'text', description: 'text', tags: 'text' });

export const Project = mongoose.model<IProject>('Project', ProjectSchema); 