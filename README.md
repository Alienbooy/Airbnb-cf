# AlojateYa (StayBnb)

Plataforma de alojamientos estilo Airbnb con arquitectura de microservicios, API Gateway y frontend con Server-Side Rendering (SSR).

---

## Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                        NAVEGADOR                            │
│                  http://localhost:5173                       │
└────────────────┬───────────────┬────────────────────────────┘
                 │               │
          Páginas (HTML)    API calls (JSON)
                 │               │
                 │       ┌───────▼───────┐
                 │       │   APISIX      │
                 │       │  API Gateway  │
                 │       │  :9080        │
                 │       └───────┬───────┘
                 │               │
          ┌──────▼──────┐ ┌─────▼──────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐
          │  Frontend   │ │   Auth     │ │Alojamiento │ │ Reservas   │ │ Admin      │
          │  SSR (Node) │ │  Service   │ │  Service   │ │  Service   │ │ Service    │
          │  Express    │ │  Django    │ │  Java      │ │  Node.js   │ │ Node.js    │
          │  :5173      │ │  :8000     │ │  :8081     │ │  :4002     │ │ :8082      │
          └─────────────┘ └─────┬──────┘ └─────┬──────┘ └─────┬──────┘ └─────┬──────┘
                                │              │              │              │
                          ┌─────▼──────┐ ┌─────▼──────┐ ┌─────▼──────┐ ┌─────▼──────┐
                          │   auth_db  │ │alojamientos│ │reservations│ │  admin_db  │
                          │ PostgreSQL │ │_db (CQRS)  │ │    -db     │ │ PostgreSQL │
                          │  :5440     │ │  :5441     │ │   :5442    │ │   :5443    │
                          └────────────┘ └────────────┘ └────────────┘ └────────────┘
                                │              │              │              │
                                └──────────────┼──────────────┼──────────────┘
                                         ┌─────▼──────┐
                                         │  Redpanda  │
                                         │  (Kafka)   │
                                         │  :9092     │
                                         └────────────┘
```

---

## Requisitos

| Herramienta      | Versión mínima |
| ---------------- | -------------- |
| **Docker**       | 24+            |
| **Docker Compose** | 2.20+        |
| **Git**          | 2.30+          |

> [!NOTE]
> No necesitás instalar Node.js, Python, Java ni PostgreSQL en tu máquina. Todo corre dentro de Docker.

---

## Levantar el proyecto

### 1. Clonar el repositorio

```bash
git clone https://github.com/Alienbooy/Airbnb-cf.git
cd Airbnb-cf
```

### 2. Configurar variables de entorno

El servicio de autenticación necesita un archivo `.env`. Ya existe uno preconfigurado en:

```
services/auth-prueba/.env
```

### 3. Levantar todo con Docker Compose

```bash
docker-compose up -d
```

Esto levanta toda la infraestructura, que incluye:

| Contenedor             | Puerto Host | Descripción                                 |
| ---------------------- | ----------- | ------------------------------------------- |
| `frontend`             | 5173        | Frontend React con SSR (Express)            |
| `apisix`               | 9080        | API Gateway                                 |
| `auth_service`         | 8000        | Microservicio de Autenticación (Django)     |
| `auth_worker`          | -           | Publicador asíncrono de eventos (Django)    |
| `auth_consumer`        | -           | Consumidor asíncrono de eventos (Django)    |
| `alojamientos_service` | 8081        | Microservicio de Alojamientos (Spring Boot) |
| `reservations-service` | 4002        | Microservicio de Reservas (Node.js)         |
| `admin_service`        | 8082        | Microservicio de Administración (Node.js)   |
| `kafka`                | 9092        | Message broker (Redpanda/Kafka)             |
| `auth_db`              | 5440        | BD de Autenticación (PostgreSQL)            |
| `alojamientos_db`      | 5441        | BD de Alojamientos - CQRS (PostgreSQL)      |
| `reservations-db`      | 5442        | BD de Reservas (PostgreSQL)                 |
| `admin_db`             | 5443        | BD de Admin y Reportes (PostgreSQL)         |

### 4. Verificar que todo está corriendo

```bash
docker-compose ps
```

Todos los contenedores deberían mostrar estado `Up`.

### 5. Esperar al build del frontend

El frontend compila automáticamente al iniciar (~30 segundos). Podés ver el progreso con:

```bash
docker logs frontend -f
```

Cuando veas este mensaje, está listo:

```
[PRODUCCIÓN] SSR server → http://localhost:5173
```

---

## Acceder a la aplicación

Accedé siempre a través del **frontend directo**: [http://localhost:5173](http://localhost:5173)

Las llamadas a la API del frontend van automáticamente al gateway en `localhost:9080`.

---

## Server-Side Rendering (SSR)

El frontend implementa SSR con Express + React. Así funciona:

```
1.  El usuario entra a http://localhost:5173/listings
2.  El servidor Express ejecuta renderToString(<App />)
   → Genera el HTML completo (títulos, imágenes, textos)
   → Lo envía al navegador de inmediato
3.  El usuario ve la página AL INSTANTE (sin pantalla blanca)
4.  El JavaScript (entry-client.js) se descarga en segundo plano
   → React "hidrata" la página silenciosamente
   → Los botones, formularios y links se activan
```

---

##  Comandos útiles

### Docker

```bash
# Levantar todo
docker-compose up -d

# Ver logs de un servicio específico
docker logs frontend -f
docker logs alojamientos_service -f

# Parar todo
docker-compose down

# Parar y borrar volúmenes (reset completo de base de datos)
docker-compose down -v

# Reconstruir un servicio después de cambios
docker-compose up -d --force-recreate frontend
```

---

##  Estructura del proyecto

```
.
├── conf/                          # Configuración del API Gateway
│   ├── config.yaml                # Config base de APISIX
│   └── apisix.yaml                # Rutas y upstreams declarativos
│
├── frontend/                      #  Frontend React + SSR (Vite/Node)
│
├── services/
│   ├── auth-prueba/               #  Microservicio Auth (Django + DRF)
│   ├── alojamientos/              #  Microservicio Alojamientos (Java Spring Boot + CQRS)
│   ├── reservas-service/          #  Microservicio Reservas (Node.js/Express)
│   └── admin-reportes/            #  Microservicio Admin (Node.js/Express)
│
└── docker-compose.yml             #  Orquestación de todos los servicios
```

---

##  API Gateway — Rutas

El API Gateway (APISIX) valida el JWT y enruta las peticiones así:

| Ruta                  | Destino                         | Descripción                    |
| --------------------- | ------------------------------- | ------------------------------ |
| `/auth/*`             | `auth_service:8000`             | Autenticación (login, registro)|
| `/api/admin/*`        | `admin_service:8082`            | Gestión de moderación y logs   |
| `/api/listings/*`     | `alojamientos_service:8081`     | Búsqueda y gestión de catálogos|
| `/api/reservations/*` | `reservations-service:4002`     | Gestión de reservas            |
| `/api/*`              | `auth_service:8000`             | Backend base y validación token|
| `/*`                  | `frontend:5173`                 | Frontend SSR (catch-all)       |

---

##  Roles de usuario

| Rol       | Acceso                                            |
| --------- | ------------------------------------------------- |
| `guest`   | Home, listados, detalle, dashboard de huésped, ver reservas |
| `host`    | Dashboard de host, creación y edición de propiedades |
| `admin`   | Panel de administración, moderación (aprobar/rechazar) |

---

##  Licencia

Proyecto privado — Uso educativo.
