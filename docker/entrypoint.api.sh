#!/usr/bin/env sh
set -eu
echo ">> Starting API..."

install_python_dependencies() {
  backend_requirements="/backend_common/requirements/api.txt"
  service_requirements="/app/web/requirements.txt"
  marker_file="/tmp/.api_requirements_hash"

  if [ ! -f "$backend_requirements" ] || [ ! -f "$service_requirements" ]; then
    echo ">> Skipping dependency sync (requirements missing)."
    return
  fi

  current_hash=$(cat "$backend_requirements" "$service_requirements" | sha256sum | awk '{print $1}')
  installed_hash=""
  if [ -f "$marker_file" ]; then
    installed_hash=$(cat "$marker_file")
  fi

  if [ "$current_hash" != "$installed_hash" ]; then
    echo ">> Installing backend Python dependencies..."
    pip install --no-cache-dir -r "$backend_requirements" -r "$service_requirements"
    echo "$current_hash" > "$marker_file"
  else
    echo ">> Backend Python dependencies already up to date."
  fi
}

install_python_dependencies
EXTRA_PATHS="/app"
if [ -d /backend_common ]; then
  EXTRA_PATHS="/backend_common:${EXTRA_PATHS}"
fi
export PYTHONPATH="${EXTRA_PATHS}:${PYTHONPATH:-}"
UVICORN_WORKERS=${UVICORN_WORKERS:-1}
exec uvicorn web.main:app --host 0.0.0.0 --port 8000 --workers "${UVICORN_WORKERS}"
