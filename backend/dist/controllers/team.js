"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeTeamMember = exports.addTeamMember = exports.deleteTeam = exports.updateTeam = exports.getTeam = exports.getTeams = exports.createTeam = void 0;
const Team_1 = require("../models/Team");
const zod_1 = require("zod");
const mongoose_1 = require("mongoose");
const teamSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    description: zod_1.z.string().min(1),
    skills: zod_1.z.array(zod_1.z.string()).optional(),
    avatar: zod_1.z.string().optional(),
});
// Utility to check ownership
const isLeader = (userId, leaderId) => {
    return leaderId.toString() === userId.toString();
};
const createTeam = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        const teamData = teamSchema.parse(req.body);
        const team = new Team_1.Team({
            ...teamData,
            leader: req.user._id,
            members: [req.user._id],
        });
        await team.save();
        res.status(201).json(team);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ message: error.errors[0].message });
        }
        console.error('Error creating team:', error);
        res.status(500).json({ message: 'Error creating team' });
    }
};
exports.createTeam = createTeam;
const getTeams = async (req, res) => {
    try {
        const { search } = req.query;
        const query = {};
        if (search)
            query.$text = { $search: search };
        const teams = await Team_1.Team.find(query)
            .populate('leader', 'name email avatar')
            .populate('members', 'name email avatar')
            .sort({ createdAt: -1 });
        res.json(teams);
    }
    catch (error) {
        console.error('Error fetching teams:', error);
        res.status(500).json({ message: 'Error fetching teams' });
    }
};
exports.getTeams = getTeams;
const getTeam = async (req, res) => {
    try {
        const team = await Team_1.Team.findById(req.params.id)
            .populate('leader', 'name email avatar')
            .populate('members', 'name email avatar')
            .populate('projects', 'title description');
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }
        res.json(team);
    }
    catch (error) {
        console.error('Error fetching team:', error);
        res.status(500).json({ message: 'Error fetching team' });
    }
};
exports.getTeam = getTeam;
const updateTeam = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        const teamData = teamSchema.parse(req.body);
        const team = await Team_1.Team.findById(req.params.id);
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }
        if (!isLeader(req.user._id, team.leader)) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        Object.assign(team, teamData);
        await team.save();
        res.json(team);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ message: error.errors[0].message });
        }
        console.error('Error updating team:', error);
        res.status(500).json({ message: 'Error updating team' });
    }
};
exports.updateTeam = updateTeam;
const deleteTeam = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        const team = await Team_1.Team.findById(req.params.id);
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }
        if (!isLeader(req.user._id, team.leader)) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        await team.deleteOne();
        res.json({ message: 'Team deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting team:', error);
        res.status(500).json({ message: 'Error deleting team' });
    }
};
exports.deleteTeam = deleteTeam;
const addTeamMember = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        const { userId } = req.body;
        const team = await Team_1.Team.findById(req.params.id);
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }
        if (!isLeader(req.user._id, team.leader)) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        const memberIds = team.members;
        if (memberIds.some(memberId => memberId.toString() === userId)) {
            return res.status(400).json({ message: 'User is already a team member' });
        }
        team.members.push(new mongoose_1.Types.ObjectId(userId));
        await team.save();
        res.json(team);
    }
    catch (error) {
        console.error('Error adding team member:', error);
        res.status(500).json({ message: 'Error adding team member' });
    }
};
exports.addTeamMember = addTeamMember;
const removeTeamMember = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        const { userId } = req.body;
        const team = await Team_1.Team.findById(req.params.id);
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }
        if (!isLeader(req.user._id, team.leader)) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        const memberIds = team.members;
        team.members = memberIds.filter((memberId) => memberId.toString() !== userId);
        await team.save();
        res.json(team);
    }
    catch (error) {
        console.error('Error removing team member:', error);
        res.status(500).json({ message: 'Error removing team member' });
    }
};
exports.removeTeamMember = removeTeamMember;
