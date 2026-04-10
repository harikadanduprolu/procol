import express from 'express';
import { auth } from '../middleware/auth';
import { summarizeTasks } from '../services/aiService';

const router = express.Router();

router.post('/summarize', auth, async (req, res) => {
  try {
    const { tasks } = req.body;
    const userId = req.user?._id?.toString();

    if (!Array.isArray(tasks) || tasks.length === 0) {
      return res.status(400).json({ error: 'tasks must be a non-empty array' });
    }

    const normalizedTasks = tasks
      .map((task) => String(task).trim())
      .filter(Boolean);

    if (normalizedTasks.length === 0) {
      return res.status(400).json({ error: 'tasks must contain at least one valid string' });
    }

    const result = await summarizeTasks(normalizedTasks, userId || 'default');

    res.json({ success: true, data: result });
  } catch (error) {
    console.error('AI summarize failed:', error);
    res.status(500).json({ error: 'AI failed' });
  }
});

export default router;
