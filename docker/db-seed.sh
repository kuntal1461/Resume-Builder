#!/usr/bin/env sh
set -eu

MYSQL_HOST="${MYSQL_HOST:-mysql}"
MYSQL_PORT="${MYSQL_PORT:-3306}"
MYSQL_USER="${MYSQL_USER:-root}"
MYSQL_PASSWORD="${MYSQL_PASSWORD:?MYSQL_PASSWORD not set}"
MYSQL_DB="${MYSQL_DB:-resumes}"
SQL_ROOT="${SQL_ROOT:-/seed/sql}"
ADMIN_SQL_ROOT="${ADMIN_SQL_ROOT:-/seed/admin-sql}"
SCRAPER_SQL_ROOT="${SCRAPER_SQL_ROOT:-/seed/scraper-sql}"

printf '>> Waiting for MySQL at %s:%s...\n' "$MYSQL_HOST" "$MYSQL_PORT"
until mysqladmin ping \
  --host="$MYSQL_HOST" \
  --port="$MYSQL_PORT" \
  --user="$MYSQL_USER" \
  --password="$MYSQL_PASSWORD" \
  --silent >/dev/null 2>&1
  do
    sleep 2
  done
printf '>> MySQL is up.\n'

run_mysql() {
  mysql \
    --protocol=TCP \
    --host="$MYSQL_HOST" \
    --port="$MYSQL_PORT" \
    --user="$MYSQL_USER" \
    --password="$MYSQL_PASSWORD" \
    "$@"
}

run_mysql -e "CREATE DATABASE IF NOT EXISTS \`$MYSQL_DB\` CHARACTER SET utf8 COLLATE utf8_general_ci;"
run_mysql "$MYSQL_DB" <<'SQL'
CREATE TABLE IF NOT EXISTS schema_migrations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  filename VARCHAR(512) NOT NULL UNIQUE,
  sha256 CHAR(64) NOT NULL,
  applied_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
SQL

apply_sql_directory() {
  dir_path="$1"
  label="$2"

  if [ ! -d "$dir_path" ]; then
    printf '>> [%s] Directory %s not found, skipping.\n' "$label" "$dir_path"
    return
  fi

  temp_list=$(mktemp)
  find "$dir_path" -type f -name '*.sql' -print | LC_ALL=C sort >"$temp_list"

  file_total=$(wc -l <"$temp_list" | tr -d '[:space:]')
  if [ -z "$file_total" ]; then
    file_total=0
  fi

  printf '>> [%s] Found %s SQL files under %s\n' "$label" "$file_total" "$dir_path"

  if [ "$file_total" -eq 0 ]; then
    rm -f "$temp_list"
    printf '>> [%s] No migrations to apply.\n' "$label"
    return
  fi

  while IFS= read -r file_path || [ -n "$file_path" ]; do
    [ -n "$file_path" ] || continue

    case "$file_path" in
      "$dir_path"/*)
        rel_path=${file_path#"$dir_path"/}
        ;;
      *)
        rel_path=$(basename "$file_path")
        ;;
    esac

    checksum=$(sha256sum "$file_path" | awk '{print $1}')
    key="${label}/${rel_path}"
    escaped_key=$(printf "%s" "$key" | sed "s/'/''/g")

    exists=$(run_mysql "$MYSQL_DB" -N -B -e "SELECT COUNT(*) FROM schema_migrations WHERE filename='${escaped_key}' AND sha256='${checksum}';")
    if [ -n "$exists" ] && [ "$exists" -gt 0 ]; then
      printf '>> [%s] Skipping already applied: %s\n' "$label" "$rel_path"
      continue
    fi

    escaped_source=$(printf "%s" "$file_path" | tr -d '\r' | sed 's/\\/\\\\/g; s/ /\\ /g')
    printf '>> [%s] Applying: %s\n' "$label" "$rel_path"
    run_mysql "$MYSQL_DB" <<SQL
SET autocommit=0;
START TRANSACTION;
SOURCE $escaped_source
COMMIT;
SQL

    run_mysql "$MYSQL_DB" -e "INSERT INTO schema_migrations(filename, sha256) VALUES ('${escaped_key}','${checksum}') ON DUPLICATE KEY UPDATE sha256=VALUES(sha256), applied_at=NOW();"
  done <"$temp_list"

  rm -f "$temp_list"
}

apply_sql_directory "$SQL_ROOT" "job_major"
apply_sql_directory "$ADMIN_SQL_ROOT" "admin_major"
apply_sql_directory "$SCRAPER_SQL_ROOT" "scraper_major"

printf '>> All migrations complete.\n'
