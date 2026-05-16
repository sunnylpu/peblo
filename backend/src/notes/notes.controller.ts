import { Response } from 'express';
import { z } from 'zod';
import { prisma } from '../utils/db';
import { AuthRequest } from '../middleware/auth';
import { v4 as uuidv4 } from 'uuid';

const createNoteSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

const updateNoteSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export const getNotes = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const notes = await prisma.note.findMany({
      where: { userId: req.user!.id },
      include: { tags: true },
      orderBy: { updatedAt: 'desc' }
    });
    res.status(200).json({ notes });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getNote = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const note = await prisma.note.findUnique({
      where: { id },
      include: { tags: true, aiInsights: true }
    });

    if (!note) {
      res.status(404).json({ error: 'Note not found' });
      return;
    }

    if (note.userId !== req.user!.id && !note.isPublic) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }

    res.status(200).json({ note });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createNote = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = createNoteSchema.parse(req.body);
    const note = await prisma.note.create({
      data: {
        title: data.title || 'Untitled',
        content: data.content || '',
        userId: req.user!.id,
      },
    });

    if (data.tags && data.tags.length > 0) {
      // Tags implementation simplified
    }

    await prisma.activityLog.create({
      data: {
        userId: req.user!.id,
        action: 'CREATE_NOTE',
        entityType: 'NOTE',
        entityId: note.id,
      }
    });

    res.status(201).json({ note });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateNote = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const data = updateNoteSchema.parse(req.body);
    
    const note = await prisma.note.findUnique({ where: { id } });
    if (!note || note.userId !== req.user!.id) {
      res.status(404).json({ error: 'Note not found' });
      return;
    }

    const updatedNote = await prisma.note.update({
      where: { id },
      data: {
        title: data.title,
        content: data.content,
        lastEditedAt: new Date(),
      },
    });

    await prisma.activityLog.create({
      data: {
        userId: req.user!.id,
        action: 'UPDATE_NOTE',
        entityType: 'NOTE',
        entityId: updatedNote.id,
      }
    });

    res.status(200).json({ note: updatedNote });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteNote = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const note = await prisma.note.findUnique({ where: { id } });
    if (!note || note.userId !== req.user!.id) {
      res.status(404).json({ error: 'Note not found' });
      return;
    }

    await prisma.note.delete({ where: { id } });

    await prisma.activityLog.create({
      data: {
        userId: req.user!.id,
        action: 'DELETE_NOTE',
        entityType: 'NOTE',
        entityId: id,
      }
    });

    res.status(200).json({ message: 'Note deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const archiveNote = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { isArchived } = req.body;
    
    const note = await prisma.note.findUnique({ where: { id } });
    if (!note || note.userId !== req.user!.id) {
      res.status(404).json({ error: 'Note not found' });
      return;
    }

    const updatedNote = await prisma.note.update({
      where: { id },
      data: { isArchived },
    });

    await prisma.activityLog.create({
      data: {
        userId: req.user!.id,
        action: 'ARCHIVE_NOTE',
        entityType: 'NOTE',
        entityId: id,
      }
    });

    res.status(200).json({ note: updatedNote });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const shareNote = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { isPublic } = req.body;
    
    const note = await prisma.note.findUnique({ where: { id } });
    if (!note || note.userId !== req.user!.id) {
      res.status(404).json({ error: 'Note not found' });
      return;
    }

    const shareId = isPublic ? (note.shareId || uuidv4()) : null;

    const updatedNote = await prisma.note.update({
      where: { id },
      data: { isPublic, shareId },
    });

    if (isPublic) {
      await prisma.activityLog.create({
        data: {
          userId: req.user!.id,
          action: 'SHARE_NOTE',
          entityType: 'NOTE',
          entityId: id,
        }
      });
    }

    res.status(200).json({ note: updatedNote });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
