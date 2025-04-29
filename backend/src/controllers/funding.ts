import { Request, Response } from 'express';
import { Funding, IFunding } from '../models/Funding';
import { Project } from '../models/Project';
import { z } from 'zod';
import { Types } from 'mongoose';

const fundingSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  project: z.string().min(1),
  goal: z.number().min(0),
  deadline: z.string().transform(str => new Date(str)),
  rewards: z.array(z.object({
    tier: z.string(),
    amount: z.number().min(0),
    description: z.string()
  })).optional(),
});

// Utility to check ownership
const isCreator = (userId: Types.ObjectId, creatorId: Types.ObjectId): boolean => {
  return creatorId.toString() === userId.toString();
};

export const createFunding = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const userId = req.user._id as Types.ObjectId;
    const fundingData = fundingSchema.parse(req.body);

    // Check if project exists and user is the owner
    const project = await Project.findById(fundingData.project);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.owner && project.owner.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Not authorized to create funding for this project' });
    }

    const funding = new Funding({
      ...fundingData,
      creator: req.user._id,
      currentAmount: 0,
      status: 'active',
      backers: []
    });

    await funding.save();
    res.status(201).json(funding);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }
    console.error('Error creating funding:', error);
    res.status(500).json({ message: 'Error creating funding' });
  }
};

export const getFundings = async (req: Request, res: Response) => {
  try {
    const { search, status } = req.query;
    const query: any = {};

    if (search) query.$text = { $search: search as string };
    if (status) query.status = status;

    const fundings = await Funding.find(query)
      .populate('creator', 'name email avatar')
      .populate('project', 'title description')
      .sort({ createdAt: -1 });

    res.json(fundings);
  } catch (error) {
    console.error('Error fetching fundings:', error);
    res.status(500).json({ message: 'Error fetching fundings' });
  }
};

export const getFunding = async (req: Request, res: Response) => {
  try {
    const funding = await Funding.findById(req.params.id)
      .populate('creator', 'name email avatar')
      .populate('project', 'title description')
      .populate('backers.user', 'name email avatar');

    if (!funding) {
      return res.status(404).json({ message: 'Funding not found' });
    }

    res.json(funding);
  } catch (error) {
    console.error('Error fetching funding:', error);
    res.status(500).json({ message: 'Error fetching funding' });
  }
};

export const updateFunding = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const fundingData = fundingSchema.parse(req.body);
    const funding = await Funding.findById(req.params.id) as IFunding | null;

    if (!funding) {
      return res.status(404).json({ message: 'Funding not found' });
    }

    if (!isCreator(req.user._id as Types.ObjectId, funding.creator as Types.ObjectId)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Only allow updates if funding is not completed or cancelled
    if (funding.status !== 'active') {
      return res.status(400).json({ message: 'Cannot update a completed or cancelled funding' });
    }

    Object.assign(funding, fundingData);
    await funding.save();

    res.json(funding);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }
    console.error('Error updating funding:', error);
    res.status(500).json({ message: 'Error updating funding' });
  }
};

export const deleteFunding = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const funding = await Funding.findById(req.params.id) as IFunding | null;

    if (!funding) {
      return res.status(404).json({ message: 'Funding not found' });
    }

    if (!isCreator(req.user._id as Types.ObjectId, funding.creator as Types.ObjectId)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Only allow deletion if funding has no backers
    if (funding.backers.length > 0) {
      return res.status(400).json({ message: 'Cannot delete a funding with backers' });
    }

    await funding.deleteOne();
    res.json({ message: 'Funding deleted successfully' });
  } catch (error) {
    console.error('Error deleting funding:', error);
    res.status(500).json({ message: 'Error deleting funding' });
  }
};

export const backFunding = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const userId = req.user._id as Types.ObjectId;
    const { amount, rewardTier } = req.body;
    const funding = await Funding.findById(req.params.id) as IFunding | null;

    if (!funding) {
      return res.status(404).json({ message: 'Funding not found' });
    }

    if (funding.status !== 'active') {
      return res.status(400).json({ message: 'Funding is not active' });
    }

    // Check if user has already backed this funding
    const existingBacker = funding.backers.find(
      backer => backer.user && backer.user.toString() === userId.toString()
    );

    if (existingBacker) {
      return res.status(400).json({ message: 'You have already backed this funding' });
    }

    // Add backer
    funding.backers.push({
      user: req.user._id as Types.ObjectId,
      amount,
      rewardTier,
      date: new Date()
    });

    // Update current amount
    funding.currentAmount += amount;

    // Check if funding goal is reached
    if (funding.currentAmount >= funding.goal) {
      funding.status = 'completed';
    }

    await funding.save();
    res.json(funding);
  } catch (error) {
    console.error('Error backing funding:', error);
    res.status(500).json({ message: 'Error backing funding' });
  }
}; 