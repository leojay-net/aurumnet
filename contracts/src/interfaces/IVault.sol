// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IVault is IERC20 {
    event Deposited(address indexed user, uint256 assets, uint256 shares);
    event Withdrawn(address indexed user, uint256 assets, uint256 shares);
    event StrategyManagerUpdated(address indexed newManager);
    event AIExecutorUpdated(address indexed newExecutor);

    function deposit(
        uint256 assets,
        address receiver
    ) external returns (uint256 shares);
    function withdraw(
        uint256 shares,
        address receiver,
        address owner
    ) external returns (uint256 assets);

    function totalAssets() external view returns (uint256);
    function convertToShares(uint256 assets) external view returns (uint256);
    function convertToAssets(uint256 shares) external view returns (uint256);

    function asset() external view returns (address);
}
