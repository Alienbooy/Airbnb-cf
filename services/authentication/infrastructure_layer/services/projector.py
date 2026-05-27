"""Project User -> UserView in read_db."""

from infrastructure_layer.models.user import User
from infrastructure_layer.models.user_view import UserView


class ProjectorService:
    @staticmethod
    def project_user(user: User) -> UserView:
        user_view, _ = UserView.objects.using("read_db").update_or_create(
            id=user.id,
            defaults={
                "username": user.username,
                "email": user.email,
                "created_at": user.created_at,
            },
        )
        return user_view
