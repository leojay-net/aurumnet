// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../../src/core/VaultCore.sol";
import "../../src/core/StrategyManager.sol";
import "../../src/core/AIExecutor.sol";
import "../../src/strategies/RWAStrategy.sol";
import "../../src/strategies/AaveStrategy.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockERC20 is ERC20 {
    constructor() ERC20("Mock USDC", "USDC") {
        _mint(msg.sender, 1000000 * 10 ** 18);
    }
    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}

contract MockAavePool {
    mapping(address => uint256) public balances;
    function supply(
        address asset,
        uint256 amount,
        address onBehalfOf,
        uint16 referralCode
    ) external {
        balances[onBehalfOf] += amount;
    }
    function withdraw(
        address asset,
        uint256 amount,
        address to
    ) external returns (uint256) {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        IERC20(asset).transfer(to, amount);
        return amount;
    }
    // Mock getReserveData to return aToken address (we'll use the pool itself as aToken for simplicity in mock)
    function getReserveData(
        address asset
    ) external view returns (IPool.ReserveData memory) {
        IPool.ReserveData memory data;
        data.aTokenAddress = address(this); // Hack: use pool as aToken for balanceOf check
        return data;
    }
    // Mock balanceOf for aToken check
    function balanceOf(address account) external view returns (uint256) {
        return balances[account];
    }
}

contract AurumIntegrationTest is Test {
    VaultCore vault;
    StrategyManager strategyManager;
    AIExecutor aiExecutor;
    RWAStrategy rwaStrategy;
    AaveStrategy aaveStrategy;
    MockERC20 usdc;
    MockAavePool aavePool;

    address admin = address(1);
    address user = address(2);
    address aiAgent = address(3);
    address issuer = address(4);

    function setUp() public {
        vm.startPrank(admin);

        usdc = new MockERC20();
        aavePool = new MockAavePool();

        vault = new VaultCore(address(usdc), "Aurum Vault", "AUR", admin);
        strategyManager = new StrategyManager(
            address(vault),
            address(usdc),
            admin
        );
        aiExecutor = new AIExecutor(address(strategyManager), aiAgent);

        vault.setStrategyManager(address(strategyManager));
        vault.setAIExecutor(address(aiExecutor));

        rwaStrategy = new RWAStrategy(
            address(usdc),
            address(vault),
            admin,
            "Invoice #1",
            "ipfs",
            1000,
            30 days
        );
        aaveStrategy = new AaveStrategy(
            address(usdc),
            address(aavePool),
            address(vault)
        );

        strategyManager.addStrategy(address(rwaStrategy));
        strategyManager.addStrategy(address(aaveStrategy));
        strategyManager.grantRole(
            strategyManager.EXECUTOR_ROLE(),
            address(aiExecutor)
        );
        rwaStrategy.grantRole(rwaStrategy.ISSUER_ROLE(), issuer);

        vm.stopPrank();

        usdc.mint(user, 10000 * 10 ** 18);
        usdc.mint(address(aavePool), 100000 * 10 ** 18); // Liquidity for Aave
    }

    function testFullFlow() public {
        // 1. User Deposits
        vm.startPrank(user);
        usdc.approve(address(vault), 1000 * 10 ** 18);
        vault.deposit(1000 * 10 ** 18, user);
        vm.stopPrank();

        // 2. AI Rebalances (50% RWA, 50% Aave)
        vm.startPrank(aiAgent);
        address[] memory strategies = new address[](2);
        strategies[0] = address(rwaStrategy);
        strategies[1] = address(aaveStrategy);
        uint256[] memory allocations = new uint256[](2);
        allocations[0] = 5000;
        allocations[1] = 5000;
        aiExecutor.rebalance(strategies, allocations);
        vm.stopPrank();

        assertEq(rwaStrategy.totalAssets(), 500 * 10 ** 18);
        // Aave balance check (mock pool acts as aToken)
        assertEq(aavePool.balanceOf(address(aaveStrategy)), 500 * 10 ** 18);

        // 3. RWA Activity (Borrow & Repay with Interest)
        vm.startPrank(issuer);
        rwaStrategy.borrow(500 * 10 ** 18);
        usdc.approve(address(rwaStrategy), 550 * 10 ** 18);
        usdc.mint(issuer, 50 * 10 ** 18);
        rwaStrategy.repay(550 * 10 ** 18);
        vm.stopPrank();

        // 4. User Withdraws (Principal + Profit)
        // Vault totalAssets should now reflect the profit
        // RWA Strategy has 550. Aave has 500. Total = 1050.
        assertEq(vault.totalAssets(), 1050 * 10 ** 18);

        vm.startPrank(user);
        uint256 shares = vault.balanceOf(user);
        vault.withdraw(shares, user, user);
        vm.stopPrank();

        assertEq(usdc.balanceOf(user), 10050 * 10 ** 18); // Started with 10000, deposited 1000, got back 1050.
    }

    function testEmergencyPause() public {
        vm.startPrank(admin);
        vault.pause();
        vm.stopPrank();

        vm.startPrank(user);
        usdc.approve(address(vault), 100 * 10 ** 18);
        vm.expectRevert(Pausable.EnforcedPause.selector);
        vault.deposit(100 * 10 ** 18, user);
        vm.stopPrank();

        vm.startPrank(admin);
        vault.unpause();
        vm.stopPrank();

        vm.startPrank(user);
        vault.deposit(100 * 10 ** 18, user);
        vm.stopPrank();

        assertEq(vault.balanceOf(user), 100 * 10 ** 18);
    }
}
