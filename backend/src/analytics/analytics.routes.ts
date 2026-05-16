import { Router } from 'express';
import { getOverview, getActivity } from './analytics.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/overview', getOverview);
router.get('/activity', getActivity);

export default router;
