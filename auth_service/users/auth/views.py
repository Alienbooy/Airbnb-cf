"""JWT login, refresh and self-info endpoints."""

from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from users.auth.serializers import AuthUserSerializer, LoginSerializer, RefreshTokenSerializer
from users.auth.token_service import JWTError, JWTService


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request: Request) -> Response:
        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        user = serializer.validated_data["user"]
        tokens = JWTService.issue_token_pair(user)

        return Response(
            {
                "token_type": "Bearer",
                "access": tokens["access"],
                "refresh": tokens["refresh"],
                "user": AuthUserSerializer(user).data,
            },
            status=status.HTTP_200_OK,
        )


class RefreshView(APIView):
    permission_classes = [AllowAny]

    def post(self, request: Request) -> Response:
        serializer = RefreshTokenSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        try:
            user, access_token = JWTService.refresh_access_token(serializer.validated_data["refresh"])
        except JWTError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)

        return Response(
            {
                "token_type": "Bearer",
                "access": access_token,
                "user": AuthUserSerializer(user).data,
            },
            status=status.HTTP_200_OK,
        )


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request: Request) -> Response:
        return Response(AuthUserSerializer(request.user).data, status=status.HTTP_200_OK)