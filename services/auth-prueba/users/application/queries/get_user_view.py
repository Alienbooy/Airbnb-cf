from users.infrastructure.db.models import UserView


def get_user_view(user_id: int) -> UserView:
    return UserView.objects.filter(id=user_id).first()
