// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../../src/core/VaultCore.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockERC20 is ERC20 {
    constructor() ERC20("Mock USDC", "USDC") {
        _mint(msg.sender, 1000000 * 10 ** 18);
    }
    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}

contract VaultCoreTest is Test {
    VaultCore vault;
    MockERC20 usdc;
    address admin = address(1);
    address user = address(2);
    address other = address(3);

    function setUp() public {
        vm.startPrank(admin);
        usdc = new MockERC20();
        vault = new VaultCore(address(usdc), "Aurum Vault", "AUR", admin);
        vm.stopPrank();

        usdc.mint(user, 1000 * 10 ** 18);
    }

    function testInitialState() public {
        assertEq(vault.name(), "Aurum Vault");
        assertEq(vault.symbol(), "AUR");
        assertEq(vault.asset(), address(usdc));
        assertTrue(vault.hasRole(vault.DEFAULT_ADMIN_ROLE(), admin));
        assertTrue(vault.hasRole(vault.ADMIN_ROLE(), admin));
    }

    event Deposited(address indexed user, uint256 assets, uint256 shares);
    event Withdrawn(address indexed user, uint256 assets, uint256 shares);

    function testDeposit() public {
        vm.startPrank(user);
        usdc.approve(address(vault), 100 * 10 ** 18);

        vm.expectEmit(true, true, true, true);
        emit Deposited(user, 100 * 10 ** 18, 100 * 10 ** 18);

        uint256 shares = vault.deposit(100 * 10 ** 18, user);

        assertEq(shares, 100 * 10 ** 18);
        assertEq(vault.balanceOf(user), 100 * 10 ** 18);
        assertEq(vault.totalAssets(), 100 * 10 ** 18);
        vm.stopPrank();
    }

    function testDepositZero() public {
        vm.startPrank(user);
        vm.expectRevert("Deposit amount must be greater than zero");
        vault.deposit(0, user);
        vm.stopPrank();
    }

    function testWithdraw() public {
        vm.startPrank(user);
        usdc.approve(address(vault), 100 * 10 ** 18);
        vault.deposit(100 * 10 ** 18, user);

        vm.expectEmit(true, true, true, true);
        emit Withdrawn(user, 50 * 10 ** 18, 50 * 10 ** 18);

        uint256 assets = vault.withdraw(50 * 10 ** 18, user, user);

        assertEq(assets, 50 * 10 ** 18);
        assertEq(vault.balanceOf(user), 50 * 10 ** 18);
        assertEq(usdc.balanceOf(user), 950 * 10 ** 18);
        vm.stopPrank();
    }

    function testWithdrawInsufficientShares() public {
        vm.startPrank(user);
        usdc.approve(address(vault), 100 * 10 ** 18);
        vault.deposit(100 * 10 ** 18, user);

        vm.expectRevert(); // ERC20InsufficientBalance or similar
        vault.withdraw(150 * 10 ** 18, user, user);
        vm.stopPrank();
    }

    function testAccessControl() public {
        vm.startPrank(other);
        vm.expectRevert(); // AccessControlUnauthorizedAccount
        vault.setStrategyManager(other);

        vm.expectRevert();
        vault.setAIExecutor(other);

        vm.expectRevert();
        vault.pause();
        vm.stopPrank();
    }

    function testPause() public {
        vm.startPrank(admin);
        vault.pause();
        vm.stopPrank();

        vm.startPrank(user);
        usdc.approve(address(vault), 100 * 10 ** 18);
        vm.expectRevert(Pausable.EnforcedPause.selector);
        vault.deposit(100 * 10 ** 18, user);
        vm.stopPrank();
    }
}
