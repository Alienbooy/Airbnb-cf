"""URLs raíz del proyecto auth_service."""

from django.urls import include, path

urlpatterns = [
    path("api/auth/", include("users.auth.urls")),
    path("api/users/", include("users.urls", namespace="users")),
]
