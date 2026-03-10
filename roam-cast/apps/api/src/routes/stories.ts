import { Router } from 'express';
import { prisma } from '../config/db';
import { requireAuth } from '../middleware/auth';
import { generateStoryForPoi } from '../services/storyService';

export const storyRouter = Router();

storyRouter.post('/generate/:poiId', requireAuth, async (req, res) => {
  const poi = await generateStoryForPoi(req.params.poiId);
  res.json(poi);
});

storyRouter.get('/:poiId', requireAuth, async (req, res) => {
  const poi = await prisma.poi.findUnique({ where: { id: req.params.poiId } });
  if (!poi) return res.status(404).json({ error: 'Not found' });
  res.json({ shortStory: poi.shortStory, longStory: poi.longStory, transcript: poi.transcript, audioUrl: poi.audioUrl });
});

storyRouter.post('/:poiId/audio-regenerate', requireAuth, async (req, res) => {
  const poi = await generateStoryForPoi(req.params.poiId);
  res.json({ audioUrl: poi.audioUrl });
});
