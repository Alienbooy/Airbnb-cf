from users.infrastructure.db.models import User


def authenticate_user(username: str, password: str) -> User:
    user = User.objects.filter(username=username).first()
    if not user or not user.check_password(password):
        raise ValueError("invalid_credentials")
    if not user.is_active:
        raise ValueError("inactive_user")
    return user
