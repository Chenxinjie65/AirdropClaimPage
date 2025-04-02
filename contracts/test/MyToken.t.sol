// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "forge-std/Test.sol";
import "../src/MyToken.sol"; 

contract MyTokenTest is Test {
    MyToken token;

    function setUp() public {
        token = new MyToken(1000 * 10 ** 18); 
    }

    function testInitialSupply() public view{
        uint256 initialSupply = token.totalSupply();
        assertEq(initialSupply, 1000 * 10 ** 18, "Initial supply should be 1000 MTK");
    }

    function testName() public view{
        string memory name = token.name();
        assertEq(name, "MyToken", "Token name should be MyToken");
    }

    function testSymbol() public view{
        string memory symbol = token.symbol();
        assertEq(symbol, "MTK", "Token symbol should be MTK");
    }

    function testMinting() public view{
        uint256 balance = token.balanceOf(address(this));
        assertEq(balance, 1000 * 10 ** 18, "The balance of the deployer should be the initial supply");
    }
    function testTransfer() public {
        address recipient = address(0x123); // 示例接收者地址
        uint256 amountToTransfer = 100 * 10 ** 18;

        // 执行转账
        token.transfer(recipient, amountToTransfer);

        // 验证转账结果
        assertEq(token.balanceOf(recipient), amountToTransfer, "Recipient should have received the transferred amount");
        assertEq(token.balanceOf(address(this)), 900 * 10 ** 18, "Deployer should have reduced balance after transfer");
    }
}