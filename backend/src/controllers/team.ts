import { Request, Response } from 'express';
import { Team, ITeam } from '../models/Team';
import { z } from 'zod';
import { Types } from 'mongoose';

const teamSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  skills: z.array(z.string()).optional(),
  avatar: z.string().optional(),
});

// Utility to check ownership
const isLeader = (userId: Types.ObjectId, leaderId: Types.ObjectId): boolean => {
  return leaderId.toString() === userId.toString();
};

export const createTeam = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const teamData = teamSchema.parse(req.body);

    const team = new Team({
      ...teamData,
      leader: req.user._id,
      members: [req.user._id],
    });

    await team.save();
    res.status(201).json(team);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }
    console.error('Error creating team:', error);
    res.status(500).json({ message: 'Error creating team' });
  }
};

export const getTeams = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    const query: any = {};

    if (search) {
      query.$text = { $search: search as string };
    }

    const teams = await Team.find(query)
      .populate('leader', 'name email avatar')
      .populate('members', 'name email avatar')
      .sort({ createdAt: -1 });

    res.json(teams);
  } catch (error) {
    console.error('Error fetching teams:', error);
    res.status(500).json({ message: 'Error fetching teams' });
  }
};

export const getTeam = async (req: Request, res: Response) => {
  try {
    const team = await Team.findById(req.params.id)
      .populate('leader', 'name email avatar')
      .populate('members', 'name email avatar')
      .populate('projects', 'title description');

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    res.json(team);
  } catch (error) {
    console.error('Error fetching team:', error);
    res.status(500).json({ message: 'Error fetching team' });
  }
};

export const updateTeam = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const teamData = teamSchema.parse(req.body);
    const team = await Team.findById(req.params.id) as ITeam | null;

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    if (!isLeader(req.user._id as Types.ObjectId, team.leader as Types.ObjectId)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    Object.assign(team, teamData);
    await team.save();

    res.json(team);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }
    console.error('Error updating team:', error);
    res.status(500).json({ message: 'Error updating team' });
  }
};

export const deleteTeam = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const team = await Team.findById(req.params.id) as ITeam | null;

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    if (!isLeader(req.user._id as Types.ObjectId, team.leader as Types.ObjectId)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await team.deleteOne();
    res.json({ message: 'Team deleted successfully' });
  } catch (error) {
    console.error('Error deleting team:', error);
    res.status(500).json({ message: 'Error deleting team' });
  }
};

export const addTeamMember = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const { userId } = req.body;
    const team = await Team.findById(req.params.id) as ITeam | null;

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    if (!isLeader(req.user._id as Types.ObjectId, team.leader as Types.ObjectId)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const memberIds = team.members as Types.ObjectId[];
    if (memberIds.some(memberId => memberId.toString() === userId)) {
      return res.status(400).json({ message: 'User is already a team member' });
    }

    team.members.push(new Types.ObjectId(userId));
    await team.save();

    res.json(team);
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
    const team = await Team.findById(req.params.id) as ITeam | null;

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    if (!isLeader(req.user._id as Types.ObjectId, team.leader as Types.ObjectId)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const memberIds = team.members as Types.ObjectId[];
    team.members = memberIds.filter(
      (memberId) => memberId.toString() !== userId
    ) as unknown as ITeam['members'];

    await team.save();
    res.json(team);
  } catch (error) {
    console.error('Error removing team member:', error);
    res.status(500).json({ message: 'Error removing team member' });
  }
}; 

export const getUserTeams = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const teams = await Team.find({ members: req.user._id })
      .populate('leader', 'name email avatar')
      .populate('members', 'name email avatar')
      .populate('projects', 'title');

    res.json({ teams });
  } catch (error) {
    console.error('Error fetching user teams:', error);
    res.status(500).json({ message: 'Error fetching user teams' });
  }
};
