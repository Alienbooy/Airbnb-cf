import json
import os
from typing import Any

from kafka import KafkaProducer

from users.infrastructure.db.models import UserEvent

_producer_instance: KafkaProducer | None = None


def _producer() -> KafkaProducer:
    global _producer_instance
    if _producer_instance is not None:
        return _producer_instance

    _producer_instance = KafkaProducer(
        bootstrap_servers=os.environ.get("KAFKA_BROKER", "kafka:9092"),
        value_serializer=lambda v: json.dumps(v).encode("utf-8"),
        acks=1,
    )
    return _producer_instance


def send_user_event(event: UserEvent) -> bool:
    if os.environ.get("KAFKA_ENABLED", "1") != "1":
        return False

    payload: dict[str, Any] = {
        "id": event.id,
        "event_type": event.event_type,
        "aggregate_id": event.aggregate_id,
        "payload": event.payload,
        "occurred_at": event.occurred_at.isoformat(),
    }

    producer = _producer()
    try:
        producer.send(os.environ.get("KAFKA_TOPIC", "users.events"), payload)
        producer.flush()
        return True
    except Exception:
        return False
