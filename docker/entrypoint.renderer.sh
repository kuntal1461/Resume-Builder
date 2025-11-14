#!/usr/bin/env sh
set -eu

cd /app

if [ ! -d node_modules ] || [ -z "$(ls -A node_modules 2>/dev/null || true)" ]; then
  echo ">> Installing renderer dependencies"
  npm ci
fi

SCRIPT="${1:-dev}"

echo ">> Starting renderer service via npm run ${SCRIPT} (PORT=${PORT:-4100})"
if [ "${SCRIPT}" = "dev" ]; then
  exec npm run dev
else
  exec npm run "${SCRIPT}"
fi
