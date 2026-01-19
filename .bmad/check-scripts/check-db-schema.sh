#!/bin/bash
# 데이터베이스 스키마 확인 스크립트
# .bmad/check-scripts/check-db-schema.sh

set -e

# 환경 변수 로드
if [ -f .env ]; then
  export $(cat .env | grep -v '^#' | xargs)
fi

# 기본값
DB_HOST=${DB_HOST:-"localhost"}
DB_PORT=${DB_PORT:-"5432"}
DB_NAME=${DB_NAME:-"gr8"}
DB_USER=${DB_USER:-"postgres"}

echo "🗄️  Checking Database Schema..."
echo "Host: $DB_HOST:$DB_PORT"
echo "Database: $DB_NAME"

# 테이블 존재 확인 함수
check_table() {
  local table=$1
  echo -n "  Checking table '$table'... "

  OUTPUT=$(docker exec gr8-db psql -U "$DB_USER" -d "$DB_NAME" -tAc "\d $table" 2>/dev/null || echo "")

  if [ -n "$OUTPUT" ]; then
    echo "✅ EXISTS"
    return 0
  else
    echo "❌ MISSING"
    return 1
  fi
}

# 컬럼 존재 확인 함수
check_column() {
  local table=$1
  local column=$2
  echo -n "    Checking column '$table.$column'... "

  OUTPUT=$(docker exec gr8-db psql -U "$DB_USER" -d "$DB_NAME" -tAc "SELECT column_name FROM information_schema.columns WHERE table_name='$table' AND column_name='$column'" 2>/dev/null || echo "")

  if [ -n "$OUTPUT" ]; then
    echo "✅ EXISTS"
    return 0
  else
    echo "❌ MISSING"
    return 1
  fi
}

# DB 연결 확인
echo "Checking database connection..."
if ! docker exec gr8-db psql -U "$DB_USER" -d "$DB_NAME" -c "SELECT 1" > /dev/null 2>&1; then
  echo "❌ FAIL: Cannot connect to database"
  echo "   Hint: Make sure Docker container 'gr8-db' is running"
  exit 1
fi

echo "✅ Database connected"

# 필수 테이블 확인 (custom-check-rules.yaml에서 정의)
echo "Checking required tables..."

REQUIRED_TABLES=(
  "users"
  "strategies"
  "backtests"
)

ALL_TABLES_EXIST=true
for table in "${REQUIRED_TABLES[@]}"; do
  if ! check_table "$table"; then
    ALL_TABLES_EXIST=false
  fi
done

# 필수 컬럼 확인 (users 테이블)
echo "Checking required columns..."
if docker exec gr8-db psql -U "$DB_USER" -d "$DB_NAME" -tAc "\d users" > /dev/null 2>&1; then
  echo "  Table 'users' exists, checking columns..."

  REQUIRED_COLUMNS=(
    "wallet_address"
    "role"
  )

  for column in "${REQUIRED_COLUMNS[@]}"; do
    if ! check_column "users" "$column"; then
      ALL_TABLES_EXIST=false
    fi
  done
fi

# 결과
echo ""
if [ "$ALL_TABLES_EXIST" = true ]; then
  echo "✅ All required tables and columns exist"
  exit 0
else
  echo "❌ FAIL: Some required tables or columns are missing"
  echo "   Run migrations to create missing tables/columns"
  exit 1
fi
