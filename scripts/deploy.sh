#!/bin/bash

# Comprehensive deployment script for AurumNet
# Usage: ./scripts/deploy.sh [network] [options]
# Networks: local, testnet, mainnet
# Options: --verify (verify contracts on explorer)

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
CONTRACTS_DIR="$PROJECT_ROOT/contracts"

# Load environment variables from .env files if present
# This allows PRIVATE_KEY, MANTLE_TESTNET_RPC, etc. to be defined in .env
if [ -f "$PROJECT_ROOT/.env" ]; then
  set -a
  # shellcheck disable=SC1090
  . "$PROJECT_ROOT/.env"
  set +a
fi

if [ -f "$CONTRACTS_DIR/.env" ]; then
  set -a
  # shellcheck disable=SC1090
  . "$CONTRACTS_DIR/.env"
  set +a
fi

NETWORK=${1:-local}
VERIFY=false

# Parse options
shift || true
while [[ $# -gt 0 ]]; do
    case $1 in
        --verify)
            VERIFY=true
            shift
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

cd "$CONTRACTS_DIR"

# Network-specific configuration
case $NETWORK in
  local)
    echo "🚀 Deploying to Local Network (Anvil)..."
    
    # Check if Anvil is running
    if ! curl -s http://127.0.0.1:8545 > /dev/null 2>&1; then
        echo "⚠️  Anvil is not running. Starting Anvil..."
        anvil > /dev/null 2>&1 &
        ANVIL_PID=$!
        sleep 3
        echo "✓ Anvil started (PID: $ANVIL_PID)"
    fi
    
    RPC_URL="http://127.0.0.1:8545"
    PRIVATE_KEY="${PRIVATE_KEY:-0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80}"
    ;;
    
  testnet)
    echo "🚀 Deploying to Mantle Testnet..."
    
    if [ -z "$PRIVATE_KEY" ]; then
        echo "❌ Error: PRIVATE_KEY environment variable is required for testnet deployment"
        exit 1
    fi
    
    RPC_URL="$MANTLE_TESTNET_RPC"
    ETHERSCAN_API_KEY="${ETHERSCAN_API_KEY:-}"
    ;;
    
  mainnet)
    echo "🚀 Deploying to Mantle Mainnet..."
    
    if [ -z "$PRIVATE_KEY" ]; then
        echo "❌ Error: PRIVATE_KEY environment variable is required for mainnet deployment"
        exit 1
    fi
    
    RPC_URL="${MANTLE_MAINNET_RPC:-https://rpc.mantle.xyz}"
    ETHERSCAN_API_KEY="${ETHERSCAN_API_KEY:-}"
    
    # Safety check for mainnet
    read -p "⚠️  Are you sure you want to deploy to MAINNET? (yes/no): " confirm
    if [ "$confirm" != "yes" ]; then
        echo "Deployment cancelled."
        exit 1
    fi
    ;;
    
  *)
    echo "❌ Unknown network: $NETWORK"
    echo "Usage: $0 [local|testnet|mainnet] [--verify]"
    exit 1
    ;;
esac

export PRIVATE_KEY
export RPC_URL

echo "📋 Deployment Configuration:"
echo "  Network: $NETWORK"
echo "  RPC URL: $RPC_URL"
echo "  Verify Contracts: $VERIFY"
echo ""

# Build contracts first
echo "🔨 Building contracts..."
forge build

# Deploy contracts
echo "📦 Deploying contracts..."
if [ "$VERIFY" = true ] && [ "$NETWORK" != "local" ]; then
    if [ -z "$ETHERSCAN_API_KEY" ]; then
        echo "⚠️  Warning: ETHERSCAN_API_KEY not set. Skipping verification."
        VERIFY=false
    else
        forge script script/Deploy.s.sol:DeployAurumNet \
            --rpc-url "$RPC_URL" \
            --broadcast \
            --verify \
            --etherscan-api-key "$ETHERSCAN_API_KEY"
    fi
else
    forge script script/Deploy.s.sol:DeployAurumNet \
        --rpc-url "$RPC_URL" \
        --broadcast
fi

# Update environment variables
echo ""
echo "📝 Updating environment variables..."
cd "$PROJECT_ROOT"
./scripts/update-env.sh "$NETWORK"

echo ""
echo "✅ Deployment complete!"
echo ""
echo "Next steps:"
echo "  1. Verify contract addresses in deployment-addresses.json"
echo "  2. Start the AI agent: cd ai-agent && python -m src.agent"
echo "  3. Start the frontend: cd frontend && npm run dev"
