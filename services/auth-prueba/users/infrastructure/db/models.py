import uuid
from django.contrib.auth.base_user import AbstractBaseUser, BaseUserManager
from django.contrib.auth.models import PermissionsMixin
from django.db import models


class RoleChoices(models.TextChoices):
    ADMIN = "admin", "Admin"
    CLIENT = "client", "Client"
    HOST = "host", "Host"


def _normalize_roles(roles: list[str]) -> list[str]:
    if not roles:
        return [RoleChoices.CLIENT]
    unique_roles = list(dict.fromkeys(roles))
    if RoleChoices.ADMIN in unique_roles and len(unique_roles) > 1:
        raise ValueError("admin_role_must_be_exclusive")
    for role in unique_roles:
        if role not in RoleChoices.values:
            raise ValueError("invalid_role")
    return unique_roles


class UserManager(BaseUserManager):
    def create_user(self, username: str, email: str, password: str, roles: list[str]) -> "User":
        if not username:
            raise ValueError("username_required")
        if not email:
            raise ValueError("email_required")
        roles = _normalize_roles(roles)

        user = self.model(username=username, email=self.normalize_email(email), roles=roles)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username: str, email: str, password: str) -> "User":
        user = self.create_user(username=username, email=email, password=password, roles=[RoleChoices.ADMIN])
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user


class User(AbstractBaseUser, PermissionsMixin):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(unique=True)
    roles = models.JSONField(default=list)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    objects = UserManager()

    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = ["email"]

    class Meta:
        db_table = "users_user"

    def __str__(self) -> str:
        roles = ",".join(self.roles) if self.roles else "client"
        return f"{self.username} ({roles})"


class UserEvent(models.Model):
    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        SENT = "sent", "Sent"
        FAILED = "failed", "Failed"

    event_type = models.CharField(max_length=100)
    aggregate_id = models.CharField(max_length=100)
    payload = models.JSONField()
    occurred_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING, db_index=True)
    sent_at = models.DateTimeField(null=True, blank=True)
    error = models.TextField(blank=True)

    class Meta:
        db_table = "users_event"


class UserView(models.Model):
    username = models.CharField(max_length=150)
    email = models.EmailField()
    created_at = models.DateTimeField()

    class Meta:
        db_table = "users_userview"
