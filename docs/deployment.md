# Deployment Guide

This guide provides step-by-step instructions for deploying the AurumNet protocol, including the smart contracts, AI agent, and frontend application.

## Prerequisites

Ensure you have the following tools installed:

- **Foundry**: For smart contract development and deployment. [Installation Guide](https://book.getfoundry.sh/getting-started/installation)
- **Python 3.10+**: For the AI Agent.
- **Node.js 18+ & npm**: For the Frontend.
- **Git**: For version control.

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
   ```

### Deployment

To deploy the contracts to a network (e.g., Mantle Testnet or a local Anvil fork):

```bash
forge script script/Deploy.s.sol:DeployAurumNet --rpc-url $RPC_URL --broadcast
```

**Important**: After deployment, the script will output the addresses of the deployed contracts:
- `MockUSDC` (if deployed)
- `VaultCore`
- `StrategyManager`
- `AIExecutor`
- `AaveStrategy`
- `RWAStrategy`

**Save these addresses!** You will need them for the AI Agent and Frontend configuration.

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
   source venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Update the configuration:
   Open `src/config.py` (or create a `.env` if supported) and update the following constants with the addresses from the contract deployment:
   - `STRATEGY_MANAGER_ADDRESS`
   - `AI_EXECUTOR_ADDRESS`
   - `AAVE_STRATEGY_ADDRESS`
   - `RWA_STRATEGY_ADDRESS`
   - `RPC_URL`
   - `PRIVATE_KEY` (The agent needs a wallet to execute transactions)

### Running the Agent

Start the agent simulation:

```bash
python -m src.agent
```

The agent will start monitoring the vault and strategies, printing logs to the console.

## 3. Frontend Deployment

The frontend allows users to interact with the protocol.

### Configuration

1. Navigate to the frontend directory:
   ```bash
   cd aurumnet/frontend
   ```

2. Create a `.env.local` file (or update `src/config/contracts.ts` if hardcoded) with the deployed contract addresses.
   
   *Example `.env.local`:*
   ```env
   NEXT_PUBLIC_VAULT_ADDRESS=0x...
   NEXT_PUBLIC_STRATEGY_MANAGER_ADDRESS=0x...
   NEXT_PUBLIC_RPC_URL=...
   ```

### Build and Run

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`.

3. Build for production:
   ```bash
   npm run build
   npm start
   ```

## Verification

To verify the entire system is working:
1. **Contracts**: Ensure you can verify the contracts on the block explorer.
2. **Frontend**: Connect your wallet, deposit some Mock USDC into the Vault.
3. **AI Agent**: Watch the agent logs. It should detect the deposit and potentially trigger a rebalance if conditions are met.
