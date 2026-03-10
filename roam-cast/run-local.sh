#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

if [ ! -f apps/api/.env ]; then
  cp apps/api/.env.example apps/api/.env
  echo "Created apps/api/.env from .env.example"
fi

echo "Starting Postgres+Redis..."
docker compose -f apps/api/docker-compose.yml up -d

echo "Installing dependencies..."
npm install

echo "Applying DB migration (dev)..."
npm run db:dev --workspace @roamcast/api || true

echo "Seeding data..."
npm run db:seed --workspace @roamcast/api

echo "Starting API (4000) + Web (3000)..."
(npm run dev:api &) 
(npm run dev:web &)

sleep 3

echo "\nRoam Cast local is booting:"
echo "- API: http://localhost:4000/health"
echo "- Web: http://localhost:3000"
echo "\nStart mobile in another terminal:"
echo "cd $ROOT && npm run dev:mobile"

wait
