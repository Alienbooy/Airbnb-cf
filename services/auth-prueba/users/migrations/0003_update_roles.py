from django.db import migrations

ROLE_MAP = {
    "guest": "client",
    "arrendatario": "host",
}


def forwards(apps, schema_editor):
    User = apps.get_model("users", "User")
    for user in User.objects.all():
        roles = user.roles or []
        updated = []
        for role in roles:
            updated.append(ROLE_MAP.get(role, role))
        if not updated:
            updated = ["client"]
        user.roles = list(dict.fromkeys(updated))
        user.save(update_fields=["roles"])


def backwards(apps, schema_editor):
    User = apps.get_model("users", "User")
    for user in User.objects.all():
        roles = user.roles or []
        updated = []
        for role in roles:
            if role == "client":
                updated.append("guest")
            elif role == "host":
                updated.append("arrendatario")
            else:
                updated.append(role)
        if not updated:
            updated = ["guest"]
        user.roles = list(dict.fromkeys(updated))
        user.save(update_fields=["roles"])


class Migration(migrations.Migration):
    dependencies = [
        ("users", "0002_userview"),
    ]

    operations = [
        migrations.RunPython(forwards, backwards),
    ]
