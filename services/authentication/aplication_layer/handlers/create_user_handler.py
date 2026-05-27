"""Command handler for CreateUser."""

from infrastructure_layer.models.user import User
from infrastructure_layer.services.user_writer import UserWriterService


class CreateUserHandler:
    def __init__(self, writer_service: UserWriterService = None):
        self._writer = writer_service or UserWriterService()

    def handle(self, validated_data: dict) -> User:
        return self._writer.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            raw_password=validated_data["password"],
        )
