from typing import Any, Dict

from users.application.commands.record_user_event import record_user_event
from users.infrastructure.db.models import User


def register_user(payload: Dict[str, Any]) -> User:
    if User.objects.filter(username=payload["username"]).exists():
        raise ValueError("username ya existe")
    if User.objects.filter(email=payload["email"]).exists():
        raise ValueError("email ya existe")

    user = User.objects.create_user(
        username=payload["username"],
        email=payload["email"],
        password=payload["password"],
        roles=payload["roles"],
    )

    record_user_event(
        event_type="user_registered",
        aggregate_id=str(user.id),
        payload={
            "id": str(user.id),
            "username": user.username,
            "email": user.email,
            "roles": user.roles,
        },
    )

    return user
