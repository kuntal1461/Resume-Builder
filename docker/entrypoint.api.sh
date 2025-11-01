#!/usr/bin/env bash
set -euo pipefail
echo ">> Starting API..."
export PYTHONPATH="/app:${PYTHONPATH:-}"
UVICORN_WORKERS=${UVICORN_WORKERS:-1}
exec uvicorn web.main:app --host 0.0.0.0 --port 8000 --workers "${UVICORN_WORKERS}"
