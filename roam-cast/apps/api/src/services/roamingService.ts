import { prisma } from '../config/db';
import { getNearbyPois } from './poiService';

const POI_COOLDOWN_MIN = 60;
const GLOBAL_COOLDOWN_SEC = 90;

export async function checkRoaming(userId: string, lat: number, lng: number, radius = 30, recentPoiIds: string[] = []) {
  const userPrefs = await prisma.userPreference.findMany({ where: { userId, enabled: true } });
  const prefSet = new Set(userPrefs.map((p) => p.category));

  const session = await prisma.roamingSession.upsert({
    where: { id: `active-${userId}` },
    update: {},
    create: { id: `active-${userId}`, userId, recentPoiIds: [] }
  });

  if (session.lastPromptAt && (Date.now() - session.lastPromptAt.getTime()) / 1000 < GLOBAL_COOLDOWN_SEC) {
    return null;
  }

  const candidates = await getNearbyPois(lat, lng, radius);
  if (!candidates.length) return null;

  const scored = await Promise.all(candidates.map(async (c) => {
    const recentInteraction = await prisma.userInteraction.findFirst({
      where: {
        userId,
        poiId: c.id,
        action: { in: ['prompted', 'completed'] },
        createdAt: { gte: new Date(Date.now() - POI_COOLDOWN_MIN * 60 * 1000) }
      }
    });
    const blocked = recentPoiIds.includes(c.id) || session.recentPoiIds.includes(c.id) || Boolean(recentInteraction);
    const distanceScore = Math.max(0, 1 - Number(c.distance) / radius);
    const prefScore = prefSet.has(c.category) ? 0.4 : 0;
    const score = blocked ? -1 : distanceScore * 0.5 + Number(c.interestScore) * 0.4 + prefScore;
    return { ...c, score, blocked };
  }));

  const best = scored.filter((s) => !s.blocked).sort((a, b) => b.score - a.score)[0];
  if (!best) return null;

  await prisma.userInteraction.create({ data: { userId, poiId: best.id, action: 'prompted', metadata: { lat, lng, score: best.score } } });
  await prisma.roamingSession.update({
    where: { id: session.id },
    data: { lastPromptAt: new Date(), recentPoiIds: [...session.recentPoiIds.slice(-9), best.id] }
  });

  return {
    poiId: best.id,
    name: best.name,
    category: best.category,
    shortSummary: best.shortSummary,
    distanceMeters: Number(best.distance),
    score: best.score
  };
}
