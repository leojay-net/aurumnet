#!/bin/bash

# Script to update environment variables from deployment addresses JSON
# Usage: ./scripts/update-env.sh [network]
# Network options: local, testnet, mainnet (defaults to local)

set -e

NETWORK=${1:-local}
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Network-specific RPC URLs
case $NETWORK in
  local)
    RPC_URL="http://127.0.0.1:8545"
    ADDRESSES_FILE="$PROJECT_ROOT/contracts/deployment-addresses.json"
    ;;
  testnet)
    RPC_URL="${MANTLE_TESTNET_RPC:-https://rpc.testnet.mantle.xyz}"
    # Prefer network-specific file if it exists, otherwise fall back to generic
    if [ -f "$PROJECT_ROOT/contracts/deployment-addresses-testnet.json" ]; then
      ADDRESSES_FILE="$PROJECT_ROOT/contracts/deployment-addresses-testnet.json"
    else
      ADDRESSES_FILE="$PROJECT_ROOT/contracts/deployment-addresses.json"
    fi
    ;;
  mainnet)
    RPC_URL="${MANTLE_MAINNET_RPC:-https://rpc.mantle.xyz}"
    # Prefer network-specific file if it exists, otherwise fall back to generic
    if [ -f "$PROJECT_ROOT/contracts/deployment-addresses-mainnet.json" ]; then
      ADDRESSES_FILE="$PROJECT_ROOT/contracts/deployment-addresses-mainnet.json"
    else
      ADDRESSES_FILE="$PROJECT_ROOT/contracts/deployment-addresses.json"
    fi
    ;;
  *)
    echo "Unknown network: $NETWORK"
    echo "Usage: $0 [local|testnet|mainnet]"
    exit 1
    ;;
esac

if [ ! -f "$ADDRESSES_FILE" ]; then
    echo "Error: Deployment addresses file not found: $ADDRESSES_FILE"
    echo "Please deploy contracts first using: forge script script/Deploy.s.sol:DeployAurumNet --broadcast"
    exit 1
fi

echo "Updating environment variables for network: $NETWORK"
echo "Reading addresses from: $ADDRESSES_FILE"

# Extract addresses using jq (if available) or grep/sed
if command -v jq &> /dev/null; then
    VAULT_CORE=$(jq -r '.VaultCore' "$ADDRESSES_FILE")
    STRATEGY_MANAGER=$(jq -r '.StrategyManager' "$ADDRESSES_FILE")
    AI_EXECUTOR=$(jq -r '.AIExecutor' "$ADDRESSES_FILE")
    RWA_STRATEGY=$(jq -r '.RWAStrategy' "$ADDRESSES_FILE")
    AAVE_STRATEGY=$(jq -r '.AaveStrategy' "$ADDRESSES_FILE")
    MOCK_USDC=$(jq -r '.MockUSDC // empty' "$ADDRESSES_FILE")
else
    # Fallback to grep/sed if jq is not available
    VAULT_CORE=$(grep -o '"VaultCore":\s*"[^"]*"' "$ADDRESSES_FILE" | sed 's/.*"\([^"]*\)"/\1/')
    STRATEGY_MANAGER=$(grep -o '"StrategyManager":\s*"[^"]*"' "$ADDRESSES_FILE" | sed 's/.*"\([^"]*\)"/\1/')
    AI_EXECUTOR=$(grep -o '"AIExecutor":\s*"[^"]*"' "$ADDRESSES_FILE" | sed 's/.*"\([^"]*\)"/\1/')
    RWA_STRATEGY=$(grep -o '"RWAStrategy":\s*"[^"]*"' "$ADDRESSES_FILE" | sed 's/.*"\([^"]*\)"/\1/')
    AAVE_STRATEGY=$(grep -o '"AaveStrategy":\s*"[^"]*"' "$ADDRESSES_FILE" | sed 's/.*"\([^"]*\)"/\1/')
    MOCK_USDC=$(grep -o '"MockUSDC":\s*"[^"]*"' "$ADDRESSES_FILE" | sed 's/.*"\([^"]*\)"/\1/' || echo "")
fi

# Update AI Agent .env file
AI_AGENT_ENV="$PROJECT_ROOT/ai-agent/.env"
if [ -f "$AI_AGENT_ENV" ]; then
    echo "Updating AI Agent .env file..."
    
    # Update or add each variable
    update_env_var() {
        local file=$1
        local key=$2
        local value=$3
        
        if grep -q "^${key}=" "$file"; then
            # Update existing variable
            if [[ "$OSTYPE" == "darwin"* ]]; then
                sed -i '' "s|^${key}=.*|${key}=${value}|" "$file"
            else
                sed -i "s|^${key}=.*|${key}=${value}|" "$file"
            fi
        else
            # Add new variable
            echo "${key}=${value}" >> "$file"
        fi
    }
    
    update_env_var "$AI_AGENT_ENV" "RPC_URL" "$RPC_URL"
    update_env_var "$AI_AGENT_ENV" "STRATEGY_MANAGER_ADDRESS" "$STRATEGY_MANAGER"
    update_env_var "$AI_AGENT_ENV" "AI_EXECUTOR_ADDRESS" "$AI_EXECUTOR"
    update_env_var "$AI_AGENT_ENV" "RWA_STRATEGY_ADDRESS" "$RWA_STRATEGY"
    update_env_var "$AI_AGENT_ENV" "AAVE_STRATEGY_ADDRESS" "$AAVE_STRATEGY"
    
    echo "✓ AI Agent .env updated"
else
    echo "Warning: AI Agent .env file not found at $AI_AGENT_ENV"
fi

# Update Frontend .env.local file
FRONTEND_ENV="$PROJECT_ROOT/frontend/.env.local"
if [ ! -f "$FRONTEND_ENV" ]; then
    echo "Creating Frontend .env.local file..."
    touch "$FRONTEND_ENV"
fi

echo "Updating Frontend .env.local file..."
update_env_var "$FRONTEND_ENV" "NEXT_PUBLIC_VAULT_ADDRESS" "$VAULT_CORE"
update_env_var "$FRONTEND_ENV" "NEXT_PUBLIC_STRATEGY_MANAGER_ADDRESS" "$STRATEGY_MANAGER"
update_env_var "$FRONTEND_ENV" "NEXT_PUBLIC_AI_EXECUTOR_ADDRESS" "$AI_EXECUTOR"
update_env_var "$FRONTEND_ENV" "NEXT_PUBLIC_RPC_URL" "$RPC_URL"
if [ -n "$MOCK_USDC" ]; then
    update_env_var "$FRONTEND_ENV" "NEXT_PUBLIC_MOCK_USDC_ADDRESS" "$MOCK_USDC"
fi

echo "✓ Frontend .env.local updated"

echo ""
echo "=== Updated Addresses ==="
echo "VaultCore: $VAULT_CORE"
echo "StrategyManager: $STRATEGY_MANAGER"
echo "AIExecutor: $AI_EXECUTOR"
echo "RWAStrategy: $RWA_STRATEGY"
echo "AaveStrategy: $AAVE_STRATEGY"
if [ -n "$MOCK_USDC" ]; then
    echo "MockUSDC: $MOCK_USDC"
fi
echo ""
echo "Environment variables updated successfully!"
