import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User';
import { IProject } from './Project';

export interface ITeam extends Document {
  name: string;
  description: string;
  leader: IUser['_id'];
  members: mongoose.Types.ObjectId[];
  projects: mongoose.Types.ObjectId[];
  skills: string[];
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TeamSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    leader: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    projects: [{ type: Schema.Types.ObjectId, ref: 'Project' }],
    skills: [{ type: String, trim: true }],
    avatar: { type: String }
  },
  { timestamps: true }
);

// Index for searching teams
TeamSchema.index({ name: 'text', description: 'text', skills: 'text' });

export const Team = mongoose.model<ITeam>('Team', TeamSchema); 