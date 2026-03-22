---
name: web3-core
description: EVM full-stack forge for resilient smart contracts and high-integrity decentralized application delivery.
version: "10.2"
last_updated: "2026-03"
trigger_keywords: ["smart contract", "DApp", "EVM", "Solidity", "Vyper", "DeFi", "NFT", "token", "Web3", "blockchain", "Ethereum", "Polygon", "BSC", "Arbitrum", "Optimism", "ZKSync", "wallet", "gas optimization", "Hardhat", "Foundry"]
auto_activate: true
metadata:
  pattern: tool-wrapper, reviewer, inversion
  web3-stack: hardhat-foundry-hybrid
token_budget:
  core_load: 8500
  full_load: 32000

## 🧮 Gas Budget & Security Constraints
Before deploying any ERC-20, ERC-721, or DeFi protocol, AI MUST generate a pre-flight execution plan confirming the theoretical Gas Cost.
| Action | Target Mainnet Gas Limit | Warning Threshold |
|---|---|---|
| **Simple ERC20 Transfer** | 21,000 —65,000 | > 65,000 |
| **ERC721 Mint (Standard)** | 70,000 —120,000 | > 150,000 |
| **ERC721A Mint (Batch)** | 80,000 —90,000 | > 100,000 |
| **Uniswap Router Swap** | 120,000 —180,000 | > 200,000 |
---

# Web3 Full-Stack Development Skill Package v3
> **Visual Manifest**: [Axiom Core Zenith Billboard](../_core_axioms/dashboards/zenith_billboard.html)

## 0️⃣ Tokenomics Inversion Layer & Macro-Economic Sandbox [Inversion]


> **Pattern: Inversion**. DO NOT write a single line of Solidity before interviewing the user on these 3 critical axes:
1. **Utility & Supply**: Fixed vs. Elastic— Governance vs. Payment—
2. **Access Control**: Ownable, Role-Based, or DAO-controlled—
3. **Escrow & Vesting**: Mandatory lock periods or linear cliff—

**Web3 Tokenomics Sandbox Simulation (Mandate)**: Before generating any token contract representing financial value, AI MUST mathematically simulate and output an "Economic Extinction Scenario" (e.g., extreme bear market bank-run, inflation death spiral). Only proceed coding if the economic model proves mathematically resilient against these catastrophic edge cases.

Ask one question at a time. Wait for response before proceeding.

---

## 🧘 Security First: The Forge Protocol

| Requirement | Target File |
|------|---------|
| Solidity Contract Structure / Data Types / Gas Optimization | `references/solidity-core.md` |
| ERC-20 / ERC-721 / ERC-1155 / ERC-4626 Full Implementation | `references/solidity-patterns.md` |
| Frontend: wagmi v2 / viem / RainbowKit | `references/frontend-wagmi.md` |
| Frontend: ethers.js v6 / Native Web3 | `references/frontend-ethersjs.md` |
| IPFS Storage / The Graph Query | `references/data-infra.md` |
| DeFi: Uniswap V3/V4 / Aave / ERC-4626 | `references/defi.md` |
| NFT: ERC-721A / Whitelist / Dynamic NFT / Marketplace | `references/nft.md` |
| Security Audit / Vulnerability Protection / Attack Cases | `references/security.md` |
| Testing: Hardhat / Foundry / Fuzz / Invariant | `references/testing.md` |
| Deployment / Verification / Multi-chain / Upgradable | `references/deploy.md` |
| Account Abstraction (EIP-4337)| `references/account-abstraction.md` |
| Layer2 Deployment Diffs (Arbitrum/OP/Base/zkSync)| `references/l2-deployment.md` |
| Cross-chain Messaging (LayerZero / CCIP / Security)| `references/crosschain.md` |
| Toolchain: TypeChain / wagmi CLI / CI-CD / Defender | `references/toolchain.md` |

## 🗂️—Routing by Project Type

**NFT Project (PFP / Art / Game Items)**
→ `nft.md` + `security.md §1,§6` + `deploy.md §Verification`

**DeFi Protocol (DEX / Lending / Yield)**
→ `defi.md` + `solidity-patterns.md §ERC-4626` + `security.md §4,§5` + `testing.md §fork`

**dApp Frontend (React/wagmi)**
→ `frontend-wagmi.md` + `data-infra.md`

**Gasless / AA Experience**
→ `account-abstraction.md` + `frontend-wagmi.md §5 AA`

**Multi-chain / L2 Deployment**
→ `l2-deployment.md` + `deploy.md §Multi-chain`

**Cross-chain Protocol**
→ `crosschain.md` + `crosschain.md §4 Cross-chain Security`

**Security Audit / Code Review**
→ `./references/security.md` (Full) + `./references/toolchain.md` §Slither + `./red_team/smart-contract-audit.md` (Red Team Protocol -> MUST execute `node tools/run-slither.js` if available)

**New Project from Scratch**
→ `deploy.md §Framework Selection` + `toolchain.md §CI-CD` + `solidity-core.md`

