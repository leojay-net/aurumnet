// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IStrategyManager {
    function rebalance(
        address[] calldata strategies,
        uint256[] calldata allocations
    ) external;
    function withdraw(uint256 amount) external;
    function totalAssets() external view returns (uint256);
}
