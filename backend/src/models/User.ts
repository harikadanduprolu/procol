import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'mentor' | 'admin';
  avatar?: string;
  bio?: string;
  skills?: string[];
  institution?: string;
  location?: string;
  socials?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
  projects?: mongoose.Types.ObjectId[];
  teams?: mongoose.Types.ObjectId[];
  mentoring?: mongoose.Types.ObjectId[];
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'mentor', 'admin'], default: 'user' },
    avatar: { type: String },
    bio: { type: String },
    skills: [{ type: String }],
    institution: { type: String },
    location: { type: String },
    socials: {
      github: { type: String },
      linkedin: { type: String },
      twitter: { type: String },
      website: { type: String }
    },
    projects: [{ type: Schema.Types.ObjectId, ref: 'Project' }],
    teams: [{ type: Schema.Types.ObjectId, ref: 'Team' }],
    mentoring: [{ type: Schema.Types.ObjectId, ref: 'Mentor' }],
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String },
    emailVerificationExpires: { type: Date }
  },
  { timestamps: true }
);

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password as string, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>('User', UserSchema); 