import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User';
import { IProject } from './Project';

export interface IFunding extends Document {
  title: string;
  description: string;
  project: mongoose.Types.ObjectId;
  creator: mongoose.Types.ObjectId;
  goal: number;
  currentAmount: number;
  deadline: Date;
  status: 'active' | 'completed' | 'cancelled';
  rewards: {
    tier: string;
    amount: number;
    description: string;
  }[];
  backers: {
    user: mongoose.Types.ObjectId;
    amount: number;
    rewardTier: string;
    date: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const FundingSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    goal: { type: Number, required: true },
    currentAmount: { type: Number, default: 0 },
    deadline: { type: Date, required: true },
    status: { 
      type: String, 
      enum: ['active', 'completed', 'cancelled'],
      default: 'active'
    },
    rewards: [
      {
        tier: { type: String },
        amount: { type: Number },
        description: { type: String }
      }
    ],
    backers: [
      {
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        amount: { type: Number },
        rewardTier: { type: String },
        date: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);

// Index for searching funding campaigns
FundingSchema.index({ title: 'text', description: 'text' });

export const Funding = mongoose.model<IFunding>('Funding', FundingSchema); 