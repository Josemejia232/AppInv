# Stack Tecnológico

## Frontend

| Tecnología | Versión | Propósito |
|---|---|---|
| React | ^19.2.7 | UI library |
| React Router DOM | ^7.18.0 | Enrutamiento SPA |
| Vite | ^8.1.0 | Bundler / dev server |
| Tailwind CSS | ^4.3.1 | Estilos utility-first |
| PostCSS | ^8.5.15 | Procesador CSS |
| Autoprefixer | ^10.5.1 | Prefijos CSS |
| Oxlint | ^1.69.0 | Linter |
| lucide-react | ^1.21.0 | Iconos SVG |
| date-fns | ^4.4.0 | Manipulación de fechas |
| clsx | ^2.1.1 | Conditional classnames |
| tailwind-merge | ^3.6.0 | Merge de clases Tailwind |

## Backend

| Tecnología | Propósito |
|---|---|
| Laravel 13 (PHP 8.4) | API REST full-stack framework |
| Eloquent ORM | Modelo de datos |
| Sanctum | Autenticación API |
| SQLite | Base de datos local |

## Infraestructura

- `backend/` — API Laravel servida con `php artisan serve` (puerto 8000)
- `frontend/` — SPA React servida con Vite (puerto 3001), proxy inverso `/api` → `localhost:8000`
- `TramiteContext` (React Context) — Estado compartido entre Vista General y Cronograma
- Base de datos SQLite en `backend/database/`

## Clientes / Documentos

- `DocumentosClientes/` — Archivos estáticos (imágenes, Excel) de clientes
