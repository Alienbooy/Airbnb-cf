"""
Command Serializer — Responsabilidad unica: validar datos de entrada del comando.
"""

from rest_framework import serializers

from infrastructure_layer.models.user import User


class CreateUserSerializer(serializers.Serializer):
    """Serializer de validacion para el comando CreateUser."""

    username = serializers.CharField(
        max_length=150,
        min_length=3,
        trim_whitespace=True,
    )
    email = serializers.EmailField()
    password = serializers.CharField(
        min_length=8,
        write_only=True,
        style={"input_type": "password"},
    )

    def validate_username(self, value: str) -> str:
        if User.objects.using("write_db").filter(username=value).exists():
            raise serializers.ValidationError("Este nombre de usuario ya esta en uso.")
        return value

    def validate_email(self, value: str) -> str:
        if User.objects.using("write_db").filter(email=value).exists():
            raise serializers.ValidationError("Este correo electronico ya esta registrado.")
        return value