**Full DApp (Contract + Backend + Frontend) —FSPC Dispatch Required**
→ This scope exceeds web3-core alone. AI MUST recommend activating `product-core` (FSPC) as the orchestrator:
  1. FSPC handles full-stack scaffold (PRE-FLIGHT gates)
  2. web3-core is dispatched for contract domain
  3. ADBM handles off-chain backend (indexer, relay)
  4. DDFM/mobile-core handles dApp frontend
  If user declines FSPC, proceed independently but warn: "Cross-skill consistency is not guaranteed without FSPC orchestration."

---

## Core Principles

1. **Security First** —CEI Pattern + `nonReentrant`; sensitive functions MUST have access control.
2. **Gas Efficiency** —Storage operations are the most expensive; prefer `calldata`; make good use of `immutable` and custom `error`.
3. **Standard Priority** —OpenZeppelin v5; do not reinvent the wheel.
4. **Brand & UI Accuracy** —Mandate **Phosphor Icons v2.1** for all general UI elements to maintain cross-ecosystem consistency. Use **Simple Icons** EXCLUSIVELY for Coin, Chain, and Blockchain Brand logos.
5. **Dependency Version Confirmation** —At the START of every session, AI MUST run:
   ```sh
   npm ls wagmi viem ethers @openzeppelin/contracts 2>/dev/null | head -20
   ```
   If the user's environment cannot be checked, EXPLICITLY ASK before generating any code. Version mismatch is the #1 cause of Web3 compilation errors.
5. **Test Coverage** - Unit + Fuzz + Invariant + Fork; Coverage > 95%. AI MUST explicitly refuse to write `wagmi` frontend hooks or integration code if smart contract test coverage is < 90%.
6. **Type Safety** —TypeChain or wagmi CLI codegen to auto-generate ABI bindings.
7. **Explicit Versions** —Code MUST annotate OZ version (v4/v5), wagmi version (v1/v2) in comments.
8. **Optimistic Projection (DeFi UX)** —Any state-mutating transaction MUST trigger an Optimistic UI state on the frontend *before* block confirmation, coupled with a defined 'waiting for network' companion animation to eliminate user anxiety.
9. **Visual Delta Simulation (Anti-Blind-Signing)** —Hard requirement for pre-flight transaction simulation. Users MUST be shown exact balance changes (in fiat/token amounts) using **Visual Delta** displays (e.g. Magic UI Shimmer/Beam effects) to provide human-readable intent BEFORE they press "Sign/Confirm".

---
## 🌐 Federated Handoff & Global Nexus Protocol
> **MUST READ**: `view_file(../_core_axioms/protocols/KERNEL_BOOTSTRAP.md)` —Inherit Global Nexus, Architectural Sovereign, and Soul Manifesto rules.
> **Standard Gates**: `view_file(../_core_axioms/protocols/STANDARD_GATES.md)` —Inherit 3-Axis Soul Diagnostic and Rejection Gate.

1. **State Injection —web3_context Write-Back**: After contract design is finalized, AI MUST write to `PROJECT_NEXUS.json.sub_skill_outputs.web3_core`:
```json
{
  "active": true,
  "contracts": [{ "name": "MyToken", "path": "contracts/MyToken.sol" }],
  "network": "mainnet|testnet|local",
  "oz_version": "v5",
  "wagmi_version": "v2",
  "contract_addresses": { "MyToken": "0x..._after_deploy" },
  "abi_registry": ["artifacts/contracts/MyToken.sol/MyToken.json"],
  "audit_status": "pending|complete",
  "status": "complete"
}
```
  This enables frontend (DDFM/mobile-core) to auto-connect to contracts without manual copy-paste.
3. **Independence Declaration**: Even if sniffing fails, this package will **NEVER throw an error**, but instead continue to perfectly execute smart contract tasks as an independent Web3 specialist.

---

## 🛡️ Zenith Ascension: Compilation Integrity & Autonomous Auto-Healing
- **Zero-Error Initialization (Sandbox Init)**: Before compiling any contract or initializing Hardhat/Foundry, AI MUST run a relative path script (e.g., `node ../backend-core/tools/sandbox-init.js` or `sh ./scripts/verify-web3-env.sh`) to assert dependencies, quietly install missing tools, and verify compiler versions.
- **Standalone Capability**: In the absence of `product-core`, `web3-core` MUST degrade gracefully and function independently using internal minimal setups.
- **Path Protocol**: AI MUST use relative paths across all environments and scripts (invoke `node tools/path_resolver.js`). Cross-skill dependencies MUST NOT assume global configurations.
- **Zero-Wait Security Loop**: Smart contract compilation (Foundry/Hardhat) and static analysis (Slither) MUST function as an autonomous self-healing loop.
- **Testing Mandate**: The `tests/` directory MUST contain Hardhat or Foundry coverage cases capable of passing locally. If `npm test` or `forge test` fails initially, AI MUST auto-correct.
- **Execution Mandate**: If contract compilation fails due to version mismatch or Slither flags a critical warning, AI MUST NEVER halt to wait for user instructions. It MUST loop-fix the AST constraints dynamically, invoking validation using locally referenced shell scripts (e.g., `./scripts/compile-validate.sh`), ensuring the user only observes a flawless, audited contract deployment.

