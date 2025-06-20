"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.getProfile = exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const zod_1 = require("zod");
// Validation schemas
const registerSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
    name: zod_1.z.string().min(2),
    role: zod_1.z.enum(['user', 'mentor', 'admin']).optional()
});
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string()
});
const updateProfileSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).optional(),
    bio: zod_1.z.string().optional(),
    skills: zod_1.z.array(zod_1.z.string()).optional(),
    institution: zod_1.z.string().optional(),
    location: zod_1.z.string().optional(),
    socials: zod_1.z.object({
        github: zod_1.z.string().optional(),
        linkedin: zod_1.z.string().optional(),
        twitter: zod_1.z.string().optional(),
        website: zod_1.z.string().optional()
    }).optional()
});
const register = async (req, res) => {
    try {
        const { email, password, name, role } = registerSchema.parse(req.body);
        // Check if user already exists
        const existingUser = await User_1.User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        // Create new user
        const user = new User_1.User({
            email,
            password,
            name,
            role: role || 'user'
        });
        await user.save();
        // Generate token
        const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET || 'your-super-secret-jwt-key', { expiresIn: '7d' });
        res.status(201).json({
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ message: error.errors[0].message });
        }
        res.status(500).json({ message: 'Error creating user' });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = loginSchema.parse(req.body);
        // Find user
        const user = await User_1.User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        // Generate token
        const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET || 'your-super-secret-jwt-key', { expiresIn: '7d' });
        res.json({
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ message: error.errors[0].message });
        }
        res.status(500).json({ message: 'Error logging in' });
    }
};
exports.login = login;
const getProfile = async (req, res) => {
    try {
        const user = await User_1.User.findById(req.user?._id)
            .select('-password')
            .populate({
            path: 'projects',
            select: 'title description tags team image',
            options: { limit: 6 }
        })
            .populate({
            path: 'teams',
            select: 'name role members projects',
            options: { limit: 4 }
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // If user is a mentor, include mentoring data
        if (user.role === 'mentor') {
            await user.populate({
                path: 'mentoring',
                select: 'projects students reviews rating',
                options: { limit: 4 }
            });
        }
        res.json(user);
    }
    catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ message: 'Error fetching profile' });
    }
};
exports.getProfile = getProfile;
const updateProfile = async (req, res) => {
    try {
        const updates = updateProfileSchema.parse(req.body);
        const user = await User_1.User.findById(req.user?._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Update user fields
        Object.assign(user, updates);
        await user.save();
        // Return updated user without password
        const updatedUser = await User_1.User.findById(user._id)
            .select('-password')
            .populate({
            path: 'projects',
            select: 'title description tags team image',
            options: { limit: 6 }
        })
            .populate({
            path: 'teams',
            select: 'name role members projects',
            options: { limit: 4 }
        });
        if (user.role === 'mentor') {
            await updatedUser?.populate({
                path: 'mentoring',
                select: 'projects students reviews rating',
                options: { limit: 4 }
            });
        }
        res.json(updatedUser);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ message: error.errors[0].message });
        }
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Error updating profile' });
    }
};
exports.updateProfile = updateProfile;
