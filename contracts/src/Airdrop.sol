// SPDX-License-Identifier: MIT

pragma solidity ^0.8.21;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract Airdrop {
    address public owner;
    IERC20 public token;
    bytes32 public merkleRoot;

    mapping(address => bool) public claimed; // 记录每个地址是否已领取空投

    event AirdropClaimed(address indexed claimant, uint256 amount);

    constructor(address _token, bytes32 _merkleRoot) {
        owner = msg.sender;
        token = IERC20(_token);
        merkleRoot = _merkleRoot;
    }

    function claim(uint256 amount, bytes32[] calldata proof) external {
        require(!claimed[msg.sender], "Airdrop already claimed");
        
        // 验证用户地址是否在名单中
        bytes32 leaf = keccak256(abi.encodePacked(msg.sender, amount));
        require(MerkleProof.verify(proof, merkleRoot, leaf), "Invalid proof");

        claimed[msg.sender] = true;
        require(token.transfer(msg.sender, amount), "Token transfer failed");

        emit AirdropClaimed(msg.sender, amount);
    }

    function setMerkleRoot(bytes32 _merkleRoot) external {
        require(msg.sender == owner, "Only owner can set merkle root");
        merkleRoot = _merkleRoot;
    }
}