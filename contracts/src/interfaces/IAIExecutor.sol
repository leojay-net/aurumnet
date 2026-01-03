// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IAIExecutor {
    event Rebalanced(uint256 timestamp, string reason);

    function setStrategyManager(address _strategyManager) external;
    function rebalance(
        address[] calldata strategies,
        uint256[] calldata allocations
    ) external;
}
