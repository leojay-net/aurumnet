import os
import json
from dotenv import load_dotenv
from pathlib import Path
from typing import List, Dict, Any

# Load environment variables
load_dotenv()

# Base Paths
BASE_DIR = Path(__file__).resolve().parent.parent
CONTRACTS_OUT_DIR = BASE_DIR.parent / "contracts" / "out"


def load_abi(contract_name: str) -> List[Dict[str, Any]]:
    """Loads the ABI for a given contract from the Foundry output directory."""
    path = CONTRACTS_OUT_DIR / f"{contract_name}.sol" / f"{contract_name}.json"
    if not path.exists():
        raise FileNotFoundError(f"ABI not found for {contract_name} at {path}")

    with open(path, "r") as f:
        data = json.load(f)
    return data["abi"]


# Network Configuration
RPC_URL: str = os.getenv("RPC_URL", "http://127.0.0.1:8545")
PRIVATE_KEY: str | None = os.getenv("PRIVATE_KEY")
AGENT_ADDRESS: str | None = os.getenv("AGENT_ADDRESS")

if not PRIVATE_KEY:
    raise ValueError("PRIVATE_KEY environment variable is not set")

# Contract Addresses (These should be set after deployment)
STRATEGY_MANAGER_ADDRESS: str | None = os.getenv("STRATEGY_MANAGER_ADDRESS")
AI_EXECUTOR_ADDRESS: str | None = os.getenv("AI_EXECUTOR_ADDRESS")
AAVE_STRATEGY_ADDRESS: str | None = os.getenv("AAVE_STRATEGY_ADDRESS")
RWA_STRATEGY_ADDRESS: str | None = os.getenv("RWA_STRATEGY_ADDRESS")

if not all(
    [
        STRATEGY_MANAGER_ADDRESS,
        AI_EXECUTOR_ADDRESS,
        AAVE_STRATEGY_ADDRESS,
        RWA_STRATEGY_ADDRESS,
    ]
):
    # Only raise warning here as they might be set later or during simulation
    print("WARNING: Some contract addresses are missing in environment variables.")

# Strategy Configuration
REBALANCE_THRESHOLD_BPS: int = int(os.getenv("REBALANCE_THRESHOLD_BPS", 500))  # 5%
MIN_DEFI_APY_BPS: int = int(os.getenv("MIN_DEFI_APY_BPS", 200))  # 2%

# Logging
LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")
