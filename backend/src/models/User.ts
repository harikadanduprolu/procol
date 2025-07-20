import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  role: 'user' | 'mentor' | 'admin' | 'funder';
  bio?: string;
  skills?: string[];
  institution?: string;
  university?: string;
  location?: string;
  yearsOfExperience?: number;
  socials?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
  avatar?: string;
  isEmailVerified?: boolean;
  lastSeen?: Date;
  projects?: mongoose.Types.ObjectId[];
  teams?: mongoose.Types.ObjectId[];
  mentoring?: mongoose.Types.ObjectId[];
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['user', 'mentor', 'admin', 'funder'],
    default: 'user'
  },
  bio: {
    type: String,
    trim: true
  },
  skills: [{
    type: String,
    trim: true
  }],
  institution: {
    type: String,
    trim: true
  },
  university: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  yearsOfExperience: {
    type: Number,
    default: 0
  },
  socials: {
    github: { type: String },
    linkedin: { type: String },
    twitter: { type: String },
    website: { type: String }
  },
  avatar: {
    type: String
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  lastSeen: {
    type: Date,
    default: Date.now
  },
  projects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  }],
  teams: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  }],
  mentoring: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mentoring'
  }]
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>('User', userSchema);