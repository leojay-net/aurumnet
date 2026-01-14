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
    struct DeploymentAddresses {
        address mockUSDC;
        address vaultCore;
        address strategyManager;
        address aiExecutor;
        address rwaStrategy;
        address aaveStrategy;
        address mockAavePool;
    }

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        // Get AI Agent address from env, default to deployer
        address aiAgent = vm.envOr("AI_AGENT_ADDRESS", deployer);
        
        // Get USDC address from env (for testnet/mainnet), or deploy mock
        address usdcAddress = vm.envOr("USDC_ADDRESS", address(0));
        bool deployMockUSDC = usdcAddress == address(0);
        
        // Get Aave Pool address from env (for testnet/mainnet), or deploy mock
        address aavePoolAddress = vm.envOr("AAVE_POOL_ADDRESS", address(0));
        bool deployMockAavePool = aavePoolAddress == address(0);

        vm.startBroadcast(deployerPrivateKey);

        DeploymentAddresses memory addresses;

        // 1. Deploy or use existing USDC
        address usdc;
        if (deployMockUSDC) {
            MockUSDC mockUSDC = new MockUSDC();
            usdc = address(mockUSDC);
            addresses.mockUSDC = usdc;
            console.log("MockUSDC deployed at:", usdc);
        } else {
            usdc = usdcAddress;
            console.log("Using existing USDC at:", usdc);
        }

        // 2. Deploy VaultCore
        VaultCore vault = new VaultCore(
            usdc,
            "AurumNet Vault",
            "AUR",
            deployer
        );
        addresses.vaultCore = address(vault);
        console.log("VaultCore deployed at:", address(vault));

        // 3. Deploy StrategyManager
        StrategyManager strategyManager = new StrategyManager(
            address(vault),
            usdc,
            deployer
        );
        addresses.strategyManager = address(strategyManager);
        console.log("StrategyManager deployed at:", address(strategyManager));

        // 4. Connect Vault to StrategyManager
        vault.setStrategyManager(address(strategyManager));

        // 5. Deploy AIExecutor
        AIExecutor aiExecutor = new AIExecutor(
            address(strategyManager),
            aiAgent
        );
        addresses.aiExecutor = address(aiExecutor);
        console.log("AIExecutor deployed at:", address(aiExecutor));
        console.log("AI Agent address:", aiAgent);

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
            usdc,
            address(vault),
            deployer,
            "Invoice #1234",
            "ipfs://QmHash...",
            1000, // 10% APY
            30 days
        );
        addresses.rwaStrategy = address(rwaStrategy);
        console.log("RWAStrategy deployed at:", address(rwaStrategy));

        // Aave Pool and Strategy
        address aavePool;
        if (deployMockAavePool) {
            MockAavePool mockAavePool = new MockAavePool();
            aavePool = address(mockAavePool);
            addresses.mockAavePool = aavePool;
            console.log("MockAavePool deployed at:", aavePool);
        } else {
            aavePool = aavePoolAddress;
            console.log("Using existing Aave Pool at:", aavePool);
        }

        AaveStrategy aaveStrategy = new AaveStrategy(
            usdc,
            aavePool,
            address(vault)
        );
        addresses.aaveStrategy = address(aaveStrategy);
        console.log("AaveStrategy deployed at:", address(aaveStrategy));

        // 9. Add Strategies to Manager
        strategyManager.addStrategy(address(rwaStrategy));
        strategyManager.addStrategy(address(aaveStrategy));

        vm.stopBroadcast();

        // Save addresses to JSON file
        saveAddresses(addresses);
    }

    function saveAddresses(DeploymentAddresses memory addresses) internal {
        string memory json = "deployment-addresses.json";
        string memory chainId = vm.toString(block.chainid);
        
        // Build JSON string manually for better compatibility
        string memory jsonStr = "{";
        jsonStr = string.concat(jsonStr, '"chainId": "', chainId, '",');
        jsonStr = string.concat(jsonStr, '"VaultCore": "', vm.toString(addresses.vaultCore), '",');
        jsonStr = string.concat(jsonStr, '"StrategyManager": "', vm.toString(addresses.strategyManager), '",');
        jsonStr = string.concat(jsonStr, '"AIExecutor": "', vm.toString(addresses.aiExecutor), '",');
        jsonStr = string.concat(jsonStr, '"RWAStrategy": "', vm.toString(addresses.rwaStrategy), '",');
        jsonStr = string.concat(jsonStr, '"AaveStrategy": "', vm.toString(addresses.aaveStrategy), '"');
        
        if (addresses.mockUSDC != address(0)) {
            jsonStr = string.concat(jsonStr, ',"MockUSDC": "', vm.toString(addresses.mockUSDC), '"');
        }
        if (addresses.mockAavePool != address(0)) {
            jsonStr = string.concat(jsonStr, ',"MockAavePool": "', vm.toString(addresses.mockAavePool), '"');
        }
        
        jsonStr = string.concat(jsonStr, "}");
        
        vm.writeJson(jsonStr, "./deployment-addresses.json");
        
        console.log("\n=== Deployment Summary ===");
        console.log("Addresses saved to: deployment-addresses.json");
    }
}
