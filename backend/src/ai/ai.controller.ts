import { Response } from 'express';
import { prisma } from '../utils/db';
import { AuthRequest } from '../middleware/auth';

// Stubbing AI functionality for the moment. 
// A real implementation would use the OpenAI Node.js SDK
export const summarizeNote = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const noteId = req.params.noteId as string;
    const note = await prisma.note.findUnique({ where: { id: noteId } });

    if (!note || note.userId !== req.user!.id) {
      res.status(404).json({ error: 'Note not found' });
      return;
    }

    // Call OpenAI API here using note.content
    const mockSummary = "This is an AI-generated summary of the note.";

    const insight = await prisma.aIInsight.create({
      data: {
        noteId,
        summary: mockSummary,
        provider: 'OpenAI',
      }
    });

    res.status(200).json({ summary: mockSummary, insight });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const extractActionItems = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const noteId = req.params.noteId as string;
    const note = await prisma.note.findUnique({ where: { id: noteId } });

    if (!note || note.userId !== req.user!.id) {
      res.status(404).json({ error: 'Note not found' });
      return;
    }

    // Call OpenAI API here using note.content
    const mockActionItems = JSON.stringify([
      "Design homepage mockups",
      "Review backend APIs"
    ]);

    const insight = await prisma.aIInsight.create({
      data: {
        noteId,
        actionItems: mockActionItems,
        provider: 'OpenAI',
      }
    });

    res.status(200).json({ actionItems: JSON.parse(mockActionItems), insight });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const suggestTitle = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const noteId = req.params.noteId as string;
    const note = await prisma.note.findUnique({ where: { id: noteId } });

    if (!note || note.userId !== req.user!.id) {
      res.status(404).json({ error: 'Note not found' });
      return;
    }

    // Call OpenAI API here using note.content
    const mockTitle = "AI Suggested: Project Planning";

    const insight = await prisma.aIInsight.create({
      data: {
        noteId,
        suggestedTitle: mockTitle,
        provider: 'OpenAI',
      }
    });

    res.status(200).json({ title: mockTitle, insight });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
