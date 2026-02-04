#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

cd "$ROOT_DIR"

echo "[1/4] Starting docker-compose services..."
docker-compose up -d

echo "[2/4] Installing backend deps (container)..."
docker-compose exec -T backend npm install

echo "[3/4] Running backend e2e tests..."
docker-compose exec -T backend npm run test:e2e

echo "[4/4] Installing frontend deps (container) and running tests/build..."
docker-compose exec -T frontend npm install
docker-compose exec -T frontend npm run test
docker-compose exec -T frontend npm run build

echo "All tests and build completed."
