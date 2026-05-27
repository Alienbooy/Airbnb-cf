"""Authentication backend for Bearer JWT tokens."""

from rest_framework import exceptions
from rest_framework.authentication import BaseAuthentication, get_authorization_header

from infrastructure_layer.auth.token_service import JWTError, JWTService


class JWTAuthentication(BaseAuthentication):
    keyword = b"bearer"

    def authenticate(self, request):
        auth_header = get_authorization_header(request).split()
        if not auth_header:
            return None
        if auth_header[0].lower() != self.keyword:
            return None
        if len(auth_header) != 2:
            raise exceptions.AuthenticationFailed(
                "Formato invalido. Usa Authorization: Bearer <token>."
            )
        token = auth_header[1].decode("utf-8")
        try:
            principal = JWTService.authenticate_access_token(token)
        except JWTError as exc:
            raise exceptions.AuthenticationFailed(str(exc)) from exc
        return (principal, token)
