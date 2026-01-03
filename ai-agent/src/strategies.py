from dataclasses import dataclass
from typing import List, Optional
from web3 import Web3
from web3.contract import Contract
from .config import (
    load_abi,
    AAVE_STRATEGY_ADDRESS,
    RWA_STRATEGY_ADDRESS,
    MIN_DEFI_APY_BPS,
)


@dataclass
class Allocation:
    """Represents the allocation of funds across strategies."""

    aave_bps: int
    rwa_bps: int

    def to_list(self) -> List[int]:
        return [self.aave_bps, self.rwa_bps]


class StrategyAnalyzer:
    """
    Analyzes market conditions and determines optimal asset allocation.
    """

    def __init__(self, w3: Web3):
        self.w3 = w3
        self.aave_strategy_abi = load_abi("AaveStrategy")
        self.rwa_strategy_abi = load_abi("RWAStrategy")

        self.aave_strategy: Optional[Contract] = (
            self.w3.eth.contract(
                address=AAVE_STRATEGY_ADDRESS, abi=self.aave_strategy_abi
            )
            if AAVE_STRATEGY_ADDRESS
            else None
        )
        self.rwa_strategy: Optional[Contract] = (
            self.w3.eth.contract(
                address=RWA_STRATEGY_ADDRESS, abi=self.rwa_strategy_abi
            )
            if RWA_STRATEGY_ADDRESS
            else None
        )

    def get_aave_apy(self) -> int:
        """
        Fetches the current Supply APY for the asset on Aave.
        Returns APY in basis points (e.g., 250 = 2.5%).
        """
        # TODO: Implement actual Aave V3 getReserveData call
        # For now, return a static value or random for testing
        return 300  # 3.0%

    def get_rwa_yield(self) -> int:
        """
        Fetches the fixed yield rate from the RWA Strategy contract.
        Returns Yield in basis points.
        """
        if not self.rwa_strategy:
            return 0

        try:
            yield_bps = self.rwa_strategy.functions.yieldRateBps().call()
            return yield_bps
        except Exception as e:
            print(f"Error fetching RWA yield: {e}")
            return 0

    def calculate_optimal_allocation(
        self, aave_apy_bps: int, rwa_yield_bps: int
    ) -> Allocation:
        """
        Determines the optimal allocation between [Aave, RWA].
        Returns an Allocation object.
        """
        RISK_PREMIUM_BPS = 100

        if rwa_yield_bps > (aave_apy_bps + RISK_PREMIUM_BPS):
            # RWA is significantly better. Allocate 80% RWA, 20% Aave (keep some liquidity).
            return Allocation(aave_bps=2000, rwa_bps=8000)
        elif rwa_yield_bps > aave_apy_bps:
            # RWA is slightly better. 50/50 split.
            return Allocation(aave_bps=5000, rwa_bps=5000)
        else:
            # Aave is better or equal. Favor liquidity. 90% Aave, 10% RWA.
            return Allocation(aave_bps=9000, rwa_bps=1000)
