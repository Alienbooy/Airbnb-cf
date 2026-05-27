"""
Views — Solo orquesta. Sin logica de negocio.
"""

import uuid

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from aplication_layer.handlers.create_user_handler import CreateUserHandler
from aplication_layer.handlers.get_user_handler import GetUserHandler
from audit_logs.serializers.create_user_serializer import CreateUserSerializer
from audit_logs.serializers.user_view_serializer import UserViewSerializer


class RegisterView(APIView):
    """
    POST /api/users/register/
    """

    def post(self, request: Request) -> Response:
        input_serializer = CreateUserSerializer(data=request.data)
        if not input_serializer.is_valid():
            return Response(
                input_serializer.errors,
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = CreateUserHandler().handle(input_serializer.validated_data)
        output_serializer = RegisterResponseSerializer(user)
        return Response(output_serializer.data, status=status.HTTP_201_CREATED)


class GetUserView(APIView):
    """
    GET /api/users/<uuid:pk>/
    """

    permission_classes = [IsAuthenticated]

    def get(self, request: Request, pk: uuid.UUID) -> Response:
        user_view = GetUserHandler.handle(pk)

        if user_view is None:
            return Response(
                {"detail": "Usuario no encontrado."},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = UserViewSerializer(user_view)
        return Response(serializer.data, status=status.HTTP_200_OK)


from rest_framework import serializers
from infrastructure_layer.models.user import User


class RegisterResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email"]
        read_only_fields = fields
