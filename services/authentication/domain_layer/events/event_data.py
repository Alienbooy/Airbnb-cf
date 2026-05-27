"""Domain event model stored in write_db."""

import uuid

from django.db import models

from domain_layer.enums.event_enums import EventType


class Event(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    event_type = models.CharField(max_length=100, choices=EventType.choices)
    aggregate_id = models.UUIDField(help_text="ID de la entidad que origino el evento")
    payload = models.JSONField(help_text="Datos del evento en formato JSON")
    occurred_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        app_label = "audit_logs"
        db_table = "users_event"
        ordering = ["occurred_at"]

    def __str__(self) -> str:
        return f"{self.event_type} [{self.aggregate_id}] @ {self.occurred_at}"
