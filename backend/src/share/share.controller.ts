import { Request, Response } from 'express';
import { prisma } from '../utils/db';

export const getSharedNote = async (req: Request, res: Response): Promise<void> => {
  try {
    const shareId = req.params.shareId as string;
    const note = await prisma.note.findUnique({
      where: { shareId }
    });

    if (!note || !note.isPublic) {
      res.status(404).json({ error: 'Note not found or is not public' });
      return;
    }

    res.status(200).json({ note });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
