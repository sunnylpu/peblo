"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.suggestTitle = exports.extractActionItems = exports.summarizeNote = void 0;
const db_1 = require("../utils/db");
// Stubbing AI functionality for the moment. 
// A real implementation would use the OpenAI Node.js SDK
const summarizeNote = async (req, res) => {
    try {
        const noteId = req.params.noteId;
        const note = await db_1.prisma.note.findUnique({ where: { id: noteId } });
        if (!note || note.userId !== req.user.id) {
            res.status(404).json({ error: 'Note not found' });
            return;
        }
        // Call OpenAI API here using note.content
        const mockSummary = "This is an AI-generated summary of the note.";
        const insight = await db_1.prisma.aIInsight.create({
            data: {
                noteId,
                summary: mockSummary,
                provider: 'OpenAI',
            }
        });
        res.status(200).json({ summary: mockSummary, insight });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.summarizeNote = summarizeNote;
const extractActionItems = async (req, res) => {
    try {
        const noteId = req.params.noteId;
        const note = await db_1.prisma.note.findUnique({ where: { id: noteId } });
        if (!note || note.userId !== req.user.id) {
            res.status(404).json({ error: 'Note not found' });
            return;
        }
        // Call OpenAI API here using note.content
        const mockActionItems = JSON.stringify([
            "Design homepage mockups",
            "Review backend APIs"
        ]);
        const insight = await db_1.prisma.aIInsight.create({
            data: {
                noteId,
                actionItems: mockActionItems,
                provider: 'OpenAI',
            }
        });
        res.status(200).json({ actionItems: JSON.parse(mockActionItems), insight });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.extractActionItems = extractActionItems;
const suggestTitle = async (req, res) => {
    try {
        const noteId = req.params.noteId;
        const note = await db_1.prisma.note.findUnique({ where: { id: noteId } });
        if (!note || note.userId !== req.user.id) {
            res.status(404).json({ error: 'Note not found' });
            return;
        }
        // Call OpenAI API here using note.content
        const mockTitle = "AI Suggested: Project Planning";
        const insight = await db_1.prisma.aIInsight.create({
            data: {
                noteId,
                suggestedTitle: mockTitle,
                provider: 'OpenAI',
            }
        });
        res.status(200).json({ title: mockTitle, insight });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.suggestTitle = suggestTitle;
