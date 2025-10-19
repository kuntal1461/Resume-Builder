#!/usr/bin/env sh
set -eu

cd /app

# Install deps into the mounted volume if needed
if [ ! -d node_modules ] || [ -z "$(ls -A node_modules 2>/dev/null || true)" ]; then
  echo ">> Installing dependencies with npm ci"
  npm ci
fi

SCRIPT="${1:-dev}"

echo ">> Starting frontend: npm run ${SCRIPT} on 0.0.0.0:${PORT:-3000}"
exec npm run "${SCRIPT}" -- -H 0.0.0.0 -p "${PORT:-3000}"

