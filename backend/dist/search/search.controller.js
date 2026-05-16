"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchNotes = void 0;
const db_1 = require("../utils/db");
const searchNotes = async (req, res) => {
    try {
        const { query, tags } = req.query;
        const notes = await db_1.prisma.note.findMany({
            where: {
                userId: req.user.id,
                OR: [
                    { title: { contains: query || '', mode: 'insensitive' } },
                    { content: { contains: query || '', mode: 'insensitive' } },
                ],
            },
            include: { tags: true },
        });
        res.status(200).json({ notes });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.searchNotes = searchNotes;
