from typing import Any, Dict

from users.infrastructure.db.models import UserEvent


def record_user_event(event_type: str, aggregate_id: str, payload: Dict[str, Any]) -> UserEvent:
    return UserEvent.objects.create(
        event_type=event_type,
        aggregate_id=aggregate_id,
        payload=payload,
    )
