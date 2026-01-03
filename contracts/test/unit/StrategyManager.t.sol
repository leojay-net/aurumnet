// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../../src/core/StrategyManager.sol";
import "../../src/core/VaultCore.sol";
import "../../src/strategies/RWAStrategy.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockERC20 is ERC20 {
    constructor() ERC20("Mock USDC", "USDC") {
        _mint(msg.sender, 1000000 * 10 ** 18);
    }
    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}

contract StrategyManagerTest is Test {
    StrategyManager strategyManager;
    VaultCore vault;
    MockERC20 usdc;
    RWAStrategy rwaStrategy;

    address admin = address(1);
    address executor = address(2);
    address user = address(3);

    function setUp() public {
        vm.startPrank(admin);
        usdc = new MockERC20();
        vault = new VaultCore(address(usdc), "Aurum Vault", "AUR", admin);
        strategyManager = new StrategyManager(
            address(vault),
            address(usdc),
            admin
        );
        vault.setStrategyManager(address(strategyManager));

        rwaStrategy = new RWAStrategy(
            address(usdc),
            address(vault),
            admin,
            "RWA",
            "ipfs",
            1000,
            30 days
        );

        strategyManager.grantRole(strategyManager.EXECUTOR_ROLE(), executor);
        vm.stopPrank();
    }

    function testAddStrategy() public {
        vm.startPrank(admin);
        strategyManager.addStrategy(address(rwaStrategy));
        assertTrue(strategyManager.isStrategyWhitelisted(address(rwaStrategy)));
        vm.stopPrank();
    }

    function testAddStrategyOnlyAdmin() public {
        vm.startPrank(user);
        vm.expectRevert();
        strategyManager.addStrategy(address(rwaStrategy));
        vm.stopPrank();
    }

    function testRebalance() public {
        vm.startPrank(admin);
        strategyManager.addStrategy(address(rwaStrategy));
        vm.stopPrank();

        // Fund vault
        usdc.mint(address(vault), 1000 * 10 ** 18);

        vm.startPrank(executor);
        address[] memory strategies = new address[](1);
        strategies[0] = address(rwaStrategy);
        uint256[] memory allocations = new uint256[](1);
        allocations[0] = 10000; // 100%

        strategyManager.rebalance(strategies, allocations);

        assertEq(rwaStrategy.totalAssets(), 1000 * 10 ** 18);
        vm.stopPrank();
    }

    function testRebalanceUnauthorized() public {
        vm.startPrank(user);
        address[] memory strategies = new address[](0);
        uint256[] memory allocations = new uint256[](0);

        vm.expectRevert();
        strategyManager.rebalance(strategies, allocations);
        vm.stopPrank();
    }

    function testWithdrawByVault() public {
        vm.startPrank(admin);
        strategyManager.addStrategy(address(rwaStrategy));
        vm.stopPrank();

        // Fund vault and deploy
        usdc.mint(address(vault), 1000 * 10 ** 18);

        vm.startPrank(executor);
        address[] memory strategies = new address[](1);
        strategies[0] = address(rwaStrategy);
        uint256[] memory allocations = new uint256[](1);
        allocations[0] = 10000;
        strategyManager.rebalance(strategies, allocations);
        vm.stopPrank();

        // Vault calls withdraw (simulated by prank)
        vm.startPrank(address(vault));
        strategyManager.withdraw(500 * 10 ** 18);
        vm.stopPrank();

        assertEq(usdc.balanceOf(address(vault)), 500 * 10 ** 18);
        assertEq(rwaStrategy.totalAssets(), 500 * 10 ** 18);
    }
}
