// routes/assistantRoutes.js

const express = require('express');
const router = express.Router();
const assistantController = require('../controllers/assistantController');

// POST /api/assistant
router.post('/', async (req, res) => {
  console.log("📥 Assistant route hit:", req.body);

  const { prompt, userId } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required.' });
  }

  try {
    const response = await assistantController.handleUserPrompt(prompt, userId || 'anonymous');
    res.json(response);
  } catch (error) {
    console.error('❌ Assistant error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
