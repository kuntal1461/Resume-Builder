#!/usr/bin/env bash
set -euo pipefail
echo ">> Starting API..."
exec uvicorn main:app --host 0.0.0.0 --port 8000 --workers 2
