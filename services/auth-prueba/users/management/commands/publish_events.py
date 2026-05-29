import os

from django.core.management.base import BaseCommand
from django.utils import timezone

from users.infrastructure.db.models import UserEvent
from users.infrastructure.messaging.kafka_producer import send_user_event


class Command(BaseCommand):
    help = "Publish pending user events to Kafka in order."

    def add_arguments(self, parser):
        parser.add_argument("--batch-size", type=int, default=int(os.environ.get("EVENT_PUBLISH_BATCH", "100")))
        parser.add_argument("--include-failed", action="store_true")

    def handle(self, *args, **options):
        batch_size = options["batch_size"]
        include_failed = options["include_failed"]

        statuses = [UserEvent.Status.PENDING]
        if include_failed:
            statuses.append(UserEvent.Status.FAILED)

        events = (
            UserEvent.objects.filter(status__in=statuses)
            .order_by("id")
            .only("id", "event_type", "aggregate_id", "payload", "occurred_at", "status")[:batch_size]
        )

        if not events:
            self.stdout.write(self.style.SUCCESS("No pending events."))
            return

        published = 0
        failed = 0
        for event in events:
            ok = send_user_event(event)
            if ok:
                event.status = UserEvent.Status.SENT
                event.sent_at = timezone.now()
                event.error = ""
                event.save(update_fields=["status", "sent_at", "error"])
                published += 1
            else:
                event.status = UserEvent.Status.FAILED
                event.error = "publish_failed"
                event.save(update_fields=["status", "error"])
                failed += 1

        self.stdout.write(self.style.SUCCESS(f"Published: {published}, Failed: {failed}"))
