// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";

// Import your contract here
// import {MyContract} from "../src/MyContract.sol";

/**
 * @title L2 Deployment Script
 * @dev Foundry script specifically tuned for L2 deployment nuances (e.g., Optimism, Arbitrum, Base)
 * Usage:
 * forge script script/DeployL2.s.sol:DeployL2 --rpc-url $L2_RPC_URL --broadcast --verify -vvvv
 */
contract DeployL2 is Script {
    function setUp() public {}

    function run() public {
        // Retrieve private key from environment
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        console.log("Starting L2 deployment with deployer:", deployer);

        // Required for Optimism/Base gas estimation anomalies
        // L2s often require specific gas price overrides or legacy tx types 
        // depending on the exact chain. Wait for network condition stabilization.
        
        vm.startBroadcast(deployerPrivateKey);

        // Example Deployment
        // MyContract instance = new MyContract();
        
        // console.log("Contract deployed successfully at:", address(instance));

        vm.stopBroadcast();
    }
}
