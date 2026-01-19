#!/bin/bash
# Web3 블록체인 노드 연결 확인 스크립트
# .bmad/check-scripts/check-blockchain-node.sh

set -e

# 환경 변수 로드
if [ -f .env ]; then
  export $(cat .env | grep -v '^#' | xargs)
fi

# 기본값
RPC_URL=${RPC_URL:-"http://localhost:8545"}
EXPECTED_CHAIN_ID=${EXPECTED_CHAIN_ID:-4148}  # Monad testnet

echo "🔗 Checking Blockchain Node Connection..."
echo "RPC URL: $RPC_URL"
echo "Expected Chain ID: $EXPECTED_CHAIN_ID"

# 체인 ID 확인
CHAIN_ID_HEX=$(curl -s -X POST "$RPC_URL" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}' \
  | jq -r '.result')

if [ -z "$CHAIN_ID_HEX" ] || [ "$CHAIN_ID_HEX" = "null" ]; then
  echo "❌ FAIL: Cannot connect to blockchain node at $RPC_URL"
  exit 1
fi

# 16진수를 10진수로 변환
CHAIN_ID=$((CHAIN_ID_HEX))

echo "✅ Connected to blockchain node"
echo "   Chain ID: $CHAIN_ID (0x$CHAIN_ID_HEX)"

# 체인 ID 확인
if [ "$CHAIN_ID" -eq "$EXPECTED_CHAIN_ID" ]; then
  echo "✅ Correct chain (Monad testnet)"
  exit 0
else
  echo "❌ FAIL: Wrong chain ID (expected $EXPECTED_CHAIN_ID, got $CHAIN_ID)"
  exit 1
fi
