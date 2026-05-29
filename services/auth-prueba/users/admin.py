from django.contrib import admin

from users.infrastructure.db.models import User


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ("id", "username", "email", "roles", "is_active", "created_at")
    search_fields = ("username", "email")
