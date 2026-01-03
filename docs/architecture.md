# Technical Architecture

AurumNet is built on a modular architecture that separates capital holding (Vaults), logic execution (Strategies), and decision making (AI Agent).

## System Overview

```mermaid
graph TB
    subgraph "Off-Chain Layer"
        Agent[Python AI Agent]
        Model[ML Model (PyTorch)]
        Data[Data Ingestion Service]
        
        Data --> Model
        Model --> Agent
    end

    subgraph "On-Chain Layer (Mantle Network)"
        Executor[AIExecutor.sol]
        Manager[StrategyManager.sol]
        Vault[VaultCore.sol]
        
        subgraph "Strategies"
            S1[AaveStrategy.sol]
            S2[RWAStrategy.sol]
            S3[CurveStrategy.sol]
        end
    end

    Agent -->|Signed Transaction| Executor
    Executor -->|Delegate Call| Manager
    Manager -->|Rebalance| Vault
    Vault -->|Deposit/Withdraw| S1
    Vault -->|Deposit/Withdraw| S2
    Vault -->|Deposit/Withdraw| S3
```

## Components

### 1. VaultCore.sol
The main entry point for users. It is an ERC-4626 compliant vault.
- **Functions**: `deposit()`, `withdraw()`, `totalAssets()`
- **State**: Holds the user's shares and tracks the total value of assets across all strategies.

### 2. AIExecutor.sol
The bridge between off-chain intelligence and on-chain execution.
- **Access Control**: Only whitelisted "Agent" addresses can call this contract.
- **Validation**: Verifies that the proposed rebalance meets safety parameters (e.g., slippage checks).

### 3. StrategyManager.sol
Manages the registry of active strategies.
- **Registry**: Maps Strategy IDs to contract addresses.
- **Accounting**: Calculates the total value managed by each strategy.

### 4. Strategies (IStrategy.sol)
Individual adapters for external protocols.
- **AaveStrategy**: Wraps Aave V3 interactions (supply/borrow).
- **RWAStrategy**: Interfaces with tokenized bond issuers (e.g., Ondo, MatrixDock).

## Data Flow: The Rebalance Lifecycle

1.  **Ingest**: The off-chain agent pulls data from The Graph (Mantle subgraph) and centralized APIs (for RWA data).
2.  **Analyze**: The ML model predicts the 24h yield outlook for each asset.
3.  **Optimize**: A convex optimization solver determines the ideal portfolio weights.
4.  **Transact**: The agent constructs a transaction calling `AIExecutor.rebalance()`.
5.  **Execute**:
    *   `AIExecutor` validates the sender.
    *   `VaultCore` withdraws funds from underperforming strategies.
    *   `VaultCore` deposits funds into outperforming strategies.
6.  **Verify**: The transaction emits a `RebalanceExecuted` event, which the agent indexes to update its state.

## Security Considerations

- **Role-Based Access Control (RBAC)**: Uses OpenZeppelin's `AccessControl`.
- **ReentrancyGuard**: Applied to all external state-changing functions.
- **Max Drawdown Circuit Breaker**: If a strategy reports a loss > 5% in a single update, the vault automatically pauses deposits to that strategy.
