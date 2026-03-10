import { Router } from 'express';
import { prisma } from '../config/db';
import { generateStoryForPoi } from '../services/storyService';
import { seed } from '../../prisma/seed';
import { requireAuth } from '../middleware/auth';

export const adminRouter = Router();

adminRouter.get('/admin/jobs', requireAuth, async (_req, res) => {
  res.json([{ name: 'story-generation', status: 'idle' }]);
});

adminRouter.post('/admin/seed', requireAuth, async (_req, res) => {
  await seed();
  res.json({ ok: true });
});

adminRouter.post('/admin/rebuild-poi/:id', requireAuth, async (req, res) => {
  const poi = await generateStoryForPoi(req.params.id);
  res.json(poi);
});
