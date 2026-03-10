import { Category } from '@prisma/client';
import { Router } from 'express';
import { prisma } from '../config/db';
import { getNearbyPois } from '../services/poiService';
import { requireAuth } from '../middleware/auth';

export const poiRouter = Router();

poiRouter.get('/nearby', requireAuth, async (req, res) => {
  const lat = Number(req.query.lat);
  const lng = Number(req.query.lng);
  const radius = Number(req.query.radius || 30);
  const category = req.query.category as Category | undefined;
  const data = await getNearbyPois(lat, lng, radius, category);
  res.json(data);
});

poiRouter.get('/:id', requireAuth, async (req, res) => {
  const poi = await prisma.poi.findUnique({ where: { id: req.params.id } });
  if (!poi) return res.status(404).json({ error: 'Not found' });
  res.json(poi);
});

poiRouter.get('/', requireAuth, async (req, res) => {
  const { category, city } = req.query;
  const pois = await prisma.poi.findMany({ where: { city: String(city || 'Melbourne'), ...(category ? { category: category as Category } : {}) } });
  res.json(pois);
});

poiRouter.post('/', requireAuth, async (req, res) => {
  const poi = await prisma.poi.create({ data: req.body });
  res.status(201).json(poi);
});

poiRouter.patch('/:id', requireAuth, async (req, res) => {
  const poi = await prisma.poi.update({ where: { id: req.params.id }, data: req.body });
  res.json(poi);
});
