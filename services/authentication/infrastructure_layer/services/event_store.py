"""Persist domain events in write_db."""

from domain_layer.enums.event_enums import EventType
from domain_layer.events.event_data import Event


class EventStoreService:
    @staticmethod
    def record(event_type: EventType, aggregate_id, payload: dict) -> Event:
        return Event.objects.using("write_db").create(
            event_type=event_type,
            aggregate_id=aggregate_id,
            payload=payload,
        )
