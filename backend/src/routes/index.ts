import { Router } from 'express';
import authRoutes from '../auth/auth.routes';
import notesRoutes from '../notes/notes.routes';
import aiRoutes from '../ai/ai.routes';
import searchRoutes from '../search/search.routes';
import analyticsRoutes from '../analytics/analytics.routes';
import shareRoutes from '../share/share.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/notes', notesRoutes);
router.use('/ai', aiRoutes);
router.use('/search', searchRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/notes/shared', shareRoutes);

export default router;
