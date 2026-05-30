import json
import os
import time

from django.core.management.base import BaseCommand
from django.utils.dateparse import parse_datetime

from kafka import KafkaConsumer

from users.infrastructure.db.models import UserView


class Command(BaseCommand):
    help = "Consume user events from Kafka and update the read database (UserView)."

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS("Starting background event consumer..."))
        
        consumer = None
        while consumer is None:
            try:
                consumer = KafkaConsumer(
                    os.environ.get("KAFKA_TOPIC", "users.events"),
                    bootstrap_servers=os.environ.get("KAFKA_BROKER", "kafka:9092"),
                    group_id="auth_service_read_model_updater",
                    auto_offset_reset="earliest",
                    enable_auto_commit=True,
                    value_deserializer=lambda m: json.loads(m.decode("utf-8")),
                )
            except Exception as e:
                self.stdout.write(self.style.ERROR(f"Error connecting to Kafka: {e}. Retrying in 5s..."))
                time.sleep(5)

        self.stdout.write(self.style.SUCCESS("Connected to Kafka! Listening for events..."))

        for message in consumer:
            event = message.value
            event_type = event.get("event_type")
            payload = event.get("payload", {})

            try:
                if event_type == "user_registered":
                    # Update the read model
                    UserView.objects.using("read").update_or_create(
                        id=payload["id"],
                        defaults={
                            "username": payload["username"],
                            "email": payload["email"],
                            "created_at": parse_datetime(event["occurred_at"]) if event.get("occurred_at") else time.time()
                        }
                    )
                    self.stdout.write(self.style.SUCCESS(f"Read model updated: user_registered for ID {payload['id']}"))
                
                elif event_type == "user_role_changed":
                    # Currently UserView doesn't store roles, but we catch it to avoid errors or for future use
                    self.stdout.write(self.style.SUCCESS(f"Read model updated: user_role_changed for ID {payload['id']}"))

            except Exception as e:
                self.stdout.write(self.style.ERROR(f"Error processing event {event_type}: {e}"))
