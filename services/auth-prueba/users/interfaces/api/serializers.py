from rest_framework import serializers

from users.application.commands.login_user import authenticate_user
from users.application.commands.register_user import register_user
from users.infrastructure.db.models import RoleChoices, User, UserView


class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=6)
    roles = serializers.ListField(
        child=serializers.ChoiceField(choices=RoleChoices.choices),
        required=False,
        allow_empty=True,
    )

    def create(self, validated_data: dict) -> User:
        if "roles" not in validated_data or not validated_data["roles"]:
            validated_data["roles"] = [RoleChoices.CLIENT]
        try:
            return register_user(validated_data)
        except ValueError as e:
            raise serializers.ValidationError({"detail": str(e)})




class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs: dict) -> dict:
        try:
            user = authenticate_user(attrs["email"], attrs["password"])
        except ValueError:
            raise serializers.ValidationError({"detail": "invalid_credentials"})
        attrs["user"] = user
        return attrs


class UserViewSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserView
        fields = ("id", "username", "email", "created_at")


class MeSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username", "email", "roles", "created_at")
