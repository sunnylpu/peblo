import { Router } from 'express';
import { summarizeNote, extractActionItems, suggestTitle } from './ai.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.post('/summarize/:noteId', summarizeNote);
router.post('/action-items/:noteId', extractActionItems);
router.post('/title/:noteId', suggestTitle);

export default router;
