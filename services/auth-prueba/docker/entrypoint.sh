#!/bin/sh
set -e

echo "Waiting for database..."
python - <<'PY'
import os
import time
import psycopg2

host = os.environ.get("DB_HOST", "db")
port = int(os.environ.get("DB_PORT", "5432"))
name = os.environ.get("DB_NAME_WRITE", "airbnb_write")
user = os.environ.get("DB_USER", "postgres")
password = os.environ.get("DB_PASSWORD", "postgres")

for _ in range(30):
    try:
        conn = psycopg2.connect(host=host, port=port, dbname=name, user=user, password=password)
        conn.close()
        print("Database ready.")
        raise SystemExit(0)
    except Exception:
        time.sleep(2)

raise SystemExit("Database not ready after timeout")
PY

python manage.py migrate --noinput
python manage.py create_admin

exec "$@"
