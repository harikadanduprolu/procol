"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllMentors = void 0;
const Mentor_1 = require("../models/Mentor");
const getAllMentors = async (req, res) => {
    try {
        const mentors = await Mentor_1.Mentor.find().populate('user');
        res.json(mentors);
    }
    catch (err) {
        res.status(500).json({ message: 'Failed to fetch mentors' });
    }
};
exports.getAllMentors = getAllMentors;
