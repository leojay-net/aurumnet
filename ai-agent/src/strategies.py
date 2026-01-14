from dataclasses import dataclass
from typing import List, Optional
from web3 import Web3
from web3.contract import Contract
from .config import (
    load_abi,
    AAVE_STRATEGY_ADDRESS,
    RWA_STRATEGY_ADDRESS,
    MIN_DEFI_APY_BPS,
    AAVE_POOL_ADDRESS,
    UNDERLYING_ASSET_ADDRESS,
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

        # Load ABIs
        self.aave_strategy_abi = load_abi("AaveStrategy")
        self.rwa_strategy_abi = load_abi("RWAStrategy")
        self.aave_pool_abi = load_abi("IPool")

        # On-chain contracts
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
        self.aave_pool: Optional[Contract] = (
            self.w3.eth.contract(
                address=AAVE_POOL_ADDRESS, abi=self.aave_pool_abi
            )
            if AAVE_POOL_ADDRESS
            else None
        )

    def get_aave_apy(self) -> int:
        """
        Fetches the current Supply APY for the asset on Aave using IPool.getReserveData.

        Returns APY in basis points (e.g., 250 = 2.5%).
        If configuration is missing or the call fails, returns 0.
        """
        if not self.aave_pool or not UNDERLYING_ASSET_ADDRESS:
            # Misconfigured – cannot read real APY
            return 0

        try:
            # Aave V3: currentLiquidityRate is a ray (1e27)
            reserve_data = self.aave_pool.functions.getReserveData(
                UNDERLYING_ASSET_ADDRESS
            ).call()

            # currentLiquidityRate is at index 2 in ReserveData struct for Aave V3
            current_liquidity_rate = reserve_data[2]

            # Convert from ray (1e27) to a per-year rate in basis points (1e4)
            # bps = rate * 1e4 / 1e27 = rate / 1e23
            apy_bps = int(current_liquidity_rate // 10**23)

            # Basic sanity clamp: ignore clearly nonsensical values
            if apy_bps < 0 or apy_bps > 100_000:  # >1000% APY
                return 0

            return apy_bps
        except Exception as e:  # pragma: no cover - defensive
            print(f"Error fetching Aave APY: {e}")
            return 0

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
