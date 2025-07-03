const mongoose = require('mongoose');
const Project = require('./models/Project');

mongoose.connect('mongodb://localhost:27017/procollab')
  .then(async () => {
    await Project.deleteMany();
    await Project.insertMany([
      {
        title: 'AI in Healthcare',
        description: 'Building diagnostic tools with machine learning',
        tags: ['AI', 'ML', 'Healthcare'],
        domain: 'Healthcare'
      },
      {
        title: 'Blockchain Voting System',
        description: 'Secure decentralized voting',
        tags: ['Blockchain', 'Security'],
        domain: 'CivicTech'
      }
    ]);
    console.log('Sample data inserted');
    process.exit();
  });
