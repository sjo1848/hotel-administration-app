#!/bin/bash
set -e

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🚀 Iniciando Sistema de Gestion Hotelera (Elite Mode)...${NC}"

# 1. Verificar Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Error: Docker no está instalado.${NC}"
    exit 1
fi

# 2. Levantar Contenedores
echo -e "${YELLOW}📦 Levantando contenedores (Build puede tardar)...${NC}"
docker-compose up -d --build

# 3. Esperar a Postgres
echo -e "${YELLOW}⏳ Esperando a que la base de datos esté lista...${NC}"
until docker exec hotel_db_dev pg_isready -U admin_hotel > /dev/null 2>&1; do
  echo -n "."
  sleep 1
done
echo -e "\n${GREEN}✅ Base de datos lista.${NC}"

# 4. Aplicar Migraciones
echo -e "${YELLOW}🔄 Verificando y aplicando migraciones de esquema...${NC}"
# Usamos el container de backend para correr prisma ya que tiene acceso directo a la red 'hotel_network'
# Sobreescribimos DATABASE_URL para usar el hostname 'postgres_db' en lugar de 'localhost' o variables de .env local
docker-compose exec -T -e DATABASE_URL="postgresql://admin_hotel:palo_alto_secure_2026@postgres_db:5432/hotel_pms_dev?schema=public" backend npx prisma migrate deploy

echo -e "${GREEN}✅ Migraciones aplicadas.${NC}"

# 5. Generar Cliente Prisma
echo -e "${YELLOW}🔄 Regenerando cliente Prisma...${NC}"
docker-compose exec -T backend npx prisma generate

# 6. Reiniciar Backend (para tomar cambios de prisma client)
echo -e "${YELLOW}🔄 Recargando backend...${NC}"
docker-compose restart backend

echo -e "${GREEN}==============================================${NC}"
echo -e "${GREEN}🚀 SISTEMA OPERATIVO${NC}"
echo -e "${GREEN}==============================================${NC}"
echo -e "🏨 Backend:  http://localhost:3000/api/v1/docs"
echo -e "💻 Frontend: http://localhost:5173"
echo -e "🐳 Docker:   docker-compose logs -f (para ver logs)"
