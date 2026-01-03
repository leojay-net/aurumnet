// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
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

contract RWAStrategyTest is Test {
    RWAStrategy rwaStrategy;
    MockERC20 usdc;
    address admin = address(1);
    address vault = address(2);
    address issuer = address(3);
    address user = address(4);

    function setUp() public {
        vm.startPrank(admin);
        usdc = new MockERC20();
        rwaStrategy = new RWAStrategy(
            address(usdc),
            vault,
            admin,
            "Invoice #1",
            "ipfs://test",
            1000,
            30 days
        );
        rwaStrategy.grantRole(rwaStrategy.ISSUER_ROLE(), issuer);
        vm.stopPrank();

        // Fund strategy (simulate deposit from vault)
        usdc.mint(address(rwaStrategy), 1000 * 10 ** 18);
        // We need to manually update totalPrincipalDeposited if we just transfer
        // But better to use deposit()
        vm.startPrank(user); // User acts as depositor (usually vault)
        usdc.mint(user, 1000 * 10 ** 18);
        usdc.approve(address(rwaStrategy), 1000 * 10 ** 18);
        rwaStrategy.deposit(1000 * 10 ** 18);
        vm.stopPrank();
    }

    function testMetadata() public {
        assertEq(rwaStrategy.name(), "Invoice #1");
        assertEq(rwaStrategy.ipfsMetadata(), "ipfs://test");
        assertEq(rwaStrategy.yieldRateBps(), 1000);
        assertEq(rwaStrategy.loanDuration(), 30 days);
    }

    function testBorrow() public {
        vm.startPrank(issuer);
        rwaStrategy.borrow(500 * 10 ** 18);

        assertEq(usdc.balanceOf(issuer), 500 * 10 ** 18);
        assertEq(rwaStrategy.totalBorrowed(), 500 * 10 ** 18);
        vm.stopPrank();
    }

    function testBorrowUnauthorized() public {
        vm.startPrank(user);
        vm.expectRevert();
        rwaStrategy.borrow(500 * 10 ** 18);
        vm.stopPrank();
    }

    function testRepay() public {
        vm.startPrank(issuer);
        rwaStrategy.borrow(500 * 10 ** 18);

        usdc.approve(address(rwaStrategy), 550 * 10 ** 18);
        usdc.mint(issuer, 50 * 10 ** 18); // Interest

        rwaStrategy.repay(550 * 10 ** 18);

        assertEq(rwaStrategy.totalRepaid(), 550 * 10 ** 18);
        vm.stopPrank();
    }

    function testDefault() public {
        vm.startPrank(admin);
        rwaStrategy.markDefault();
        assertTrue(rwaStrategy.isDefaulted());

        vm.expectRevert("Pool is defaulted");
        rwaStrategy.deposit(100);
        vm.stopPrank();

        vm.startPrank(issuer);
        vm.expectRevert("Pool is defaulted");
        rwaStrategy.borrow(100);
        vm.stopPrank();
    }
}
