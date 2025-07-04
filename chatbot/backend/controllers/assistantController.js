const projectModel = require('../models/projectModel');
const mentorService = require('../services/mentorService');
const fundingService = require('../services/fundingService');
const notificationService = require('../services/notificationService');
const faqService = require('../services/faqService');

exports.handleUserPrompt = async (prompt, userId) => {
  const lowerPrompt = prompt.toLowerCase();

  // --- FAQ / Support ---
  if (
    lowerPrompt.includes('help') ||
    lowerPrompt.includes('login') ||
    lowerPrompt.includes('upload') ||
    lowerPrompt.includes('faq') ||
    lowerPrompt.includes('support') ||
    lowerPrompt.includes('reset') ||
    lowerPrompt.includes('password') ||
    lowerPrompt.includes('trouble') ||
    lowerPrompt.includes('issue') ||
    lowerPrompt.includes('how to') ||
    lowerPrompt.includes('create a new project')
  ) {
    let topic = 'general';

    if (lowerPrompt.includes('login')) topic = 'login';
    else if (lowerPrompt.includes('upload')) topic = 'upload';
    else if (lowerPrompt.includes('reset') || lowerPrompt.includes('password')) topic = 'password';
    else if (lowerPrompt.includes('project')) topic = 'project';

    const faq = await faqService.getFAQ(topic);
    return {
      type: 'faq',
      message: faq?.answer || '❓ I couldn’t find help for that topic.',
    };
  }

  // --- Project Matching ---
  if (
    lowerPrompt.includes('project') ||
    lowerPrompt.includes('team') ||
    lowerPrompt.includes('collaboration')
  ) {
    const keywords = ['ai', 'ml', 'web', 'healthcare', 'blockchain', 'data'];
    const foundKeyword = keywords.find((kw) => lowerPrompt.includes(kw));
    const query = foundKeyword
      ? {
          $or: [
            { domain: { $regex: foundKeyword, $options: 'i' } },
            { tags: { $regex: foundKeyword, $options: 'i' } }
          ]
        }
      : {};

    const projects = await projectModel.find(query).limit(5);
    if (projects.length === 0) {
      return {
        type: 'project',
        message: '📁 No matching projects found.',
      };
    }

    return {
      type: 'project',
      projects,
      message: `📂 Found ${projects.length} project(s) for your interest.`,
    };
  }

  // --- Mentor Matching ---
  if (
    lowerPrompt.includes('mentor') ||
    lowerPrompt.includes('book') ||
    lowerPrompt.includes('guidance') ||
    lowerPrompt.includes('session')
  ) {
    const domainKeywords = ['ml', 'ai', 'robotics', 'data', 'web'];
    const domain = domainKeywords.find((kw) => lowerPrompt.includes(kw)) || 'ML';
    const mentors = await mentorService.getAvailableMentors(domain);

    if (!mentors || mentors.length === 0) {
      return {
        type: 'mentor',
        message: '🧑‍🏫 No mentors available in that domain currently.',
      };
    }

    return {
      type: 'mentor',
      mentors,
      message: `🧑‍🏫 Found ${mentors.length} mentor(s) available for guidance.`,
    };
  }

  // --- Funding / Grants ---
  if (
    lowerPrompt.includes('funding') ||
    lowerPrompt.includes('grant') ||
    lowerPrompt.includes('sponsor') ||
    lowerPrompt.includes('money')
  ) {
    const grants = await fundingService.getOpenGrants();

    if (!grants || grants.length === 0) {
      return {
        type: 'funding',
        message: '💸 No funding opportunities are currently open.',
      };
    }

    return {
      type: 'funding',
      grants,
      message: `💰 Found ${grants.length} funding opportunity(ies).`,
    };
  }

  // --- Notifications / Invites ---
  if (
    lowerPrompt.includes('invite') ||
    lowerPrompt.includes('pending') ||
    lowerPrompt.includes('request')
  ) {
    const invites = await notificationService.getPendingInvites(userId);

    if (!invites || invites.length === 0) {
      return {
        type: 'notification',
        message: '📭 You have no pending invites or requests.',
      };
    }

    return {
      type: 'notification',
      invites,
      message: `📬 You have ${invites.length} pending invite(s).`,
    };
  }

  // --- Fallback ---
  return {
    type: 'default',
    message: "🤖 Sorry, I didn't understand that. Try asking about projects, mentors, funding, or help.",
  };
};
