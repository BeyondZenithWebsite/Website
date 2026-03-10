import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

export async function ensureGeoSetup() {
  await prisma.$executeRawUnsafe(`CREATE EXTENSION IF NOT EXISTS postgis;`);
  await prisma.$executeRawUnsafe(`
    ALTER TABLE "Poi"
    ADD COLUMN IF NOT EXISTS geom geography(Point,4326);
  `);
  await prisma.$executeRawUnsafe(`
    UPDATE "Poi"
    SET geom = ST_SetSRID(ST_MakePoint(longitude, latitude),4326)::geography
    WHERE geom IS NULL;
  `);
  await prisma.$executeRawUnsafe(`
    CREATE INDEX IF NOT EXISTS poi_geom_gix ON "Poi" USING GIST (geom);
  `);
}
