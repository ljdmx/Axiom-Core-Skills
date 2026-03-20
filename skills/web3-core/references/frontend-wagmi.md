# Frontend Web3: wagmi v2 + viem + RainbowKit

> Best for: React / Next.js projects. For Vue projects, see `frontend-ethersjs.md` or wagmi-vue.

## Table of Contents
1. [Project Initialization](#1-project-initialization)
2. [Configuration (Multi-chain + Multi-wallet)](#2-configuration)
3. [Core Hooks Quick Reference](#3-core-hooks-quick-reference)
4. [Complete Contract Interaction Flow](#4-complete-contract-interaction-flow)
5. [AA Frontend Integration (Gasless Experience)](#5-aa-frontend-integration-gasless-experience)
6. [EIP-6963 Multi-wallet Support](#6-eip-6963-multi-wallet-support)
7. [Common Utility Patterns](#7-common-utility-patterns)
8. [IPFS Storage / The Graph Queries](#8-ipfs-storage--the-graph-queries)

---

## 1. Project Initialization

```bash
npm create next-app@latest my-dapp -- --typescript --tailwind --app
cd my-dapp
npm install wagmi viem @rainbow-me/rainbowkit @tanstack/react-query
npm install @rainbow-me/rainbowkit@latest  # Ensure version consistency
```

---

## 2. Configuration

```typescript
// lib/wagmi.ts  (wagmi v2 + RainbowKit v2)
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http, fallback } from 'wagmi';
import { mainnet, sepolia, polygon, arbitrum, base, optimism } from 'wagmi/chains';

export const config = getDefaultConfig({
    appName:   'My dApp',
    projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
    chains: [mainnet, arbitrum, base, optimism, polygon, sepolia],
    transports: {
        [mainnet.id]:   fallback([http(process.env.NEXT_PUBLIC_ALCHEMY_MAINNET_URL!), http()]),
        [arbitrum.id]:  http(process.env.NEXT_PUBLIC_ALCHEMY_ARB_URL!),
        [base.id]:      http(process.env.NEXT_PUBLIC_ALCHEMY_BASE_URL!),
        [optimism.id]:  http(process.env.NEXT_PUBLIC_ALCHEMY_OP_URL!),
        [polygon.id]:   http(process.env.NEXT_PUBLIC_ALCHEMY_POLYGON_URL!),
        [sepolia.id]:   http(process.env.NEXT_PUBLIC_ALCHEMY_SEPOLIA_URL!),
    },
    ssr: true,  // Required for Next.js App Router
});

// app/providers.tsx
'use client';
import '@rainbow-me/rainbowkit/styles.css';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from '@/lib/wagmi';

const queryClient = new QueryClient();

export function Web3Providers({ children }: { children: React.ReactNode }) {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider theme={darkTheme()}>
                    {children}
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}

// Used in app/layout.tsx
// <Web3Providers>{children}</Web3Providers>
```

---

## 3. Core Hooks Quick Reference

```typescript
import {
    useAccount,          // Current account info
    useBalance,          // ETH / ERC-20 balance
    useChainId,          // Current chain ID
    useSwitchChain,      // Switch chains
    useReadContract,     // Read single contract function
    useReadContracts,    // Batch reading (Reduce RPC calls)
    useWriteContract,    // Send transactions
    useSimulateContract, // Pre-simulation (Gas estimation + error pre-check)
    useWaitForTransactionReceipt, // Wait for confirmation
    useWatchContractEvent,        // Real-time event listener
    useBlockNumber,      // Latest block number
    usePublicClient,     // Underlying viem PublicClient
    useWalletClient,     // Underlying viem WalletClient
} from 'wagmi';
import { parseEther, formatEther, parseUnits, formatUnits, getAddress } from 'viem';

// ── Account ─────────────────────────────────────────────────────
const { address, isConnected, chain, status } = useAccount();
const { data: ethBalance } = useBalance({ address });
const { switchChain } = useSwitchChain();

// ── Batch Reading (multicall) ─────────────────────────────────────
const { data } = useReadContracts({
    contracts: [
        { address: TOKEN, abi: ERC20_ABI, functionName: 'name' },
        { address: TOKEN, abi: ERC20_ABI, functionName: 'totalSupply' },
        { address: TOKEN, abi: ERC20_ABI, functionName: 'balanceOf', args: [address!] },
    ],
    allowFailure: true,   // One failure doesn't affect the rest
    query: { enabled: !!address },
});
const [name, totalSupply, balance] = data?.map(r => r.result) ?? [];

// ── Chain Guard ───────────────────────────────────────────────────
const chainId = useChainId();
if (chainId !== mainnet.id) {
    switchChain({ chainId: mainnet.id });
}
```

---

## 4. Complete Contract Interaction Flow

```tsx
// Best Practice: simulate �?write �?wait
import { useState } from 'react';
import { useSimulateContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';

function TransferToken() {
    const [to, setTo]     = useState('');
    const [amount, setAmount] = useState('');

    // Step 1: Simulate (Pre-check errors + Get exact Gas)
    const { data: simData, error: simError } = useSimulateContract({
        address: TOKEN_ADDRESS,
        abi: ERC20_ABI,
        functionName: 'transfer',
        args: [to as `0x${string}`, parseEther(amount || '0')],
        query: {
            enabled: !!to && !!amount && parseFloat(amount) > 0,
            retry: false,
        },
    });

    // Step 2: Send Transaction
    const { writeContract, data: hash, isPending, error: writeError } = useWriteContract();

    // Step 3: Wait for On-Chain Confirmation
    const { isLoading: isConfirming, isSuccess, data: receipt } = useWaitForTransactionReceipt({
        hash,
        confirmations: 1,  // Wait for 1 block confirmation
    });

    const handleTransfer = () => {
        if (!simData?.request) return;
        writeContract(simData.request);
    };

    // Error Handling
    const errorMsg = simError?.message || writeError?.message;

    return (
        <div>
            <input value={to} onChange={e => setTo(e.target.value)} placeholder="0x..." />
            <input value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.0" />

            <button
                onClick={handleTransfer}
                disabled={!simData?.request || isPending || isConfirming}
            >
                {isPending     ? 'Please confirm in wallet...' :
                 isConfirming  ? 'Confirming on-chain...' :
                                 'Transfer'}
            </button>

            {isSuccess  && <p>�?Success! <a href={`https://etherscan.io/tx/${hash}`}>View Transaction</a></p>}
            {simError   && <p>⚠️ Pre-check Failed: {errorMsg}</p>}
            {writeError && <p>�?Send Failed: {errorMsg}</p>}
        </div>
    );
}
```

### Reading Historical Events

```typescript
import { usePublicClient } from 'wagmi';
import { parseAbiItem } from 'viem';

function useTransferHistory(address: `0x${string}`) {
    const client = usePublicClient();

    const fetchLogs = async () => {
        const logs = await client!.getLogs({
            address: TOKEN_ADDRESS,
            event: parseAbiItem('event Transfer(address indexed from, address indexed to, uint256 value)'),
            args: { to: address },                     // Filter by recipient
            fromBlock: BigInt(await client!.getBlockNumber()) - 1000n,
            toBlock: 'latest',
        });
        return logs.map(l => ({
            from: l.args.from,
            value: formatEther(l.args.value ?? 0n),
            txHash: l.transactionHash,
        }));
    };
    return { fetchLogs };
}
```

### Listening to Real-Time Events

```tsx
import { useWatchContractEvent } from 'wagmi';

function EventFeed() {
    const [events, setEvents] = useState<any[]>([]);

    useWatchContractEvent({
        address: TOKEN_ADDRESS,
        abi: ERC20_ABI,
        eventName: 'Transfer',
        onLogs(logs) {
            setEvents(prev => [...logs, ...prev].slice(0, 50));
        },
        poll: false,  // WebSocket (Fast) instead of polling (Slow)
    });

    return (
        <ul>
            {events.map((e, i) => (
                <li key={i}>
                    {e.args.from?.slice(0,6)}... �?{e.args.to?.slice(0,6)}...
                    : {formatEther(e.args.value ?? 0n)} tokens
                </li>
            ))}
        </ul>
    );
}
```

---

## 5. AA Frontend Integration (Gasless Experience)

> For full contract side, Paymaster theory, and social recovery see `references/account-abstraction.md`
> The following is a full frontend integration with wagmi + permissionless.js v0.2.

```bash
npm install permissionless@^0.2 viem
```

```tsx
// hooks/useSmartAccount.ts �?permissionless.js v0.2 + wagmi v2
import { useState, useEffect }    from 'react';
import { useWalletClient, usePublicClient } from 'wagmi';
import { createSmartAccountClient }  from 'permissionless';
import { toSimpleSmartAccount }       from 'permissionless/accounts';
import { createPimlicoClient }        from 'permissionless/clients/pimlico';
import { http }                       from 'viem';
import { base }                       from 'viem/chains';
import { entryPoint07Address }        from 'viem/account-abstraction';

const PIMLICO_KEY = process.env.NEXT_PUBLIC_PIMLICO_API_KEY!;
const BUNDLER_URL = `https://api.pimlico.io/v2/base/rpc?apikey=${PIMLICO_KEY}`;

export function useSmartAccount() {
    const { data: walletClient } = useWalletClient();
    const publicClient           = usePublicClient();
    const [aaClient,  setAAClient]  = useState<any>(null);
    const [aaAddress, setAAAddress] = useState<`0x${string}` | ''>('');
    const [loading,   setLoading]   = useState(false);
    const [error,     setError]     = useState<Error | null>(null);

    useEffect(() => {
        if (!walletClient || !publicClient) { setAAClient(null); return; }
        setLoading(true);

        const pimlicoClient = createPimlicoClient({
            transport: http(BUNDLER_URL),
            entryPoint: { address: entryPoint07Address, version: '0.7' },
        });

        toSimpleSmartAccount({
            client:     publicClient,
            owner:      walletClient,          // v0.2: Pass wagmi walletClient directly
            entryPoint: { address: entryPoint07Address, version: '0.7' },
        }).then(account => {
            const client = createSmartAccountClient({
                account,
                chain:            base,
                bundlerTransport: http(BUNDLER_URL),
                paymaster:        pimlicoClient,   // v0.2: paymaster field
            });
            setAAClient(client);
            setAAAddress(account.address);
        })
        .catch(err => setError(err))
        .finally(() => setLoading(false));
    }, [walletClient, publicClient]);

    // Send Gasless Transaction
    const sendGasless = async (to: `0x${string}`, data: `0x${string}`, value = 0n) => {
        if (!aaClient) throw new Error('SmartAccount not initialized');
        const hash    = await aaClient.sendTransaction({ to, data, value });
        const receipt = await aaClient.waitForTransactionReceipt({ hash });
        return { hash, receipt };
    };

    // Batch Operations (AA Core Advantage: Multi-step combined into one tx)
    const sendBatch = async (calls: { to: `0x${string}`; data: `0x${string}`; value?: bigint }[]) => {
        if (!aaClient) throw new Error('SmartAccount not initialized');
        const hash    = await aaClient.sendTransactions({ transactions: calls });
        const receipt = await aaClient.waitForTransactionReceipt({ hash });
        return { hash, receipt };
    };

    return { aaClient, aaAddress, loading, error, sendGasless, sendBatch };
}
```

**Component Example: Gasless Approve + Swap Batch Operation**

```tsx
function GaslessSwap() {
    const { aaAddress, sendBatch, loading } = useSmartAccount();
    const { address: eoaAddress } = useAccount();

    const approveAndSwap = async () => {
        // Two steps merged into one UserOperation; user only confirms once
        await sendBatch([
            {
                to:   USDC_ADDRESS,
                data: encodeFunctionData({
                    abi: ERC20_ABI,
                    functionName: 'approve',
                    args: [UNISWAP_ROUTER, parseUnits('100', 6)],
                }),
            },
            {
                to:   UNISWAP_ROUTER,
                data: encodeFunctionData({
                    abi: ROUTER_ABI,
                    functionName: 'exactInputSingle',
                    args: [{ tokenIn: USDC, tokenOut: WETH, fee: 3000,
                             recipient: aaAddress, amountIn: parseUnits('100', 6),
                             amountOutMinimum: 0n, sqrtPriceLimitX96: 0n }],
                }),
            },
        ]);
    };

    return (
        <div>
            <p>Smart Account: {aaAddress || '(Auto-generated after connecting wallet)'}</p>
            <button onClick={approveAndSwap} disabled={loading || !aaAddress}>
                {loading ? 'Sending...' : 'Gasless Approve and Swap USDC→ETH'}
            </button>
        </div>
    );
}
```

---

## 6. EIP-6963 Multi-wallet Support (Built-in for RainbowKit)

EIP-6963 solves conflict issues when multiple wallets are installed simultaneously (no longer relying on `window.ethereum` competition). RainbowKit v2 / wagmi v2 natively support this without manual handling required.

```typescript
// wagmi v2 + RainbowKit v2 automatically support EIP-6963
// It is enabled when using getDefaultConfig or getDefaultWallets
// Users will see all installed wallets instead of only the one that last overwrote window.ethereum

// Manually detect installed wallet list (For custom UIs)
const detectedWallets: EIP6963ProviderDetail[] = [];
window.addEventListener('eip6963:announceProvider', (event: any) => {
    detectedWallets.push(event.detail);
});
window.dispatchEvent(new Event('eip6963:requestProvider'));
// detectedWallets now contains info of all installed wallets
// event.detail = { info: { name, icon, rdns }, provider }
```

---

## 7. Common Utility Patterns

```typescript
// ── Address Formatting ───────────────────────────────────────────────
import { getAddress, isAddress } from 'viem';
const short = (addr: string) => `${addr.slice(0,6)}...${addr.slice(-4)}`;
const checksum = getAddress(addr);       // Checksum address
const valid = isAddress(addr);           // Verify if it's a valid address

// ── Amount Formatting ───────────────────────────────────────────────
import { formatUnits, parseUnits } from 'viem';
const display = (amount: bigint, decimals: number, precision = 4) =>
    Number(formatUnits(amount, decimals)).toLocaleString('en-US', {
        maximumFractionDigits: precision,
    });
const usd = (val: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

// ── ENS Resolution ──────────────────────────────────────────────────
const publicClient = usePublicClient();
const name = await publicClient!.getEnsName({ address });         // 0x... �?vitalik.eth
const addr = await publicClient!.getEnsAddress({ name: 'vitalik.eth' });

// ── Chain Guard Component ───────────────────────────────────────────────
function RequireChain({ chainId, children }: { chainId: number; children: React.ReactNode }) {
    const { chain } = useAccount();
    const { switchChain, isPending } = useSwitchChain();
    if (chain?.id === chainId) return <>{children}</>;
    return (
        <button onClick={() => switchChain({ chainId })} disabled={isPending}>
            {isPending ? 'Switching...' : `Switch to ${chainId === 1 ? 'Ethereum' : 'L2'}`}
        </button>
    );
}

// ── ABI Type Safety (wagmi CLI codegen, see toolchain.md details) ────────
// wagmi.config.ts �?npm run wagmi:generate �?Auto-generates typed hooks
// Afterwards you can use: import { useReadMyContractBalance } from './generated'
```

---

## 8. IPFS Storage / The Graph Queries

> For full implementation, see `references/data-infra.md` (Including Pinata upload, NFT metadata formatting, Subgraph development & deployment, Apollo query hooks).

```typescript
// Quick Ref: IPFS Upload (Pinata JWT)
async function uploadMetadata(metadata: object): Promise<string> {
    const res = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
        },
        body: JSON.stringify({ pinataContent: metadata }),
    });
    const { IpfsHash } = await res.json();
    return `ipfs://${IpfsHash}`;
}

// Quick Ref: The Graph Queries (Apollo)
import { useQuery, gql } from '@apollo/client';
const { data } = useQuery(gql`query { tokens(first: 10) { id owner } }`);

// Full GraphQL Client configuration, Subgraph queries, and pagination in data-infra.md
```
