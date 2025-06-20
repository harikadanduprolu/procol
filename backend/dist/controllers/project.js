"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeTeamMember = exports.addTeamMember = exports.deleteProject = exports.updateProject = exports.getProject = exports.getProjects = exports.createProject = void 0;
const Project_1 = require("../models/Project");
const zod_1 = require("zod");
const mongoose_1 = require("mongoose");
const projectSchema = zod_1.z.object({
    title: zod_1.z.string().min(1),
    description: zod_1.z.string().min(1),
    category: zod_1.z.string().min(1),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
    githubUrl: zod_1.z.string().url().optional(),
    demoUrl: zod_1.z.string().url().optional(),
    fundingGoal: zod_1.z.number().min(0).optional(),
    difficulty: zod_1.z.enum(['easy', 'medium', 'hard']).optional(),
    duration: zod_1.z.string().optional(),
    image: zod_1.z.string().optional(),
});
// Utility to check ownership
const isOwner = (userId, ownerId) => {
    return ownerId.toString() === userId.toString();
};
const createProject = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        // Parse tags if they're sent as a JSON string
        let projectData = { ...req.body };
        if (projectData.tags && typeof projectData.tags === 'string') {
            try {
                projectData.tags = JSON.parse(projectData.tags);
            }
            catch (error) {
                return res.status(400).json({ message: 'Invalid tags format' });
            }
        }
        // Add image path if file was uploaded
        if (req.file) {
            projectData.image = `/uploads/${req.file.filename}`;
        }
        const validatedData = projectSchema.parse(projectData);
        const project = new Project_1.Project({
            ...validatedData,
            owner: req.user._id,
            team: [req.user._id],
        });
        await project.save();
        res.status(201).json(project);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ message: error.errors[0].message });
        }
        console.error('Error creating project:', error);
        res.status(500).json({ message: 'Error creating project' });
    }
};
exports.createProject = createProject;
const getProjects = async (req, res) => {
    try {
        const { category, status, search, tags, difficulty, duration, sort, page = '1', limit = '10' } = req.query;
        const query = {};
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;
        // Build query
        if (category)
            query.category = category;
        if (status)
            query.status = status;
        // Handle text search
        if (search) {
            try {
                query.$text = { $search: search };
            }
            catch (error) {
                console.warn('Text search failed, falling back to regex search:', error);
                query.$or = [
                    { title: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } }
                ];
            }
        }
        // Filter by tags
        if (tags) {
            const tagArray = tags.split(',');
            if (tagArray.length > 0) {
                query.tags = { $in: tagArray };
            }
        }
        // Filter by difficulty
        if (difficulty) {
            query.difficulty = difficulty;
        }
        // Filter by duration
        if (duration) {
            query.duration = duration;
        }
        // Determine sort order
        let sortOption = {};
        if (sort) {
            switch (sort) {
                case 'newest':
                    sortOption = { createdAt: -1 };
                    break;
                case 'popular':
                    sortOption = { team: -1 }; // Sort by team size (popularity)
                    break;
                case 'deadline':
                    sortOption = { deadline: 1 }; // Sort by deadline (ascending)
                    break;
                default:
                    sortOption = { createdAt: -1 };
            }
        }
        else {
            sortOption = { createdAt: -1 }; // Default sort by newest
        }
        // Get total count for pagination
        const total = await Project_1.Project.countDocuments(query);
        // Fetch projects with pagination
        const projects = await Project_1.Project.find(query)
            .populate('owner', 'name email avatar')
            .populate('team', 'name email avatar')
            .sort(sortOption)
            .skip(skip)
            .limit(limitNum);
        res.json({
            projects,
            pagination: {
                total,
                page: pageNum,
                limit: limitNum,
                pages: Math.ceil(total / limitNum)
            }
        });
    }
    catch (error) {
        console.error('Error fetching projects:', error);
        if (error instanceof Error) {
            res.status(500).json({
                message: 'Error fetching projects',
                error: error.message
            });
        }
        else {
            res.status(500).json({ message: 'Error fetching projects' });
        }
    }
};
exports.getProjects = getProjects;
const getProject = async (req, res) => {
    try {
        const project = await Project_1.Project.findById(req.params.id)
            .populate('owner', 'name email avatar')
            .populate('team', 'name email avatar');
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.json(project);
    }
    catch (error) {
        console.error('Error fetching project:', error);
        res.status(500).json({ message: 'Error fetching project' });
    }
};
exports.getProject = getProject;
const updateProject = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        // Parse tags if they're sent as a JSON string
        let projectData = { ...req.body };
        if (projectData.tags && typeof projectData.tags === 'string') {
            try {
                projectData.tags = JSON.parse(projectData.tags);
            }
            catch (error) {
                return res.status(400).json({ message: 'Invalid tags format' });
            }
        }
        // Add image path if file was uploaded
        if (req.file) {
            projectData.image = `/uploads/${req.file.filename}`;
        }
        const validatedData = projectSchema.parse(projectData);
        const project = await Project_1.Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        if (!isOwner(req.user._id, project.owner)) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        Object.assign(project, validatedData);
        await project.save();
        res.json(project);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ message: error.errors[0].message });
        }
        console.error('Error updating project:', error);
        res.status(500).json({ message: 'Error updating project' });
    }
};
exports.updateProject = updateProject;
const deleteProject = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        const project = await Project_1.Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        if (!isOwner(req.user._id, project.owner)) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        if (project.team.length > 1) {
            return res.status(400).json({ message: 'Remove team members before deleting project' });
        }
        await project.deleteOne();
        res.json({ message: 'Project deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ message: 'Error deleting project' });
    }
};
exports.deleteProject = deleteProject;
const addTeamMember = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        const { userId } = req.body;
        const project = await Project_1.Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        if (!isOwner(req.user._id, project.owner)) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        const teamIds = project.team;
        if (teamIds.some(memberId => memberId.toString() === userId)) {
            return res.status(400).json({ message: 'User is already a team member' });
        }
        project.team.push(new mongoose_1.Types.ObjectId(userId));
        await project.save();
        res.json(project);
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
        const project = await Project_1.Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        if (!isOwner(req.user._id, project.owner)) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        const teamIds = project.team;
        project.team = teamIds.filter((memberId) => memberId.toString() !== userId);
        await project.save();
        res.json(project);
    }
    catch (error) {
        console.error('Error removing team member:', error);
        res.status(500).json({ message: 'Error removing team member' });
    }
};
exports.removeTeamMember = removeTeamMember;
