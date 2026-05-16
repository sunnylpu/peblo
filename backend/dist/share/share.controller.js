"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSharedNote = void 0;
const db_1 = require("../utils/db");
const getSharedNote = async (req, res) => {
    try {
        const shareId = req.params.shareId;
        const note = await db_1.prisma.note.findUnique({
            where: { shareId }
        });
        if (!note || !note.isPublic) {
            res.status(404).json({ error: 'Note not found or is not public' });
            return;
        }
        res.status(200).json({ note });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getSharedNote = getSharedNote;
