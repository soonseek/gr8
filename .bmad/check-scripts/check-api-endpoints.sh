#!/bin/bash
# API 엔드포인트 확인 스크립트
# .bmad/check-scripts/check-api-endpoints.sh

set -e

# 환경 변수 로드
if [ -f .env ]; then
  export $(cat .env | grep -v '^#' | xargs)
fi

# 기본값
API_BASE_URL=${API_BASE_URL:-"http://localhost:8000"}
TIMEOUT=${TIMEOUT:-"5"}

echo "🌐 Checking API Endpoints..."
echo "Base URL: $API_BASE_URL"
echo "Timeout: ${TIMEOUT}s"

# API 엔드포인트 확인 함수
check_endpoint() {
  local endpoint=$1
  local method=${2:-"GET"}
  local description=$3

  echo -n "  Checking $method $endpoint"
  if [ -n "$description" ]; then
    echo -n " ($description)"
  fi
  echo "..."

  RESPONSE=$(curl -s -w "\n%{http_code}" -X "$method" \
    "$API_BASE_URL$endpoint" \
    --max-time "$TIMEOUT" \
    -H "Content-Type: application/json" 2>/dev/null)

  HTTP_CODE=$(echo "$RESPONSE" | tail -n1)

  if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "401" ]; then
    # 200 OK 또는 401 Unauthorized (엔드포인트는 존재함)
    echo "    ✅ EXISTS (HTTP $HTTP_CODE)"
    return 0
  elif [ "$HTTP_CODE" = "404" ]; then
    echo "    ❌ NOT FOUND (HTTP 404)"
    return 1
  elif [ "$HTTP_CODE" = "000" ]; then
    echo "    ❌ CANNOT CONNECT (server not running?)"
    return 1
  else
    echo "    ⚠️  UNEXPECTED (HTTP $HTTP_CODE)"
    return 1
  fi
}

# 백엔드 서버 실행 확인
echo "Checking if backend server is running..."
if ! curl -s --max-time 2 "$API_BASE_URL" > /dev/null 2>&1; then
  echo "❌ FAIL: Cannot connect to backend server at $API_BASE_URL"
  echo "   Hint: Start the backend server first"
  exit 1
fi

echo "✅ Backend server is running"
echo ""

# 필수 엔드포인트 확인 (custom-check-rules.yaml에서 정의 가능)
echo "Checking required endpoints..."

REQUIRED_ENDPOINTS=(
  "/api/health|GET|Health check endpoint"
  "/api/auth/me|GET|JWT authentication endpoint"
)

ALL_ENDPOINTS_EXIST=true
for endpoint_spec in "${REQUIRED_ENDPOINTS[@]}"; do
  IFS='|' read -r endpoint method description <<< "$endpoint_spec"
  if ! check_endpoint "$endpoint" "$method" "$description"; then
    ALL_ENDPOINTS_EXIST=false
  fi
done

# 결과
echo ""
if [ "$ALL_ENDPOINTS_EXIST" = true ]; then
  echo "✅ All required endpoints exist"
  exit 0
else
  echo "❌ FAIL: Some required endpoints are missing"
  exit 1
fi
