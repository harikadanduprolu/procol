"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.backFunding = exports.deleteFunding = exports.updateFunding = exports.getFunding = exports.getFundings = exports.createFunding = void 0;
const Funding_1 = require("../models/Funding");
const Project_1 = require("../models/Project");
const zod_1 = require("zod");
const fundingSchema = zod_1.z.object({
    title: zod_1.z.string().min(1),
    description: zod_1.z.string().min(1),
    project: zod_1.z.string().min(1),
    goal: zod_1.z.number().min(0),
    deadline: zod_1.z.string().transform(str => new Date(str)),
    rewards: zod_1.z.array(zod_1.z.object({
        tier: zod_1.z.string(),
        amount: zod_1.z.number().min(0),
        description: zod_1.z.string()
    })).optional(),
});
// Utility to check ownership
const isCreator = (userId, creatorId) => {
    return creatorId.toString() === userId.toString();
};
const createFunding = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        const userId = req.user._id;
        const fundingData = fundingSchema.parse(req.body);
        // Check if project exists and user is the owner
        const project = await Project_1.Project.findById(fundingData.project);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        if (project.owner && project.owner.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'Not authorized to create funding for this project' });
        }
        const funding = new Funding_1.Funding({
            ...fundingData,
            creator: req.user._id,
            currentAmount: 0,
            status: 'active',
            backers: []
        });
        await funding.save();
        res.status(201).json(funding);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ message: error.errors[0].message });
        }
        console.error('Error creating funding:', error);
        res.status(500).json({ message: 'Error creating funding' });
    }
};
exports.createFunding = createFunding;
const getFundings = async (req, res) => {
    try {
        const { search, status } = req.query;
        const query = {};
        if (search)
            query.$text = { $search: search };
        if (status)
            query.status = status;
        const fundings = await Funding_1.Funding.find(query)
            .populate('creator', 'name email avatar')
            .populate('project', 'title description')
            .sort({ createdAt: -1 });
        res.json(fundings);
    }
    catch (error) {
        console.error('Error fetching fundings:', error);
        res.status(500).json({ message: 'Error fetching fundings' });
    }
};
exports.getFundings = getFundings;
const getFunding = async (req, res) => {
    try {
        const funding = await Funding_1.Funding.findById(req.params.id)
            .populate('creator', 'name email avatar')
            .populate('project', 'title description')
            .populate('backers.user', 'name email avatar');
        if (!funding) {
            return res.status(404).json({ message: 'Funding not found' });
        }
        res.json(funding);
    }
    catch (error) {
        console.error('Error fetching funding:', error);
        res.status(500).json({ message: 'Error fetching funding' });
    }
};
exports.getFunding = getFunding;
const updateFunding = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        const fundingData = fundingSchema.parse(req.body);
        const funding = await Funding_1.Funding.findById(req.params.id);
        if (!funding) {
            return res.status(404).json({ message: 'Funding not found' });
        }
        if (!isCreator(req.user._id, funding.creator)) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        // Only allow updates if funding is not completed or cancelled
        if (funding.status !== 'active') {
            return res.status(400).json({ message: 'Cannot update a completed or cancelled funding' });
        }
        Object.assign(funding, fundingData);
        await funding.save();
        res.json(funding);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ message: error.errors[0].message });
        }
        console.error('Error updating funding:', error);
        res.status(500).json({ message: 'Error updating funding' });
    }
};
exports.updateFunding = updateFunding;
const deleteFunding = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        const funding = await Funding_1.Funding.findById(req.params.id);
        if (!funding) {
            return res.status(404).json({ message: 'Funding not found' });
        }
        if (!isCreator(req.user._id, funding.creator)) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        // Only allow deletion if funding has no backers
        if (funding.backers.length > 0) {
            return res.status(400).json({ message: 'Cannot delete a funding with backers' });
        }
        await funding.deleteOne();
        res.json({ message: 'Funding deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting funding:', error);
        res.status(500).json({ message: 'Error deleting funding' });
    }
};
exports.deleteFunding = deleteFunding;
const backFunding = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        const userId = req.user._id;
        const { amount, rewardTier } = req.body;
        const funding = await Funding_1.Funding.findById(req.params.id);
        if (!funding) {
            return res.status(404).json({ message: 'Funding not found' });
        }
        if (funding.status !== 'active') {
            return res.status(400).json({ message: 'Funding is not active' });
        }
        // Check if user has already backed this funding
        const existingBacker = funding.backers.find(backer => backer.user && backer.user.toString() === userId.toString());
        if (existingBacker) {
            return res.status(400).json({ message: 'You have already backed this funding' });
        }
        // Add backer
        funding.backers.push({
            user: req.user._id,
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
    }
    catch (error) {
        console.error('Error backing funding:', error);
        res.status(500).json({ message: 'Error backing funding' });
    }
};
exports.backFunding = backFunding;
