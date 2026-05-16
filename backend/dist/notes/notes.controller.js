"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shareNote = exports.archiveNote = exports.deleteNote = exports.updateNote = exports.createNote = exports.getNote = exports.getNotes = void 0;
const zod_1 = require("zod");
const db_1 = require("../utils/db");
const uuid_1 = require("uuid");
const createNoteSchema = zod_1.z.object({
    title: zod_1.z.string().optional(),
    content: zod_1.z.string().optional(),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
});
const updateNoteSchema = zod_1.z.object({
    title: zod_1.z.string().optional(),
    content: zod_1.z.string().optional(),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
});
const getNotes = async (req, res) => {
    try {
        const notes = await db_1.prisma.note.findMany({
            where: { userId: req.user.id },
            include: { tags: true },
            orderBy: { updatedAt: 'desc' }
        });
        res.status(200).json({ notes });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getNotes = getNotes;
const getNote = async (req, res) => {
    try {
        const id = req.params.id;
        const note = await db_1.prisma.note.findUnique({
            where: { id },
            include: { tags: true, aiInsights: true }
        });
        if (!note) {
            res.status(404).json({ error: 'Note not found' });
            return;
        }
        if (note.userId !== req.user.id && !note.isPublic) {
            res.status(403).json({ error: 'Forbidden' });
            return;
        }
        res.status(200).json({ note });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getNote = getNote;
const createNote = async (req, res) => {
    try {
        const data = createNoteSchema.parse(req.body);
        const note = await db_1.prisma.note.create({
            data: {
                title: data.title || 'Untitled',
                content: data.content || '',
                userId: req.user.id,
            },
        });
        if (data.tags && data.tags.length > 0) {
            // Tags implementation simplified
        }
        await db_1.prisma.activityLog.create({
            data: {
                userId: req.user.id,
                action: 'CREATE_NOTE',
                entityType: 'NOTE',
                entityId: note.id,
            }
        });
        res.status(201).json({ note });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.createNote = createNote;
const updateNote = async (req, res) => {
    try {
        const id = req.params.id;
        const data = updateNoteSchema.parse(req.body);
        const note = await db_1.prisma.note.findUnique({ where: { id } });
        if (!note || note.userId !== req.user.id) {
            res.status(404).json({ error: 'Note not found' });
            return;
        }
        const updatedNote = await db_1.prisma.note.update({
            where: { id },
            data: {
                title: data.title,
                content: data.content,
                lastEditedAt: new Date(),
            },
        });
        await db_1.prisma.activityLog.create({
            data: {
                userId: req.user.id,
                action: 'UPDATE_NOTE',
                entityType: 'NOTE',
                entityId: updatedNote.id,
            }
        });
        res.status(200).json({ note: updatedNote });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.updateNote = updateNote;
const deleteNote = async (req, res) => {
    try {
        const id = req.params.id;
        const note = await db_1.prisma.note.findUnique({ where: { id } });
        if (!note || note.userId !== req.user.id) {
            res.status(404).json({ error: 'Note not found' });
            return;
        }
        await db_1.prisma.note.delete({ where: { id } });
        await db_1.prisma.activityLog.create({
            data: {
                userId: req.user.id,
                action: 'DELETE_NOTE',
                entityType: 'NOTE',
                entityId: id,
            }
        });
        res.status(200).json({ message: 'Note deleted' });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.deleteNote = deleteNote;
const archiveNote = async (req, res) => {
    try {
        const id = req.params.id;
        const { isArchived } = req.body;
        const note = await db_1.prisma.note.findUnique({ where: { id } });
        if (!note || note.userId !== req.user.id) {
            res.status(404).json({ error: 'Note not found' });
            return;
        }
        const updatedNote = await db_1.prisma.note.update({
            where: { id },
            data: { isArchived },
        });
        await db_1.prisma.activityLog.create({
            data: {
                userId: req.user.id,
                action: 'ARCHIVE_NOTE',
                entityType: 'NOTE',
                entityId: id,
            }
        });
        res.status(200).json({ note: updatedNote });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.archiveNote = archiveNote;
const shareNote = async (req, res) => {
    try {
        const id = req.params.id;
        const { isPublic } = req.body;
        const note = await db_1.prisma.note.findUnique({ where: { id } });
        if (!note || note.userId !== req.user.id) {
            res.status(404).json({ error: 'Note not found' });
            return;
        }
        const shareId = isPublic ? (note.shareId || (0, uuid_1.v4)()) : null;
        const updatedNote = await db_1.prisma.note.update({
            where: { id },
            data: { isPublic, shareId },
        });
        if (isPublic) {
            await db_1.prisma.activityLog.create({
                data: {
                    userId: req.user.id,
                    action: 'SHARE_NOTE',
                    entityType: 'NOTE',
                    entityId: id,
                }
            });
        }
        res.status(200).json({ note: updatedNote });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.shareNote = shareNote;
