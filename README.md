# 🏠 AlojateYa (StayBnb)

Plataforma de alojamientos estilo Airbnb con arquitectura de microservicios, API Gateway y frontend con Server-Side Rendering (SSR).

---

## 📐 Arquitectura

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
          ┌──────▼──────┐ ┌─────▼──────┐
          │  Frontend   │ │   Auth     │
          │  SSR (Node) │ │  Service   │
          │  Express    │ │  Django    │
          │  :5173      │ │  :8000     │
          └─────────────┘ └─────┬──────┘
                                │
                          ┌─────▼──────┐   ┌────────────┐
                          │ PostgreSQL │   │  Redpanda   │
                          │  :5432     │   │  (Kafka)    │
                          └────────────┘   │  :9092      │
                                           └────────────┘
```

---

## 🛠️ Requisitos

| Herramienta      | Versión mínima |
| ---------------- | -------------- |
| **Docker**       | 24+            |
| **Docker Compose** | 2.20+        |
| **Git**          | 2.30+          |

> [!NOTE]
> No necesitás instalar Node.js, Python ni PostgreSQL en tu máquina. Todo corre dentro de Docker.

---

## 🚀 Levantar el proyecto

### 1. Clonar el repositorio

```bash
git clone https://github.com/Alienbooy/tu-repo.git
cd tu-repo
```

### 2. Configurar variables de entorno

El servicio de autenticación necesita un archivo `.env`. Ya existe uno preconfigurado en:

```
services/auth-prueba/.env
```

Si necesitás personalizarlo, estos son los valores por defecto:

```env
DJANGO_SECRET_KEY=contraseñasecreta01020304050607
DJANGO_DEBUG=1
DJANGO_ALLOWED_HOSTS=*

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME_WRITE=airbnb_write
DB_NAME_READ=airbnb_read

KAFKA_ENABLED=1
KAFKA_BROKER=kafka:9092
KAFKA_TOPIC=users.events
```

### 3. Levantar todo con Docker Compose

```bash
docker-compose up -d
```

Esto levanta **5 contenedores**:

| Contenedor     | Imagen                       | Puerto | Descripción                           |
| -------------- | ---------------------------- | ------ | ------------------------------------- |
| `frontend`     | `node:20-alpine`             | 5173   | Frontend React con SSR (Express)      |
| `apisix`       | `apache/apisix:3.8.0-debian` | 9080   | API Gateway                           |
| `auth_service` | Build local (Django)         | 8000   | Microservicio de autenticación        |
| `auth_db`      | `postgres:16`                | 5433   | Base de datos PostgreSQL (CQRS)       |
| `kafka`        | `redpandadata/redpanda`      | 9092   | Message broker (Redpanda/Kafka)       |

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
[🚀 PRODUCCIÓN] SSR server → http://localhost:5173
```

---

## 🌐 Acceder a la aplicación

| URL                              | Descripción                        |
| -------------------------------- | ---------------------------------- |
| `http://localhost:5173`          | 🏠 Frontend (acceso directo)       |
| `http://localhost:9080`          | 🌐 API Gateway (APISIX)           |
| `http://localhost:8000`          | 🔐 Auth Service (Django, directo) |

### Flujo recomendado

Accedé siempre a través del **frontend directo**: `http://localhost:5173`

Las llamadas a la API del frontend van automáticamente al gateway en `localhost:9080`.

---

## 🔄 Server-Side Rendering (SSR)

El frontend implementa SSR con Express + React. Así funciona:

```
1. 🌐 El usuario entra a http://localhost:5173/listings

2. 🖥️ El servidor Express ejecuta renderToString(<App />)
   → Genera el HTML completo (títulos, imágenes, textos)
   → Lo envía al navegador de inmediato

3. 👁️ El usuario ve la página AL INSTANTE (sin pantalla blanca)

4. ⚡ El JavaScript (entry-client.js) se descarga en segundo plano
   → React "hidrata" la página silenciosamente
   → Los botones, formularios y links se activan
```

### Archivos clave del SSR

