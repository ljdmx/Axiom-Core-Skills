# Account Abstraction (EIP-4337)

> EIP-4337 is the most important UX innovation of 2024: No need for EOA private keys, Smart Contract Wallet + Paymaster achieves gasless experiences, social recovery, and batch operations.

## Table of Contents
1. [Core Concepts](#1-core-concepts)
2. [Paymaster (Gas Sponsorship)](#2-paymaster)
3. [Pimlico SDK Quick Integration](#3-pimlico-sdk)
4. [Biconomy SDK](#4-biconomy-sdk)
5. [Smart Contract Wallet Development (SimpleAccount)](#5-simple-contract-wallet)
6. [Batch Operations (Batch Calls)](#6-batch-operations)
7. [Social Recovery](#7-social-recovery)
8. [On-Chain Contract Integration](#8-on-chain-contract-integration)

---

## 1. Core Concepts

```
Traditional EOA Model:
  User Private Key → Sign Transaction → Pay Gas → Execute

EIP-4337 Model:
  UserOperation → Bundler bundles → EntryPoint Contract → Contract Wallet Executes
                                    →                              Paymaster sponsors Gas (Optional)

Key Roles:
  UserOperation  —User intent (Similar to a transaction, but more flexible)
  EntryPoint     —0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789 (Unified address across all chains)
  Smart Account  —User's contract wallet (SimpleAccount / Safe / Kernel etc.)
  Bundler        —Collects UserOps, bundles them into a real transaction, and submits on-chain
  Paymaster      —Optional, pays Gas on behalf of the user (Supports ERC-20 Gas payment)

Mainstream AA Providers:
  Pimlico        —permissionless.js, supports the most chains
  Biconomy       —Enterprise-grade, comes with its own SDK
  ZeroDev        —Kernel account, plugin-based
  Alchemy        —aa-sdk, backed by a major company
  Safe           —Most secure, Safe{Core} AA SDK
```

---

## 2. Paymaster

Paymaster solves Web3's biggest UX problem: Users no longer need to hold ETH to pay for Gas.

```
Paymaster Types:
  Verifying Paymaster   —Project team signs authorization, sponsoring Gas for specific operations
  ERC-20 Paymaster      —Users pay Gas with tokens like USDC/DAI
  Staked Paymaster      —Paymaster stakes ETH at the EntryPoint

Flow (Using Pimlico Verifying Paymaster as an example):
  1. Frontend constructs UserOperation
  2. Calls Paymaster API to get paymasterAndData signature
  3. Bundler submits UserOperation
  4. EntryPoint verifies Paymaster signature, deducts Gas from Paymaster's stake
  5. User does not need to hold ETH!
```

---

## 3. Pimlico SDK

```bash
# permissionless.js v0.2 (Note: v0.1 → v0.2 has breaking changes)
npm install permissionless@^0.2 viem
```

```typescript
// lib/aa.ts —permissionless.js v0.2 Correct API
import { createSmartAccountClient }  from 'permissionless';
import { toSimpleSmartAccount }       from 'permissionless/accounts';
import { createPimlicoClient }        from 'permissionless/clients/pimlico';
import { createPublicClient, http }   from 'viem';
import { base }                       from 'viem/chains';
import { entryPoint07Address }        from 'viem/account-abstraction';

const PIMLICO_KEY = process.env.NEXT_PUBLIC_PIMLICO_API_KEY!;
const BUNDLER_URL = `https://api.pimlico.io/v2/base/rpc—apikey=${PIMLICO_KEY}`;

// EntryPoint v0.7 (Recommended for new projects)
// EntryPoint v0.6: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789' (Legacy compatibility)
const EP_ADDRESS = entryPoint07Address; // '0x0000000071727De22E5E9d8BAf0edAc6f37da032'

export const publicClient = createPublicClient({ chain: base, transport: http() });

// ── 1. Pimlico Bundler + Paymaster Client ────────────────────
export const pimlicoClient = createPimlicoClient({
    transport: http(BUNDLER_URL),
    entryPoint: { address: EP_ADDRESS, version: '0.7' },
});

// ── 2. Create Smart Account (v0.2 API: Pass walletClient directly) ────
export async function createAAClient(walletClient: any) {
    // v0.2 no longer requires walletClientToSmartAccountSigner conversion
    const account = await toSimpleSmartAccount({
        client:  publicClient,
        owner:   walletClient,   // Pass wagmi walletClient directly
        entryPoint: { address: EP_ADDRESS, version: '0.7' },
        // Alternative Account Types:
        // toSafeSmartAccount       —Safe account (Most secure)
        // toKernelSmartAccount     —ZeroDev Kernel (Plugin-based)
        // toNexusSmartAccount      —Biconomy Nexus (v0.7 Native)
    });

    console.log('Smart Account Address (counterfactual):', account.address);

    const smartAccountClient = createSmartAccountClient({
        account,
        chain:            base,
        bundlerTransport: http(BUNDLER_URL),
        paymaster:        pimlicoClient,      // v0.2: paymaster field replaces middleware
        paymasterContext: { sponsorshipPolicyId: 'sp_xxx' }, // Created in Pimlico Dashboard
    });

    return smartAccountClient;
}

// ── 3. Send Gasless UserOperation ──────────────────────────────
export async function sendGaslessOp(
    client: Awaited<ReturnType<typeof createAAClient>>,
    to: `0x${string}`,
    data: `0x${string}`,
    value = 0n
) {
    const hash = await client.sendTransaction({ to, data, value });
    console.log('UserOp Hash:', hash);
    const receipt = await client.waitForTransactionReceipt({ hash });
    console.log('Confirmed Block:', receipt.blockNumber);
    return receipt;
}
```

### React Hook Encapsulation (v0.2 Correct Syntax)

```tsx
// hooks/useSmartAccount.ts —permissionless.js v0.2
import { useState, useEffect } from 'react';
import { useWalletClient }     from 'wagmi';
import { createAAClient, sendGaslessOp } from '@/lib/aa';

export function useSmartAccount() {
    const { data: walletClient } = useWalletClient();
    const [aaClient,  setAAClient]  = useState<any>(null);
    const [aaAddress, setAAAddress] = useState<string>('');
    const [loading,   setLoading]   = useState(false);
    const [error,     setError]     = useState<Error | null>(null);

    useEffect(() => {
        if (!walletClient) { setAAClient(null); setAAAddress(''); return; }
        setLoading(true);
        setError(null);

        // v0.2: Pass walletClient directly, no extra conversion needed
        createAAClient(walletClient)
            .then(client => {
                setAAClient(client);
                setAAAddress(client.account.address);
            })
            .catch(err => setError(err))
            .finally(() => setLoading(false));
    }, [walletClient]);

    const executeGasless = async (to: `0x${string}`, data: `0x${string}`, value = 0n) => {
        if (!aaClient) throw new Error('AA client not initialized');
        return sendGaslessOp(aaClient, to, data, value);
    };

    return { aaClient, aaAddress, loading, error, executeGasless };
}
```

---

## 4. Biconomy SDK

```bash
npm install @biconomy/account @biconomy/paymaster @biconomy/bundler
```

```typescript
import { createSmartAccountClient, PaymasterMode } from '@biconomy/account';
import { ethers } from 'ethers';

const provider = new ethers.BrowserProvider(window.ethereum);
const signer   = await provider.getSigner();

const smartAccount = await createSmartAccountClient({
    signer,
    bundlerUrl: `https://bundler.biconomy.io/api/v2/8453/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44`,
    biconomyPaymasterApiKey: process.env.NEXT_PUBLIC_BICONOMY_KEY!,
    rpcUrl: process.env.NEXT_PUBLIC_BASE_RPC!,
});

console.log('Smart Account:', await smartAccount.getAccountAddress());

// Send Gasless Transaction
const { waitForTxHash } = await smartAccount.sendTransaction(
    { to: contractAddr, data: calldata },
    {
        paymasterServiceData: { mode: PaymasterMode.SPONSORED },  // Sponsorship mode
    }
);
const { transactionHash } = await waitForTxHash();
```

---

## 5. Simple Contract Wallet

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
// SimpleAccount —EIP-4337 minimal contract wallet implementation (For learning purposes only, use Safe/Kernel in production)

import "@account-abstraction/contracts/core/BaseAccount.sol";
import "@account-abstraction/contracts/interfaces/IEntryPoint.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";

contract SimpleAccount is BaseAccount {
    using ECDSA for bytes32;

    IEntryPoint private immutable _entryPoint;
    address public owner;

    error NotOwnerOrEntryPoint();
    error InvalidNonce();

    modifier onlyOwnerOrEntryPoint() {
        if (msg.sender != owner && msg.sender != address(_entryPoint))
            revert NotOwnerOrEntryPoint();
        _;
    }

    constructor(IEntryPoint ep, address _owner) {
        _entryPoint = ep;
        owner = _owner;
    }

    function entryPoint() public view override returns (IEntryPoint) { return _entryPoint; }

    /// @notice EntryPoint calls this function to verify the signature
    function _validateSignature(PackedUserOperation calldata userOp, bytes32 userOpHash)
        internal override returns (uint256 validationData)
    {
        bytes32 hash = MessageHashUtils.toEthSignedMessageHash(userOpHash);
        address recovered = hash.recover(userOp.signature);
        if (recovered != owner) return SIG_VALIDATION_FAILED;
        return SIG_VALIDATION_SUCCESS;
    }

    /// @notice Execute arbitrary calls
    function execute(address dest, uint256 value, bytes calldata data)
        external onlyOwnerOrEntryPoint
    {
        (bool ok, bytes memory result) = dest.call{value: value}(data);
        if (!ok) {
            assembly { revert(add(result, 32), mload(result)) }
        }
    }

    /// @notice Batch execution
    function executeBatch(
        address[] calldata dests,
        uint256[] calldata values,
        bytes[]   calldata datas
    ) external onlyOwnerOrEntryPoint {
        uint256 len = dests.length;
        for (uint256 i; i < len;) {
            (bool ok,) = dests[i].call{value: values[i]}(datas[i]);
            require(ok, "Batch call failed");
            unchecked { ++i; }
        }
    }

    receive() external payable {}
}
```

---

## 6. Batch Operations

One of AA's core advantages: Completing multiple operations in a single transaction, reducing Gas and confirmation waits.

```typescript
// Sending batch operations with permissionless.js
const hash = await smartAccountClient.sendTransactions({
    transactions: [
        // approve USDC
        {
            to: USDC_ADDRESS as `0x${string}`,
            data: encodeFunctionData({
                abi: ERC20_ABI,
                functionName: 'approve',
                args: [UNISWAP_ROUTER, parseUnits('100', 6)],
            }),
        },
        // swap USDC → ETH
        {
            to: UNISWAP_ROUTER as `0x${string}`,
            data: encodeFunctionData({
                abi: ROUTER_ABI,
                functionName: 'exactInputSingle',
                args: [{ tokenIn: USDC, tokenOut: WETH, fee: 3000, ... }],
            }),
        },
        // The above two steps are merged into ONE UserOperation!
    ],
});
```

---

## 7. Social Recovery

```solidity
// Social Recovery: Guardian multi-sig can reset the owner
contract RecoverableAccount is SimpleAccount {
    mapping(address => bool) public isGuardian;
    uint256 public guardianCount;
    uint256 public threshold;           // Minimum Guardian signatures required for recovery

    mapping(bytes32 => uint256) public recoveryApprovals;
    mapping(bytes32 => mapping(address => bool)) public hasApproved;

    event RecoveryInitiated(address indexed newOwner, bytes32 indexed recoveryId);
    event OwnerRecovered(address indexed oldOwner, address indexed newOwner);

    function initiateRecovery(address newOwner) external {
        require(isGuardian[msg.sender], "Not guardian");
        bytes32 id = keccak256(abi.encodePacked(newOwner, block.timestamp / 1 days));
        if (!hasApproved[id][msg.sender]) {
            hasApproved[id][msg.sender] = true;
            recoveryApprovals[id]++;
        }
        if (recoveryApprovals[id] >= threshold) {
            address old = owner;
            owner = newOwner;
            emit OwnerRecovered(old, newOwner);
        }
        emit RecoveryInitiated(newOwner, id);
    }
}
```

---

## 8. On-Chain Contract Integration

Making existing contracts support AA users (no contract modifications needed; AA is transparent at the EntryPoint layer):

```solidity
// ✅No special changes needed for contracts, AA user's msg.sender = Contract Wallet Address
// Just ensure access control logic uses msg.sender instead of tx.origin

// ❌Incorrect: tx.origin will expose the Bundler address
require(tx.origin == owner, "Not owner");  // DANGEROUS

// ✅Correct: msg.sender = Smart Account Address
require(msg.sender == owner, "Not owner");
```

**Common EntryPoint and Factory Addresses (Unified across all chains):**
```
EntryPoint v0.6:  0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789
EntryPoint v0.7:  0x0000000071727De22E5E9d8BAf0edAc6f37da032 (Recommended for new projects)
SimpleAccountFactory v0.6: 0x9406Cc6185a346906296840746125a0E44976454
Safe 4337 Module: 0xa581c4A4DB7175302464fF3C06380BC3270b4037
```

---

## 9. zkSync Native AA vs EIP-4337

zkSync Era natively supports AA; all accounts are smart contracts by default. The implementation is fundamentally different from EIP-4337. Developing on zkSync requires understanding the differences.

```
EIP-4337 (Ethereum / Arbitrum / Optimism / Base):
─────────────────────────────────────────────────
  User → UserOperation → Bundler → EntryPoint → Smart Account

  ● Runs above the protocol layer, requires an extra EntryPoint contract
  ● EOA and Smart Account are two distinct account types
  ● tx.origin = EOA (Secure)
  ● Deployment: Normal CREATE2

zkSync Native AA (Built into Protocol Layer):
─────────────────────────────────────────────────
  User → Transaction → Bootloader (System Contract) → Account Contract

  ● Directly built into the protocol layer, no EntryPoint needed
  ● All accounts (including EOAs) = Contract accounts
  ● tx.origin = Bootloader Address (0x8001) ⚠️ NEVER use tx.origin for authentication!
  ● Deployment: zkSync-specific CREATE2 (Different address calculation)

Selection Guide:
  Ethereum / Arbitrum / Base / Optimism → EIP-4337 (Sections §3-§7 of this doc)
  zkSync Era → Native AA (Implements IAccount interface)
  Deploying on both simultaneously → Use respective solutions for each chain, do not mix
```

### zkSync Native AA Contract Interface

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;  // ⚠️ zkSync does not support 0.8.20+ (PUSH0 opcode)

import "@matterlabs/zksync-contracts/l2/system-contracts/interfaces/IAccount.sol";
import "@matterlabs/zksync-contracts/l2/system-contracts/libraries/TransactionHelper.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract ZkSyncAccount is IAccount {
    using TransactionHelper for Transaction;

    address public owner;

    // ── Verify Transaction Signature (Called by Bootloader) ──────────────────────
    function validateTransaction(
        bytes32 /* txHash */,
        bytes32 /* suggestedSignedHash */,
        Transaction calldata _transaction
    ) external payable override returns (bytes4 magic) {
        // Verify nonce
        SystemContractsCaller.systemCallWithPropagatedRevert(
            uint32(gasleft()),
            address(NONCE_HOLDER_SYSTEM_CONTRACT),
            0,
            abi.encodeCall(INonceHolder.incrementMinNonceIfEquals, (_transaction.nonce))
        );

        // Verify signature
        bytes32 txHash      = _transaction.encodeHash();
        bytes32 signedHash  = ECDSA.toEthSignedMessageHash(txHash);
        address recovered   = ECDSA.recover(signedHash, _transaction.signature);

        magic = recovered == owner
            — ACCOUNT_VALIDATION_SUCCESS_MAGIC
            : bytes4(0);
    }

    // ── Execute Transaction ─────────────────────────────────────────────
    function executeTransaction(
        bytes32, bytes32, Transaction calldata _transaction
    ) external payable override {
        address to    = address(uint160(_transaction.to));
        uint256 value = _transaction.value;
        bytes   memory data = _transaction.data;
        (bool ok,) = to.call{value: value}(data);
        require(ok, "Execution failed");
    }

    // ── Pay Gas ─────────────────────────────────────────────
    function payForTransaction(
        bytes32, bytes32, Transaction calldata _transaction
    ) external payable override {
        bool ok = _transaction.payToTheBootloader();
        require(ok, "Failed to pay bootloader");
    }

    // Paymaster Scenario (Using Paymaster to pay Gas)
    function prepareForPaymaster(
        bytes32, bytes32, Transaction calldata _transaction
    ) external payable override {
        _transaction.processPaymasterInput();
    }

    function executeTransactionFromOutside(Transaction calldata) external payable override {}

    receive() external payable {}
}
```
