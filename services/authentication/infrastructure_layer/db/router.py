"""CQRS database router."""

WRITE_MODELS = {"user", "event"}
READ_MODELS = {"userview"}
APP_LABEL = "audit_logs"


class CQRSRouter:
    def db_for_read(self, model, **hints):
        if model._meta.app_label == APP_LABEL:
            model_name = model._meta.model_name
            if model_name in READ_MODELS:
                return "read_db"
            if model_name in WRITE_MODELS:
                return "write_db"
        return None

    def db_for_write(self, model, **hints):
        if model._meta.app_label == APP_LABEL:
            model_name = model._meta.model_name
            if model_name in READ_MODELS:
                return "read_db"
            if model_name in WRITE_MODELS:
                return "write_db"
        return None

    def allow_relation(self, obj1, obj2, **hints):
        db_set = {
            self.db_for_write(type(obj1)),
            self.db_for_write(type(obj2)),
        }
        if len(db_set) == 1:
            return True
        return None

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        if app_label != APP_LABEL:
            return None
        if model_name is None:
            return None
        model_name_lower = model_name.lower()
        if db == "write_db":
            return model_name_lower in WRITE_MODELS
        if db == "read_db":
            return model_name_lower in READ_MODELS
        return None
