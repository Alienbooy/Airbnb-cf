"""Serializers for JWT login and refresh operations."""

from rest_framework import serializers

from infrastructure_layer.models.user import User


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(trim_whitespace=True)
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        user = User.objects.using("write_db").filter(username=attrs["username"]).first()

        if user is None or not user.check_password(attrs["password"]):
            raise serializers.ValidationError("Credenciales invalidas.")

        attrs["user"] = user
        return attrs


class RefreshTokenSerializer(serializers.Serializer):
    refresh = serializers.CharField()


class AuthUserSerializer(serializers.Serializer):
    id = serializers.UUIDField()
    username = serializers.CharField()
    email = serializers.EmailField()
