import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User';

export interface IMessage extends Document {
  sender: mongoose.Types.ObjectId;
  recipient: mongoose.Types.ObjectId;
  content: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema: Schema = new Schema(
  {
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    read: { type: Boolean, default: false }
  },
  { timestamps: true }
);

// Index for querying messages
MessageSchema.index({ sender: 1, recipient: 1 });
MessageSchema.index({ createdAt: -1 });

export const Message = mongoose.model<IMessage>('Message', MessageSchema); 