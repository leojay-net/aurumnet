import time
import logging
from typing import List
from web3 import Web3
from web3.contract import Contract

# from web3.middleware import geth_poa_middleware # Deprecated in v7

from .config import (
    RPC_URL,
    PRIVATE_KEY,
    AGENT_ADDRESS,
    STRATEGY_MANAGER_ADDRESS,
    AI_EXECUTOR_ADDRESS,
    AAVE_STRATEGY_ADDRESS,
    RWA_STRATEGY_ADDRESS,
    REBALANCE_THRESHOLD_BPS,
    LOG_LEVEL,
    load_abi,
)
from .strategies import StrategyAnalyzer

# Setup Logging
logging.basicConfig(level=LOG_LEVEL, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)


class AurumAgent:
    def __init__(self) -> None:
        self.w3: Web3 = Web3(Web3.HTTPProvider(RPC_URL))
        # self.w3.middleware_onion.inject(geth_poa_middleware, layer=0) # Not needed for Anvil usually, or use ExtraDataToPOAMiddleware

        if not self.w3.is_connected():
            raise ConnectionError("Failed to connect to RPC")

        logger.info(f"Connected to {RPC_URL}")
        logger.info(f"Agent Address: {AGENT_ADDRESS}")

        if not PRIVATE_KEY:
            raise ValueError("Private key not found")
        self.account = self.w3.eth.account.from_key(PRIVATE_KEY)

        # Load Contracts
        self.strategy_manager_abi = load_abi("StrategyManager")
        self.ai_executor_abi = load_abi("AIExecutor")

        self.strategy_manager: Contract = self.w3.eth.contract(
            address=STRATEGY_MANAGER_ADDRESS, abi=self.strategy_manager_abi
        )
        self.ai_executor: Contract = self.w3.eth.contract(
            address=AI_EXECUTOR_ADDRESS, abi=self.ai_executor_abi
        )

        self.analyzer: StrategyAnalyzer = StrategyAnalyzer(self.w3)

        # Strategy Addresses (Order matters for rebalance call)
        self.strategies: List[str | None] = [
            AAVE_STRATEGY_ADDRESS,
            RWA_STRATEGY_ADDRESS,
        ]

    def run_cycle(self) -> None:
        """
        Main execution loop for the agent.
        Analyzes market, calculates optimal allocation, and executes rebalance if needed.
        """
        logger.info("Starting Agent Cycle...")

        try:
            # 1. Analyze Market
            aave_apy = self.analyzer.get_aave_apy()
            rwa_yield = self.analyzer.get_rwa_yield()

            logger.info(
                f"Market Data - Aave APY: {aave_apy} bps, RWA Yield: {rwa_yield} bps"
            )

            # 2. Calculate Optimal Allocation
            optimal_allocation = self.analyzer.calculate_optimal_allocation(
                aave_apy, rwa_yield
            )
            logger.info(
                f"Optimal Allocation: Aave {optimal_allocation.aave_bps} bps, RWA {optimal_allocation.rwa_bps} bps"
            )

            # 3. Execute Rebalance
            # In a production agent, we would check if the difference is > threshold.
            # For this MVP, we will just execute.

            self.execute_rebalance(optimal_allocation.to_list())

        except Exception as e:
            logger.error(f"Error in agent cycle: {e}", exc_info=True)

    def execute_rebalance(self, allocations: List[int]) -> None:
        """
        Executes the rebalance transaction on-chain.
        """
        logger.info("Executing Rebalance...")

        try:
            # Estimate Gas
            gas_estimate = self.ai_executor.functions.rebalance(
                self.strategies, allocations
            ).estimate_gas({"from": self.account.address})

            # Add buffer to gas estimate
            gas_limit = int(gas_estimate * 1.2)

            # Build Transaction
            tx = self.ai_executor.functions.rebalance(
                self.strategies, allocations
            ).build_transaction(
                {
                    "from": self.account.address,
                    "nonce": self.w3.eth.get_transaction_count(self.account.address),
                    "gas": gas_limit,
                    "gasPrice": self.w3.eth.gas_price,
                }
            )

            # Sign and Send
            if not PRIVATE_KEY:
                raise ValueError("Private key not found")
            signed_tx = self.w3.eth.account.sign_transaction(tx, PRIVATE_KEY)
            tx_hash = self.w3.eth.send_raw_transaction(signed_tx.raw_transaction)

            logger.info(f"Transaction Sent: {self.w3.to_hex(tx_hash)}")

            # Wait for Receipt
            receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash, timeout=120)
            if receipt.status == 1:
                logger.info("Rebalance Successful!")
            else:
                logger.error("Rebalance Failed! Transaction reverted.")

        except Exception as e:
            logger.error(f"Error executing rebalance: {e}")


if __name__ == "__main__":
    agent = AurumAgent()
    while True:
        agent.run_cycle()
        time.sleep(60)  # Run every minute
