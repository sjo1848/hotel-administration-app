# Sistema de Gestión Hotelera (PMS)

PMS para operación hotelera con backend NestJS + Prisma + Postgres y frontend Vue + Pinia + Tailwind.

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
Metrics: `http://localhost:3000/metrics` (Bearer `METRICS_TOKEN`)

## Deploy (básico)
Imágenes de producción:
- Backend: `backend/Dockerfile.prod`
- Frontend: `frontend/Dockerfile.prod`

Ejemplo build:
```bash
docker build -f backend/Dockerfile.prod -t hotel-backend:prod ./backend
docker build -f frontend/Dockerfile.prod -t hotel-frontend:prod ./frontend
```

## Archivo .env ejemplo
Usa `.env.example` como base para producción.

## Variables de entorno
Archivo raíz `.env`:
```
DB_USER=admin_hotel
DB_PASSWORD=palo_alto_secure_2026
DB_NAME=hotel_pms_dev
DATABASE_URL="postgresql://admin_hotel:palo_alto_secure_2026@postgres_db:5432/hotel_pms_dev?schema=public"
JWT_SECRET=super_secret_key_hotel_2026
BACKEND_PORT=3000
FRONTEND_PORT=5173
METRICS_TOKEN=super_secret_metrics_2026
REFRESH_COOKIE_SAMESITE=lax
REFRESH_COOKIE_SECURE=false
```

## Seed de datos
```bash
docker-compose exec backend npx prisma db seed
```

Credenciales seed:
- Admin: `admin@paloalto.com` / `admin_password_123`
- Staff: `staff@paloalto.com` / `staff_password_123`

## Tests E2E
```bash
docker-compose exec backend npm run test:e2e
```

## Frontend E2E (Playwright)
Requiere backend y frontend corriendo (Docker o local).
```bash
cd frontend
npm install
npx playwright install --with-deps
npm run test:e2e
```

## CI (Frontend E2E)
El workflow `frontend_e2e` levanta backend con `docker-compose` y corre Playwright.

## Frontend E2E (Docker, recomendado)
Si no tenés Playwright instalado localmente:
```bash
docker-compose --env-file .env up -d
docker-compose --env-file .env run --rm playwright bash -lc "npm ci && npm run test:e2e"
```

## API
Documentación:
- `API.md`
- `API.txt`

Prefijo obligatorio: `/api/v1`

## Desarrollo sin Docker (opcional)
Backend:
```bash
cd backend
npm install
npx prisma generate
npm run start:dev
```

Frontend:
```bash
cd frontend
npm install
npm run dev
```

## Notas de seguridad
- Access token expira en 15 minutos.
- Refresh token expira en 7 días (HttpOnly cookie).
- Passwords con bcrypt cost 10.
- Refresh tokens ya usan HttpOnly cookies.
- Access token se mantiene solo en memoria (no localStorage).
- Refresh cookie configurable con `REFRESH_COOKIE_SAMESITE` y `REFRESH_COOKIE_SECURE`.
- Refresh tokens con rotación y detección de reuse (family + jti).

## CSP (Frontend)
El frontend incluye un CSP básico en `frontend/index.html`.
Si cambiás dominios/puertos en producción, actualizá `connect-src` acorde.

## Observabilidad (Prometheus)
Endpoint:
```bash
curl -H "Authorization: Bearer $METRICS_TOKEN" http://localhost:3000/metrics
```

Alertas recomendadas (PromQL):
```
# 5xx > 1% en 5m
sum(rate(http_requests_total{status=~"5.."}[5m])) / sum(rate(http_requests_total[5m])) > 0.01

# p95 > 500ms
histogram_quantile(0.95, sum(rate(http_request_duration_ms_bucket[5m])) by (le)) > 500

# Sin tráfico 5m
sum(rate(http_requests_total[5m])) == 0
```
