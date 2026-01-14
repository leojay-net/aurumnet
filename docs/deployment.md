# Deployment Guide

This guide provides step-by-step instructions for deploying the AurumNet protocol, including the smart contracts, AI agent, and frontend application.

## Prerequisites

Ensure you have the following tools installed:

- **Foundry**: For smart contract development and deployment. [Installation Guide](https://book.getfoundry.sh/getting-started/installation)
- **Python 3.10+**: For the AI Agent.
- **Node.js 18+ & npm**: For the Frontend.
- **Git**: For version control.
- **jq** (optional): For parsing JSON in deployment scripts

## Quick Start

The easiest way to deploy is using our deployment script:

```bash
# Deploy to local network (Anvil)
./scripts/deploy.sh local

# Deploy to Mantle Testnet
./scripts/deploy.sh testnet

# Deploy to Mantle Mainnet (with verification)
./scripts/deploy.sh mainnet --verify
```

The script will automatically:
1. Deploy all contracts
2. Save addresses to `deployment-addresses.json`
3. Update environment variables for AI Agent and Frontend

## 1. Smart Contracts Deployment

The smart contracts are the core of the protocol. They must be deployed first to generate the addresses needed for the AI Agent and Frontend.

### Setup

1. Navigate to the contracts directory:
   ```bash
   cd aurumnet/contracts
   ```

2. Install dependencies:
   ```bash
   forge install
   ```

3. Create a `.env` file in `aurumnet/contracts` with your deployment credentials:
   ```env
   PRIVATE_KEY=0x...
   RPC_URL=https://rpc.mantle.xyz # or your target network RPC
   ETHERSCAN_API_KEY=... # Optional, for verification
   AI_AGENT_ADDRESS=0x... # Optional, defaults to deployer
   USDC_ADDRESS=0x... # Optional, will deploy MockUSDC if not set
   AAVE_POOL_ADDRESS=0x... # Optional, will deploy MockAavePool if not set
   ```

### Deployment

#### Option 1: Using the Deployment Script (Recommended)

```bash
# From project root
./scripts/deploy.sh [network] [--verify]
```

Networks: `local`, `testnet`, `mainnet`

#### Option 2: Manual Deployment

To deploy the contracts manually:

```bash
cd contracts
forge script script/Deploy.s.sol:DeployAurumNet --rpc-url $RPC_URL --broadcast
```

**Important**: After deployment, the script will automatically save addresses to `deployment-addresses.json`:
- `MockUSDC` (if deployed)
- `VaultCore`
- `StrategyManager`
- `AIExecutor`
- `AaveStrategy`
- `RWAStrategy`

### Network-Specific Configuration

#### Local Development (Anvil)

```bash
# Start Anvil (if not already running)
anvil

# Deploy
./scripts/deploy.sh local
```

#### Mantle Testnet

```bash
export PRIVATE_KEY=0x...
export MANTLE_TESTNET_RPC=https://rpc.testnet.mantle.xyz
export ETHERSCAN_API_KEY=... # Optional

./scripts/deploy.sh testnet --verify
```

#### Mantle Mainnet

```bash
export PRIVATE_KEY=0x...
export MANTLE_MAINNET_RPC=https://rpc.mantle.xyz
export ETHERSCAN_API_KEY=...
export USDC_ADDRESS=0x... # Use real USDC address
export AAVE_POOL_ADDRESS=0x... # Use real Aave Pool address

./scripts/deploy.sh mainnet --verify
```

## 2. AI Agent Setup

The AI Agent monitors the protocol and executes rebalancing strategies.

### Configuration

1. Navigate to the AI Agent directory:
   ```bash
   cd aurumnet/ai-agent
   ```

2. Create a virtual environment (recommended):
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Configure environment variables:
   
   The deployment script automatically updates the `.env` file, but you can also create it manually:
   
   ```bash
   cp .env.example .env
   ```
   
   Then update `ai-agent/.env` with:
   ```env
   RPC_URL=http://127.0.0.1:8545  # or your network RPC
   PRIVATE_KEY=0x...  # Agent wallet private key
   AGENT_ADDRESS=0x...  # Agent wallet address
   STRATEGY_MANAGER_ADDRESS=0x...  # From deployment
   AI_EXECUTOR_ADDRESS=0x...  # From deployment
   AAVE_STRATEGY_ADDRESS=0x...  # From deployment
   RWA_STRATEGY_ADDRESS=0x...  # From deployment
   ```

   **Note**: If you used the deployment script, run `./scripts/update-env.sh [network]` to automatically update these values.

### Running the Agent

Start the agent:

```bash
python -m src.agent
```

The agent will start monitoring the vault and strategies, printing logs to the console. It will execute rebalancing transactions when optimal allocation conditions are met.

## 3. Frontend Deployment

The frontend allows users to interact with the protocol.

### Configuration

1. Navigate to the frontend directory:
   ```bash
   cd aurumnet/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   
   The deployment script automatically updates `.env.local`, but you can also create it manually:
   
   ```bash
   cp .env.example .env.local
   ```
   
   Update `frontend/.env.local` with:
   ```env
   NEXT_PUBLIC_VAULT_ADDRESS=0x...
   NEXT_PUBLIC_STRATEGY_MANAGER_ADDRESS=0x...
   NEXT_PUBLIC_AI_EXECUTOR_ADDRESS=0x...
   NEXT_PUBLIC_MOCK_USDC_ADDRESS=0x...  # If using MockUSDC
   NEXT_PUBLIC_RPC_URL=http://127.0.0.1:8545
   NEXT_PUBLIC_CHAIN_ID=31337
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
   ```

   **Note**: Get a WalletConnect Project ID at https://cloud.walletconnect.com

   **Note**: If you used the deployment script, run `./scripts/update-env.sh [network]` to automatically update these values.

### Build and Run

1. Run the development server:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`.

2. Build for production:
   ```bash
   npm run build
   npm start
   ```

## Verification

To verify the entire system is working:

1. **Contracts**: 
   - Check `deployment-addresses.json` for all contract addresses
   - If deployed with `--verify`, check the block explorer for verified contracts
   - Verify contract interactions using the explorer

2. **Frontend**: 
   - Connect your wallet (ensure it's on the correct network)
   - Deposit some Mock USDC (or real USDC on testnet/mainnet) into the Vault
   - Check that your balance updates correctly

3. **AI Agent**: 
   - Watch the agent logs for connection status
   - The agent should detect deposits and monitor strategy performance
   - It will trigger rebalancing transactions when optimal allocation conditions are met

## Troubleshooting

### Contract Addresses Not Found

If environment variables aren't updating automatically:

```bash
# Manually update environment variables
./scripts/update-env.sh [network]
```

### Frontend Can't Connect to Contracts

1. Verify `.env.local` has the correct addresses
2. Ensure your wallet is connected to the correct network
3. Check the browser console for errors

### AI Agent Not Executing Transactions

1. Verify the agent wallet has sufficient funds for gas
2. Check that `AGENT_ADDRESS` matches the address derived from `PRIVATE_KEY`
3. Ensure the agent has the correct role in `AIExecutor` contract

## Next Steps

After successful deployment:

1. **Monitor**: Set up monitoring for contract events and agent activity
2. **Test**: Run through user flows (deposit, withdraw, rebalancing)
3. **Optimize**: Tune rebalancing thresholds in the AI agent configuration
4. **Scale**: Consider deploying additional strategies or upgrading contracts
