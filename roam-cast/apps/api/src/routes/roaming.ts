import { Router } from 'express';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { checkRoaming } from '../services/roamingService';

export const roamingRouter = Router();

roamingRouter.post('/check', requireAuth, async (req: AuthRequest, res) => {
  const { lat, lng, radius = 30, recentPoiIds = [] } = req.body;
  const candidate = await checkRoaming(req.user!.id, lat, lng, radius, recentPoiIds);
  res.json({ candidate });
});
