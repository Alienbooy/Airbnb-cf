from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from users.interfaces.api.views import HostRoleView, LoginView, MeView, RegisterView, UserViewDetail

urlpatterns = [
    path("register", RegisterView.as_view(), name="register"),
    path("login", LoginView.as_view(), name="login"),
    path("token/refresh", TokenRefreshView.as_view(), name="token_refresh"),
    path("me", MeView.as_view(), name="me"),
    path("roles/host", HostRoleView.as_view(), name="roles_host"),
    path("users/<int:user_id>", UserViewDetail.as_view(), name="user_view"),
]
