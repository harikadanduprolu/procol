import { Request, Response } from 'express';
import { User } from '../models/User';
import { z } from 'zod';

const profileUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  bio: z.string().max(500).optional(),
  skills: z.array(z.string()).optional(),
  github: z.string().url().optional().nullable(),
  linkedin: z.string().url().optional().nullable(),
  twitter: z.string().url().optional().nullable(),
  website: z.string().url().optional().nullable(),
  location: z.string().optional(),
  avatar: z.string().optional()
});

export const getProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user?._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Error fetching profile' });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const updateData = profileUpdateSchema.parse(req.body);
    const user = await User.findById(req.user?._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    Object.assign(user, updateData);
    await user.save();

    const updatedUser = await User.findById(user._id).select('-password');
    res.json(updatedUser);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Error updating profile' });
  }
};

export const getPublicProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id)
      .select('name avatar bio skills github linkedin twitter website location role createdAt')
      .populate('projects', 'title description category');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error fetching public profile:', error);
    res.status(500).json({ message: 'Error fetching public profile' });
  }
}; 