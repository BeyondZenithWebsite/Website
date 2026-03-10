import { Category, Prisma } from '@prisma/client';
import { prisma } from '../config/db';

export async function getNearbyPois(lat: number, lng: number, radius = 30, category?: Category) {
  const categoryFilter = category ? Prisma.sql`AND category = ${category}` : Prisma.empty;
  const rows = await prisma.$queryRaw<any[]>(Prisma.sql`
    SELECT id, name, slug, category, latitude, longitude, "shortSummary", "interestScore",
      ST_Distance(geom, ST_SetSRID(ST_MakePoint(${lng}, ${lat}),4326)::geography) AS distance
    FROM "Poi"
    WHERE "isActive" = true
      AND geom IS NOT NULL
      AND ST_DWithin(geom, ST_SetSRID(ST_MakePoint(${lng}, ${lat}),4326)::geography, ${radius})
      ${categoryFilter}
    ORDER BY distance ASC
    LIMIT 20;
  `);
  return rows;
}
