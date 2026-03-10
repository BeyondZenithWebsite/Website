#!/usr/bin/env sh
set -e

echo "Running prisma generate..."
npx prisma generate

echo "Running prisma migrate deploy..."
npx prisma migrate deploy || true

echo "Starting API..."
node dist/index.js
