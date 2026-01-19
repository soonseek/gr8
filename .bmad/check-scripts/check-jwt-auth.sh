#!/bin/bash
# JWT 인증 구현 확인 스크립트
# .bmad/check-scripts/check-jwt-auth.sh

set -e

echo "🔐 Checking JWT Authentication Implementation..."

# 환경 변수 로드
if [ -f .env ]; then
  export $(cat .env | grep -v '^#' | xargs)
fi

# 1. JWT_SECRET_KEY 환경 변수 확인
echo "1. Checking JWT_SECRET_KEY environment variable..."
if [ -z "$JWT_SECRET_KEY" ] && ! grep -q "JWT_SECRET_KEY" .env 2>/dev/null; then
  echo "  ⚠️  WARNING: JWT_SECRET_KEY not set"
  echo "     This is optional for development, but required for production"
else
  echo "  ✅ JWT_SECRET_KEY is configured"
fi

# 2. JWT 관련 파일 확인
echo "2. Checking JWT implementation files..."

# 백엔드 JWT 파일
JWT_FILES=(
  "backend/app/auth/jwt.py"
  "backend/app/middleware/auth.py"
)

JWT_FOUND=false
for file in "${JWT_FILES[@]}"; do
  echo -n "  Checking $file... "
  if [ -f "$file" ]; then
    echo "✅ EXISTS"
    JWT_FOUND=true
  else
    echo "❌ MISSING"
  fi
done

# 3. JWT 함수 확인
echo "3. Checking JWT functions..."

if [ -f "backend/app/auth/jwt.py" ]; then
  JWT_FUNCTIONS=(
    "decode_jwt"
    "create_access_token"
    "verify_token"
  )

  for func in "${JWT_FUNCTIONS[@]}"; do
    echo -n "  Checking function $func... "
    if grep -q "def $func" backend/app/auth/jwt.py 2>/dev/null; then
      echo "✅ FOUND"
    else
      echo "❌ NOT FOUND"
    fi
  done
else
  echo "  ⚠️  Skipping function checks (jwt.py not found)"
fi

# 4. 프론트엔드 Web3 인트그레이션 확인
echo "4. Checking Web3 wallet integration..."

FRONTEND_WALLET_FILES=(
  "frontend/src/hooks/useWallet.ts"
  "frontend/src/hooks/useWeb3Auth.ts"
)

WALLET_FOUND=false
for file in "${FRONTEND_WALLET_FILES[@]}"; do
  echo -n "  Checking $file... "
  if [ -f "$file" ]; then
    echo "✅ EXISTS"
    WALLET_FOUND=true
  else
    echo "❌ MISSING"
  fi
done

# 결과
echo ""
if [ "$JWT_FOUND" = true ] && [ "$WALLET_FOUND" = true ]; then
  echo "✅ JWT authentication implementation exists"
  exit 0
elif [ "$JWT_FOUND" = true ]; then
  echo "⚠️  JWT backend exists, but frontend wallet integration is missing"
  exit 1
else
  echo "❌ FAIL: JWT authentication implementation not found"
  echo "   Implement JWT authentication in backend/app/auth/jwt.py"
  exit 1
fi
