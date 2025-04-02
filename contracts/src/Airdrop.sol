// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Airdrop {
    address public owner;
    IERC20 public token;
    mapping(address => bool) public claimed;

    event AirdropClaimed(address indexed claimant, uint256 amount);

    constructor(address _tokenAddress) {
        owner = msg.sender;
        token = IERC20(_tokenAddress);
    }

    function claim() external {
        require(!claimed[msg.sender], "Already claimed");
        
        // 将地址转换为字符串并检查第一个字符
        bytes memory addressBytes = abi.encodePacked(msg.sender);
        bytes1 firstChar = addressBytes[0];
        
        // 检查地址的第一个字符是否小于 '8'
        require(uint8(firstChar) < uint8(bytes1('8')), "Not eligible for airdrop");

        claimed[msg.sender] = true;
        require(token.transfer(msg.sender, 100 * 10**18), "Transfer failed"); // 转移 100 个代币

        emit AirdropClaimed(msg.sender, 100 * 10**18);
    }
}