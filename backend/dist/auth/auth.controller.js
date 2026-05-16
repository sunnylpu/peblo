"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.me = exports.logout = exports.login = exports.signup = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = require("zod");
const db_1 = require("../utils/db");
const signupSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8)
        .regex(/[A-Z]/, 'One uppercase required')
        .regex(/[a-z]/, 'One lowercase required')
        .regex(/[0-9]/, 'One number required')
        .regex(/[^A-Za-z0-9]/, 'One special character required')
});
const signup = async (req, res) => {
    try {
        const data = signupSchema.parse(req.body);
        const existingUser = await db_1.prisma.user.findUnique({ where: { email: data.email } });
        if (existingUser) {
            res.status(400).json({ error: 'Email already in use' });
            return;
        }
        const hashedPassword = await bcrypt_1.default.hash(data.password, 10);
        const user = await db_1.prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: hashedPassword,
            },
        });
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
            expiresIn: '7d',
        });
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        res.status(201).json({
            user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar },
            token
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({ error: error.issues });
            return;
        }
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.signup = signup;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await db_1.prisma.user.findUnique({ where: { email } });
        if (!user) {
            res.status(401).json({ error: 'Invalid email or password' });
            return;
        }
        const isValidPassword = await bcrypt_1.default.compare(password, user.password);
        if (!isValidPassword) {
            res.status(401).json({ error: 'Invalid email or password' });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
            expiresIn: '7d',
        });
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.status(200).json({
            user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar },
            token
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.login = login;
const logout = async (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logged out successfully' });
};
exports.logout = logout;
const me = async (req, res) => {
    try {
        const user = await db_1.prisma.user.findUnique({
            where: { id: req.user?.id },
            select: { id: true, name: true, email: true, avatar: true, createdAt: true }
        });
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        res.status(200).json({ user });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.me = me;
