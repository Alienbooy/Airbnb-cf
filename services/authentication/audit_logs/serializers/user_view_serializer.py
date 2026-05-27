"""
Query Serializer — Responsabilidad unica: serializar el UserView para la respuesta.
"""

from rest_framework import serializers

from infrastructure_layer.models.user_view import UserView


class UserViewSerializer(serializers.ModelSerializer):
    """Serializer de salida para el read model UserView."""

    class Meta:
        model = UserView
        fields = ["id", "username", "email", "created_at"]
        read_only_fields = fields
