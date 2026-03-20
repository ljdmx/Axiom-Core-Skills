# Layer 2 Deployment Differences Reference (Arbitrum / Optimism / Base / zkSync)

> For cross-chain messaging protocols (LayerZero / CCIP) and cross-chain security, see `references/crosschain.md`

## Table of Contents
1. [L2 Selection Comparison](#1-l2-selection-comparison)
2. [Arbitrum](#2-arbitrum)
3. [Optimism / Base](#3-optimism--base)
4. [zkSync Era (Includes Native AA Notes)](#4-zksync-era)
5. [EIP-4844 Blobs](#5-eip-4844-blobs)

---

## 1. L2 Selection Comparison

| | Arbitrum One | Optimism / Base | zkSync Era | Polygon zkEVM |
|--|--|--|--|--|
| Type | Optimistic Rollup | Optimistic Rollup | ZK Rollup | ZK Rollup |
| EVM Compat | �?Complete | �?Complete | ⚠️ Close (See §4) | �?Near Complete |
| Withdrawal | 7-day challenge | 7-day challenge | ZK proofs instant | ZK proofs instant |
| Ecosystem | Largest TVL | Base growing fastest | Native AA | Polygon ecosystem |
| Gas | Extremely low | Extremely low (Post-EIP-4844) | Extremely low | Extremely low |
| Best For | Complex DeFi protocols | Consumer-facing dApps | AA-first projects | Polygon ecosystem migrations |

---

## 2. Arbitrum

### Key Differences & Unique Precompiles

```solidity
// Arbitrum Specific: ArbSys Precompile (Fixed Address)
interface IArbSys {
    function arbBlockNumber() external view returns (uint256);
    function arbBlockHash(uint256 blockNumber) external view returns (bytes32);
}
address constant ARB_SYS = 0x0000000000000000000000000000000000000064;

contract ArbitrumAware {
    // ⚠️ block.number on Arbitrum returns L1 block number (~12s interval)
    // Use ArbSys to get the true L2 block number (~250ms interval)
    function getL2BlockNumber() public view returns (uint256) {
        return IArbSys(ARB_SYS).arbBlockNumber();
    }

    // ⚠️ block.difficulty / block.prevrandao mapped to 1 on Arbitrum
    //    CANNOT be used as a source of randomness! Use Chainlink VRF
    // �?block.timestamp is generally accurate (close to L1, safe for timelocks)
}
```

### L1 �?L2 Messaging (Retryable Tickets)

```solidity
import "@arbitrum/nitro-contracts/src/bridge/IInbox.sol";

contract L1ToArbitrum {
    // Mainnet Inbox: 0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f
    IInbox public immutable inbox;

    constructor(address _inbox) { inbox = IInbox(_inbox); }

    function sendToL2(
        address l2Target,
        bytes   calldata data,
        uint256 maxSubmissionCost,  // L1 �?L2 submission fee (Estimate with Inbox.calculateRetryableSubmissionFee)
        uint256 maxGas,             // L2 Gas limit for execution
        uint256 gasPriceBid         // L2 Gas price (Usually starts at 0.1 gwei)
    ) external payable returns (uint256 ticketId) {
        return inbox.createRetryableTicket{value: msg.value}(
            l2Target,
            0,                  // L2 call value (Sending ETH to L2)
            maxSubmissionCost,
            msg.sender,         // excessFeeRefundAddress
            msg.sender,         // callValueRefundAddress
            maxGas,
            gasPriceBid,
            data
        );
    }
}
```

### Deployment Commands

```bash
# Deploy to Arbitrum One
forge script script/Deploy.s.sol \
    --rpc-url $ARBITRUM_RPC_URL \
    --broadcast --verify \
    --etherscan-api-key $ARBISCAN_API_KEY

# Hardhat
npx hardhat run scripts/deploy.ts --network arbitrum
npx hardhat verify --network arbitrum <ADDR> "constructor_arg"
```

---

## 3. Optimism / Base

### OP Stack Specific Contracts

```solidity
// L1Block Precompile: Get current L1 block info
interface IL1Block {
    function number()    external view returns (uint64);
    function timestamp() external view returns (uint64);
    function basefee()   external view returns (uint256);
    function hash()      external view returns (bytes32);
}
address constant L1_BLOCK = 0x4200000000000000000000000000000000000015;

// L1 �?L2 Messaging (CrossDomainMessenger)
import { ICrossDomainMessenger } from "@eth-optimism/contracts/libraries/bridge/ICrossDomainMessenger.sol";

contract OPL1Sender {
    // Mainnet: 0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1
    ICrossDomainMessenger constant MESSENGER =
        ICrossDomainMessenger(0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1);

    function sendToL2(address l2Contract, bytes calldata message, uint32 gasLimit) external {
        MESSENGER.sendMessage(l2Contract, message, gasLimit);
    }
}
```

### Base Deployment & Verification

```bash
# Base Mainnet
forge script script/Deploy.s.sol \
    --rpc-url $BASE_RPC_URL \
    --broadcast --verify \
    --verifier-url https://api.basescan.org/api \
    --etherscan-api-key $BASESCAN_API_KEY

# Base Sepolia (Testnet)
forge script script/Deploy.s.sol \
    --rpc-url https://sepolia.base.org \
    --broadcast --verify \
    --verifier-url https://api-sepolia.basescan.org/api \
    --etherscan-api-key $BASESCAN_API_KEY
```

---

## 4. zkSync Era

### EVM Differences (Must Read Before Migration)

```
Key differences between zkSync Era and standard EVM:

�?Unsuppported:
  SELFDESTRUCT    �?Not supported on zkSync (Still available on other L2s)
  PUSH0           �?Requires Solidity �?0.8.19 (0.8.20 introduced PUSH0)
  CREATE2 Address �?Different calculation algorithm; cannot predict zkSync addresses from L1

⚠️ Behavior Differences:
  msg.sender      �?Can be a contract address (Due to Native AA)
  tx.origin       �?ALWAYS the Bootloader address (0x8001), ABSOLUTELY DO NOT use for auth!
  block.chainid   �?Returns 324 (Mainnet) / 300 (Sepolia)
  gasPrice        �?L2 gas + L1 data cost; calculated differently

�?Advantages:
  Native AA (See below)
  All accounts support EIP-712 structured signatures by default
  L1 �?L2 native communication is cheaper than OP Stack
```

### zkSync Native AA vs EIP-4337

```
EIP-4337 (Ethereum / Arbitrum / Optimism / Base):
  ┌────────────────────────────────────────────�?  �? EOA private key signs �?Send UserOperation�?  �? Bundler packs �?EntryPoint routes         �?  �? Smart Account contract executes           �?  └────────────────────────────────────────────�?  �?Requires additional EntryPoint contract
  �?Standard EOAs and Smart Accounts are two different account types
  �?ERC-4337 operates on top of the protocol layer

zkSync Native AA (Built into Protocol Layer):
  ┌────────────────────────────────────────────�?  �? All accounts (EOA + Contract) use same tx flow�?  �? EOA = Built-in default Smart Account      �?  �? Validation logic customized by account contract (validateTransaction)�?  └────────────────────────────────────────────�?  �?No EntryPoint contract needed; Bootloader calls directly
  �?tx.origin == Bootloader (⚠️ Do not use tx.origin for auth)
  �?Multi-sig, social recovery, etc., possible without extra EntryPoint

Migration Note:
  EIP-4337 contracts can run on zkSync, but are less efficient than Native AA.
  For new projects on zkSync, implementing the IAccount interface to use Native AA is recommended.
```

### Hardhat zkSync Configuration

```bash
npm install --save-dev @matterlabs/hardhat-zksync-deploy \
                       @matterlabs/hardhat-zksync-solc \
                       @matterlabs/hardhat-zksync-verify
```

```typescript
// hardhat.config.ts (zkSync Dedicated)
import '@matterlabs/hardhat-zksync-deploy';
import '@matterlabs/hardhat-zksync-solc';
import '@matterlabs/hardhat-zksync-verify';

export default {
    zksolc: {
        version: 'latest',
        settings: { optimizer: { enabled: true, mode: '3' } },
    },
    solidity: { version: '0.8.19' },  // ⚠️ Cannot use 0.8.20+ (PUSH0 incompatible)
    networks: {
        zksync: {
            url:      'https://mainnet.era.zksync.io',
            ethNetwork: 'mainnet',
            zksync:   true,
            verifyURL: 'https://zksync2-mainnet-explorer.zksync.io/contract_verification',
        },
        'zksync-sepolia': {
            url:      'https://sepolia.era.zksync.dev',
            ethNetwork: 'sepolia',
            zksync:   true,
            verifyURL: 'https://explorer.sepolia.era.zksync.dev/contract_verification',
        },
    },
};
```

---

## 5. EIP-4844 Blobs

EIP-4844 (Proto-Danksharding) reduces L2 data publishing costs by 90%+, and is the fundamental reason for the massive Gas reductions on Optimism/Base/Arbitrum.

```
How it works:
  L2 bundles batches of transaction data into Blobs and publishes them to L1
  Blobs are ~10-100x cheaper than calldata (Roughly: ~0.01 ETH/MB vs ~1 ETH/MB)
  Blob data is stored on L1 for ~18 days, then automatically deleted (Consensus layer maintained, doesn't enter EVM)
  L2 can arbitrarily read Blobs before deletion; afterwards, relies on archive nodes

Impact on contract development:
  �?Massive L2 Gas fee reductions benefit users; developers don't need to change contracts
  �?Cannot read Blob content inside EVM (Can only verify commitments via blobhash())
  ⚠️ To trace historical Blob data, archive nodes or Blobscan must be used

Accessing Blob hashes in contracts (Cancun EVM / Solidity 0.8.24):
```

```solidity
contract BlobVerifier {
    // blobhash(index) returns the KZG commitment hash of the index-th Blob in the current transaction.
    // Use Case: Verify the existence of specific Blob data on-chain; cannot read the Blob contents.
    function verifyBlobPresence(uint256 index) external view returns (bytes32) {
        return blobhash(index);  // 0x... if it exists, bytes32(0) if index is out of bounds
    }
}
```

```bash
# View Blob data
# https://blobscan.com      �?Blob block explorer
# cast blob <txhash>        �?cast CLI tool (Foundry v0.2.0+)
```
