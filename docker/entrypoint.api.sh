#!/usr/bin/env bash
set -euo pipefail
echo ">> Starting API..."
EXTRA_PATHS="/app"
if [ -d /backend_common ]; then
  EXTRA_PATHS="/backend_common:${EXTRA_PATHS}"
fi
export PYTHONPATH="${EXTRA_PATHS}:${PYTHONPATH:-}"
UVICORN_WORKERS=${UVICORN_WORKERS:-1}
exec uvicorn web.main:app --host 0.0.0.0 --port 8000 --workers "${UVICORN_WORKERS}"
