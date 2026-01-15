# AurumNet Complete Deployment Guide

This is a comprehensive, step-by-step guide for deploying the entire AurumNet protocol, including smart contracts, AI agent, and frontend. Follow this guide to get a fully functional deployment.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Project Setup](#project-setup)
3. [Understanding the Mocks](#understanding-the-mocks)
4. [Deployment Steps](#deployment-steps)
5. [Configuration](#configuration)
6. [Running the System](#running-the-system)
7. [Verification](#verification)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Install the following tools on your machine:

### Required Tools

1. **Git** - Version control
   ```bash
   # Check installation
   git --version
   ```

2. **Foundry** - Smart contract development toolkit
   ```bash
   # Install Foundry
   curl -L https://foundry.paradigm.xyz | bash
   foundryup
   
   # Verify installation
   forge --version
   cast --version
   anvil --version
   ```

3. **Node.js 18+ and npm** - Frontend dependencies
   ```bash
   # Check installation
   node --version  # Should be 18+
   npm --version
   ```

4. **Python 3.10+** - AI agent runtime
   ```bash
   # Check installation
   python3 --version  # Should be 3.10+
   ```

5. **jq** (optional but recommended) - JSON parsing for scripts
   ```bash
   # macOS
   brew install jq
   
   # Linux
   sudo apt-get install jq
   ```

### Clone the Repository

```bash
git clone <repository-url>
cd aurumnet
```

---

## Project Setup

### Step 1: Install Smart Contract Dependencies

```bash
cd contracts
forge install
cd ..
```

This installs OpenZeppelin and other contract dependencies.

### Step 2: Install Frontend Dependencies

```bash
cd frontend
npm install
cd ..
```

### Step 3: Set Up AI Agent Python Environment

```bash
cd ai-agent
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cd ..
```

### Step 4: Verify Builds

Run the build verification script:

```bash
./scripts/verify-build.sh
```

This will:
- ✅ Build smart contracts
- ✅ Build frontend
- ✅ Verify AI agent dependencies
- ✅ Check all deployment scripts

**Expected output:** `✅ All builds successful!`

---

## Understanding the Mocks

AurumNet uses **mocks** for local development and testing. Understanding how they work is crucial for deployment.

### MockUSDC

**Location:** `contracts/script/Deploy.s.sol` (lines 13-25)

**What it does:**
- ERC20 token with **6 decimals** (like real USDC)
- Mints **1,000,000 USDC** to the deployer address on deployment
- Provides `mint()` function for additional tokens
- Used as the underlying asset for the vault

**When it's deployed:**
- Automatically deployed when `USDC_ADDRESS` environment variable is **not set**
- Used in local development and testnet (unless you specify a real USDC address)

### MockAavePool

**Location:** `contracts/script/Deploy.s.sol` (lines 28-73)

**What it does:**
- Minimal implementation of Aave V3 Pool interface
- Provides:
  - `supply(asset, amount, onBehalfOf, referralCode)` - Deposits assets
  - `withdraw(asset, amount, to)` - Withdraws assets
  - `getReserveData(asset)` - Returns reserve data (currently returns zeros for rates)

**Important:** The mock returns **zero APY** from `getReserveData()`. For real APY data, you need:
- Real Aave Pool address on Mantle
- Real underlying asset address

**When it's deployed:**
- Automatically deployed when `AAVE_POOL_ADDRESS` environment variable is **not set**
- Used in local development and testnet (unless you specify a real Aave pool)

### How Mocks Are Used

1. **Local Development (Anvil):**
   - ✅ Deploys `MockUSDC` and `MockAavePool`
   - ✅ `AaveStrategy` connects to `MockAavePool`
   - ✅ `VaultCore` uses `MockUSDC` as underlying asset
   - ⚠️ APY will be 0 (mock returns zeros)

2. **Mantle Testnet:**
   - Can use mocks OR real addresses
   - If `USDC_ADDRESS` and `AAVE_POOL_ADDRESS` are set → uses real contracts
   - If not set → deploys mocks

3. **Mantle Mainnet:**
   - **Should use real addresses** (set `USDC_ADDRESS` and `AAVE_POOL_ADDRESS`)
   - Mocks are NOT deployed if addresses are provided

---

## Deployment Steps

### Option 1: One-Command Deployment (Recommended)

We provide a single script that handles everything:

```bash
# From project root
./scripts/deploy.sh [network] [--verify]
```

**Networks:** `local`, `testnet`, `mainnet`

#### Local Deployment

```bash
./scripts/deploy.sh local
```

**What happens:**
1. Starts Anvil (if not running)
2. Uses default Anvil private key
3. Deploys all contracts including mocks
4. Saves addresses to `contracts/deployment-addresses.json`
5. Updates `ai-agent/.env`
6. Updates `frontend/.env.local`

**Result:** Fully functional local deployment with mocks

#### Testnet Deployment

```bash
export PRIVATE_KEY=0x...  # Your testnet wallet private key
export MANTLE_TESTNET_RPC=https://rpc.testnet.mantle.xyz
export ETHERSCAN_API_KEY=...  # Optional, for verification

# Deploy with mocks (default)
./scripts/deploy.sh testnet

# OR deploy with real USDC/Aave (if available on testnet)
export USDC_ADDRESS=0x...  # Real USDC on Mantle testnet
export AAVE_POOL_ADDRESS=0x...  # Real Aave pool on Mantle testnet
./scripts/deploy.sh testnet --verify
```

#### Mainnet Deployment

```bash
export PRIVATE_KEY=0x...  # Mainnet wallet (BE CAREFUL!)
export MANTLE_MAINNET_RPC=https://rpc.mantle.xyz
export ETHERSCAN_API_KEY=...
export USDC_ADDRESS=0x...  # Real USDC on Mantle mainnet
export AAVE_POOL_ADDRESS=0x...  # Real Aave V3 pool on Mantle mainnet

# Script will ask for confirmation
./scripts/deploy.sh mainnet --verify
```

### Option 2: Manual Deployment

If you prefer manual control:

#### Step 1: Set Environment Variables

Create `contracts/.env`:

```env
PRIVATE_KEY=0x...
RPC_URL=http://127.0.0.1:8545  # or Mantle RPC
ETHERSCAN_API_KEY=...  # Optional
AI_AGENT_ADDRESS=0x...  # Optional, defaults to deployer
USDC_ADDRESS=0x...  # Optional, will deploy MockUSDC if not set
AAVE_POOL_ADDRESS=0x...  # Optional, will deploy MockAavePool if not set
```

#### Step 2: Deploy Contracts

```bash
cd contracts
forge script script/Deploy.s.sol:DeployAurumNet --rpc-url $RPC_URL --broadcast
```

#### Step 3: Update Environment Files

```bash
# From project root
./scripts/update-env.sh [network]
```

This reads `contracts/deployment-addresses.json` and updates:
- `ai-agent/.env`
- `frontend/.env.local`

---

## Configuration

### AI Agent Configuration (`ai-agent/.env`)

After deployment, your `.env` should have:

```env
# Network
RPC_URL=http://127.0.0.1:8545  # or Mantle RPC

# Agent Wallet
PRIVATE_KEY=0x...  # Agent wallet private key
AGENT_ADDRESS=0x...  # Agent wallet address (derived from PRIVATE_KEY)

# Contract Addresses (auto-populated by deploy script)
STRATEGY_MANAGER_ADDRESS=0x...
AI_EXECUTOR_ADDRESS=0x...
AAVE_STRATEGY_ADDRESS=0x...
RWA_STRATEGY_ADDRESS=0x...

# Aave Configuration (for real APY fetching)
AAVE_POOL_ADDRESS=0x...  # MockAavePool or real Aave pool
UNDERLYING_ASSET_ADDRESS=0x...  # MockUSDC or real USDC

# Strategy Parameters
REBALANCE_THRESHOLD_BPS=500  # 5% threshold
MIN_DEFI_APY_BPS=200  # 2% minimum

# Logging
LOG_LEVEL=INFO
```

**Important Notes:**
- `AAVE_POOL_ADDRESS` and `UNDERLYING_ASSET_ADDRESS` are **required** for real APY fetching
- If not set, `get_aave_apy()` returns 0
- For local deployment with mocks, use the addresses from `deployment-addresses.json`:
  - `AAVE_POOL_ADDRESS` = `MockAavePool` address
  - `UNDERLYING_ASSET_ADDRESS` = `MockUSDC` address

### Frontend Configuration (`frontend/.env.local`)

After deployment, your `.env.local` should have:

```env
# Contract Addresses (auto-populated by deploy script)
NEXT_PUBLIC_VAULT_ADDRESS=0x...
NEXT_PUBLIC_STRATEGY_MANAGER_ADDRESS=0x...
NEXT_PUBLIC_AI_EXECUTOR_ADDRESS=0x...
NEXT_PUBLIC_MOCK_USDC_ADDRESS=0x...  # Only if MockUSDC was deployed

# Network Configuration
NEXT_PUBLIC_RPC_URL=http://127.0.0.1:8545  # or Mantle RPC
NEXT_PUBLIC_CHAIN_ID=31337  # Local: 31337, Mantle Testnet: 5001, Mainnet: 5000

# WalletConnect (REQUIRED - get from https://cloud.walletconnect.com)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

**Important:** You **must** set `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` manually:
1. Go to https://cloud.walletconnect.com
2. Create a project
3. Copy the Project ID
4. Add it to `.env.local`

---

## Running the System

### Step 1: Start Local Blockchain (if deploying locally)

```bash
# In a separate terminal
anvil
```

Keep this running. Default RPC: `http://127.0.0.1:8545`

### Step 2: Deploy Contracts

```bash
./scripts/deploy.sh local
```

### Step 3: Start AI Agent

```bash
cd ai-agent
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Make sure .env is configured
python -m src.agent
```

**What the agent does:**
- Connects to RPC
- Monitors vault and strategies
- Fetches APY from Aave (or returns 0 if mocks)
- Calculates optimal allocation
- Executes rebalancing transactions when thresholds are met

### Step 4: Start Frontend

```bash
cd frontend
npm run dev
```

Open http://localhost:3000

**What you can do:**
1. Connect wallet (ensure it's on the correct network)
2. **Mint MockUSDC** (if using mocks) - Use the mint function
3. **Approve Vault** - Approve MockUSDC spending
4. **Deposit** - Deposit into VaultCore
5. **Monitor** - Watch balances and vault stats

---

## Verification

### Verify Builds

```bash
./scripts/verify-build.sh
```

### Verify Deployment

```bash
./scripts/verify-deployment.sh [network]
```

This checks:
- ✅ Contract bytecode exists at all addresses
- ✅ Read-only function calls succeed
- ✅ Contract addresses are valid

### Manual Verification

#### Check Contract Addresses

```bash
cat contracts/deployment-addresses.json
```

#### Test Contract Calls

```bash
cd contracts

# Check VaultCore total assets
cast call <VAULT_ADDRESS> "totalAssets()(uint256)" --rpc-url $RPC_URL

# Check StrategyManager strategies
cast call <STRATEGY_MANAGER_ADDRESS> "strategies(uint256)(address)" 0 --rpc-url $RPC_URL
```

#### Test AI Agent Connection

```bash
cd ai-agent
source venv/bin/activate
python3 -c "from web3 import Web3; w3 = Web3(Web3.HTTPProvider('http://127.0.0.1:8545')); print('Connected:', w3.is_connected())"
```

---

## Troubleshooting

### Build Issues

**Problem:** `forge build` fails
```bash
# Solution: Clean and rebuild
cd contracts
forge clean
forge build
```

**Problem:** Frontend build fails
```bash
# Solution: Clear cache and reinstall
cd frontend
rm -rf .next node_modules
npm install
npm run build
```

**Problem:** Python imports fail
```bash
# Solution: Reinstall dependencies
cd ai-agent
source venv/bin/activate
pip install -r requirements.txt --force-reinstall
```

### Deployment Issues

**Problem:** `deployment-addresses.json` not found
```bash
# Solution: Deploy contracts first
./scripts/deploy.sh local
```

**Problem:** Environment variables not updated
```bash
# Solution: Manually update
./scripts/update-env.sh local
```

**Problem:** Anvil not running
```bash
# Solution: Start Anvil
anvil
# Or the deploy script will start it automatically
```

### Runtime Issues

**Problem:** AI agent can't connect to RPC
```bash
# Check RPC_URL in ai-agent/.env
# Test connection:
curl -X POST -H "Content-Type: application/json" --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' $RPC_URL
```

**Problem:** Frontend can't connect to contracts
- ✅ Check `.env.local` has correct addresses
- ✅ Ensure wallet is on correct network
- ✅ Verify contract addresses in `deployment-addresses.json`

**Problem:** Aave APY returns 0
- ✅ Check `AAVE_POOL_ADDRESS` and `UNDERLYING_ASSET_ADDRESS` are set
- ✅ If using mocks, this is expected (mocks return zero)
- ✅ For real APY, use real Aave pool address

### Mock-Specific Issues

**Problem:** MockUSDC not minting
```bash
# MockUSDC mints 1M tokens to deployer on deployment
# To mint more, call the mint function:
cast send <MOCK_USDC_ADDRESS> "mint(address,uint256)" <RECIPIENT> <AMOUNT> --rpc-url $RPC_URL --private-key $PRIVATE_KEY
```

**Problem:** MockAavePool returns zero APY
- ✅ This is **expected behavior** - mocks return zeros
- ✅ For real APY, deploy with real `AAVE_POOL_ADDRESS`

---

## Quick Reference

### Deployment Commands

```bash
# Build verification
./scripts/verify-build.sh

# Deploy to local
./scripts/deploy.sh local

# Deploy to testnet
export PRIVATE_KEY=0x...
./scripts/deploy.sh testnet --verify

# Deploy to mainnet
export PRIVATE_KEY=0x...
export USDC_ADDRESS=0x...
export AAVE_POOL_ADDRESS=0x...
./scripts/deploy.sh mainnet --verify

# Update environment variables
./scripts/update-env.sh [network]

# Verify deployment
./scripts/verify-deployment.sh [network]
```

### Running Commands

```bash
# Start Anvil
anvil

# Start AI Agent
cd ai-agent && source venv/bin/activate && python -m src.agent

# Start Frontend
cd frontend && npm run dev
```

### Important Files

- `contracts/deployment-addresses.json` - All contract addresses
- `ai-agent/.env` - AI agent configuration
- `frontend/.env.local` - Frontend configuration
- `contracts/script/Deploy.s.sol` - Deployment script with mocks

---

## Next Steps

After successful deployment:

1. **Test the System:**
   - Deposit funds via frontend
   - Monitor AI agent logs
   - Verify rebalancing transactions

2. **Monitor:**
   - Set up event monitoring
   - Track vault performance
   - Monitor strategy allocations

3. **Optimize:**
   - Tune rebalancing thresholds
   - Add more strategies
   - Optimize gas usage

4. **Production:**
   - Deploy to mainnet with real addresses
   - Set up monitoring and alerts
   - Consider multi-sig for admin functions

---

## Support

For issues or questions:
- Check the troubleshooting section above
- Review contract code in `contracts/src/`
- Check AI agent logs for errors
- Verify all environment variables are set correctly

---

**Last Updated:** 2024
**Version:** 1.0.0
