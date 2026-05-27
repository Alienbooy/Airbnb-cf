"""Low-level JWT encode/decode helpers used by the auth layer."""

from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
import hashlib
from typing import Any
import uuid

import jwt
from django.conf import settings

from infrastructure_layer.models.user import User


class JWTError(Exception):
    """Raised when a token cannot be issued or validated."""


@dataclass(frozen=True)
class JWTPrincipal:
    user_id: str
    username: str
    email: str

    @property
    def id(self):
        return self.user_id

    @property
    def pk(self):
        return self.user_id

    @property
    def is_authenticated(self):
        return True

    @property
    def is_anonymous(self):
        return False


class JWTService:
    algorithm = "HS256"
    access_ttl = timedelta(minutes=15)
    refresh_ttl = timedelta(days=7)

    @classmethod
    def _signing_key(cls) -> bytes:
        return hashlib.sha256(settings.SECRET_KEY.encode("utf-8")).digest()

    @classmethod
    def issue_token_pair(cls, user: User) -> dict[str, str]:
        return {
            "access": cls._encode_token(user, "access", cls.access_ttl),
            "refresh": cls._encode_token(user, "refresh", cls.refresh_ttl),
        }

    @classmethod
    def issue_access_token(cls, user: User) -> str:
        return cls._encode_token(user, "access", cls.access_ttl)

    @classmethod
    def authenticate_access_token(cls, token: str) -> JWTPrincipal:
        payload = cls._decode_token(token)
        if payload.get("typ") != "access":
            raise JWTError("Este endpoint requiere un token de acceso.")
        return cls._principal_from_payload(payload)

    @classmethod
    def refresh_access_token(cls, token: str) -> tuple[User, str]:
        payload = cls._decode_token(token)
        if payload.get("typ") != "refresh":
            raise JWTError("Se esperaba un token de refresh.")
        user = cls._user_from_payload(payload)
        return user, cls.issue_access_token(user)

    @classmethod
    def _encode_token(cls, user: User, token_type: str, ttl: timedelta) -> str:
        now = datetime.now(timezone.utc)
        payload = {
            "jti": uuid.uuid4().hex,
            "sub": str(user.id),
            "typ": token_type,
            "username": user.username,
            "email": user.email,
            "iat": int(now.timestamp()),
            "exp": int((now + ttl).timestamp()),
        }
        return jwt.encode(payload, cls._signing_key(), algorithm=cls.algorithm)

    @classmethod
    def _decode_token(cls, token: str) -> dict[str, Any]:
        try:
            return jwt.decode(token, cls._signing_key(), algorithms=[cls.algorithm])
        except jwt.ExpiredSignatureError as exc:
            raise JWTError("El token expiro.") from exc
        except jwt.InvalidTokenError as exc:
            raise JWTError("Token invalido.") from exc

    @classmethod
    def _user_from_payload(cls, payload: dict[str, Any]) -> User:
        user_id = payload.get("sub")
        if not user_id:
            raise JWTError("El token no contiene un usuario valido.")
        user = User.objects.using("write_db").filter(id=user_id).first()
        if user is None:
            raise JWTError("El usuario del token ya no existe.")
        return user

    @classmethod
    def _principal_from_payload(cls, payload: dict[str, Any]) -> JWTPrincipal:
        return JWTPrincipal(
            user_id=str(payload["sub"]),
            username=payload.get("username", ""),
            email=payload.get("email", ""),
        )
