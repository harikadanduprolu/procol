import { Request, Response } from 'express';
import { Project, IProject } from '../models/Project';
import { z } from 'zod';
import { Types } from 'mongoose';

const projectSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  category: z.string().min(1),
  tags: z.array(z.string()).optional(),
  githubUrl: z.string().url().optional(),
  demoUrl: z.string().url().optional(),
  fundingGoal: z.number().min(0).optional(),
});

// Utility to check ownership
const isOwner = (userId: Types.ObjectId, ownerId: Types.ObjectId): boolean => {
  return ownerId.toString() === userId.toString();
};

export const createProject = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const projectData = projectSchema.parse(req.body);

    const project = new Project({
      ...projectData,
      owner: req.user._id,
      team: [req.user._id],
    });

    await project.save();
    res.status(201).json(project);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }
    console.error('Error creating project:', error);
    res.status(500).json({ message: 'Error creating project' });
  }
};

export const getProjects = async (req: Request, res: Response) => {
  try {
    const { category, status, search } = req.query;
    const query: any = {};

    if (category) query.category = category;
    if (status) query.status = status;
    if (search) query.$text = { $search: search as string };

    const projects = await Project.find(query)
      .populate('owner', 'name email avatar')
      .populate('team', 'name email avatar')
      .populate('mentors', 'name email avatar')
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Error fetching projects' });
  }
};

export const getProject = async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email avatar')
      .populate('team', 'name email avatar')
      .populate('mentors', 'name email avatar');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ message: 'Error fetching project' });
  }
};

export const updateProject = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const projectData = projectSchema.parse(req.body);
    const project = await Project.findById(req.params.id) as IProject | null;

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (!isOwner(req.user._id as Types.ObjectId, project.owner as Types.ObjectId)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    Object.assign(project, projectData);
    await project.save();

    res.json(project);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }
    console.error('Error updating project:', error);
    res.status(500).json({ message: 'Error updating project' });
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const project = await Project.findById(req.params.id) as IProject | null;

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (!isOwner(req.user._id as Types.ObjectId, project.owner as Types.ObjectId)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if ((project.team as Types.ObjectId[]).length > 1) {
      return res.status(400).json({ message: 'Remove team members before deleting project' });
    }

    await project.deleteOne();
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ message: 'Error deleting project' });
  }
};

export const addTeamMember = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const { userId } = req.body;
    const project = await Project.findById(req.params.id) as IProject | null;

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (!isOwner(req.user._id as Types.ObjectId, project.owner as Types.ObjectId)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const teamIds = project.team as Types.ObjectId[];
    if (teamIds.some(memberId => memberId.toString() === userId)) {
      return res.status(400).json({ message: 'User is already a team member' });
    }

    project.team.push(new Types.ObjectId(userId));
    await project.save();

    res.json(project);
  } catch (error) {
    console.error('Error adding team member:', error);
    res.status(500).json({ message: 'Error adding team member' });
  }
};

export const removeTeamMember = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const { userId } = req.body;
    const project = await Project.findById(req.params.id) as IProject | null;

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (!isOwner(req.user._id as Types.ObjectId, project.owner as Types.ObjectId)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const teamIds = project.team as Types.ObjectId[];
    project.team = teamIds.filter(
      (memberId) => memberId.toString() !== userId
    ) as unknown as IProject['team'];

    await project.save();
    res.json(project);
  } catch (error) {
    console.error('Error removing team member:', error);
    res.status(500).json({ message: 'Error removing team member' });
  }
};
