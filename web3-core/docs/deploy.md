# Deployment & Verification Reference Manual

## Table of Contents
1. [Hardhat Deployment Scripts](#1-hardhat-deployment-scripts)
2. [Foundry Deployment Scripts](#2-foundry-deployment-scripts)
3. [Contract Verification](#3-contract-verification)
4. [Multi-Chain Deployment](#4-multi-chain-deployment)
5. [Upgradeable Contract Deployment](#5-upgradeable-contract-deployment)
6. [Deployment Security Checks](#6-deployment-security-checks)

---

## 1. Hardhat Deployment Scripts

```typescript
// scripts/deploy.ts
import { ethers, network, run } from "hardhat";
import { writeFileSync } from "fs";

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying with:", deployer.address);
    console.log("Balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)));

    // ─── Deploy Contracts ─────────────────────────────────────────────
    const MyToken = await ethers.getContractFactory("MyToken");
    const token = await MyToken.deploy(
        "My Token",
        "MTK",
        deployer.address,
        ethers.parseEther("1000000")
    );
    await token.waitForDeployment();
    const tokenAddress = await token.getAddress();
    console.log("MyToken deployed to:", tokenAddress);

    // ─── Save Deployment Addresses ─────────────────────────────────────────
    const deployments = {
        network: network.name,
        chainId: (await ethers.provider.getNetwork()).chainId.toString(),
        timestamp: new Date().toISOString(),
        contracts: {
            MyToken: {
                address: tokenAddress,
                deployTx: token.deploymentTransaction()?.hash,
            }
        }
    };
    
    writeFileSync(
        `deployments/${network.name}.json`,
        JSON.stringify(deployments, null, 2)
    );

    // ─── Wait for block confirmations before verifying ────────────────────────
    if (network.name !== "hardhat" && network.name !== "localhost") {
        console.log("Waiting for block confirmations...");
        await token.deploymentTransaction()?.wait(5);  // Wait for 5 confirmations

        await verifyContract(tokenAddress, [
            "My Token", "MTK", deployer.address, ethers.parseEther("1000000")
        ]);
    }
}

async function verifyContract(address: string, constructorArgs: any[]) {
    try {
        await run("verify:verify", {
            address,
            constructorArguments: constructorArgs,
        });
        console.log("Contract verified!");
    } catch (err: any) {
        if (err.message.includes("already verified")) {
            console.log("Already verified");
        } else {
            console.error("Verification failed:", err);
        }
    }
}

main().catch(console.error);
```

**Run Commands:**
```bash
# Deploy to testnet
npx hardhat run scripts/deploy.ts --network sepolia

# Deploy to mainnet
npx hardhat run scripts/deploy.ts --network mainnet

# Local testing
npx hardhat run scripts/deploy.ts --network localhost
```

---

## 2. Foundry Deployment Scripts

```solidity
// script/Deploy.s.sol
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/MyToken.sol";
import "../src/StakingRewards.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        vm.startBroadcast(deployerPrivateKey);

        // Deploy Token
        MyToken token = new MyToken{
            salt: keccak256("v1")  // CREATE2 Deterministic address (Optional)
        }("My Token", "MTK", deployer, 1_000_000 ether);

        console.log("MyToken:", address(token));

        // Deploy Staking Contract
        StakingRewards staking = new StakingRewards(
            address(token),
            address(token)
        );
        console.log("StakingRewards:", address(staking));

        // Initialization
        token.transfer(address(staking), 100_000 ether);
        staking.notifyRewardAmount(100_000 ether);

        vm.stopBroadcast();

        // Save addresses to JSON
        string memory obj = "deployment";
        vm.serializeAddress(obj, "token", address(token));
        string memory json = vm.serializeAddress(obj, "staking", address(staking));
        vm.writeJson(json, string.concat("./deployments/", vm.toString(block.chainid), ".json"));
    }
}
```

**Run Commands:**
```bash
# Simulate Deployment (Without broadcasting)
forge script script/Deploy.s.sol --rpc-url $SEPOLIA_RPC

# Actual Deployment
forge script script/Deploy.s.sol \
    --rpc-url $SEPOLIA_RPC \
    --broadcast \
    --verify \
    --etherscan-api-key $ETHERSCAN_KEY \
    -vvvv

# Mainnet Deployment (With Ledger)
forge script script/Deploy.s.sol \
    --rpc-url $MAINNET_RPC \
    --broadcast \
    --ledger \
    --verify
```

---

## 3. Contract Verification

```bash
# Hardhat Manual Verification
npx hardhat verify --network mainnet <ADDRESS> "arg1" "arg2"

# When constructor arguments are complex, use an arguments file
npx hardhat verify --network mainnet <ADDRESS> \
    --constructor-args scripts/arguments.js

# scripts/arguments.js
module.exports = [
    "My Token",
    "MTK",
    "0xOwnerAddress",
    ethers.parseEther("1000000")
];

# Foundry Verification
forge verify-contract <ADDRESS> src/MyToken.sol:MyToken \
    --constructor-args $(cast abi-encode "constructor(string,string,address,uint256)" "My Token" "MTK" $OWNER $AMOUNT) \
    --etherscan-api-key $ETHERSCAN_KEY \
    --chain mainnet

# Verify proxy contract (Automatically detects implementation)
forge verify-contract <PROXY_ADDRESS> --chain mainnet \
    --etherscan-api-key $ETHERSCAN_KEY
```

---

## 4. Multi-Chain Deployment

```typescript
// config/chains.ts
export const CHAIN_CONFIG = {
    mainnet:  { chainId: 1,     rpc: process.env.MAINNET_RPC!,  explorer: "etherscan" },
    polygon:  { chainId: 137,   rpc: process.env.POLYGON_RPC!,  explorer: "polygonscan" },
    arbitrum: { chainId: 42161, rpc: process.env.ARBITRUM_RPC!, explorer: "arbiscan" },
    optimism: { chainId: 10,    rpc: process.env.OPTIMISM_RPC!, explorer: "optimistic.etherscan" },
    base:     { chainId: 8453,  rpc: process.env.BASE_RPC!,     explorer: "basescan" },
    // Testnets
    sepolia:  { chainId: 11155111, rpc: process.env.SEPOLIA_RPC! },
}

// scripts/multichain-deploy.ts
const CHAINS = ["mainnet", "polygon", "arbitrum"];

for (const chainName of CHAINS) {
    console.log(`\n=== Deploying to ${chainName} ===`);
    execSync(`npx hardhat run scripts/deploy.ts --network ${chainName}`);
}
```

**hardhat.config.ts Multi-Chain Config:**
> Complete 9-chain configuration is visible in `assets/templates/hardhat.config.ts`, simply delete unused networks after pasting.
> Key fields: `networks` (RPC + chainId + accounts), `etherscan.apiKey` (Explorer keys per chain), `gasReporter`.

---

## 5. Upgradeable Contract Deployment

```typescript
// Hardhat + OpenZeppelin Upgrades
import { ethers, upgrades } from "hardhat";

async function deployUpgradeable() {
    const [deployer] = await ethers.getSigners();
    
    // ── Initial Deployment ────────────────────────────────────────────
    const V1 = await ethers.getContractFactory("MyContractV1");
    const proxy = await upgrades.deployProxy(V1, [deployer.address], {
        kind: "uups",           // Or "transparent"
        initializer: "initialize",
    });
    await proxy.waitForDeployment();
    
    const proxyAddress = await proxy.getAddress();
    const implAddress = await upgrades.erc1967.getImplementationAddress(proxyAddress);
    const adminAddress = await upgrades.erc1967.getAdminAddress(proxyAddress);
    
    console.log("Proxy:          ", proxyAddress);
    console.log("Implementation: ", implAddress);
    console.log("Admin:          ", adminAddress);

    // ── Upgrade ────────────────────────────────────────────────
    const V2 = await ethers.getContractFactory("MyContractV2");
    
    // Pre-check compatibility (without performing the actual upgrade)
    await upgrades.validateUpgrade(proxyAddress, V2, { kind: "uups" });
    
    const upgraded = await upgrades.upgradeProxy(proxyAddress, V2);
    await upgraded.waitForDeployment();
    
    console.log("Upgraded to V2!");
    
    // Verify new implementation
    const newImplAddress = await upgrades.erc1967.getImplementationAddress(proxyAddress);
    console.log("New Implementation:", newImplAddress);
}
```

---

## 6. Deployment Security Checks

### Pre-Deployment Checklist

```bash
# 1. Contract Size (< 24KB EIP-170 limit)
forge build --sizes

# 2. Complete Test Suite
forge test && npx hardhat test

# 3. Gas Report
forge test --gas-report

# 4. Static Security Analysis
slither . --filter-paths "lib/,node_modules/" --print human-summary

# 5. Simulated Deployment (No broadcast, checks for reverts and gas estimates)
forge script script/Deploy.s.sol --rpc-url $MAINNET_RPC -vvvv

# 6. Verify Constructor Argument Decoding
cast abi-decode "constructor(string,string,address,uint256)" $CONSTRUCTOR_ARGS
```

### Ledger Hardware Wallet Mainnet Deployment (Recommended! Private key never leaves the device)

```bash
# Prerequisite: Ledger connected to PC, Ethereum App unlocked, "Blind Signing" enabled

# Foundry + Ledger (Automatically identifies the first BIP44 path account)
forge script script/Deploy.s.sol \
    --rpc-url $MAINNET_RPC \
    --ledger \
    --hd-paths "m/44'/60'/0'/0/0" \   # BIP44 Default Path (MetaMask compatible)
    --broadcast \
    --verify \
    --etherscan-api-key $ETHERSCAN_KEY \
    -vvvv
# The Ledger screen will display the transaction waiting for signature, confirm and press both buttons

# If you have multiple accounts, specify the sender:
forge script script/Deploy.s.sol \
    --rpc-url $MAINNET_RPC \
    --ledger \
    --sender 0x<YOUR_LEDGER_ADDRESS> \
    --broadcast

# Hardhat + Ledger (Requires plugin installation)
npm install --save-dev @nomiclabs/hardhat-ledger
# Inside hardhat.config.ts:
# networks: { mainnet: { ledgerAccounts: ["0x<LEDGER_ADDRESS>"] } }
npx hardhat run scripts/deploy.ts --network mainnet
```

```
Ledger Deployment Best Practices:
  1. Test with keys on Sepolia first, confirm script correctness.
  2. Switch to --ledger for mainnet, private keys are never exposed.
  3. Ledger screen displays: Contract address, calldata hash, Gas limit.
  4. Verify the contract address (Calculate with CREATE2 beforehand) before pressing confirm.
  5. After deployment, immediately verify the source code on Etherscan.
```

### Post-Deployment Verification

```bash
# Confirm contract has been deployed (Bytecode exists)
cast code <ADDRESS> --rpc-url $RPC | wc -c

# Verify vital states
cast call <ADDRESS> "name()(string)"          --rpc-url $RPC
cast call <ADDRESS> "totalSupply()(uint256)"  --rpc-url $RPC
cast call <ADDRESS> "owner()(address)"        --rpc-url $RPC

# Storage Layout Verification (Slot 0 is normally the owner/admin address)
cast storage <ADDRESS> 0 --rpc-url $RPC

# Track deployment transaction (Check events and internal calls)
cast run <DEPLOY_TX_HASH> --rpc-url $RPC --trace
```

### Environmental Variable Templates

> For the complete template see `assets/templates/.env.example` (Copy as `.env` to use).
> For the deployment script boilerplate see `assets/templates/deploy.s.sol`.
