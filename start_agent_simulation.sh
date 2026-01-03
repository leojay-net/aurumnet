#!/bin/bash

# Kill any running anvil instances
pkill anvil

# Start Anvil in the background
echo "Starting Anvil..."
anvil > /dev/null 2>&1 &
ANVIL_PID=$!

# Wait for Anvil to start
sleep 3

echo "Deploying Contracts..."
cd contracts

# Run deployment and capture output
# We use --broadcast to actually send txs to the local node
export PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
DEPLOY_OUTPUT=$(forge script script/Deploy.s.sol:DeployAurumNet --fork-url http://127.0.0.1:8545 --broadcast)

echo "$DEPLOY_OUTPUT"

# Extract Addresses
STRATEGY_MANAGER=$(echo "$DEPLOY_OUTPUT" | grep "StrategyManager deployed at:" | awk '{print $4}')
AI_EXECUTOR=$(echo "$DEPLOY_OUTPUT" | grep "AIExecutor deployed at:" | awk '{print $4}')
AAVE_STRATEGY=$(echo "$DEPLOY_OUTPUT" | grep "AaveStrategy deployed at:" | awk '{print $4}')
RWA_STRATEGY=$(echo "$DEPLOY_OUTPUT" | grep "RWAStrategy deployed at:" | awk '{print $4}')

echo "--------------------------------"
echo "StrategyManager: $STRATEGY_MANAGER"
echo "AIExecutor:      $AI_EXECUTOR"
echo "AaveStrategy:    $AAVE_STRATEGY"
echo "RWAStrategy:     $RWA_STRATEGY"
echo "--------------------------------"

# Update .env file
ENV_FILE="../ai-agent/.env"
cp "../ai-agent/.env.example" "$ENV_FILE"

# Use sed to replace values (using | as delimiter to avoid issues with / in paths if any)
sed -i '' "s|STRATEGY_MANAGER_ADDRESS=|STRATEGY_MANAGER_ADDRESS=$STRATEGY_MANAGER|g" "$ENV_FILE"
sed -i '' "s|AI_EXECUTOR_ADDRESS=|AI_EXECUTOR_ADDRESS=$AI_EXECUTOR|g" "$ENV_FILE"
sed -i '' "s|AAVE_STRATEGY_ADDRESS=|AAVE_STRATEGY_ADDRESS=$AAVE_STRATEGY|g" "$ENV_FILE"
sed -i '' "s|RWA_STRATEGY_ADDRESS=|RWA_STRATEGY_ADDRESS=$RWA_STRATEGY|g" "$ENV_FILE"

echo "Updated .env file."

# Start Agent
echo "Starting AI Agent (Running for 15 seconds)..."
cd ../ai-agent
source venv/bin/activate
python3 -m src.agent &
AGENT_PID=$!

sleep 15
kill $AGENT_PID
kill $ANVIL_PID
echo "Simulation Complete."
