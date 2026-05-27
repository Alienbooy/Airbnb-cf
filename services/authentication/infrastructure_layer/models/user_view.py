"""Read model projection for auth service."""

from django.db import models


class UserView(models.Model):
    id = models.UUIDField(primary_key=True, editable=False)
    username = models.CharField(max_length=150)
    email = models.EmailField()
    created_at = models.DateTimeField()

    class Meta:
        app_label = "audit_logs"
        db_table = "users_userview"
        managed = True

    def __str__(self) -> str:
        return self.username
