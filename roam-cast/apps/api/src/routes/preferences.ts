import { Category } from '@prisma/client';
import { Router } from 'express';
import { prisma } from '../config/db';
import { requireAuth, AuthRequest } from '../middleware/auth';

export const prefRouter = Router();

prefRouter.get('/me/preferences', requireAuth, async (req: AuthRequest, res) => {
  const prefs = await prisma.userPreference.findMany({ where: { userId: req.user!.id } });
  res.json(prefs);
});

prefRouter.patch('/me/preferences', requireAuth, async (req: AuthRequest, res) => {
  const { categories } = req.body as { categories: Category[] };
  await prisma.userPreference.deleteMany({ where: { userId: req.user!.id } });
  const prefs = await prisma.userPreference.createMany({ data: categories.map((c) => ({ userId: req.user!.id, category: c, enabled: true })) });
  res.json({ ok: true, count: prefs.count });
});
