import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../utils/db';
import { AuthRequest } from '../middleware/auth';

const signupSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8)
    .regex(/[A-Z]/, 'One uppercase required')
    .regex(/[a-z]/, 'One lowercase required')
    .regex(/[0-9]/, 'One number required')
    .regex(/[^A-Za-z0-9]/, 'One special character required')
});

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = signupSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) {
      res.status(400).json({ error: 'Email already in use' });
      return;
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
      },
    });

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET as string, {
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
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: (error as z.ZodError).issues });
      return;
    }
    console.error("Signup error:", error);
    require('fs').writeFileSync('signup-error.log', JSON.stringify({ message: (error as any).message, code: (error as any).code, meta: (error as any).meta, stack: (error as any).stack }, null, 2));
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET as string, {
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
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Logged out successfully' });
};

export const me = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user?.id },
      select: { id: true, name: true, email: true, avatar: true, createdAt: true }
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
