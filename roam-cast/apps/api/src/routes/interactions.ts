import { Router } from 'express';
import { prisma } from '../config/db';
import { requireAuth, AuthRequest } from '../middleware/auth';

export const interactionRouter = Router();

interactionRouter.post('/interactions', requireAuth, async (req: AuthRequest, res) => {
  const { poiId, action, metadata, sessionId } = req.body;
  const row = await prisma.userInteraction.create({ data: { userId: req.user!.id, poiId, action, metadata, sessionId } });
  res.status(201).json(row);
});

interactionRouter.get('/me/history', requireAuth, async (req: AuthRequest, res) => {
  const rows = await prisma.userInteraction.findMany({ where: { userId: req.user!.id }, orderBy: { createdAt: 'desc' }, take: 100, include: { poi: true } });
  res.json(rows);
});
