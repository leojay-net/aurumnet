// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "../interfaces/IStrategy.sol";
import "./VaultCore.sol";

/// @title StrategyManager
/// @notice Manages the allocation of funds across different strategies
/// @dev Handles rebalancing and strategy whitelisting
contract StrategyManager is AccessControl {
    using SafeERC20 for IERC20;

    bytes32 public constant EXECUTOR_ROLE = keccak256("EXECUTOR_ROLE");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    VaultCore public vault;
    IERC20 public assetToken;

    struct StrategyInfo {
        address strategyAddress;
        uint256 allocation; // Percentage in basis points (10000 = 100%)
        bool isActive;
    }

    StrategyInfo[] public strategies;
    mapping(address => bool) public isStrategyWhitelisted;

    event StrategyAdded(address indexed strategy);
    event StrategyRemoved(address indexed strategy);
    event Rebalanced(uint256 timestamp);

    /// @notice Initializes the StrategyManager
    /// @param _vault The address of the VaultCore contract
    /// @param _asset The address of the underlying asset token
    /// @param _admin The address to be granted admin roles
    constructor(address _vault, address _asset, address _admin) {
        vault = VaultCore(_vault);
        assetToken = IERC20(_asset);
        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
        _grantRole(ADMIN_ROLE, _admin);
    }

    /// @notice Adds a new strategy to the whitelist
    /// @param _strategy The address of the strategy to add
    function addStrategy(address _strategy) external onlyRole(ADMIN_ROLE) {
        require(
            !isStrategyWhitelisted[_strategy],
            "Strategy already whitelisted"
        );
        isStrategyWhitelisted[_strategy] = true;
        strategies.push(
            StrategyInfo({
                strategyAddress: _strategy,
                allocation: 0,
                isActive: true
            })
        );
        emit StrategyAdded(_strategy);
    }

    /// @notice Sets the active status of a strategy
    /// @param _index The index of the strategy in the array
    /// @param _isActive The new active status
    function setStrategyActive(
        uint256 _index,
        bool _isActive
    ) external onlyRole(ADMIN_ROLE) {
        require(_index < strategies.length, "Invalid index");
        strategies[_index].isActive = _isActive;
    }

    /// @notice Rebalances funds across strategies based on new allocations
    /// @param _strategies The list of strategy addresses
    /// @param _allocations The list of allocation points (basis points)
    function rebalance(
        address[] calldata _strategies,
        uint256[] calldata _allocations
    ) external onlyRole(EXECUTOR_ROLE) {
        require(_strategies.length == _allocations.length, "Length mismatch");

        uint256 totalAllocation = 0;
        for (uint256 i = 0; i < _allocations.length; i++) {
            totalAllocation += _allocations[i];
        }
        require(totalAllocation <= 10000, "Total allocation exceeds 100%");

        _withdrawAll();

        uint256 vaultTotalAssets = vault.totalAssets();

        for (uint256 i = 0; i < _strategies.length; i++) {
            address strategyAddr = _strategies[i];
            require(
                isStrategyWhitelisted[strategyAddr],
                "Strategy not whitelisted"
            );

            uint256 amountToAllocate = (vaultTotalAssets * _allocations[i]) /
                10000;
            if (amountToAllocate > 0) {
                vault.pullFunds(amountToAllocate);

                assetToken.approve(strategyAddr, amountToAllocate);
                IStrategy(strategyAddr).deposit(amountToAllocate);
            }
        }

        emit Rebalanced(block.timestamp);
    }

    function _withdrawAll() internal {
        for (uint256 i = 0; i < strategies.length; i++) {
            if (!strategies[i].isActive) continue;

            address strategyAddr = strategies[i].strategyAddress;
            uint256 balance = IStrategy(strategyAddr).totalAssets();
            if (balance > 0) {
                IStrategy(strategyAddr).withdraw(balance);
                uint256 myBalance = assetToken.balanceOf(address(this));
                if (myBalance > 0) {
                    assetToken.safeTransfer(address(vault), myBalance);
                }
            }
        }
    }

    /// @notice Withdraws a specific amount from strategies to the vault
    /// @param amount The amount to withdraw
    function withdraw(uint256 amount) external {
        require(
            hasRole(ADMIN_ROLE, msg.sender) || msg.sender == address(vault),
            "Caller is not Admin or Vault"
        );
        uint256 withdrawn = 0;
        for (uint256 i = 0; i < strategies.length; i++) {
            if (withdrawn >= amount) break;
            if (!strategies[i].isActive) continue;

            address strategyAddr = strategies[i].strategyAddress;
            uint256 balance = IStrategy(strategyAddr).totalAssets();

            if (balance > 0) {
                uint256 remaining = amount - withdrawn;
                uint256 toWithdraw = balance > remaining ? remaining : balance;

                IStrategy(strategyAddr).withdraw(toWithdraw);

                uint256 myBalance = assetToken.balanceOf(address(this));
                if (myBalance > 0) {
                    assetToken.safeTransfer(address(vault), myBalance);
                    withdrawn += myBalance;
                }
            }
        }
    }

    /// @notice Returns the total assets managed by the StrategyManager
    /// @return The total amount of assets
    function totalAssets() external view returns (uint256) {
        uint256 total = assetToken.balanceOf(address(this));
        for (uint256 i = 0; i < strategies.length; i++) {
            total += IStrategy(strategies[i].strategyAddress).totalAssets();
        }
        return total;
    }
}
