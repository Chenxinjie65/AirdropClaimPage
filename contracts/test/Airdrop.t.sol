// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "forge-std/Test.sol";
import "../src/Airdrop.sol";
import "../src/MyToken.sol";

contract AirdropTest is Test {
    Airdrop public airdrop;
    MyToken public token;
    address public owner;
    address public user1;
    address public user2;
    address public user3;
    uint256 public constant AIRDROP_AMOUNT = 100 * 10**18;
    uint256 public constant INITIAL_SUPPLY = 1000000 * 10**18;

    function setUp() public {
        owner = address(this);
        user1 = address(0x1234567890123456789012345678901234567890); // 以1开头
        user2 = address(0x7234567890123456789012345678901234567890); // 以7开头
        user3 = address(0x8234567890123456789012345678901234567890); // 以8开头
        
        // 部署合约
        token = new MyToken(INITIAL_SUPPLY);
        airdrop = new Airdrop(address(token));
        
        token.transfer(address(airdrop), 10000 * 10**18);
    }

    function testIsEligible() public view {
        assertTrue(airdrop.isEligible(user1));
        assertTrue(airdrop.isEligible(user2));
        assertFalse(airdrop.isEligible(user3));
    }

    function testInitialSetup() public view {
        assertEq(airdrop.owner(), owner);
        assertEq(address(airdrop.token()), address(token));
        assertEq(token.balanceOf(address(airdrop)), 10000 * 10**18);
    }

    function testSuccessfulClaim() public {
        vm.startPrank(user1);
        
        uint256 balanceBefore = token.balanceOf(user1);
        
        airdrop.claim();
        
        assertEq(token.balanceOf(user1), balanceBefore + AIRDROP_AMOUNT);
        assertTrue(airdrop.claimed(user1));
        
        vm.stopPrank();
    }

    function testClaimWithIneligibleAddress() public {
        vm.startPrank(user3);
        
        vm.expectRevert("Not eligible for airdrop");
        airdrop.claim();
        
        assertFalse(airdrop.claimed(user3));
        assertEq(token.balanceOf(user3), 0);
        
        vm.stopPrank();
    }

    function testPreventDoubleClaim() public {
        vm.startPrank(user1);
        
        // 第一次领取成功
        airdrop.claim();
        
        // 第二次领取失败
        vm.expectRevert("Already claimed");
        airdrop.claim();
        
        // 验证只领取了一次的金额
        assertEq(token.balanceOf(user1), AIRDROP_AMOUNT);
        
        vm.stopPrank();
    }

    function testMultipleUsersClaim() public {
        // 用户1领取
        vm.prank(user1);
        airdrop.claim();
        assertEq(token.balanceOf(user1), AIRDROP_AMOUNT);

        // 用户2领取
        vm.prank(user2);
        airdrop.claim();
        assertEq(token.balanceOf(user2), AIRDROP_AMOUNT);

        // 验证合约余额正确减少
        assertEq(
            token.balanceOf(address(airdrop)),
            10000 * 10**18 - 2 * AIRDROP_AMOUNT
        );
    }

    function testFuzzEligibleAddresses(address randomAddr) public {
        vm.assume(uint160(randomAddr) < uint160(0x8000000000000000000000000000000000000000));
        vm.assume(randomAddr != address(0));
        
        if (airdrop.isEligible(randomAddr)) {
            vm.prank(randomAddr);
            airdrop.claim();
            assertEq(token.balanceOf(randomAddr), AIRDROP_AMOUNT);
        }
    }

    receive() external payable {}
}