// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
// deploy.s.sol — Foundry Deployment Script Universal Template
// Usage: forge script script/Deploy.s.sol --rpc-url $RPC --broadcast --verify

import "forge-std/Script.sol";
// import "../src/MyContract.sol";  // ← Replace with your contract

contract DeployScript is Script {
    // ─── Configuration Area (Modify as needed) ────────────────────────────────
    address constant OWNER  = address(0); // Leave as 0 to use deployer
    uint256 constant CHAIN_MAINNET   = 1;
    uint256 constant CHAIN_ARBITRUM  = 42161;
    uint256 constant CHAIN_BASE      = 8453;
    uint256 constant CHAIN_SEPOLIA   = 11155111;

    function run() external {
        uint256 deployerKey = vm.envUint("PRIVATE_KEY");
        address deployer    = vm.addr(deployerKey);
        address owner       = OWNER == address(0) — deployer : OWNER;

        console.log("Network  :", block.chainid);
        console.log("Deployer :", deployer);
        console.log("Balance  :", deployer.balance / 1e18, "ETH");

        vm.startBroadcast(deployerKey);

        // ─── Deploy Contract ──────────────────────────────────────
        // MyContract instance = new MyContract(owner);
        // console.log("MyContract:", address(instance));

        // ─── Initialization (if needed) ────────────────────────────────
        // instance.initialize(...);

        // ─── Chain-Specific Configuration ────────────────────────────────────
        // if (block.chainid == CHAIN_MAINNET) { ... }

        vm.stopBroadcast();

        // ─── Write Deployment Record ──────────────────────────────────
        _writeDeployment(
            // address(instance)
            address(0) // ← Replace
        );
    }

    function _writeDeployment(address contractAddr) internal {
        string memory chainId = vm.toString(block.chainid);
        string memory json = string.concat(
            '{"chainId":', chainId,
            ',"address":"', vm.toString(contractAddr),
            '","timestamp":', vm.toString(block.timestamp), '}'
        );
        vm.writeFile(
            string.concat("deployments/", chainId, ".json"),
            json
        );
    }
}

// ─────────────────────────────────────────────────────────────────
// Common cast Commands (Post-deployment verification)
// ─────────────────────────────────────────────────────────────────
// cast code   <ADDR> --rpc-url $RPC              # Confirm bytecode exists
// cast call   <ADDR> "owner()(address)" --rpc-url $RPC
// cast storage <ADDR> 0 --rpc-url $RPC           # Slot 0
// cast send   <ADDR> "fn(uint256)" 123 --private-key $PK --rpc-url $RPC
