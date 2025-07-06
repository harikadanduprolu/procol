const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const assistantRoutes = require('./routes/assistantRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/assistant', assistantRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error('❌ Mongo Error:', err));

module.exports = app;
