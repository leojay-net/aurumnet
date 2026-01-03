// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/core/VaultCore.sol";
import "../src/core/StrategyManager.sol";
import "../src/core/AIExecutor.sol";
import "../src/strategies/RWAStrategy.sol";
import "../src/strategies/AaveStrategy.sol";
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
}

contract AurumNetTest is Test {
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

        // RWA Strategy Setup
        rwaStrategy = new RWAStrategy(
            address(usdc),
            address(vault),
            admin,
            "Invoice #1234",
            "ipfs://QmHash...",
            1000, // 10% APY
            30 days
        );

        aaveStrategy = new AaveStrategy(
            address(usdc),
            address(aavePool),
            address(vault)
        );

        strategyManager.addStrategy(address(rwaStrategy));
        strategyManager.addStrategy(address(aaveStrategy));

        // Grant EXECUTOR_ROLE to AIExecutor in StrategyManager
        strategyManager.grantRole(
            strategyManager.EXECUTOR_ROLE(),
            address(aiExecutor)
        );

        vm.stopPrank();

        // Fund user
        usdc.mint(user, 1000 * 10 ** 18);
        // Fund Aave Pool for withdrawals
        usdc.mint(address(aavePool), 10000 * 10 ** 18);
    }

    function testDeposit() public {
        vm.startPrank(user);
        usdc.approve(address(vault), 100 * 10 ** 18);
        vault.deposit(100 * 10 ** 18, user);

        assertEq(vault.balanceOf(user), 100 * 10 ** 18);
        assertEq(vault.totalAssets(), 100 * 10 ** 18);
        vm.stopPrank();
    }

    function testWithdraw() public {
        vm.startPrank(user);
        usdc.approve(address(vault), 100 * 10 ** 18);
        vault.deposit(100 * 10 ** 18, user);

        vault.withdraw(50 * 10 ** 18, user, user);
        assertEq(vault.balanceOf(user), 50 * 10 ** 18);
        assertEq(usdc.balanceOf(user), 950 * 10 ** 18);
        vm.stopPrank();
    }

    function testAIRebalance() public {
        // 1. User deposits
        vm.startPrank(user);
        usdc.approve(address(vault), 100 * 10 ** 18);
        vault.deposit(100 * 10 ** 18, user);
        vm.stopPrank();

        // 2. AI Rebalances
        vm.startPrank(aiAgent);
        address[] memory strategies = new address[](2);
        strategies[0] = address(rwaStrategy);
        strategies[1] = address(aaveStrategy);

        uint256[] memory allocations = new uint256[](2);
        allocations[0] = 5000; // 50%
        allocations[1] = 5000; // 50%

        aiExecutor.rebalance(strategies, allocations);
        vm.stopPrank();

        // Check allocations
        assertEq(rwaStrategy.totalPrincipalDeposited(), 50 * 10 ** 18);
    }

    function testRWALifecycle() public {
        // 1. User deposits
        vm.startPrank(user);
        usdc.approve(address(vault), 1000 * 10 ** 18);
        vault.deposit(1000 * 10 ** 18, user);
        vm.stopPrank();

        // 2. AI Allocates to RWA
        vm.startPrank(aiAgent);
        address[] memory strategies = new address[](1);
        strategies[0] = address(rwaStrategy);
        uint256[] memory allocations = new uint256[](1);
        allocations[0] = 10000; // 100%
        aiExecutor.rebalance(strategies, allocations);
        vm.stopPrank();

        // 3. Issuer Borrows
        address issuer = address(4);
        vm.startPrank(admin);
        rwaStrategy.grantRole(rwaStrategy.ISSUER_ROLE(), issuer);
        vm.stopPrank();

        vm.startPrank(issuer);
        rwaStrategy.borrow(500 * 10 ** 18);
        assertEq(usdc.balanceOf(issuer), 500 * 10 ** 18);
        assertEq(rwaStrategy.totalBorrowed(), 500 * 10 ** 18);
        vm.stopPrank();

        // 4. Issuer Repays with Interest
        vm.startPrank(issuer);
        usdc.approve(address(rwaStrategy), 550 * 10 ** 18);
        // Mint extra for interest
        usdc.mint(issuer, 50 * 10 ** 18);
        rwaStrategy.repay(550 * 10 ** 18);
        vm.stopPrank();

        assertEq(rwaStrategy.totalRepaid(), 550 * 10 ** 18);

        // 5. Vault Withdraws (Principal + Interest)
        // Note: Vault logic currently only withdraws principal requested.
        // To realize yield, we would need a harvest function or rebalance.
        // For now, verify totalAssets reflects the repayment.
        assertEq(rwaStrategy.totalAssets(), 1050 * 10 ** 18);
    }
}
