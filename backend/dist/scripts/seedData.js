"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const User_1 = require("../models/User");
const Project_1 = require("../models/Project");
const Team_1 = require("../models/Team");
const Mentor_1 = require("../models/Mentor");
const Funding_1 = require("../models/Funding");
const Message_1 = require("../models/Message");
const Notification_1 = require("../models/Notification");
dotenv_1.default.config();
// Use the connection string from .env or the provided one
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://harikadanduprolu740:abcdefg@cluster0.7gmipqi.mongodb.net/projecthub_test?retryWrites=true&w=majority&appName=Cluster0';
async function seedDatabase() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose_1.default.connect(MONGODB_URI);
        console.log('Connected to MongoDB');
        // Clear existing data
        console.log('Clearing existing data...');
        await User_1.User.deleteMany({});
        await Project_1.Project.deleteMany({});
        await Team_1.Team.deleteMany({});
        await Mentor_1.Mentor.deleteMany({});
        await Funding_1.Funding.deleteMany({});
        await Message_1.Message.deleteMany({});
        await Notification_1.Notification.deleteMany({});
        console.log('Existing data cleared');
        // Create users
        console.log('Creating users...');
        const users = await User_1.User.create([
            {
                name: 'John Doe',
                email: 'john@example.com',
                password: '$2a$10$XOPbrlUPQdwdJUpSrIF6X.LbE14qsMmKGhM1A8W9iqDu0.i9ZwPTi', // password: password123
                role: 'user',
                avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
                bio: 'Full-stack developer with 5 years of experience',
                skills: ['React', 'Node.js', 'MongoDB', 'TypeScript'],
                github: 'https://github.com/johndoe',
                linkedin: 'https://linkedin.com/in/johndoe',
                website: 'https://johndoe.dev'
            },
            {
                name: 'Jane Smith',
                email: 'jane@example.com',
                password: '$2a$10$XOPbrlUPQdwdJUpSrIF6X.LbE14qsMmKGhM1A8W9iqDu0.i9ZwPTi', // password: password123
                role: 'user',
                avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
                bio: 'UI/UX designer passionate about creating beautiful interfaces',
                skills: ['Figma', 'Adobe XD', 'UI Design', 'Prototyping'],
                github: 'https://github.com/janesmith',
                linkedin: 'https://linkedin.com/in/janesmith',
                website: 'https://janesmith.design'
            },
            {
                name: 'Alex Johnson',
                email: 'alex@example.com',
                password: '$2a$10$XOPbrlUPQdwdJUpSrIF6X.LbE14qsMmKGhM1A8W9iqDu0.i9ZwPTi', // password: password123
                role: 'user',
                avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
                bio: 'Backend developer specializing in scalable systems',
                skills: ['Python', 'Django', 'PostgreSQL', 'AWS'],
                github: 'https://github.com/alexjohnson',
                linkedin: 'https://linkedin.com/in/alexjohnson',
                website: 'https://alexjohnson.dev'
            },
            {
                name: 'Sarah Williams',
                email: 'sarah@example.com',
                password: '$2a$10$XOPbrlUPQdwdJUpSrIF6X.LbE14qsMmKGhM1A8W9iqDu0.i9ZwPTi', // password: password123
                role: 'user',
                avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
                bio: 'Mobile app developer with a focus on Flutter',
                skills: ['Flutter', 'Dart', 'Firebase', 'iOS', 'Android'],
                github: 'https://github.com/sarahwilliams',
                linkedin: 'https://linkedin.com/in/sarahwilliams',
                website: 'https://sarahwilliams.dev'
            },
            {
                name: 'Michael Brown',
                email: 'michael@example.com',
                password: '$2a$10$XOPbrlUPQdwdJUpSrIF6X.LbE14qsMmKGhM1A8W9iqDu0.i9ZwPTi', // password: password123
                role: 'user',
                avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
                bio: 'DevOps engineer with expertise in CI/CD pipelines',
                skills: ['Docker', 'Kubernetes', 'Jenkins', 'Terraform'],
                github: 'https://github.com/michaelbrown',
                linkedin: 'https://linkedin.com/in/michaelbrown',
                website: 'https://michaelbrown.dev'
            },
            {
                name: 'Emily Davis',
                email: 'emily@example.com',
                password: '$2a$10$XOPbrlUPQdwdJUpSrIF6X.LbE14qsMmKGhM1A8W9iqDu0.i9ZwPTi', // password: password123
                role: 'mentor',
                avatar: 'https://randomuser.me/api/portraits/women/6.jpg',
                bio: 'Senior software architect with 10+ years of experience',
                skills: ['System Design', 'Microservices', 'Cloud Architecture', 'Java'],
                github: 'https://github.com/emilydavis',
                linkedin: 'https://linkedin.com/in/emilydavis',
                website: 'https://emilydavis.dev'
            },
            {
                name: 'David Wilson',
                email: 'david@example.com',
                password: '$2a$10$XOPbrlUPQdwdJUpSrIF6X.LbE14qsMmKGhM1A8W9iqDu0.i9ZwPTi', // password: password123
                role: 'mentor',
                avatar: 'https://randomuser.me/api/portraits/men/7.jpg',
                bio: 'AI/ML expert with a focus on computer vision',
                skills: ['TensorFlow', 'PyTorch', 'Computer Vision', 'Python'],
                github: 'https://github.com/davidwilson',
                linkedin: 'https://linkedin.com/in/davidwilson',
                website: 'https://davidwilson.dev'
            },
            {
                name: 'Admin User',
                email: 'admin@example.com',
                password: '$2a$10$XOPbrlUPQdwdJUpSrIF6X.LbE14qsMmKGhM1A8W9iqDu0.i9ZwPTi', // password: password123
                role: 'admin',
                avatar: 'https://randomuser.me/api/portraits/men/8.jpg',
                bio: 'System administrator for ProjectHub',
                skills: ['Administration', 'Security', 'Monitoring'],
                github: 'https://github.com/admin',
                linkedin: 'https://linkedin.com/in/admin',
                website: 'https://projecthub.com'
            }
        ]);
        console.log(`${users.length} users created`);
        // Create mentors
        console.log('Creating mentors...');
        const mentors = await Mentor_1.Mentor.create([
            {
                user: users[5]._id, // Emily Davis
                expertise: ['Web Development', 'React', 'Node.js', 'System Design'],
                availability: 'Weekdays, 6-9 PM EST',
                hourlyRate: 50,
                rating: 4.8,
                reviews: [
                    {
                        user: users[0]._id, // John Doe
                        rating: 5,
                        comment: 'Emily is an excellent mentor. She helped me improve my system design skills significantly.'
                    },
                    {
                        user: users[1]._id, // Jane Smith
                        rating: 4.5,
                        comment: 'Great mentor with deep knowledge of web development.'
                    }
                ]
            },
            {
                user: users[6]._id, // David Wilson
                expertise: ['AI/ML', 'Computer Vision', 'Python', 'TensorFlow'],
                availability: 'Weekends, 10 AM - 4 PM EST',
                hourlyRate: 60,
                rating: 4.9,
                reviews: [
                    {
                        user: users[2]._id, // Alex Johnson
                        rating: 5,
                        comment: 'David helped me understand complex AI concepts that I was struggling with.'
                    }
                ]
            }
        ]);
        console.log(`${mentors.length} mentors created`);
        // Create projects
        console.log('Creating projects...');
        const projects = await Project_1.Project.create([
            {
                title: 'E-commerce Platform',
                description: 'A full-featured e-commerce platform with product management, shopping cart, and payment integration.',
                category: 'Web Development',
                tags: ['React', 'Node.js', 'MongoDB', 'Stripe'],
                owner: users[0]._id, // John Doe
                team: [users[0]._id, users[1]._id], // John Doe, Jane Smith
                mentors: [mentors[0]._id], // Emily Davis
                status: 'in-progress',
                githubUrl: 'https://github.com/johndoe/ecommerce-platform',
                demoUrl: 'https://ecommerce-demo.example.com',
                fundingGoal: 5000,
                currentFunding: 2500,
                deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
                createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
                updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
            },
            {
                title: 'Mobile Fitness App',
                description: 'A fitness tracking app that helps users monitor their workouts, set goals, and track progress.',
                category: 'Mobile Development',
                tags: ['Flutter', 'Firebase', 'Google Fit API'],
                owner: users[3]._id, // Sarah Williams
                team: [users[3]._id, users[2]._id], // Sarah Williams, Alex Johnson
                mentors: [mentors[1]._id], // David Wilson
                status: 'planning',
                githubUrl: 'https://github.com/sarahwilliams/fitness-app',
                demoUrl: 'https://fitness-app-demo.example.com',
                fundingGoal: 3000,
                currentFunding: 500,
                deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
                createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
                updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
            },
            {
                title: 'AI-Powered Content Generator',
                description: 'A tool that uses AI to generate high-quality content for blogs, social media, and marketing materials.',
                category: 'AI/ML',
                tags: ['Python', 'TensorFlow', 'NLP', 'OpenAI API'],
                owner: users[2]._id, // Alex Johnson
                team: [users[2]._id, users[4]._id], // Alex Johnson, Michael Brown
                mentors: [mentors[1]._id], // David Wilson
                status: 'completed',
                githubUrl: 'https://github.com/alexjohnson/ai-content-generator',
                demoUrl: 'https://ai-content-generator.example.com',
                fundingGoal: 8000,
                currentFunding: 8000,
                deadline: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
                createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
                updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) // 10 days ago
            }
        ]);
        console.log(`${projects.length} projects created`);
        // Create teams
        console.log('Creating teams...');
        const teams = await Team_1.Team.create([
            {
                name: 'Web Dev Squad',
                description: 'A team of web developers working on various web projects.',
                leader: users[0]._id, // John Doe
                members: [users[0]._id, users[1]._id, users[2]._id], // John Doe, Jane Smith, Alex Johnson
                projects: [projects[0]._id], // E-commerce Platform
                skills: ['React', 'Node.js', 'MongoDB', 'TypeScript', 'UI/UX'],
                avatar: 'https://randomuser.me/api/portraits/lego/1.jpg',
                createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
                updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
            },
            {
                name: 'Mobile App Team',
                description: 'A team focused on developing mobile applications.',
                leader: users[3]._id, // Sarah Williams
                members: [users[3]._id, users[4]._id], // Sarah Williams, Michael Brown
                projects: [projects[1]._id], // Mobile Fitness App
                skills: ['Flutter', 'Dart', 'Firebase', 'iOS', 'Android'],
                avatar: 'https://randomuser.me/api/portraits/lego/2.jpg',
                createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 20 days ago
                updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
            }
        ]);
        console.log(`${teams.length} teams created`);
        // Create funding campaigns
        console.log('Creating funding campaigns...');
        const fundings = await Funding_1.Funding.create([
            {
                title: 'E-commerce Platform Funding',
                description: 'Help us build a full-featured e-commerce platform with modern technologies.',
                project: projects[0]._id, // E-commerce Platform
                creator: users[0]._id, // John Doe
                goal: 5000,
                currentAmount: 2500,
                deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
                status: 'active',
                rewards: [
                    {
                        tier: 'Basic',
                        amount: 25,
                        description: 'Your name in the contributors section'
                    },
                    {
                        tier: 'Premium',
                        amount: 100,
                        description: 'Your name in the contributors section + early access to the platform'
                    }
                ],
                backers: [
                    {
                        user: users[1]._id, // Jane Smith
                        amount: 100,
                        rewardTier: 'Premium',
                        date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) // 10 days ago
                    },
                    {
                        user: users[2]._id, // Alex Johnson
                        amount: 50,
                        rewardTier: 'Basic',
                        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
                    }
                ],
                createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 20 days ago
                updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
            },
            {
                title: 'Mobile Fitness App Funding',
                description: 'Support the development of a fitness tracking app that will help people achieve their fitness goals.',
                project: projects[1]._id, // Mobile Fitness App
                creator: users[3]._id, // Sarah Williams
                goal: 3000,
                currentAmount: 500,
                deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
                status: 'active',
                rewards: [
                    {
                        tier: 'Basic',
                        amount: 20,
                        description: 'Your name in the app credits'
                    },
                    {
                        tier: 'Premium',
                        amount: 50,
                        description: 'Your name in the app credits + 1 year of premium features'
                    }
                ],
                backers: [
                    {
                        user: users[4]._id, // Michael Brown
                        amount: 50,
                        rewardTier: 'Premium',
                        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
                    }
                ],
                createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
                updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
            }
        ]);
        console.log(`${fundings.length} funding campaigns created`);
        // Create messages
        console.log('Creating messages...');
        const messages = await Message_1.Message.create([
            {
                sender: users[0]._id, // John Doe
                recipient: users[1]._id, // Jane Smith
                content: 'Hey Jane, would you like to collaborate on the e-commerce project?',
                read: true,
                createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) // 14 days ago
            },
            {
                sender: users[1]._id, // Jane Smith
                recipient: users[0]._id, // John Doe
                content: 'Hi John! Yes, I\'d love to collaborate. I can help with the UI/UX design.',
                read: true,
                createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) // 14 days ago
            },
            {
                sender: users[0]._id, // John Doe
                recipient: users[1]._id, // Jane Smith
                content: 'Great! I\'ll add you to the project team.',
                read: true,
                createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) // 14 days ago
            },
            {
                sender: users[3]._id, // Sarah Williams
                recipient: users[2]._id, // Alex Johnson
                content: 'Alex, I\'m working on a fitness app and could use your backend expertise. Interested?',
                read: false,
                createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
            }
        ]);
        console.log(`${messages.length} messages created`);
        // Create notifications
        console.log('Creating notifications...');
        const notifications = await Notification_1.Notification.create([
            {
                recipient: users[0]._id, // John Doe
                title: 'New Team Member',
                content: 'Jane Smith has joined your project team.',
                type: 'team',
                read: true,
                relatedUser: users[1]._id, // Jane Smith
                createdAt: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000) // 13 days ago
            },
            {
                recipient: users[0]._id, // John Doe
                title: 'New Backer',
                content: 'Alex Johnson has backed your project with $50.',
                type: 'funding',
                read: true,
                relatedUser: users[2]._id, // Alex Johnson
                relatedFunding: fundings[0]._id, // E-commerce Platform Funding
                createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
            },
            {
                recipient: users[1]._id, // Jane Smith
                title: 'Project Update',
                content: 'The e-commerce project has been updated.',
                type: 'project',
                read: false,
                relatedProject: projects[0]._id, // E-commerce Platform
                createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
            },
            {
                recipient: users[3]._id, // Sarah Williams
                title: 'New Message',
                content: 'You have a new message from Alex Johnson.',
                type: 'message',
                read: false,
                relatedUser: users[2]._id, // Alex Johnson
                createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
            }
        ]);
        console.log(`${notifications.length} notifications created`);
        console.log('Database seeded successfully!');
        process.exit(0);
    }
    catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}
seedDatabase();
