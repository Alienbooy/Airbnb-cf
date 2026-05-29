from django.core.management.base import BaseCommand

from users.infrastructure.db.models import RoleChoices, User


class Command(BaseCommand):
    help = "Create or update the default admin user."

    def handle(self, *args, **options):
        username = "admin"
        email = "admin@prueba.com"
        password = "adminsupersecreto"

        user = User.objects.filter(username=username).first()
        if user:
            user.email = email
            user.roles = [RoleChoices.ADMIN]
            user.is_staff = True
            user.is_superuser = True
            user.set_password(password)
            user.save(update_fields=["email", "roles", "is_staff", "is_superuser", "password"])
            self.stdout.write(self.style.SUCCESS("Admin actualizado."))
            return

        User.objects.create_superuser(username=username, email=email, password=password)
        self.stdout.write(self.style.SUCCESS("Admin creado."))