```
frontend/
├── server.js               ← Servidor Express (renderiza HTML en el servidor)
├── index.html              ← Template HTML con <!--app-html--> como placeholder
├── src/
│   ├── entry-client.jsx    ← Punto de entrada del browser (hidratación)
│   ├── entry-server.jsx    ← Punto de entrada del servidor (renderToString)
│   └── App.jsx             ← Componente raíz de React
```

---

## 📋 Comandos útiles

### Docker

```bash
# Levantar todo
docker-compose up -d

# Ver logs de un servicio
docker logs frontend -f
docker logs auth_service -f

# Reiniciar un servicio
docker-compose restart frontend

# Parar todo
docker-compose down

# Parar y borrar volúmenes (reset completo)
docker-compose down -v

# Reconstruir un servicio después de cambios
docker-compose up -d --force-recreate frontend
```

### Frontend (dentro del contenedor)

```bash
# Entrar al contenedor
docker exec -it frontend sh

# Recompilar manualmente
npm run build

# Ver archivos compilados
ls dist/client/
ls dist/server/
```

---

## 🗂️ Estructura del proyecto

```
.
├── conf/                          # Configuración del API Gateway
│   ├── config.yaml                # Config base de APISIX
│   └── apisix.yaml                # Rutas y upstreams declarativos
│
├── frontend/                      # 🖥️ Frontend React + SSR
│   ├── server.js                  # Servidor Express para SSR
│   ├── vite.config.js             # Configuración de Vite (build)
│   ├── package.json               # Dependencias y scripts
│   ├── index.html                 # Template HTML
│   └── src/
│       ├── entry-client.jsx       # Hidratación en el browser
│       ├── entry-server.jsx       # Renderizado en el servidor
│       ├── App.jsx                # Componente raíz + rutas
│       ├── context/               # AuthContext (estado global)
│       ├── pages/                 # Páginas (auth, guest, host, admin)
│       ├── routes/                # Guards de autenticación
│       ├── services/              # API gateway + auth service
│       └── assets/                # Estilos globales
│
├── services/
│   └── auth-prueba/               # 🔐 Microservicio Auth (Django + DRF)
│       ├── Dockerfile
│       ├── .env                   # Variables de entorno
│       ├── manage.py
│       ├── auth_service/          # Config Django
│       ├── users/                 # App de usuarios
│       └── docker/
│           └── db/init.sql        # Inicialización de la BD
│
└── docker-compose.yml             # 🐳 Orquestación de todos los servicios
```

---

## 🔐 API Gateway — Rutas

El API Gateway (APISIX) enruta las peticiones así:

| Ruta           | Destino                     | Descripción                    |
| -------------- | --------------------------- | ------------------------------ |
| `/auth/*`      | `auth_service:8000`         | Autenticación (login, registro)|
| `/auth/profile`| `auth_service:8000/api/auth/me` | Perfil del usuario          |
| `/api/*`       | `auth_service:8000`         | API genérica del backend       |
| `/*`           | `frontend:5173`             | Frontend SSR (catch-all)       |

---

## 🐛 Troubleshooting

### El frontend no arranca

```bash
# Ver logs para identificar el error
docker logs frontend

# Si hay error de dependencias, limpiar y reiniciar
docker-compose down
docker volume rm airbnb_frontend_node_modules
docker-compose up -d
```

### Error de conexión a la base de datos

```bash
# Verificar que auth_db está corriendo
docker logs auth_db

# Reiniciar el servicio de auth
docker-compose restart auth_service
```

### Los cambios en el frontend no se reflejan

El frontend corre en modo **producción** dentro de Docker. Para ver cambios:

```bash
# Reconstruir y reiniciar
docker-compose up -d --force-recreate frontend
```

> [!TIP]
> Para desarrollo local con hot-reload (fuera de Docker), podés correr `npm run dev` directamente en la carpeta `frontend/`.

---

## 👥 Roles de usuario

| Rol       | Acceso                                            |
| --------- | ------------------------------------------------- |
| `guest`   | Home, listados, detalle, dashboard de huésped     |
| `host`    | Dashboard de host, gestión de propiedades         |
| `admin`   | Panel de administración                           |

---

## 📄 Licencia

Proyecto privado — Uso educativo.
