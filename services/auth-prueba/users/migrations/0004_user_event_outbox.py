from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("users", "0003_update_roles"),
    ]

    operations = [
        migrations.AddField(
            model_name="userevent",
            name="status",
            field=models.CharField(
                choices=[("pending", "Pending"), ("sent", "Sent"), ("failed", "Failed")],
                default="pending",
                max_length=20,
                db_index=True,
            ),
        ),
        migrations.AddField(
            model_name="userevent",
            name="sent_at",
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="userevent",
            name="error",
            field=models.TextField(blank=True),
        ),
    ]
