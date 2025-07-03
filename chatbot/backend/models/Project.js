const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: String,
  description: String,
  tags: [String],
  domain: String,
});

module.exports = mongoose.model('Project', ProjectSchema);
