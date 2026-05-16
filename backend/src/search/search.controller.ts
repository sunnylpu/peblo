import { Response } from 'express';
import { prisma } from '../utils/db';
import { AuthRequest } from '../middleware/auth';

export const searchNotes = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { query, tags } = req.query;

    const notes = await prisma.note.findMany({
      where: {
        userId: req.user!.id,
        OR: [
          { title: { contains: (query as string) || '', mode: 'insensitive' } },
          { content: { contains: (query as string) || '', mode: 'insensitive' } },
        ],
      },
      include: { tags: true },
    });

    res.status(200).json({ notes });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
