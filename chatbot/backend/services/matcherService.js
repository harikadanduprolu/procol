// services/projectMatcher.js

const Project = require('../models/Project');
const { calculateSimilarity } = require('../utils/similarity');

exports.getMatchingProjects = async (skills = [], interests = [], domain = '') => {
  // Fetch all projects from the DB
  const projects = await Project.find();

  // Combine user input into one array for matching
  const userVector = [...skills, ...interests, domain.toLowerCase()];

  // Calculate similarity score between userVector and each project's tags + domain
  const scoredProjects = projects.map((project) => {
    const projectVector = [...(project.tags || []), project.domain?.toLowerCase() || ''];
    const score = calculateSimilarity(userVector, projectVector);
    return { project, score };
  });

  // Return top 3 most relevant
  return scoredProjects
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
};
