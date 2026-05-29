from typing import Optional, Type

from django.db import models

from users.infrastructure.db.models import User, UserEvent, UserView


class AuthDbRouter:
    def db_for_read(self, model: Type[models.Model], **hints: object) -> Optional[str]:
        if model is UserView:
            return "read"
        if model in (User, UserEvent):
            return "default"
        return None

    def db_for_write(self, model: Type[models.Model], **hints: object) -> Optional[str]:
        if model in (User, UserEvent):
            return "default"
        return None

    def allow_migrate(self, db: str, app_label: str, model_name: Optional[str] = None, **hints: object) -> Optional[bool]:
        if model_name == "userview":
            return False
        if db == "read":
            return False
        return None
