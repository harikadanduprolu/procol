import express from 'express';
import { getAllMentors } from '../controllers/mentor';

const router = express.Router();

router.get('/', getAllMentors);

export default router;