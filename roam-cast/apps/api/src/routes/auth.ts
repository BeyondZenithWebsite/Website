import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/db';
import { env } from '../config/env';
import { requireAuth, AuthRequest } from '../middleware/auth';

export const authRouter = Router();

authRouter.post('/login', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'email required' });
  const user = await prisma.user.upsert({ where: { email }, update: {}, create: { email } });
  const token = jwt.sign({ id: user.id, email: user.email }, env.jwtSecret, { expiresIn: '30d' });
  res.json({ token, user });
});

authRouter.post('/logout', (_req, res) => res.json({ ok: true }));

authRouter.get('/me', requireAuth, async (req: AuthRequest, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user!.id }, include: { preferences: true } });
  res.json(user);
});
