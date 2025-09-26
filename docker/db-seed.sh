#!/usr/bin/env bash
set -euo pipefail

: "${MYSQL_HOST:=mysql}"
: "${MYSQL_PORT:=3306}"
: "${MYSQL_USER:=root}"
: "${MYSQL_PASSWORD:?MYSQL_PASSWORD not set}"
: "${MYSQL_DB:=resumes}"
: "${SQL_ROOT:=/seed/sql}"

echo ">> Waiting for MySQL at ${MYSQL_HOST}:${MYSQL_PORT}..."
until mysqladmin ping -h "${MYSQL_HOST}" -P "${MYSQL_PORT}" -u "${MYSQL_USER}" -p"${MYSQL_PASSWORD}" --silent; do
  sleep 2
done
echo ">> MySQL is up."

mysql() { command mysql --protocol=TCP -h "${MYSQL_HOST}" -P "${MYSQL_PORT}" -u "${MYSQL_USER}" -p"${MYSQL_PASSWORD}" "$@"; }

# Create DB and migrations table
mysql -e "CREATE DATABASE IF NOT EXISTS \`${MYSQL_DB}\` CHARACTER SET utf8 COLLATE utf8_general_ci;"
mysql "${MYSQL_DB}" -e "
CREATE TABLE IF NOT EXISTS schema_migrations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  filename VARCHAR(512) NOT NULL UNIQUE,
  sha256 CHAR(64) NOT NULL,
  applied_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;"

# Collect files recursively (dirs + names sorted)
mapfile -t FILES < <(find "${SQL_ROOT}" -type f -name "*.sql" | LC_ALL=C sort)
echo ">> Found ${#FILES[@]} SQL files under ${SQL_ROOT}"

for f in "${FILES[@]}"; do
  rel="$(realpath --relative-to="${SQL_ROOT}" "$f")"
  sum="$(sha256sum "$f" | awk '{print $1}')"

  exists=$(mysql "${MYSQL_DB}" -N -B -e \
    "SELECT COUNT(*) FROM schema_migrations WHERE filename='${rel//\'/\'\'}' AND sha256='${sum}';")
  if [[ "${exists}" -gt 0 ]]; then
    echo ">> Skipping already applied: ${rel}"
    continue
  fi

  echo ">> Applying: ${rel}"
  mysql "${MYSQL_DB}" -e "SET autocommit=0; START TRANSACTION; SOURCE ${f}; COMMIT;"
  mysql "${MYSQL_DB}" -e "INSERT INTO schema_migrations(filename, sha256) VALUES ('${rel//\'/\'\'}','${sum}');"
done

echo ">> Migrations complete."
