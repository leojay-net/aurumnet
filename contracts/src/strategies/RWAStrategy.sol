// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "../interfaces/IStrategy.sol";

/**
 * @title RWAStrategy
 * @notice Represents a tokenized real-world asset pool (e.g., Invoice Factoring).
 * @dev Allows an Issuer to borrow funds and repay them with interest.
 */
contract RWAStrategy is IStrategy, AccessControl {
    using SafeERC20 for IERC20;

    bytes32 public constant ISSUER_ROLE = keccak256("ISSUER_ROLE");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    IERC20 public immutable assetToken;
    address public vault;

    string public name;
    string public ipfsMetadata;
    uint256 public yieldRateBps;
    uint256 public loanDuration;
    uint256 public maturityDate;

    uint256 public totalPrincipalDeposited;
    uint256 public totalBorrowed;
    uint256 public totalRepaid;

    event Borrowed(address indexed issuer, uint256 amount);
    event Repaid(address indexed issuer, uint256 amount);
    event Defaulted(uint256 timestamp);

    bool public isDefaulted;

    /// @notice Initializes the RWA Strategy
    /// @param _asset The underlying asset token
    /// @param _vault The vault address
    /// @param _admin The admin address
    /// @param _name The name of the RWA pool
    /// @param _ipfsMetadata IPFS hash of legal documents
    /// @param _yieldRateBps Expected yield in basis points
    /// @param _loanDuration Duration of the loan in seconds
    constructor(
        address _asset,
        address _vault,
        address _admin,
        string memory _name,
        string memory _ipfsMetadata,
        uint256 _yieldRateBps,
        uint256 _loanDuration
    ) {
        assetToken = IERC20(_asset);
        vault = _vault;
        name = _name;
        ipfsMetadata = _ipfsMetadata;
        yieldRateBps = _yieldRateBps;
        loanDuration = _loanDuration;

        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
        _grantRole(ADMIN_ROLE, _admin);
    }

    // --- Strategy Interface ---

    /// @notice Deposits funds into the strategy
    /// @param amount The amount to deposit
    function deposit(uint256 amount) external override {
        require(!isDefaulted, "Pool is defaulted");
        assetToken.safeTransferFrom(msg.sender, address(this), amount);
        totalPrincipalDeposited += amount;
    }

    /// @notice Withdraws funds from the strategy
    /// @param amount The amount to withdraw
    function withdraw(uint256 amount) external override {
        uint256 balance = assetToken.balanceOf(address(this));
        require(
            balance >= amount,
            "Insufficient liquid funds (funds might be borrowed)"
        );

        if (totalPrincipalDeposited >= amount) {
            totalPrincipalDeposited -= amount;
        } else {
            totalPrincipalDeposited = 0;
        }

        assetToken.safeTransfer(vault, amount);
    }

    /// @notice Returns the total value of assets in the strategy
    /// @return The total asset value (liquid + outstanding)
    function totalAssets() external view override returns (uint256) {
        if (isDefaulted) {
            return assetToken.balanceOf(address(this));
        }

        uint256 liquidBalance = assetToken.balanceOf(address(this));
        uint256 outstandingPrincipal = totalBorrowed -
            (totalRepaid > totalBorrowed ? totalBorrowed : totalRepaid);

        return liquidBalance + outstandingPrincipal;
    }

    /// @notice Returns the name of the strategy
    function strategyName() external view override returns (string memory) {
        return name;
    }

    /// @notice Checks if the strategy is active
    function isActive() external view override returns (bool) {
        return
            !isDefaulted &&
            (maturityDate == 0 || block.timestamp < maturityDate);
    }

    // --- RWA Issuer Operations ---

    /// @notice Issuer borrows funds to finance the real world asset
    /// @param amount The amount to borrow
    function borrow(uint256 amount) external onlyRole(ISSUER_ROLE) {
        require(!isDefaulted, "Pool is defaulted");
        require(
            assetToken.balanceOf(address(this)) >= amount,
            "Insufficient liquidity"
        );

        if (maturityDate == 0) {
            maturityDate = block.timestamp + loanDuration;
        }

        totalBorrowed += amount;
        assetToken.safeTransfer(msg.sender, amount);
        emit Borrowed(msg.sender, amount);
    }

    /// @notice Issuer repays the loan with interest
    /// @param amount The amount to repay
    function repay(uint256 amount) external {
        assetToken.safeTransferFrom(msg.sender, address(this), amount);
        totalRepaid += amount;
        emit Repaid(msg.sender, amount);
    }

    /// @notice Admin can mark the asset as defaulted if repayment fails
    function markDefault() external onlyRole(ADMIN_ROLE) {
        isDefaulted = true;
        emit Defaulted(block.timestamp);
    }
}
