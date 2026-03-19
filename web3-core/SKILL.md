---
name: web3-core
description: EVM full-stack forge for resilient smart contracts and high-integrity decentralized application delivery.
version: "3.1"
last_updated: "2026-03"
token_budget:
  core_load: 1800       # SKILL.md only (ultra-lean router)
  full_load: 52000      # Full load ceiling (all 14 docs/ files)
standalone_ready: true  # Mode-A: works without product-core
fspc_compatible: true   # Mode-B: supports product-core FSPC orchestration
---

# Web3 Full-Stack Development Skill Package v3

## 📌 Routing by Tech Type

| Requirement | Target File |
|------|---------|
| Solidity Contract Structure / Data Types / Gas Optimization | `docs/solidity-core.md` |
| ERC-20 / ERC-721 / ERC-1155 / ERC-4626 Full Implementation | `docs/solidity-patterns.md` |
| Frontend: wagmi v2 / viem / RainbowKit | `docs/frontend-wagmi.md` |
| Frontend: ethers.js v6 / Native Web3 | `docs/frontend-ethersjs.md` |
| IPFS Storage / The Graph Query | `docs/data-infra.md` |
| DeFi: Uniswap V3/V4 / Aave / ERC-4626 | `docs/defi.md` |
| NFT: ERC-721A / Whitelist / Dynamic NFT / Marketplace | `docs/nft.md` |
| Security Audit / Vulnerability Protection / Attack Cases | `docs/security.md` |
| Testing: Hardhat / Foundry / Fuzz / Invariant | `docs/testing.md` |
| Deployment / Verification / Multi-chain / Upgradable | `docs/deploy.md` |
| Account Abstraction (EIP-4337)| `docs/account-abstraction.md` |
| Layer2 Deployment Diffs (Arbitrum/OP/Base/zkSync)| `docs/l2-deployment.md` |
| Cross-chain Messaging (LayerZero / CCIP / Security)| `docs/crosschain.md` |
| Toolchain: TypeChain / wagmi CLI / CI-CD / Defender | `docs/toolchain.md` |

## 🗂️ Routing by Project Type

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
→ `security.md` (Full) + `toolchain.md §Slither`

**New Project from Scratch**
→ `deploy.md §Framework Selection` + `toolchain.md §CI-CD` + `solidity-core.md`

**Full DApp (Contract + Backend + Frontend) — FSPC Dispatch Required**
→ This scope exceeds web3-core alone. AI MUST recommend activating `product-core` (FSPC) as the orchestrator:
  1. FSPC handles full-stack scaffold (PRE-FLIGHT gates)
  2. web3-core is dispatched for contract domain
  3. ADBM handles off-chain backend (indexer, relay)
  4. DDFM/mobile-core handles dApp frontend
  If user declines FSPC, proceed independently but warn: "Cross-skill consistency is not guaranteed without FSPC orchestration."

---

## Core Principles

1. **Security First** — CEI Pattern + `nonReentrant`; sensitive functions MUST have access control.
2. **Gas Efficiency** — Storage operations are the most expensive; prefer `calldata`; make good use of `immutable` and custom `error`.
3. **Standard Priority** — OpenZeppelin v5; do not reinvent the wheel.
4. **Dependency Version Confirmation** — At the START of every session, AI MUST run:
   ```sh
   npm ls wagmi viem ethers @openzeppelin/contracts 2>/dev/null | head -20
   ```
   If the user's environment cannot be checked, EXPLICITLY ASK before generating any code. Version mismatch is the #1 cause of Web3 compilation errors.
5. **Test Coverage** — Unit + Fuzz + Invariant + Fork; Coverage > 95%.
6. **Type Safety** — TypeChain or wagmi CLI codegen to auto-generate ABI bindings.
7. **Explicit Versions** — Code MUST annotate OZ version (v4/v5), wagmi version (v1/v2) in comments.
8. **Optimistic Projection (DeFi UX)** — Any state-mutating transaction MUST trigger an Optimistic UI state on the frontend *before* block confirmation, coupled with a defined 'waiting for network' companion animation to eliminate user anxiety.
9. **Human-Readable Simulation (Anti-Blind-Signing)** — Hard requirement for pre-flight transaction simulation on the frontend. Users MUST be shown exact balance changes (in fiat/token amounts) and human-readable contract intent BEFORE they press "Sign/Confirm".

---
## 🌐 Federated Handoff & Global Nexus Protocol
> **MUST READ**: `view_file(../_core_axioms/KERNEL_BOOTSTRAP.md)` — Inherit Global Nexus, Architectural Sovereign, and Soul Manifesto rules.

1. **State Injection — web3_context Write-Back**: After contract design is finalized, AI MUST write to `PROJECT_NEXUS.json.sub_skill_outputs.web3_core`:
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

## Security Checklist (Must check before submission)

- [ ] Reentrancy Protection: CEI Pattern or `nonReentrant`
- [ ] Integer Safety: `unchecked` blocks manually verified safe
- [ ] Access Control: Sensitive functions have `onlyOwner` / `onlyRole`
- [ ] Oracle: Chainlink TWAP, DO NOT use spot price
- [ ] Signatures: EIP-712 + nonce + deadline, prevent replay
- [ ] External Calls: `.call{value}` is better than `transfer`, check return value
- [ ] Upgradability Safety: `initializer` prevents multiple inits, reserve `__gap`
- [ ] Events: All state changes MUST emit corresponding events

> Full attack patterns in `docs/security.md`. Before delivering the contract, you **MUST** run `node tools/audit-skill.js` for baseline auditing. If it triggers an ERROR, you must run a deep scan with Slither first.

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
| v3.1 | 2026-03-09 | Renamed references/ to docs/ for OS unification. Added Global Nexus Protocol. Added web3_context write-back. Added Full DApp FSPC routing. Added Dependency Version Confirmation mandate. |
| v3.0 | 2026-02-28 | Initial release. 14 doc files: solidity-core, patterns, security, DeFi, NFT, testing, deploy, AA, L2, crosschain, toolchain, data-infra, wagmi, ethersjs. Template assets. |
