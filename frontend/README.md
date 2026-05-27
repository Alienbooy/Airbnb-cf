# StayBnb — Plataforma tipo Airbnb (Frontend)

## Stack
- **React 18** + Vite
- **React Router v6** — rutas declarativas con guards
- **Axios** — cliente HTTP apuntando al API Gateway
- **CSS Modules** — estilos con scope local

## Arquitectura de microservicios

```
API Gateway (puerto 8080)
├── /auth          → Microservicio Auth & Usuarios
├── /listings      → Microservicio Alojamientos
├── /reservations  → Microservicio Reservas
├── /payments      → Microservicio Pagos (simulados)
└── /admin         → Microservicio Administración & Reportes
```

## Estructura de carpetas

```
staybnb/
├── index.html
├── vite.config.js
├── package.json
├── .env.example
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── assets/
    │   └── styles/
    │       └── global.css
    ├── context/
    │   └── AuthContext.jsx          ← Estado global de autenticación
    ├── routes/
    │   └── guards.jsx               ← ProtectedRoute / PublicRoute
    ├── services/
    │   ├── api/
    │   │   └── gateway.js           ← Axios + interceptors JWT
    │   ├── auth/
    │   │   └── authService.js       ← Login, register, logout
    │   ├── listings/
    │   │   └── listingsService.js   ← CRUD alojamientos
    │   ├── reservations/
    │   │   └── reservationsService.js
    │   ├── payments/
    │   │   └── paymentsService.js
    │   └── admin/
    │       └── adminService.js
    ├── hooks/                       ← Custom hooks (useListing, useReservations…)
    ├── components/
    │   ├── common/                  ← Modal, Toast, Badge, Spinner…
    │   ├── layout/                  ← Navbar, Sidebar, Footer
    │   └── ui/                      ← Card, Button, Input, DatePicker…
    └── pages/
        ├── auth/
        │   ├── LoginPage.jsx        ✅ Listo
        │   ├── RegisterPage.jsx     ✅ Listo
        │   └── Auth.module.css      ✅ Listo
        ├── guest/
        │   ├── HomePage.jsx         🔜 Home con búsqueda
        │   ├── ListingsPage.jsx     🔜 Grid + filtros
        │   ├── ListingDetailPage.jsx 🔜 Detalle + reserva
        │   └── GuestDashboard.jsx   🔜 Mis reservas
        ├── host/
        │   ├── HostDashboard.jsx    🔜 Panel anfitrión
        │   ├── HostListings.jsx     🔜 Mis propiedades
        │   └── NewListingPage.jsx   🔜 Crear alojamiento
        └── admin/
            └── AdminDashboard.jsx   🔜 Panel admin
```

## Roles y navegación

| Rol     | Ruta base   | Acceso                              |
|---------|-------------|-------------------------------------|
| guest   | /           | Explorar, ver detalles, reservar    |
| host    | /host       | Panel, crear/editar alojamientos    |
| admin   | /admin      | Moderación, usuarios, reportes      |

## Inicio rápido

```bash
cp .env.example .env
npm install
npm run dev
```

El frontend hace proxy de todas las peticiones `/auth`, `/listings`, etc. hacia el API Gateway en el puerto 8080 (configurable en vite.config.js).
