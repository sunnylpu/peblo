import { Router } from 'express';
import { getNotes, getNote, createNote, updateNote, deleteNote, archiveNote, shareNote } from './notes.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', getNotes);
router.post('/', createNote);
router.get('/:id', getNote);
router.patch('/:id', updateNote);
router.delete('/:id', deleteNote);
router.patch('/:id/archive', archiveNote);
router.patch('/:id/share', shareNote);

export default router;
