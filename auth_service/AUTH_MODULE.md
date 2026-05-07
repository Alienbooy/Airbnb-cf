# Auth Module Contract

Este proyecto funciona como un módulo de autenticación independiente,
implementado con Django, Django REST Framework, CQRS y JWT.

Su objetivo es exponer un contrato HTTP estable para que otros módulos o
servicios, sin importar la tecnología, puedan integrarse mediante peticiones
REST y tokens Bearer.

## Responsabilidad del módulo

- Registrar usuarios.
- Autenticar credenciales.
- Emitir y renovar JWT.
- Exponer datos públicos del usuario autenticado.
- Mantener separación entre escritura y lectura con CQRS.

## Arquitectura

- `write_db`: guarda `users_user` y `users_event`.
- `read_db`: guarda `users_userview`.
- `api/users/`: comandos y consultas del recurso usuario.
- `api/auth/`: autenticación, refresh y perfil autenticado.

## Flujo de negocio

1. `POST /api/users/register/` crea un usuario en `write_db`.
2. El sistema registra el evento `USER_CREATED` en `users_event`.
3. El sistema proyecta el usuario público en `read_db`.
4. `POST /api/auth/login/` valida credenciales y emite JWT.
5. `GET /api/auth/me/` permite leer el usuario autenticado.
6. `POST /api/auth/refresh/` renueva el access token.

## Contrato HTTP

### Registro

- Method: `POST`
- URL: `/api/users/register/`
- Body:

```json
{
  "username": "juan123",
  "email": "juan123@mail.com",
  "password": "password123"
}
```

### Login

- Method: `POST`
- URL: `/api/auth/login/`
- Body:

```json
{
  "username": "juan123",
  "password": "password123"
}
```

- Response:

```json
{
  "token_type": "Bearer",
  "access": "...",
  "refresh": "...",
  "user": {
    "id": "...",
    "username": "juan123",
    "email": "juan123@mail.com"
  }
}
```

### Perfil autenticado

- Method: `GET`
- URL: `/api/auth/me/`
- Header:

```http
Authorization: Bearer <access_token>
```

### Refresh

- Method: `POST`
- URL: `/api/auth/refresh/`
- Body:

```json
{
  "refresh": "<refresh_token>"
}
```

## Integración desde otras tecnologías

Este módulo puede ser consumido desde cualquier lenguaje o plataforma que
pueda hacer requests HTTP.

### Reglas de integración

- Usar `POST /api/auth/login/` para obtener tokens.
- Enviar el access token en `Authorization: Bearer <token>`.
- Usar `refresh` solo cuando el access token expire.
- Tratar este módulo como fuente de identidad.
- No escribir directamente en las tablas de PostgreSQL desde otro sistema.

### Ejemplos de clientes

- Frontend React o Vue.
- Backend Node.js.
- Backend Java Spring.
- Backend .NET.
- Servicios Python, Go, PHP o Ruby.

## CQRS aplicado

- Comandos: registro de usuario.
- Lecturas: perfil público del usuario.
- Eventos: historial de acciones de escritura.

La separación permite que la base de lectura pueda evolucionar de forma
independiente del modelo de escritura.

## Seguridad

- El password nunca se expone en respuestas.
- El JWT viaja en el header `Authorization`.
- El access token es de corta duración.
- El refresh token se usa solo para renovar acceso.

## Tablas creadas

- `users_user`
- `users_event`
- `users_userview`

## Uso esperado

Este módulo no depende del frontend ni del stack del consumidor. Cualquier
otro sistema puede conectarse siempre que respete el contrato HTTP y el uso de
JWT Bearer  
