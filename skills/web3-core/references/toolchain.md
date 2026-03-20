# Web3 Toolchain Reference

## Table of Contents
1. [ABI Typings CodeGen (TypeChain)](#1-typechain)
2. [wagmi CLI CodeGen](#2-wagmi-cli-codegen)
3. [GitHub Actions CI/CD](#3-github-actions-cicd)
4. [OpenZeppelin Defender](#4-openzeppelin-defender)
5. [Static Analysis (Slither / Mythril)](#5-static-analysis)
6. [Gas Analysis & Optimization Workflow](#6-gas-analysis)

---

## 1. TypeChain

TypeChain automatically produces robust TypeScript interfaces parsing directly from ABI files; entirely eradicating handwritten mappings substituting `any` overrides.

```bash
npm install --save-dev typechain @typechain/hardhat @typechain/ethers-v6
```

**hardhat.config.ts Configurations:**
```typescript
import '@typechain/hardhat';

// typechain integrations (Optional overloads)
const config: HardhatUserConfig = {
    typechain: {
        outDir:  'typechain-types',    // Eject target
        target:  'ethers-v6',          // Strict bindings specifically for Ethers v6 
        alwaysGenerateOverloads: false,
        dontOverrideCompile: false,
    },
    // ...
};
```

```bash
npx hardhat typechain    # Alt: npx hardhat compile (Triggers implicitly)
```

**Utilizing Casted Types:**
```typescript
// Legacy Operations (Unsafe mapping) �?const contract = new Contract(addr, ABI as any, signer);
const balance = await contract.balanceOf(user);  // Yields blind `any` type

// TypeChain Implementations (Extremely type disciplined) �?import { MyToken, MyToken__factory } from '../typechain-types';

const token: MyToken = MyToken__factory.connect(TOKEN_ADDRESS, signer);
const balance: bigint = await token.balanceOf(user);  // Interpreted accurately as bigint
const tx = await token.transfer(recipient, parseEther('100'));  // Strict check upon param passing
await tx.wait();

// Instantiations within scripts (Highly Recommended)
const Token = await ethers.getContractFactory('MyToken') as MyToken__factory;
const token = await Token.deploy(name, symbol, owner);
// `token` object conforms entirely to MyToken interfaces globally
```

---

## 2. wagmi CLI CodeGen

The wagmi CLI dynamically builds hook subsets directly from generated ABIs natively bound into React contexts—acting as the exact replica for frontend interfaces as TypeChain performs under node operations.

```bash
npm install --save-dev @wagmi/cli
```

**wagmi.config.ts:**
```typescript
import { defineConfig } from '@wagmi/cli';
import { etherscan, react, hardhat } from '@wagmi/cli/plugins';

export default defineConfig({
    out: 'src/generated.ts',     // Targeted artifact file (Commit this route to git)
    contracts: [
        {
            name: 'MyToken',
            abi: MyTokenABI,     // Bind literal JSON ABIs
            address: {
                1:       '0x...Mainnet',
                84532:   '0xBase Sepolia',
                11155111:'0xSepolia',
            },
        },
    ],
    plugins: [
        // Siphons implicitly off Hardhat builds
        hardhat({ project: '../contracts' }),
        // Retrieves real-time ABI data via active Explorer integrations
        etherscan({
            apiKey: process.env.ETHERSCAN_API_KEY!,
            chainId: 1,
            contracts: [
                { name: 'UniswapV3Pool', address: '0x...' },
            ],
        }),
        // Bootstraps React components hooks 
        react(),
    ],
});
```

```bash
npx wagmi generate       # Exposes logic into src/generated.ts
```

**Leveraging Generation Components:**
```typescript
// Seamless deployment (Addresses implicitly mapped; hooks type-constrained fully)
import {
    useReadMyTokenBalanceOf,
    useWriteMyTokenTransfer,
    useWatchMyTokenTransferEvent,
} from '@/generated';

function TokenUI() {
    const { address } = useAccount();

    // Isolated read bindings 
    const { data: balance } = useReadMyTokenBalanceOf({
        args: [address!],
        query: { enabled: !!address },
    });

    // Write parameters enforce rigorous type validations 
    const { writeContract } = useWriteMyTokenTransfer();
    const transfer = () => writeContract({
        args: [recipient, parseEther('100')],  // Instantly errors unaligned arguments
    });

    // Event hooks bound uniquely against matching parameters
    useWatchMyTokenTransferEvent({
        args: { to: address },  // Natively matches index parameters inside schemas
        onLogs(logs) { console.log(logs); },
    });

    return <div>Balance: {balance?.toString()}</div>;
}
```

**package.json scripts target setup:**
```json
{
    "scripts": {
        "wagmi:generate": "wagmi generate",
        "typechain":      "hardhat typechain",
        "codegen":        "npm run typechain && npm run wagmi:generate"
    }
}
```

---

## 3. GitHub Actions CI/CD

**Architectural Skeleton Repositories:**
- `assets/templates/.github/workflows/ci.yml` �?Holistic pipelines checking Foundry / Hardhat bindings / Static assessments and automated deploy structures.
- `assets/templates/.github/workflows/pr-check.yml` �?Explicit verification evaluating structural upgrades and gas discrepancy readouts upon pull requests.

**Core Checkpoint Interpretations:**

```
Activators: push targeting branches (main/develop); active Pull Request cycles

Job 1: foundry-test
  forge build --sizes        �?Inspect boundary constraints limiting EVMs < 24KB
  forge test --gas-report    �?Run unit verification outputting structural utilization
  forge snapshot --check     �?Halt build assuming execution spikes prior footprint expectations
  forge test --profile ci    �?Initiate truncated fuzz suite evaluations (e.g. 1000 iteration constraints)

Job 2: hardhat-test
  npx hardhat test           �?Engage Hardhat logic executions
  npx hardhat coverage       �?Output test coverage matrix paths tracking line execution paths

Job 3: slither
  crytic/slither-action      �?Employ deep static inspection targeting High-risk indicators acting as strict blockers
  Push SARIF Artifacts �?Expose results universally inside GitHub's graphical security panel layer

Job 4: deploy-sepolia (Restricted strictly to 'main' trunking, guarded by secondary oversight approvals)
  forge script + --broadcast �?Commit transaction block via Sepolia routing triggering Etherscan code transparency verifications
```

**Required GitHub Secrets Overlays:**

```
MAINNET_RPC_URL        �?Mainnet mapping node for isolated fork tests
SEPOLIA_RPC_URL        �?Live interaction endpoints testing against live EVM environments
ETHERSCAN_API_KEY      �?Exposes contract bytecode decoding natively on visual explorers
DEPLOYER_PRIVATE_KEY   �?Dummy key managing testnet distributions (⚠️ Absolute isolation from mainnet entities required!)
```

---

## 4. OpenZeppelin Defender

Defender encompasses structural autonomy via automated deployment suites, holistic privilege mappings, dynamic observability, and incident execution routines.

```typescript
// npm install @openzeppelin/defender-sdk

import { Defender } from '@openzeppelin/defender-sdk';

const client = new Defender({
    apiKey:    process.env.DEFENDER_API_KEY!,
    apiSecret: process.env.DEFENDER_API_SECRET!,
});

// ── Orchestrating Dispatches Relaying (Keeps sensitive execution signatures air-gapped) ──
const relayClient = client.relaySigner;
const relayer = await relayClient.getRelayer('relayer-id');

const tx = await relayClient.sendTransaction({
    to:       CONTRACT_ADDRESS,
    data:     encodedCalldata,
    // V2 architecture overrides speed directives into explicit Policy dictates 
    gasPolicy: {
        EIP1559: {
            maxFeePerGas:         '30000000000',   // 30 gwei limit threshold
            maxPriorityFeePerGas: '2000000000',    // Explicit tipping structure (2 gwei)
        },
    },
    gasLimit: 200_000,
});

// ── Sentinel Monitors ────────────────────────────────────────
// Logic configuration instantiated manually across Defender graphical interfaces includes:
// - Observing explicit flag changes (i.e. Global Protocol Pause Activated)
// - Tripping instantaneous action nodes (Freezing vaults; mailing administration)
// - High-level behavior evaluations (Abnormally high transfer volumes mapping to flash loan exploits)

// ── Timelock Governance Logistics ─────────────────────────────────────────
// Defender's Administrative overlay capabilities provide visually mapped pathways:
// - Graphic representation mapping hierarchy across nested AccessControl models.
// - Pushing / Validating time-deferred network modifications execution logic 
// - Routing holistic DAO vote integrations seamlessly
```

**Industrial Grade Deployment Strategy:**
```
Developers       �?GitHub Actions Interoperability �?Isolated Testnet Operations (Sepolia)
Multi-sig Admins �?Defender Administrative Web    �?Timelock Implementations  �?Mainnet Alterations
Cron Routines    �?Defender Network Relayers      �?Routine System Tasks (Pricing update routines; Harvest yields)
Perimeter Guards �?Defender Sentinel Hooks        �?Escalation Webhooks       �?PagerDuty/Slack Dispatch Trees
```

---

## 5. Static Analysis

### Slither (Pioneer & Default Component)

```bash
pip install slither-analyzer

# Launch Base Evaluation 
slither . --filter-paths "lib/,node_modules/"

# Presenting condensed structural mapping  
slither . --print human-summary
slither . --print contract-summary

# Limiting review targeting specifically tailored vector anomalies
slither . --detect reentrancy-eth,unchecked-transfer,arbitrary-send-eth

# Projecting interaction nodes visualizing pathway links  
slither . --print call-graph

# Exposing format compliance designed native to GitHub interpretations 
slither . --sarif output.sarif

# Explicit configurations map via `.slither.config.json`
{
    "filter_paths": "lib/,node_modules/",
    "exclude_dependencies": true,
    "exclude": "naming-convention,solc-version"
}
```

### Mythril (Symbolic Evaluation Mapping)

```bash
docker pull mythril/myth
docker run -v $(pwd):/src mythril/myth analyze /src/contracts/MyContract.sol --solv 0.8.24

# Alt Installation Route: 
# pip install mythril
myth analyze contracts/MyContract.sol --solv 0.8.24 -o json
```

### Foundry Integrated Observability

```bash
# Register Baseline Trace Signatures
forge snapshot
# Evaluate Alteration Comparisons Later Down Branch 
forge snapshot --diff              

# Extrapolate Execution Lines Traversed
forge coverage --report lcov
genhtml lcov.info -o coverage-report
# Launch /coverage-report/index.html visual overview map

# Uncover explicit memory array sizing schemas graphically 
forge inspect MyContract storage-layout --pretty
```

---

## 6. Gas Analysis

```bash
# General Gas Assessment 
REPORT_GAS=true npx hardhat test    # Hardhat Native 
forge test --gas-report              # Foundry Native

# Track absolute operations against live forks 
cast run <txhash> --rpc-url $MAINNET_RPC --trace
cast trace <txhash> --rpc-url $MAINNET_RPC

# Inject traces natively toward Tenderly visual stack assessments
curl -X POST https://api.tenderly.co/api/v1/account/$USER/project/$PROJECT/simulate \
  -H "X-Access-Key: $TENDERLY_KEY" \
  -d '{
    "from": "0x...",
    "to": "0x...",
    "input": "0x...",
    "gas": 200000
  }'
```

**Common Gas Flow Optimization Bottleneck Mapping:**
```
Symptoms: Component transactions over-indexing by 30% against theoretical limits
Strategy: Query via `forge test --gas-report` isolating ceiling functions
          Push `forge inspect MyContract storage-layout` to map exact slot arrays 
          Implement `slither . --print function-summary` identifying logical complexities overextended

Symptoms: Iterator functions ballooning consumption linearly correlating to volume spikes 
Resolutions: Implement pagination logic / Sublimate elements strictly into log outputs avoiding storage layers / Employ Merkle tree verifications offloading list parsing entirely. 

Symptoms: Interaction bridging independent modules creating immense cost boundaries 
Resolutions: Compartmentalize communications aggregating grouped execution commands / Alter public interfaces toward strictly internal declarations.
```
