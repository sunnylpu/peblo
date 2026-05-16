import { Router } from 'express';
import { searchNotes } from './search.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);
router.get('/', searchNotes);

export default router;
