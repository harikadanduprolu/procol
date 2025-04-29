import mongoose, { Schema, Document } from 'mongoose';

export interface IMentor extends Document {
  user: mongoose.Types.ObjectId;
  expertise: string[];
  availability: string;
  hourlyRate: number;
  rating: number;
  reviews: {
    user: mongoose.Types.ObjectId;
    rating: number;
    comment: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const MentorSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    expertise: [{ type: String }],
    availability: { type: String },
    hourlyRate: { type: Number },
    rating: { type: Number, default: 0 },
    reviews: [
      {
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        rating: { type: Number },
        comment: { type: String }
      }
    ]
  },
  { timestamps: true }
);

export const Mentor = mongoose.model<IMentor>('Mentor', MentorSchema); 