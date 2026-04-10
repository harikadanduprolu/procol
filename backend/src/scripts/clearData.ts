import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Message } from '../models/Message';
import { Notification } from '../models/Notification';
import { User } from '../models/User';
import { Project } from '../models/Project';
import { Team } from '../models/Team';
import { Mentor } from '../models/Mentor';
import { Funding } from '../models/Funding';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/projecthub';
const CLEAR_SCOPE = process.argv.includes('--all')
  ? 'all'
  : (process.env.CLEAR_SCOPE || 'chat').toLowerCase();

async function clearChatData() {
  const [messageResult, notificationResult] = await Promise.all([
    Message.deleteMany({}),
    Notification.deleteMany({ type: 'message' })
  ]);

  console.log(`Deleted ${messageResult.deletedCount || 0} messages`);
  console.log(`Deleted ${notificationResult.deletedCount || 0} message notifications`);
}

async function clearAllData() {
  const [
    users,
    projects,
    teams,
    mentors,
    funding,
    messages,
    notifications
  ] = await Promise.all([
    User.deleteMany({}),
    Project.deleteMany({}),
    Team.deleteMany({}),
    Mentor.deleteMany({}),
    Funding.deleteMany({}),
    Message.deleteMany({}),
    Notification.deleteMany({})
  ]);

  console.log(`Deleted ${users.deletedCount || 0} users`);
  console.log(`Deleted ${projects.deletedCount || 0} projects`);
  console.log(`Deleted ${teams.deletedCount || 0} teams`);
  console.log(`Deleted ${mentors.deletedCount || 0} mentors`);
  console.log(`Deleted ${funding.deletedCount || 0} funding records`);
  console.log(`Deleted ${messages.deletedCount || 0} messages`);
  console.log(`Deleted ${notifications.deletedCount || 0} notifications`);
}

async function run() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    if (CLEAR_SCOPE === 'all') {
      console.log('Clearing full database...');
      await clearAllData();
    } else {
      console.log('Clearing chat-related data...');
      await clearChatData();
    }

    console.log('Data clear completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Failed to clear data:', error);
    process.exit(1);
  }
}

run();
