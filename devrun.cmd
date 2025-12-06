@echo off
REM Dev helper for Windows:
REM - Start Docker services
REM - Run backend/frontend quality checks
REM - Stop Docker services and report overall status

setlocal ENABLEDELAYEDEXPANSION

set OVERALL=0
set "PYTARGETS=core web"

echo ==^> Starting Docker services...
docker compose up -d
if errorlevel 1 (
  echo Failed to start Docker services.
  goto cleanup
)

REM Python checks in backend container
echo.
echo --- Python: ruff ---
docker compose exec backend ruff check %PYTARGETS%
if errorlevel 1 set OVERALL=1

echo.
echo --- Python: black --check ---
docker compose exec backend black --check %PYTARGETS%
if errorlevel 1 set OVERALL=1

echo.
echo --- Python: pytest ---
docker compose exec backend pytest
set "PYTEST_EXIT=%ERRORLEVEL%"
if "%PYTEST_EXIT%"=="5" (
  echo pytest: no tests collected ^(treated as success^)
  set "PYTEST_EXIT=0"
)
if not "%PYTEST_EXIT%"=="0" set OVERALL=1

REM Node checks in frontend container
echo.
echo --- Node: eslint ---
docker compose exec frontend npx eslint .
if errorlevel 1 set OVERALL=1

echo.
echo --- Node: prettier --check ---
docker compose exec frontend npx prettier --check .
if errorlevel 1 set OVERALL=1

echo.
echo --- Node: next lint ---
docker compose exec frontend npx next lint
if errorlevel 1 set OVERALL=1

echo.
echo --- Node: jest ---
docker compose exec frontend npx jest --passWithNoTests
if errorlevel 1 set OVERALL=1

:cleanup
echo.
echo ==^> Stopping Docker services...
docker compose down

echo.
if "%OVERALL%"=="0" (
  echo ALL CHECKS PASSED — SAFE TO COMMIT
  endlocal
  exit /b 0
) else (
  echo ISSUES FOUND — FIX BEFORE COMMIT
  endlocal
  exit /b 1
)
