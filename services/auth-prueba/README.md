# Auth microservice (Django + DRF + CQRS)

Servicio de autenticacion y usuarios con CQRS, Kafka y dos bases de datos (write/read).

## Requisitos

- Python 3.11+
- Docker (opcional)

## Configuracion local

1) Crear y activar venv

```bash
python -m venv .venv
.venv\Scripts\activate
```

2) Variables de entorno

```bash
copy .env.example .env
```

3) Instalar dependencias

```bash
pip install -r requirements.txt
```

4) Migraciones

```bash
python manage.py makemigrations
python manage.py migrate
```

5) Ejecutar

```bash
python manage.py runserver
```

## Docker Compose

```bash
docker compose up --build
```

El contenedor aplica migraciones y crea/actualiza el admin automaticamente al iniciar.

## Endpoints

- POST /api/auth/register (roles: client, host, admin) - no devuelve token
- POST /api/auth/login (devuelve access y refresh)
- POST /api/auth/token/refresh
- GET /api/auth/me
- GET /api/auth/users/<id>
- POST /api/auth/roles/host (setea rol host)
- DELETE /api/auth/roles/host (setea rol client)

## Notas de CQRS

- Escritura: `users_user` y `users_event` en `airbnb_write`.
- Lectura: `users_userview` en `airbnb_read` (solo lectura).

## Kafka

- Broker: `KAFKA_BROKER` (default: `kafka:9092`)
- Topic: `users.events`
