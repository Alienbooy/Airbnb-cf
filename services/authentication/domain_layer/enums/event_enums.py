from django.db import models


class EventType(models.TextChoices):
    USER_CREATED = "USER_CREATED", "User Created"
