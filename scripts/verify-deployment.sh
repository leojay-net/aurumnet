#!/bin/bash

# Simple end-to-end deployment verification script for AurumNet
# Usage: ./scripts/verify-deployment.sh [network]
# Networks: local, testnet, mainnet (default: local)

set -e

NETWORK=${1:-local}
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
CONTRACTS_DIR="$PROJECT_ROOT/contracts"
ADDRESSES_FILE="$CONTRACTS_DIR/deployment-addresses.json"

if [ ! -f "$ADDRESSES_FILE" ]; then
  echo "❌ deployment-addresses.json not found at: $ADDRESSES_FILE"
  echo "   Run ./scripts/deploy.sh [network] first."
  exit 1
fi

case $NETWORK in
  local)
    RPC_URL="${RPC_URL:-http://127.0.0.1:8545}"
    ;;
  testnet)
    RPC_URL="${MANTLE_TESTNET_RPC:-https://rpc.testnet.mantle.xyz}"
    ;;
  mainnet)
    RPC_URL="${MANTLE_MAINNET_RPC:-https://rpc.mantle.xyz}"
    ;;
  *)
    echo "Unknown network: $NETWORK"
    echo "Usage: $0 [local|testnet|mainnet]"
    exit 1
    ;;
esac

echo "🔍 Verifying deployment on network: $NETWORK"
echo "RPC URL: $RPC_URL"
echo

cd "$CONTRACTS_DIR"

if ! command -v jq >/dev/null 2>&1; then
  echo "⚠️  jq not found, using grep/sed fallback for JSON parsing."
fi

read_json_field() {
  local field=$1
  if command -v jq >/dev/null 2>&1; then
    jq -r ".$field" "$ADDRESSES_FILE"
  else
    grep -o "\"$field\":\\s*\"[^\"]*\"" "$ADDRESSES_FILE" | sed 's/.*"\([^"]*\)"/\1/'
  fi
}

VAULT_CORE=$(read_json_field "VaultCore")
STRATEGY_MANAGER=$(read_json_field "StrategyManager")
AI_EXECUTOR=$(read_json_field "AIExecutor")
RWA_STRATEGY=$(read_json_field "RWAStrategy")
AAVE_STRATEGY=$(read_json_field "AaveStrategy")
MOCK_USDC=$(read_json_field "MockUSDC")

echo "Contract addresses:"
echo "  VaultCore:        $VAULT_CORE"
echo "  StrategyManager:  $STRATEGY_MANAGER"
echo "  AIExecutor:       $AI_EXECUTOR"
echo "  RWAStrategy:      $RWA_STRATEGY"
echo "  AaveStrategy:     $AAVE_STRATEGY"
if [ -n "$MOCK_USDC" ] && [ "$MOCK_USDC" != "null" ]; then
  echo "  MockUSDC:         $MOCK_USDC"
fi
echo

if ! command -v cast >/dev/null 2>&1; then
  echo "❌ Foundry 'cast' CLI is required for verification."
  echo "   Install via: curl -L https://foundry.paradigm.xyz | bash"
  exit 1
fi

check_code() {
  local addr=$1
  local name=$2

  if [ -z "$addr" ] || [ "$addr" = "null" ]; then
    echo "❌ $name address is missing in deployment-addresses.json"
    return 1
  fi

  local code
  code=$(cast code "$addr" --rpc-url "$RPC_URL")
  if [ "$code" = "0x" ]; then
    echo "❌ No code found at $name ($addr)"
    return 1
  fi

  echo "✅ Code exists at $name ($addr)"
}

echo "Checking contract bytecode..."
check_code "$VAULT_CORE" "VaultCore"
check_code "$STRATEGY_MANAGER" "StrategyManager"
check_code "$AI_EXECUTOR" "AIExecutor"
check_code "$RWA_STRATEGY" "RWAStrategy"
check_code "$AAVE_STRATEGY" "AaveStrategy"
if [ -n "$MOCK_USDC" ] && [ "$MOCK_USDC" != "null" ]; then
  check_code "$MOCK_USDC" "MockUSDC"
fi
echo

echo "Calling read-only functions..."

echo "- VaultCore.totalAssets()"
cast call "$VAULT_CORE" "totalAssets()(uint256)" --rpc-url "$RPC_URL" || true

echo "- StrategyManager.getStrategies() (if available) or strategies(0)"
if cast sig "getStrategies()(address[])" >/dev/null 2>&1; then
  cast call "$STRATEGY_MANAGER" "getStrategies()(address[])" --rpc-url "$RPC_URL" || true
else
  cast call "$STRATEGY_MANAGER" "strategies(uint256)(address)" 0 --rpc-url "$RPC_URL" || true
fi

echo
echo "✅ Basic deployment verification complete."
echo "Next, you can:"
echo "  - Run the AI agent: cd ai-agent && python -m src.agent"
echo "  - Use the frontend to deposit and withdraw."

