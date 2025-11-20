#!/usr/bin/env sh
set -eu

cd /app

# Install deps into the mounted volume if needed
ensure_dependencies() {
  if [ ! -f package-lock.json ]; then
    echo "package-lock.json is missing; cannot install dependencies" >&2
    exit 1
  fi

  mkdir -p node_modules
  stamp_file="node_modules/.deps_fingerprint"
  lock_hash=$(sha256sum package-lock.json | awk '{print $1}')
  platform_desc="$(uname -s)-$(uname -m)"
  node_version=$(node -p "process.version")
  libc_desc=$(ldd --version 2>&1 | head -n 1 || echo "ldd-unavailable")
  current_fingerprint=$(printf "%s\n%s\n%s\n%s\n" "$lock_hash" "$platform_desc" "$node_version" "$libc_desc" | sha256sum | awk '{print $1}')
  stored_fingerprint=""
  if [ -f "$stamp_file" ]; then
    stored_fingerprint=$(cat "$stamp_file")
  fi

  if [ ! -f "$stamp_file" ] || [ "$stored_fingerprint" != "$current_fingerprint" ]; then
    echo ">> Installing dependencies with npm ci"
    npm ci
    echo "$current_fingerprint" > "$stamp_file"
  fi
}

ensure_dependencies

SCRIPT="${1:-dev}"

echo ">> Starting frontend: npm run ${SCRIPT} on 0.0.0.0:${PORT:-3000}"
exec npm run "${SCRIPT}" -- -H 0.0.0.0 -p "${PORT:-3000}"
