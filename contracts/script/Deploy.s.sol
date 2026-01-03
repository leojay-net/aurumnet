// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/core/VaultCore.sol";
import "../src/core/StrategyManager.sol";
import "../src/core/AIExecutor.sol";
import "../src/strategies/RWAStrategy.sol";
import "../src/strategies/AaveStrategy.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// Mock USDC for testnet deployment if needed
contract MockUSDC is ERC20 {
    constructor() ERC20("Mock USDC", "USDC") {
        _mint(msg.sender, 1000000 * 10 ** 6); // USDC uses 6 decimals usually, but let's stick to 18 if that's what the rest of the system expects. Wait, USDC is 6.
    }

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }

    function decimals() public view virtual override returns (uint8) {
        return 6;
    }
}

// Mock Aave Pool for local deployment
contract MockAavePool {
    mapping(address => uint256) public balances;
    mapping(address => address) public aTokens;

    function supply(
        address asset,
        uint256 amount,
        address onBehalfOf,
        uint16 referralCode
    ) external {
        balances[asset] += amount;
    }

    function withdraw(
        address asset,
        uint256 amount,
        address to
    ) external returns (uint256) {
        require(balances[asset] >= amount, "Insufficient balance");
        balances[asset] -= amount;
        IERC20(asset).transfer(to, amount);
        return amount;
    }

    function getReserveData(
        address asset
    ) external view returns (IPool.ReserveData memory) {
        return
            IPool.ReserveData({
                configuration: 0,
                liquidityIndex: 0,
                currentLiquidityRate: 0,
                currentVariableBorrowRate: 0,
                currentStableBorrowRate: 0,
                lastUpdateTimestamp: 0,
                id: 0,
                aTokenAddress: address(0), // In a real mock, we'd deploy a MockAToken
                stableDebtTokenAddress: address(0),
                variableDebtTokenAddress: address(0),
                interestRateStrategyAddress: address(0),
                accruedToTreasury: 0,
                unbacked: 0,
                isolationModeTotalDebt: 0
            });
    }
}

contract DeployAurumNet is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        vm.startBroadcast(deployerPrivateKey);

        // 1. Deploy Mock USDC (or use existing on testnet)
        // For this script, we'll deploy a fresh one for demonstration
        MockUSDC usdc = new MockUSDC();
        console.log("MockUSDC deployed at:", address(usdc));

        // 2. Deploy VaultCore
        VaultCore vault = new VaultCore(
            address(usdc),
            "AurumNet Vault",
            "AUR",
            deployer
        );
        console.log("VaultCore deployed at:", address(vault));

        // 3. Deploy StrategyManager
        StrategyManager strategyManager = new StrategyManager(
            address(vault),
            address(usdc),
            deployer
        );
        console.log("StrategyManager deployed at:", address(strategyManager));

        // 4. Connect Vault to StrategyManager
        vault.setStrategyManager(address(strategyManager));

        // 5. Deploy AIExecutor
        // Assuming the AI Agent address is the deployer for now, or a specific address
        address aiAgent = deployer;
        AIExecutor aiExecutor = new AIExecutor(
            address(strategyManager),
            aiAgent
        );
        console.log("AIExecutor deployed at:", address(aiExecutor));

        // 6. Connect Vault to AIExecutor
        vault.setAIExecutor(address(aiExecutor));

        // 7. Grant Executor Role to AIExecutor in StrategyManager
        strategyManager.grantRole(
            strategyManager.EXECUTOR_ROLE(),
            address(aiExecutor)
        );

        // 8. Deploy Strategies
        // RWA Strategy
        RWAStrategy rwaStrategy = new RWAStrategy(
            address(usdc),
            address(vault),
            deployer,
            "Invoice #1234",
            "ipfs://QmHash...",
            1000, // 10% APY
            30 days
        );
        console.log("RWAStrategy deployed at:", address(rwaStrategy));

        // Mock Aave Pool (Need a real or mock address for Aave Pool)
        // For this script, we'll deploy a mock Aave pool
        // In real deployment, use actual Aave Pool address
        MockAavePool mockAavePool = new MockAavePool();
        AaveStrategy aaveStrategy = new AaveStrategy(
            address(usdc),
            address(mockAavePool),
            address(vault)
        );
        console.log("AaveStrategy deployed at:", address(aaveStrategy));

        // 9. Add Strategies to Manager
        strategyManager.addStrategy(address(rwaStrategy));
        strategyManager.addStrategy(address(aaveStrategy));

        vm.stopBroadcast();
    }
}
