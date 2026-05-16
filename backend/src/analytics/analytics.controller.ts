import { Response } from 'express';
import { prisma } from '../utils/db';
import { AuthRequest } from '../middleware/auth';

export const getOverview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const totalNotes = await prisma.note.count({ where: { userId: req.user!.id } });
    const archivedNotes = await prisma.note.count({ where: { userId: req.user!.id, isArchived: true } });
    const sharedNotes = await prisma.note.count({ where: { userId: req.user!.id, isPublic: true } });

    res.status(200).json({
      overview: {
        totalNotes,
        archivedNotes,
        sharedNotes,
        aiGenerationsCount: 0 // Mocked for now
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getActivity = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const activities = await prisma.activityLog.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    res.status(200).json({ activities });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
