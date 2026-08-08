# Sistema de Gestión Hotelera (PMS) — Legacy Reference

> **Repository status: legacy / superseded.**
>
> This NestJS + Vue PMS is retained for historical and learning reference. Active hotel-management development and portfolio presentation continue in [`hotel-management-system`](https://github.com/sjo1848/hotel-management-system), the current flagship Rust + React multi-hotel SaaS.
>
> Do not treat this repository as the canonical HMS implementation or invest new feature work here unless it is intentionally reactivated.

## Historical scope

PMS para operación hotelera con backend NestJS + Prisma + PostgreSQL y frontend Vue + Pinia + Tailwind.

## Stack
- Backend: NestJS, Prisma, PostgreSQL
- Frontend: Vue 3, Pinia, Tailwind
- Infra: Docker Compose

## Requisitos
- Docker + Docker Compose
- Node 20+ (solo si corres fuera de Docker)

## Inicio rápido (Docker)
```bash
docker-compose up --build
```

Backend: `http://localhost:3000/api/v1`  
Frontend: `http://localhost:5173`  
Metrics: `http://localhost:3000/metrics`

## Deploy (básico)
Imágenes de producción:
- Backend: `backend/Dockerfile.prod`
- Frontend: `frontend/Dockerfile.prod`

Ejemplo build:
```bash
docker build -f backend/Dockerfile.prod -t hotel-backend:prod ./backend
docker build -f frontend/Dockerfile.prod -t hotel-frontend:prod ./frontend
```

## Configuración
Usa `.env.example` como base. No reutilices credenciales de desarrollo antiguas ni publiques secretos reales.

## Tests E2E
```bash
docker-compose exec backend npm run test:e2e
```

## Frontend E2E (Playwright)
```bash
cd frontend
npm install
npx playwright install --with-deps
npm run test:e2e
```

## API
Documentación histórica:
- `API.md`
- `API.txt`

Prefijo: `/api/v1`

## Notas
- Este repositorio conserva una etapa anterior del proyecto hotelero.
- Puede contener documentación o decisiones que ya no reflejan la implementación actual.
- Para arquitectura, QA, seguridad, observabilidad y demo de portfolio vigentes, usar [`sjo1848/hotel-management-system`](https://github.com/sjo1848/hotel-management-system).
- Recomendación: archivar este repositorio desde GitHub Settings cuando ya no necesites aceptar cambios aquí.
