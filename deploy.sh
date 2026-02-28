#!/usr/bin/env bash
set -euo pipefail

REPO_DIR="$(cd "$(dirname "$0")" && pwd)"
COMPOSE="docker compose -f docker-compose.yml -f docker-compose.tunnel.yml"

log() { echo "[deploy] $*"; }

cd "$REPO_DIR"

log "Pulling latest code..."
git pull --ff-only

log "Building images..."
$COMPOSE build --pull

log "Restarting services..."
$COMPOSE up -d --remove-orphans

log "Pruning dangling images..."
docker image prune -f

log "Done."
$COMPOSE ps
