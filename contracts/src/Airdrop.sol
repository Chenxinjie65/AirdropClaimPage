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

    function isEligible(address user) public pure returns (bool) {
        address mid = 0x8000000000000000000000000000000000000000; 
        return user < mid;
    }

    function claim() external {
        require(!claimed[msg.sender], "Already claimed");
        require(isEligible(msg.sender), "Not eligible for airdrop");

        claimed[msg.sender] = true;
        require(token.transfer(msg.sender, 100 * 10**18), "Transfer failed");

        emit AirdropClaimed(msg.sender, 100 * 10**18);
    }
}