// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "forge-std/Test.sol";
import "../src/Airdrop.sol";
import "../src/MyToken.sol";

contract AirdropTest is Test {
    Airdrop public airdrop;
    MyToken public token;
    address public owner;
    address public eligible;
    address public notEligible;

    function setUp() public {
        owner = address(this);
        eligible = address(0x1234567890123456789012345678901234567890);
        notEligible = address(0x8234567890123456789012345678901234567890);
        
        // 部署代币合约
        token = new MyToken(1000000 * 10**18);
        
        // 部署空投合约，传入代币合约地址
        airdrop = new Airdrop(address(token));
        
        // 将代币转给空投合约
        token.transfer(address(airdrop), 10000 * 10**18);
    }

    function testInitialState() public {
        assertEq(airdrop.owner(), address(this));
        assertEq(address(airdrop.token()), address(token));
    }

    function testEligibleAddress() public {
        uint256 initialBalance = token.balanceOf(eligible);
        
        vm.startPrank(eligible);
        airdrop.claim();
        
        assertEq(token.balanceOf(eligible), initialBalance + 100 * 10**18);
        assertTrue(airdrop.claimed(eligible));
        
        vm.stopPrank();
    }

    function testNotEligibleAddress() public {
        vm.startPrank(notEligible);
        vm.expectRevert("Not eligible for airdrop");
        airdrop.claim();
        vm.stopPrank();
    }

    function testDoubleClaim() public {
        vm.startPrank(eligible);
        
        airdrop.claim();
        vm.expectRevert("Already claimed");
        airdrop.claim();
        
        vm.stopPrank();
    }

    function testTokenBalance() public {
        uint256 initialBalance = token.balanceOf(address(airdrop));
        
        vm.prank(eligible);
        airdrop.claim();
        
        assertEq(
            token.balanceOf(address(airdrop)), 
            initialBalance - 100 * 10**18
        );
    }

    receive() external payable {}
}