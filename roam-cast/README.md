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

## Deploy
This repo now includes deploy config for:
- API on Render (`render.yaml` + `apps/api/Dockerfile`)
- Web on Vercel (`apps/web/vercel.json`)

### 1) Deploy API (Render)
1. Create Postgres and Redis in Render.
2. New Blueprint deploy from this repo root (`render.yaml`).
3. Set env vars:
   - `DATABASE_URL` (Render Postgres internal URL)
   - `REDIS_URL` (Render Redis internal URL)
   - `JWT_SECRET` (auto-generated or custom)
   - `STORY_PROVIDER=mock` and `TTS_PROVIDER=mock` for no-cost MVP mode
4. Deploy service.
5. Run DB setup once in Render shell:
   - `npm run db:dev --workspace @roamcast/api` (or `db:migrate` with generated migration)
   - `npm run db:seed --workspace @roamcast/api`

### 2) Deploy Web (Vercel)
1. Import this repo in Vercel.
2. Root directory: `roam-cast`
3. Framework: Next.js
4. Set env var:
   - `NEXT_PUBLIC_API_URL=https://<your-render-api-domain>`
5. Deploy.

### 3) Mobile (Expo)
- Keep MVP mobile in local/internal distribution first:
  - `npm run dev:mobile`
- For hosted QA builds, configure EAS and point API base URL to deployed API domain.

### Minimal production env
- `DATABASE_URL`
- `REDIS_URL`
- `JWT_SECRET`
- `STORY_PROVIDER` (`mock`|`openai`)
- `TTS_PROVIDER` (`mock`|`openai`)
- `OPENAI_API_KEY` (if using openai providers)

## Phase 2 suggestions
- Offline queue/sync, richer recommendation engine, multilingual packs
- Better background geofencing + battery-aware throttling
- Editorial tooling and source quality scoring pipeline
