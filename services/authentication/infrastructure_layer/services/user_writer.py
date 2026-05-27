"""Orchestrate writing a User aggregate."""

from domain_layer.enums.event_enums import EventType
from infrastructure_layer.models.user import User
from infrastructure_layer.services.event_store import EventStoreService
from infrastructure_layer.services.projector import ProjectorService


class UserWriterService:
    def __init__(self, event_store: EventStoreService = None, projector: ProjectorService = None):
        self._event_store = event_store or EventStoreService()
        self._projector = projector or ProjectorService()

    def create_user(self, username: str, email: str, raw_password: str) -> User:
        user = User(username=username, email=email)
        user.set_password(raw_password)
        user.save(using="write_db")
        self._event_store.record(
            event_type=EventType.USER_CREATED,
            aggregate_id=user.id,
            payload={
                "username": user.username,
                "email": user.email,
                "occurred_at": user.created_at.isoformat(),
            },
        )
        self._projector.project_user(user)
        return user
