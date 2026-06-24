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

- `frontend/` — SPA React servida con Vite (puerto 3001)
- `TramiteContext` (React Context) — Estado compartido entre Vista General y Cronograma
- **localStorage** — Persistencia de datos ficticios (mock data) sin backend

## Clientes / Documentos

- `DocumentosClientes/` — Archivos estáticos (imágenes, Excel) de clientes

## Changelog

| Versión | Commit | Descripción |
|---|---|---|
| v1 | 2413a54 | Initial commit: Laravel backend + React frontend (Vista General & Cronograma INVIMA) |
| v2 | 802d64c | Add recovery docs and client files |
| v3 | 3e1c900 | Programado y Real con date inputs, Cliente fijo en Cronograma, grupo colapsable DATOS DEL TRAMITE |
| v4 | 414ccc8 | Modal con FASE 1/2/3 en Programado, columnas Programado/Real con date inputs |
| v5 | 1850cf8 | Selector de Riesgo en modal Fechas, todas las opciones seleccionables, actualiza Gantt en tiempo real |
| v6 | a44799a | Fix zona horaria en getWeekIndex, celdas Gantt divididas en Programado/Real, auto-calculo FASE 2/3, fechas en barras Gantt |
| v7 | 04329e1 | stack.md: solo funcionalidades clave, sin fixes internos |
| v8 | d67a437 | Cronograma: refactor recalc(), etiquetas de fecha en celda especifica (F1 inicio, F2 segun riesgo, F3 cierre) |
| v9 | c8c9164 | Mock data con localStorage, auto-calculo FASE 3 desde FASE 2

## Funcionalidades Clave

- **Vista General**: tabla de 11 secciones / 39 columnas con datos de trámites INVIMA
- **Cronograma**: Gantt de 12 meses (48 semanas) con línea "HOY" dinámica, columnas colapsables, celdas divididas en mitad Programado (arriba) y Real (abajo)
- **Modal Fechas**: columna Programado con lápiz que abre modal con FASE 1, FASE 2, FASE 3 (Programado + Fecha) y selector de Riesgo (I/IIa/IIb/III). Auto-cálculo de FASE 2 (FASE 1 + riesgo) y FASE 3 (FASE 2 + 3 sem). Las barras del Gantt se etiquetan con la fecha de cada fase (DD/MM)
- **Sidebar**: colapsable con modo iconos, overlay mobile
- **Datos ficticios persistentes**: 12 trámites semilla en `src/data/mockData.js`. Al cargar la app, si no hay datos en localStorage, se inicializan automáticamente. Nuevos trámites y cambios en fases se guardan en localStorage.
- **Auto-cálculo de Fases**: FASE 2 se calcula desde FASE 1 según riesgo (I=3sem, IIa=5sem, IIb=16sem, III=16sem). FASE 3 se calcula como FASE 2 + 3 semanas. También al editar FASE 2 manualmente, FASE 3 se recalcula automáticamente.
