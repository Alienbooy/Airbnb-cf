"""URLs raíz del proyecto auth_service."""

from django.conf.urls import handler404
from django.urls import path

from audit_logs.views.auth_views import LoginView, MeView, RefreshView
from audit_logs.views.user_views import GetUserView, RegisterView
from global_views import custom_404_view

handler404 = custom_404_view

urlpatterns = [
    path("api/auth/login/", LoginView.as_view(), name="login"),
    path("api/auth/refresh/", RefreshView.as_view(), name="refresh"),
    path("api/auth/me/", MeView.as_view(), name="me"),
    path("api/users/register/", RegisterView.as_view(), name="register"),
    path("api/users/<uuid:pk>/", GetUserView.as_view(), name="get-user"),
]
