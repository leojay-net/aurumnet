// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "../interfaces/IStrategy.sol";

// Mock Aave Pool Interface
interface IPool {
    struct ReserveData {
        // stores the reserve configuration
        uint256 configuration;
        // the liquidity index. Expressed in ray
        uint128 liquidityIndex;
        // the current supply rate. Expressed in ray
        uint128 currentLiquidityRate;
        // the current variable borrow rate. Expressed in ray
        uint128 currentVariableBorrowRate;
        // the current stable borrow rate. Expressed in ray
        uint128 currentStableBorrowRate;
        // the last time the reserve was updated
        uint40 lastUpdateTimestamp;
        // the id of the reserve.
        uint16 id;
        // aToken address
        address aTokenAddress;
        // stableDebtToken address
        address stableDebtTokenAddress;
        // variableDebtToken address
        address variableDebtTokenAddress;
        // address of the interest rate strategy
        address interestRateStrategyAddress;
        // the current treasury balance, scaled
        uint128 accruedToTreasury;
        // the outstanding unbacked aTokens minted through the bridging feature
        uint128 unbacked;
        // the outstanding debt minted through the bridging feature
        uint128 isolationModeTotalDebt;
    }

    function supply(
        address asset,
        uint256 amount,
        address onBehalfOf,
        uint16 referralCode
    ) external;
    function withdraw(
        address asset,
        uint256 amount,
        address to
    ) external returns (uint256);
    function getReserveData(
        address asset
    ) external view returns (ReserveData memory);
}

/// @title AaveStrategy
/// @notice Strategy adapter for Aave V3
/// @dev Interacts with Aave Pool to supply and withdraw assets
contract AaveStrategy is IStrategy {
    using SafeERC20 for IERC20;

    IERC20 public assetToken;
    IPool public aavePool;
    address public vault;
    IERC20 public aToken;

    /// @notice Initializes the Aave Strategy
    /// @param _asset The underlying asset token
    /// @param _aavePool The Aave Pool address
    /// @param _vault The vault address
    constructor(address _asset, address _aavePool, address _vault) {
        assetToken = IERC20(_asset);
        aavePool = IPool(_aavePool);
        vault = _vault;

        try aavePool.getReserveData(_asset) returns (
            IPool.ReserveData memory data
        ) {
            aToken = IERC20(data.aTokenAddress);
        } catch {}
    }

    /// @notice Deposits funds into Aave
    /// @param amount The amount to deposit
    function deposit(uint256 amount) external override {
        assetToken.safeTransferFrom(msg.sender, address(this), amount);
        assetToken.approve(address(aavePool), amount);
        aavePool.supply(address(assetToken), amount, address(this), 0);
    }

    /// @notice Withdraws funds from Aave
    /// @param amount The amount to withdraw
    function withdraw(uint256 amount) external override {
        aavePool.withdraw(address(assetToken), amount, vault);
    }

    /// @notice Returns the total value of assets in Aave (aTokens)
    /// @return The total asset value
    function totalAssets() external view override returns (uint256) {
        if (address(aToken) != address(0)) {
            return aToken.balanceOf(address(this));
        }
        return 0;
    }

    /// @notice Returns the name of the strategy
    function strategyName() external pure override returns (string memory) {
        return "Aave Lending Strategy";
    }

    /// @notice Checks if the strategy is active
    function isActive() external pure override returns (bool) {
        return true;
    }
}
