// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "forge-std/Script.sol";
import "../src/Airdrop.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);
        
        Airdrop airdrop = new Airdrop(0xFA820Fc53b7202fF77fD4eD73b117181c79C7ED0);
        
        vm.stopBroadcast();
    }
}