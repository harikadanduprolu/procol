import express from 'express';
import { auth } from '../middleware/auth';
import { AISummaryError, summarizeTasks } from '../services/aiService';

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
  } catch (error: any) {
    console.error('AI summarize failed:', error);

    if (error instanceof AISummaryError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    const fallbackMessage = error?.message || 'AI failed';
    return res.status(500).json({ error: fallbackMessage });
  }
});

export default router;
