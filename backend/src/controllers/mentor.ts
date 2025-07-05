import { Mentor } from '../models/Mentor';

import { Request, Response } from 'express';

export const getAllMentors = async (req: Request, res: Response) => {
  try {
    const mentors = await Mentor.find().populate('user');
    res.json(mentors);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch mentors' });
  }
};