import { Router } from 'express';
import { getSharedNote } from './share.controller';

const router = Router();

router.get('/:shareId', getSharedNote);

export default router;
