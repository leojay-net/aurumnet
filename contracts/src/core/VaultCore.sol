// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "../interfaces/IVault.sol";
import "../interfaces/IStrategy.sol";
import "../interfaces/IStrategyManager.sol";

/// @title VaultCore
/// @notice Core vault contract handling user deposits, withdrawals, and share minting
/// @dev Implements ERC4626-like functionality with role-based access control
contract VaultCore is IVault, ERC20, ReentrancyGuard, Pausable, AccessControl {
    using SafeERC20 for IERC20;

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant STRATEGIST_ROLE = keccak256("STRATEGIST_ROLE");

    IERC20 public immutable assetToken;
    address public strategyManager;
    address public aiExecutor;

    /// @notice Initializes the Vault with asset token and admin
    /// @param _asset The underlying asset token address
    /// @param _name The name of the vault share token
    /// @param _symbol The symbol of the vault share token
    /// @param _admin The address to be granted admin roles
    constructor(
        address _asset,
        string memory _name,
        string memory _symbol,
        address _admin
    ) ERC20(_name, _symbol) {
        assetToken = IERC20(_asset);
        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
        _grantRole(ADMIN_ROLE, _admin);
    }

    /// @notice Sets the StrategyManager address
    /// @param _strategyManager The new StrategyManager address
    function setStrategyManager(
        address _strategyManager
    ) external onlyRole(ADMIN_ROLE) {
        strategyManager = _strategyManager;
        _grantRole(STRATEGIST_ROLE, _strategyManager);
        emit StrategyManagerUpdated(_strategyManager);
    }

    /// @notice Sets the AIExecutor address
    /// @param _aiExecutor The new AIExecutor address
    function setAIExecutor(address _aiExecutor) external onlyRole(ADMIN_ROLE) {
        aiExecutor = _aiExecutor;
        _grantRole(STRATEGIST_ROLE, _aiExecutor);
        emit AIExecutorUpdated(_aiExecutor);
    }

    /// @notice Deposits assets into the vault and mints shares
    /// @param assets The amount of assets to deposit
    /// @param receiver The address to receive the shares
    /// @return shares The amount of shares minted
    function deposit(
        uint256 assets,
        address receiver
    ) external nonReentrant whenNotPaused returns (uint256 shares) {
        require(assets > 0, "Deposit amount must be greater than zero");

        shares = convertToShares(assets);
        require(shares > 0, "Shares must be greater than zero");

        assetToken.safeTransferFrom(msg.sender, address(this), assets);
        _mint(receiver, shares);

        emit Deposited(msg.sender, assets, shares);
    }

    /// @notice Withdraws assets from the vault by burning shares
    /// @param shares The amount of shares to burn
    /// @param receiver The address to receive the assets
    /// @param owner The owner of the shares
    /// @return assets The amount of assets withdrawn
    function withdraw(
        uint256 shares,
        address receiver,
        address owner
    ) external nonReentrant returns (uint256 assets) {
        require(shares > 0, "Shares must be greater than zero");
        if (msg.sender != owner) {
            _spendAllowance(owner, msg.sender, shares);
        }

        assets = convertToAssets(shares);
        _burn(owner, shares);

        uint256 balance = assetToken.balanceOf(address(this));
        if (balance < assets) {
            uint256 shortage = assets - balance;
            if (strategyManager != address(0)) {
                IStrategyManager(strategyManager).withdraw(shortage);
                balance = assetToken.balanceOf(address(this));
            }

            require(balance >= assets, "Insufficient liquid assets");
        }

        assetToken.safeTransfer(receiver, assets);

        emit Withdrawn(msg.sender, assets, shares);
    }

    /// @notice Returns the total assets managed by the vault
    /// @return The total amount of assets
    function totalAssets() public view override returns (uint256) {
        uint256 assets = assetToken.balanceOf(address(this));
        if (strategyManager != address(0)) {
            assets += IStrategyManager(strategyManager).totalAssets();
        }
        return assets;
    }

    /// @notice Converts asset amount to share amount
    /// @param assets The amount of assets
    /// @return The equivalent amount of shares
    function convertToShares(
        uint256 assets
    ) public view override returns (uint256) {
        uint256 supply = totalSupply();
        return supply == 0 ? assets : (assets * supply) / totalAssets();
    }

    /// @notice Converts share amount to asset amount
    /// @param shares The amount of shares
    /// @return The equivalent amount of assets
    function convertToAssets(
        uint256 shares
    ) public view override returns (uint256) {
        uint256 supply = totalSupply();
        return supply == 0 ? shares : (shares * totalAssets()) / supply;
    }

    function asset() external view override returns (address) {
        return address(assetToken);
    }

    // Function for StrategyManager to pull funds
    function pullFunds(uint256 amount) external onlyRole(STRATEGIST_ROLE) {
        assetToken.safeTransfer(msg.sender, amount);
    }

    // Function to receive funds back from strategies
    function pushFunds(uint256 amount) external {
        assetToken.safeTransferFrom(msg.sender, address(this), amount);
    }

    function pause() external onlyRole(ADMIN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(ADMIN_ROLE) {
        _unpause();
    }
}
