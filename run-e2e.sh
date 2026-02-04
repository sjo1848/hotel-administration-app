#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

IMAGE="mcr.microsoft.com/playwright:v1.58.1-jammy"

if [[ ! -f ".env" ]]; then
  echo "Missing .env file in $ROOT_DIR. Create it from .env.example first."
  exit 1
fi

echo "[1/3] Pulling Playwright image (may take a while)..."
docker pull "$IMAGE"

echo "[2/3] Starting docker-compose services..."
docker-compose --env-file .env up -d

echo "[3/3] Running Playwright E2E tests..."
docker-compose --env-file .env run --rm playwright bash -lc "npm ci && npm run test:e2e"

echo "E2E complete."
