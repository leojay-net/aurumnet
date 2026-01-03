// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "../interfaces/IAIExecutor.sol";
import "../interfaces/IStrategyManager.sol";

/// @title AIExecutor
/// @notice Executes rebalancing actions triggered by the AI Agent
/// @dev Acts as a bridge between the off-chain AI agent and the on-chain StrategyManager
contract AIExecutor is IAIExecutor, Ownable {
    address public strategyManager;
    address public aiAgent;

    event AIAgentUpdated(address indexed newAgent);

    /// @notice Initializes the AIExecutor
    /// @param _strategyManager The address of the StrategyManager
    /// @param _aiAgent The address of the authorized AI agent
    constructor(
        address _strategyManager,
        address _aiAgent
    ) Ownable(msg.sender) {
        strategyManager = _strategyManager;
        aiAgent = _aiAgent;
    }

    modifier onlyAIAgent() {
        require(msg.sender == aiAgent, "Caller is not the AI Agent");
        _;
    }

    /// @notice Sets the StrategyManager address
    /// @param _strategyManager The new StrategyManager address
    function setStrategyManager(
        address _strategyManager
    ) external override onlyOwner {
        strategyManager = _strategyManager;
    }

    /// @notice Sets the AI Agent address
    /// @param _aiAgent The new AI Agent address
    function setAIAgent(address _aiAgent) external onlyOwner {
        aiAgent = _aiAgent;
        emit AIAgentUpdated(_aiAgent);
    }

    /// @notice Triggers a rebalance operation
    /// @param strategies The list of strategies to allocate to
    /// @param allocations The allocation points for each strategy
    function rebalance(
        address[] calldata strategies,
        uint256[] calldata allocations
    ) external override onlyAIAgent {
        require(strategyManager != address(0), "StrategyManager not set");
        IStrategyManager(strategyManager).rebalance(strategies, allocations);
        emit Rebalanced(block.timestamp, "AI Rebalance Triggered");
    }
}
