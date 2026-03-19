# Frontend Web3: ethers.js v6 / Native Web3

> Best for: Non-React projects, compatibility-first scenarios, Vue, Vanilla JS, Node.js scripts.
> For React projects, prefer `references/frontend-wagmi.md` (Better state management).

## Table of Contents
1. [Installation & Connection](#1-installation--connection)
2. [Provider / Signer / Contract](#2-provider--signer--contract)
3. [Contract Read & Write Operations](#3-contract-read--write-operations)
4. [Event Listening & Historical Queries](#4-event-listening--historical-queries)
5. [Signatures & EIP-712](#5-signatures--eip-712)
6. [Utility Functions Quick-Ref](#6-utility-functions-quick-ref)
7. [IPFS Integration](#7-ipfs-integration)
8. [The Graph Queries](#8-the-graph-queries)

---

## 1. Installation & Connection

```bash
npm install ethers       # v6 (Current mainstream version)
```

```typescript
// ethers v6 Key Changes (vs v5):
// BigNumber → bigint (Native)
// ethers.utils.xxx → ethers.xxx (Direct exports)
// providers.Web3Provider → BrowserProvider
// providers.JsonRpcProvider → JsonRpcProvider (Same name)
// ContractFactory usage is essentially the same

import {
    ethers,
    BrowserProvider, JsonRpcProvider,
    Contract, ContractFactory,
    parseEther, formatEther,
    parseUnits, formatUnits,
    isAddress, getAddress,
    keccak256, toUtf8Bytes,
    hexlify, zeroPadValue,
    TypedDataEncoder,
} from 'ethers';
```

---

## 2. Provider / Signer / Contract

```typescript
// ── Browser Wallet (MetaMask) ────────────────────────────────────
async function connectWallet() {
    if (!window.ethereum) throw new Error('Please install MetaMask');

    const provider = new BrowserProvider(window.ethereum);

    // Request authorization (Triggers MetaMask popup)
    await provider.send('eth_requestAccounts', []);

    const signer  = await provider.getSigner();
    const address = await signer.getAddress();
    const network = await provider.getNetwork();
    const balance = await provider.getBalance(address);

    console.log('Address:', address);
    console.log('Chain ID:', network.chainId.toString());
    console.log('Balance:', formatEther(balance), 'ETH');

    return { provider, signer, address };
}

// ── Event Listening (Account/Chain Switch) ───────────────────────────────────
window.ethereum?.on('accountsChanged', (accounts: string[]) => {
    if (accounts.length === 0) {
        // User disconnected
    } else {
        // Account switched
    }
});
window.ethereum?.on('chainChanged', (chainId: string) => {
    window.location.reload();  // Recommendation: Refresh the page
});

// ── Server-Side / Scripts (No browser) ────────────────────────────────
const provider = new JsonRpcProvider(process.env.MAINNET_RPC_URL);
const wallet   = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
// Or from a mnemonic:
// const wallet = ethers.Wallet.fromPhrase(mnemonic).connect(provider);

// ── Switch Network ─────────────────────────────────────────────────
async function switchToArbitrum() {
    try {
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0xa4b1' }],  // 42161 hex
        });
    } catch (err: any) {
        if (err.code === 4902) {  // Chain not added
            await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [{
                    chainId: '0xa4b1',
                    chainName: 'Arbitrum One',
                    rpcUrls: ['https://arb1.arbitrum.io/rpc'],
                    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
                    blockExplorerUrls: ['https://arbiscan.io'],
                }],
            });
        }
    }
}
```

---

## 3. Contract Read & Write Operations

```typescript
const ERC20_ABI = [
    'function name() view returns (string)',
    'function symbol() view returns (string)',
    'function decimals() view returns (uint8)',
    'function totalSupply() view returns (uint256)',
    'function balanceOf(address) view returns (uint256)',
    'function allowance(address owner, address spender) view returns (uint256)',
    'function approve(address spender, uint256 amount) returns (bool)',
    'function transfer(address to, uint256 amount) returns (bool)',
    'function transferFrom(address from, address to, uint256 amount) returns (bool)',
    'event Transfer(address indexed from, address indexed to, uint256 value)',
    'event Approval(address indexed owner, address indexed spender, uint256 value)',
];

// ── Read-Only (Using provider) ─────────────────────────────────────
const contract = new Contract(TOKEN_ADDRESS, ERC20_ABI, provider);

// Batch reading (Promise.all concurrency)
const [name, symbol, decimals, supply, balance] = await Promise.all([
    contract.name(),
    contract.symbol(),
    contract.decimals(),
    contract.totalSupply(),
    contract.balanceOf(userAddress),
]);
console.log(`${name} (${symbol}): ${formatUnits(balance, decimals)}`);

// ── Writing (Using signer) ─────────────────────────────────────
const contractWithSigner = new Contract(TOKEN_ADDRESS, ERC20_ABI, signer);

// Gas Estimation + Send
const gasEstimate = await contractWithSigner.transfer.estimateGas(recipient, parseEther('100'));
const tx = await contractWithSigner.transfer(recipient, parseEther('100'), {
    gasLimit: gasEstimate * 120n / 100n,  // 20% buffer
    // EIP-1559 (Recommended)
    maxFeePerGas:         parseUnits('30', 'gwei'),
    maxPriorityFeePerGas: parseUnits('2',  'gwei'),
});

console.log('Transaction Hash:', tx.hash);
const receipt = await tx.wait(1);  // Wait for 1 confirmation
console.log('Confirmed Block:', receipt?.blockNumber);
console.log('Actual Gas Used:', receipt?.gasUsed.toString());

// ── Full approve + transferFrom Flow ──────────────────────────
async function approveAndStake(amount: bigint) {
    // 1. Check current allowance
    const allowance = await contract.allowance(userAddress, STAKING_ADDRESS);
    if (allowance < amount) {
        // 2. Approve
        const approveTx = await contractWithSigner.approve(STAKING_ADDRESS, amount);
        await approveTx.wait(1);
    }
    // 3. Stake
    const stakingContract = new Contract(STAKING_ADDRESS, STAKING_ABI, signer);
    const stakeTx = await stakingContract.stake(amount);
    await stakeTx.wait(1);
}
```

---

## 4. Event Listening & Historical Queries

```typescript
// ── Listen to New Events in Real-Time ────────────────────────────────────────────
const filter = contract.filters.Transfer(null, userAddress);  // Filter: to = userAddress

contract.on(filter, (from, to, value, event) => {
    console.log(`Received ${formatEther(value)} tokens from ${from}`);
    console.log('Transaction Hash:', event.log.transactionHash);
});

// Stop listening
contract.off(filter);   // Or contract.removeAllListeners();

// ── Query Historical Events ──────────────────────────────────────────────
async function getTransferHistory(userAddress: string, blocks = 10000) {
    const latestBlock = await provider.getBlockNumber();
    const fromBlock   = Math.max(0, latestBlock - blocks);

    const filter   = contract.filters.Transfer(null, userAddress);
    const logs     = await contract.queryFilter(filter, fromBlock, 'latest');

    return logs.map(log => ({
        from:   log.args[0],
        to:     log.args[1],
        value:  formatEther(log.args[2]),
        txHash: log.transactionHash,
        block:  log.blockNumber,
    }));
}
```

---

## 5. Signatures & EIP-712

```typescript
// ── Normal Message Signature ──────────────────────────────────────────────
const message  = 'Sign this message to verify ownership';
const sig      = await signer.signMessage(message);
const recovered = ethers.verifyMessage(message, sig);
console.log('Is same address?', recovered.toLowerCase() === (await signer.getAddress()).toLowerCase());

// ── EIP-712 Structured Signature (Anti-Replay) ──────────────────────────────
const domain = {
    name:              'MyProtocol',
    version:           '1',
    chainId:           (await provider.getNetwork()).chainId,
    verifyingContract: CONTRACT_ADDRESS,
};

const types = {
    Permit: [
        { name: 'owner',    type: 'address' },
        { name: 'spender',  type: 'address' },
        { name: 'value',    type: 'uint256' },
        { name: 'nonce',    type: 'uint256' },
        { name: 'deadline', type: 'uint256' },
    ],
};

const value = {
    owner:    await signer.getAddress(),
    spender:  SPENDER_ADDRESS,
    value:    parseEther('100'),
    nonce:    await contract.nonces(await signer.getAddress()),
    deadline: BigInt(Math.floor(Date.now() / 1000) + 3600),  // 1 Hour
};

const sig712 = await signer.signTypedData(domain, types, value);
const { v, r, s } = ethers.Signature.from(sig712);

// Contract Verification (Permit)
await contract.permit(value.owner, value.spender, value.value, value.deadline, v, r, s);
```

---

## 6. Utility Functions Quick-Ref

```typescript
// ── Unit Conversions ──────────────────────────────────────────────────
parseEther('1.5')              // → 1500000000000000000n
formatEther(1500000000000000000n) // → '1.5'
parseUnits('100', 6)           // USDC (6 decimals) → 100000000n
formatUnits(100000000n, 6)     // → '100.0'

// ── Address Checking ──────────────────────────────────────────────────
isAddress('0x...')             // Format validation
getAddress('0x...')            // Convert to EIP-55 Checksum address
ethers.ZeroAddress             // '0x0000...0000'

// ── Hashing ──────────────────────────────────────────────────────
keccak256(toUtf8Bytes('MINTER_ROLE'))  // bytes32 role ID
ethers.id('transfer(address,uint256)') // Function selector keccak256

// ── ENS ───────────────────────────────────────────────────────
const name = await provider.lookupAddress(address);  // → 'vitalik.eth' | null
const addr = await provider.resolveName('vitalik.eth'); // → '0x...'

// ── Byte Operations ─────────────────────────────────────────────────
hexlify(new Uint8Array([1, 2, 3]))  // → '0x010203'
zeroPadValue('0x01', 32)            // Left pad to 32 bytes

// ── ABI Encoding / Decoding ────────────────────────────────────────────────
const encoded = ethers.AbiCoder.defaultAbiCoder().encode(
    ['address', 'uint256'], [address, amount]
);
const [addr2, amt] = ethers.AbiCoder.defaultAbiCoder().decode(
    ['address', 'uint256'], encoded
);
```

---

## 7. IPFS Integration / The Graph Queries

> For full implementation (Including Subgraph Development & Deployment), see `references/data-infra.md`

```typescript
// IPFS Upload (Pinata) — Quick Ref
import { uploadFile, uploadMetadata } from '@/lib/ipfs';  // see data-infra.md §1

const imageUri    = await uploadFile(imageFile);           // → ipfs://Qm...
const metaUri     = await uploadMetadata({ name, image: imageUri, attributes });

// Convert IPFS URI to HTTP
const toHTTP = (uri: string) =>
    uri.startsWith('ipfs://') ? `https://gateway.pinata.cloud/ipfs/${uri.slice(7)}` : uri;

// The Graph Queries (Apollo) — Quick Ref, complete config in data-infra.md §2
import { gql, useQuery } from '@apollo/client';
const { data } = useQuery(gql`query { pools(first: 10) { id token0 { symbol } } }`, { client });
```

---

## 8. Server-Side Signature Verification (Node.js)

The frontend uses `signer.signTypedData` to sign, the backend must verify accordingly. Compliments `§5 Signatures & EIP-712`.

```typescript
// server/verify.ts — Node.js / Express Backend (ethers.js v6)
import { ethers } from 'ethers';

// Domain and types must be perfectly identical to the frontend's
const DOMAIN = {
    name:              'MyProtocol',
    version:           '1',
    chainId:           1,
    verifyingContract: '0x...',
};
const TYPES = {
    LoginRequest: [
        { name: 'user',    type: 'address' },
        { name: 'nonce',   type: 'uint256' },
        { name: 'deadline', type: 'uint256' },
    ],
};

export async function verifyLogin(
    userAddress: string,
    nonce:       bigint,
    deadline:    bigint,
    signature:   string,
): Promise<boolean> {
    // Expiration check (Server time, Unix seconds)
    if (BigInt(Math.floor(Date.now() / 1000)) > deadline) {
        throw new Error('Signature expired');
    }

    const value = { user: userAddress, nonce, deadline };

    // ethers.verifyTypedData recovers the signer address
    const recovered = ethers.verifyTypedData(DOMAIN, TYPES, value, signature);

    // Case-insensitive comparison (EIP-55 Checksum)
    return recovered.toLowerCase() === userAddress.toLowerCase();
}

// Express Route Example
app.post('/api/login', async (req, res) => {
    const { address, nonce, deadline, signature } = req.body;
    try {
        const valid = await verifyLogin(address, BigInt(nonce), BigInt(deadline), signature);
        if (!valid) return res.status(401).json({ error: 'Invalid signature' });

        // Nonce is used, save mapping in DB/Redis to prevent replay attacks
        await markNonceUsed(address, nonce);
        const token = issueJWT(address);
        res.json({ token });
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
});
```
