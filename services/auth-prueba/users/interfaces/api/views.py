from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from users.application.commands.record_user_event import record_user_event
from users.application.queries.get_user_view import get_user_view
from users.infrastructure.db.models import RoleChoices
from users.interfaces.api.serializers import (
    LoginSerializer,
    MeSerializer,
    RegisterSerializer,
    UserViewSerializer,
)


def token_role_from_roles(roles):
    if RoleChoices.ADMIN in roles:
        return RoleChoices.ADMIN
    if RoleChoices.HOST in roles:
        return RoleChoices.HOST
    return "guest"


class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(
            {
                "user_id": user.id,
                "message": "user registered",
            },
            status=status.HTTP_201_CREATED,
        )


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]

        roles = [str(role) for role in (user.roles or [RoleChoices.CLIENT])]
        refresh = RefreshToken.for_user(user)
        refresh["roles"] = roles
        refresh["role"] = token_role_from_roles(roles)

        return Response(
            {
                "user_id": user.id,
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            }
        )


class UserViewDetail(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, user_id: int):
        user_view = get_user_view(user_id)
        if not user_view:
            return Response({"detail": "not_found"}, status=status.HTTP_404_NOT_FOUND)
        return Response(UserViewSerializer(user_view).data)


class MeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response(MeSerializer(request.user).data)


class HostRoleView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = request.user
        previous_roles = list(user.roles or [])
        if RoleChoices.ADMIN in previous_roles:
            return Response({"detail": "admin_role_locked"}, status=status.HTTP_400_BAD_REQUEST)
        user.roles = [RoleChoices.HOST]
        user.save(update_fields=["roles"])
        record_user_event(
            event_type="user_role_changed",
            aggregate_id=str(user.id),
            payload={
                "id": user.id,
                "previous_roles": previous_roles,
                "roles": user.roles,
            },
        )
        return Response(
            {
                "message": "role_updated",
                "roles": user.roles,
                "redirect": "host_dashboard",
            }
        )

    def delete(self, request):
        user = request.user
        previous_roles = list(user.roles or [])
        if RoleChoices.ADMIN in previous_roles:
            return Response({"detail": "admin_role_locked"}, status=status.HTTP_400_BAD_REQUEST)
        user.roles = [RoleChoices.CLIENT]
        user.save(update_fields=["roles"])
        record_user_event(
            event_type="user_role_changed",
            aggregate_id=str(user.id),
            payload={
                "id": user.id,
                "previous_roles": previous_roles,
                "roles": user.roles,
            },
        )
        return Response(
            {
                "message": "role_updated",
                "roles": user.roles,
                "redirect": "client_home",
            }
        )
