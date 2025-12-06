#!/bin/sh

# POSIX-compliant dev helper:
# - Start Docker services
# - Run backend/frontend quality checks
# - Stop Docker services and report overall status

set -eu

PROJECT_ROOT=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
cd "$PROJECT_ROOT"

overall_status=0

PYTHON_TARGETS="core web"

run_check() {
  label=$1
  shift
  printf '\n--- %s ---\n' "$label"
  if "$@"; then
    printf '[OK] %s\n' "$label"
  else
    printf '[FAIL] %s\n' "$label"
    overall_status=1
  fi
}

echo "==> Starting Docker services..."
docker compose up -d

trap 'echo "==> Stopping Docker services..."; docker compose down' EXIT

# Python checks in backend container
run_check "Python: ruff" docker compose exec -T backend ruff check $PYTHON_TARGETS
run_check "Python: black --check" docker compose exec -T backend black --check $PYTHON_TARGETS
run_check "Python: pytest" docker compose exec -T backend sh -c 'pytest || code=$?; if [ "$code" -eq 5 ]; then echo "pytest: no tests collected (treated as success)"; exit 0; fi; exit "$code"'

# Node checks in frontend container
run_check "Node: eslint" docker compose exec -T frontend npx eslint .
run_check "Node: prettier --check" docker compose exec -T frontend npx prettier --check .
run_check "Node: next lint" docker compose exec -T frontend npx next lint
run_check "Node: jest" docker compose exec -T frontend npx jest --passWithNoTests

printf '\n'
if [ "$overall_status" -eq 0 ]; then
  echo "ALL CHECKS PASSED — SAFE TO COMMIT"
else
  echo "ISSUES FOUND — FIX BEFORE COMMIT"
fi

exit "$overall_status"
