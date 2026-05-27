import os

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "auth_service.settings")

import django

django.setup()

from django.db import connections


def print_tables(alias: str) -> None:
	with connections[alias].cursor() as cursor:
		cursor.execute(
			"SELECT tablename FROM pg_tables WHERE schemaname='public' ORDER BY tablename"
		)
		print(f"{alias.upper()} tablas:", [row[0] for row in cursor.fetchall()])


print_tables("write_db")
print_tables("read_db")
