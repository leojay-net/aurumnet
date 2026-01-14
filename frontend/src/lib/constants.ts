// Contract addresses from environment variables
// These are set during deployment via scripts/update-env.sh
export const CONTRACT_ADDRESSES = {
    VaultCore: (process.env.NEXT_PUBLIC_VAULT_ADDRESS || "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512") as `0x${string}`,
    StrategyManager: (process.env.NEXT_PUBLIC_STRATEGY_MANAGER_ADDRESS || "0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0") as `0x${string}`,
    MockUSDC: (process.env.NEXT_PUBLIC_MOCK_USDC_ADDRESS || "0x5fbdb2315678afecb367f032d93f642f64180aa3") as `0x${string}`,
    AIExecutor: (process.env.NEXT_PUBLIC_AI_EXECUTOR_ADDRESS || "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9") as `0x${string}`
} as const;

// Chain ID from environment or default to local (31337)
export const CHAIN_ID = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || "31337", 10);