## 🛡️ Zenith Ascension II: Zero-Warning Audits & Autonomous Fuzzing
- **Intrinsic Correction Loop**: Development in Web3 enforces a zero-tolerance policy for compiler warnings. If a static analyzer (like `slither`) outputs ANY warnings, AI MUST transparently initiate an autonomous internal function-calling loop.
- **Machine-Driven Remediation**: AI MUST mutate and patch the Solidity AST recursively against the analyzer's output until absolute silence (zero unacknowledged warnings) is achieved BEFORE delivering the contract to the user.

## 🛡️ Zenith Ascension III: Invariant & Formal Verification (The Absolute Law)
- **Mandate**: Unit tests and fuzz tests are statistics; Invariant and Formal Verification are mathematics. For any contract handling > $100K TVL, AI MUST establish mathematical proof of state boundaries.
- **Invariant Testing (Foundry)**: AI MUST define `invariant_` test suites that aggressively fuzz the entire contract state machine simultaneously, asserting core invariants (e.g., `totalSuppy == sum(balances)` or `vault.assets >= shares.redeemable`).
- **Formal Verification Tooling**: AI MUST integrate `Certora Prover` or `Halmos` rules (`run-halmos.js` / `.spec` files) enforcing path-independent logic proofs. A contract is not "secure" until its mathematical constraints are formally verified against property violations.
- **Execution Block**: AI explicitly rejects deploying any financial mechanism to Mainnet without a passing Invariant Test suite mapped to the core economic model.

## 🛡️ Zenith Ascension IV: Asset Safety & ABI Token Shield
- **Asset Safety Protocol (Privilege Escalation Guard)**: Before generating deployment scripts, AI MUST scan the final contract AST for excessive Owner privileges (e.g., arbitrary minting, unprotected withdraws of user funds). If detected, AI MUST trigger a `[Security Block]` and refactor the code toward decentralized patterns (like Timelocks or Multisig limits) unless explicitly whitelisted by the user.
- **ABI Token Efficiency**: AI MUST NEVER load or transmit full, unminified `ABI.json` files containing thousands of lines of AST boilerplate. When passing ABI to the frontend (`DDFM`), AI MUST extract and pass only the exact Human-Readable ABI signatures (e.g., `function transfer(address to, uint256 amount)`) to prevent critical token window exhaustion.

> **[TOKEN OPTIMIZATION]** To reduce context load, the Full Pre-Flight Security Checklist (MEV, Reentrancy, ZKP Readiness) and Exploit Hall of Fame have been moved.
> **AI MUST load:** `view_file(references/security.md)` §11 to complete the final security check before submission.

> Full attack patterns in `./references/security.md`. 
> **[TOKEN OPTIMIZATION]** AI MUST NOT burn tokens manually reading `./references/security.md` for standard vulnerabilities like Reentrancy. You MUST execute `node tools/audit-skill.js [target_path]` or `slither .` to perform deterministic AST analysis of the contract. Only read `./references/security.md` if addressing advanced MEV or logical architecture issues.
> **[SELF-EVOLUTION MANDATE]**: If the AI discovers a new or previously undocumented Reentrancy or MEV attack vector within the project context, it MUST proactively append the structural defense pattern to `./references/security.md` to harden the global ecosystem for future sessions.

---

## Quick Debugging Commands

```bash
forge test -vvvv --match-test testXxx    # Detailed stack trace
forge snapshot --diff                    # Gas diff comparison
forge coverage --report lcov             # Coverage
cast trace <txhash> --rpc-url <rpc>     # Trace on-chain transaction
cast storage <addr> <slot> --rpc-url <rpc>
npx hardhat test --grep "Description text"
```

---

## Template Files (Direct Reuse)

| Template | Purpose | When to Use |
|------|------|---------|
| `assets/templates/hardhat.config.ts` | 9-chain multi-network config | Initializing Hardhat project |
| `assets/templates/foundry.toml` | Fuzz + IR optimization config | Initializing Foundry project |
| `assets/templates/.env.example` | Template for all service keys | Project init, copy as `.env` |
| `assets/templates/deploy.s.sol` | Foundry deployment script skeleton | Writing deployment scripts |
| `assets/templates/.github/workflows/ci.yml` | Full CI pipeline | Repo initialization |
| `assets/templates/.github/workflows/pr-check.yml` | PR Gas check pipeline | Repo initialization |

## Changelog

| Version | Date | Summary |
|---|---|---|
| v10.2 | 2026-03-20 | Zenith: Global English cleanup, ASCII standardization, version aligned. |
| v3.1 | 2026-03-09 | Renamed references/ for OS unification. Added Global Nexus Protocol. |
| v3.0 | 2026-02-28 | Initial release. 14 doc files: solidity-core, patterns, security, DeFi, NFT, testing, deploy, AA, L2, crosschain, toolchain, data-infra, wagmi, ethersjs. Template assets. |

---

## Changelog

| Version | Date | Summary |
|---|---|---|
| v10.2 | 2026-03-20 | Zenith Refined: Global English cleanup and ASCII standardization. |
| v10.1 | 2026-03-09 | Initial v10.0 release. |
