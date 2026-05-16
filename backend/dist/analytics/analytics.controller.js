"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActivity = exports.getOverview = void 0;
const db_1 = require("../utils/db");
const getOverview = async (req, res) => {
    try {
        const totalNotes = await db_1.prisma.note.count({ where: { userId: req.user.id } });
        const archivedNotes = await db_1.prisma.note.count({ where: { userId: req.user.id, isArchived: true } });
        const sharedNotes = await db_1.prisma.note.count({ where: { userId: req.user.id, isPublic: true } });
        res.status(200).json({
            overview: {
                totalNotes,
                archivedNotes,
                sharedNotes,
                aiGenerationsCount: 0 // Mocked for now
            }
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getOverview = getOverview;
const getActivity = async (req, res) => {
    try {
        const activities = await db_1.prisma.activityLog.findMany({
            where: { userId: req.user.id },
            orderBy: { createdAt: 'desc' },
            take: 10
        });
        res.status(200).json({ activities });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getActivity = getActivity;
