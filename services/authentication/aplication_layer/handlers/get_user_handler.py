"""Query handler for reading UserView from read_db."""

import uuid
from typing import Optional

from infrastructure_layer.models.user_view import UserView


class GetUserHandler:
    @staticmethod
    def handle(user_id: uuid.UUID) -> Optional[UserView]:
        return UserView.objects.using("read_db").filter(id=user_id).first()
