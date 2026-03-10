# Roam Cast MVP (Phase 1)

Location-aware audio storytelling MVP for Melbourne CBD.

## Stack
- Mobile: React Native (Expo) + TypeScript + React Query + Zustand
- Web: Next.js + TypeScript + Leaflet (OSM)
- API: Node.js + Express + TypeScript + Prisma + PostgreSQL/PostGIS
- Jobs: BullMQ (Redis)

## Monorepo
- `apps/api` — backend API + story/audio generation pipeline + seed/admin
- `apps/web` — web companion + admin-lite POI browser/editor
- `apps/mobile` — mobile app with roaming mode + map + audio story playback
- `packages/types` — shared TS types/contracts

## Quick start
1. `cd roam-cast`
2. `cp apps/api/.env.example apps/api/.env`
3. `docker compose -f apps/api/docker-compose.yml up -d`
4. `npm install`
5. `npm run db:migrate`
6. `npm run db:seed`
7. Run apps:
   - API: `npm run dev:api`
   - Web: `npm run dev:web`
   - Mobile: `npm run dev:mobile`

## Env (API)
See `apps/api/.env.example`.

Defaults run in mock mode (no paid APIs needed):
- `STORY_PROVIDER=mock`
- `TTS_PROVIDER=mock`

## Implemented
- JWT demo auth and profile/preferences
- PostGIS-backed POI model + nearby queries
- Deterministic roaming ranking and cooldown logic
- Story generation + narration text + TTS abstraction (mock/openai adapters)
- Seeded Melbourne CBD dataset (30+ POIs)
- Mobile roaming mode with prompt and story playback
- Web map + story browsing + admin-lite CRUD/rebuild controls
- Interaction tracking and basic analytics events

## Stubbed / MVP shortcuts
- Magic link auth (using demo JWT auth for MVP)
- Background location execution hardened for production (hooks in place)
- Cloud audio object storage (mock local URLs used)
- Full moderation/verification workflow for generated stories

## Phase 2 suggestions
- Offline queue/sync, richer recommendation engine, multilingual packs
- Better background geofencing + battery-aware throttling
- Editorial tooling and source quality scoring pipeline
