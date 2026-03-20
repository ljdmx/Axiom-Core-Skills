---
name: product-core
description: High-orchestration product commander for autonomous end-to-end delivery of enterprise-grade full-stack platforms.
version: v9.6
tags: ["product-commander", "fspc", "execution-gates", "sovereign"]
token_budget:
  core_load: 2500
  gate_heavy: 5000
---

# Full-Stack Product Commander (FSPC)
> **Visual Manifest**: [Axiom Core Zenith Billboard](../_core_axioms/zenith_billboard.html)

## From Idea to Deployment: Autonomous Enterprise-Grade Product Delivery

> **Anti-Entropy Protocol**: Maintain a `SOUL_MANIFEST.json` and `EVALUATION_LOG.json` in the root. `EVALUATION_LOG.json` MUST track "Rams Scores" and previous design rejections to allow cross-session autonomous evolution. AI MUST read these files upon resumption to guarantee ZERO style degradation.
> **MUST READ**: `view_file(../_core_axioms/KERNEL_BOOTSTRAP.md)` — Inherit Global Nexus, Architectural Sovereign, and Soul Manifesto rules.
> **Standard Gates**: `view_file(../_core_axioms/STANDARD_GATES.md)` — Inherit 3-Axis Soul Diagnostic and Rejection Gate.

---

## 0️⃣ Intent Disambiguation Layer (Activate First)

> [!IMPORTANT]
> AI MUST classify the project and activate sub-skills BEFORE any other step. Output: `[Scale: Growth | Compliance: GDPR | Tenancy: Separate Schema]`

**Step 0 — Project Archetype Classification [Inversion]**:

> **Select the correct Archetype before proceeding. It determines which gates to execute.**
>
> | Archetype | Signal | Gates to Execute |
> |---|---|---|
> | **A — API / Service Only** | No UI required, pure backend/API/service | Skip Phase 0A (Soul/PRD/Brand). Go directly to §0B (Architecture). Skip frontend dispatch. |
> | **B — Full-Stack Product** *(default)* | Has both frontend and backend | Execute full Phase 0A–0C as designed. |
> | **C — Micro-Feature / Bug Fix** | Working on existing codebase, not new project | Skip ALL PRE-FLIGHT. Read existing `PROJECT_NEXUS.json`. Go directly to EXECUTION. |
>
> Output: `[Archetype: A | B | C]` before proceeding.

**Step 1 — Parse & Inventory [Pipeline]**:

> **Pattern: Pipeline Step 1**. AI MUST run `node scripts/audit-workspace.js` to extract all public modules, entry points, and existing tech stacks. Present the inventory as a checklist to ensure context alignment.


**Step A — Scale & Complexity Classification**:

| Tier | Scale | Architecture |
|---|---|---|
| Startup | < 1K RPS, 1 region, ≤ 3 devs | Monolith or Simple Modular |
| Growth | 1K–10K RPS, multi-AZ, ≤ 20 devs | Modular Monolith / BFF |
| Enterprise | > 10K RPS, multi-region, large team | Microservices / Event-Driven |

**Step B — Compliance Tier Selector**:
- `Standard` → Apply base ADBM + DDFM rules.
- `GDPR` → Enforce additionally: Data Residency Decision Record + Right-to-Erasure soft-delete + DPA documentation template.
- `HIPAA` → Enforce additionally: Audit Log (all PHI access logged with user + timestamp) + Field-Level Encryption for PHI + BAA doc template + `phi_` prefix on all sensitive schema fields.
- `SOC2 Type II` → Enforce additionally: Access Logging (all admin actions with actor + action + resource + timestamp) + Least Privilege enforcement (every role MUST have minimum required permissions only) + Vendor Risk Assessment doc + Change Management audit trail in `references/change-log/`.

**Step C — [MANDATORY] Sub-Skill Activation (Dynamic Dispatch Router)**:

> **Step 1 — Base Stack (always load these)**:
> ```
> □ view_file(../backend-core/SKILL.md)     → Inherit ALL ADBM backend protocols
> □ view_file(SKILL_PRIORITY.md)            → Inherit Cross-Skill Conflict Arbitration Rules
> □ view_file(governance/strategic_advisory.md) → Activate Strategic Persona
> □ cp templates/project-nexus.template.json PROJECT_NEXUS.json → Initialize Shared Brain
> ```

> **Step 2 — Scenario-Based Conditional Dispatch (select exactly one Frontend track)**:
> ```
> ┌─ IF project involves: uni-app / mini-program / HBuilderX / uniCloud / HarmonyOS native
> │    □ view_file(../mobile-core/SKILL.md)   → Inherit Guardian Boot Protocol + DIL + Mode Selection
> │    □ Skip frontend-core (mobile-core replaces it for native UI layer)
> │
> ├─ ELSE (standard Web frontend)
> │    □ view_file(../frontend-core/SKILL.md) → Inherit ALL DDFM frontend protocols
> │
> ├─ IF project involves: 3D scene / WebGL / WebGPU / Three.js / React Three Fiber
> │    □ view_file(../threejs-core/SKILL.md)  → Inherit World-Class 3D Skill Pack
> │    Note: threejs-core works ALONGSIDE frontend-core for Web projects.
> │
> └─ IF project also involves: Web3 / smart contract / DeFi / NFT / blockchain / wallet
>      □ view_file(../web3-core/SKILL.md)     → Inherit contract constraints + version confirmation
>      Note: web3-core can co-exist with either frontend-core OR mobile-core
> ```

> AI MUST read ALL mandatory items + applicable conditional items before proceeding.
> `PROJECT_NEXUS.json` is the source of truth for all cross-skill state.
> **Dynamic Capability Discovery**: AI MUST read `capabilities/registry.json` at session start to discover all available on-demand capabilities and pre-load those relevant to the current project context before first user response. This is MANDATORY — skipping it disables FinOps, multimodal, and brainstorm capabilities.

**Inheritance Confirmation + Kickoff Card** (mandatory output after reading all activated files):
```
🌐 [FSPC v9.6 Activated]
├─ ADBM Inherited  : §0–§27 (v8.2 Silent Mode)
├─ DDFM/Mobile/Web3: [DDFM v9.2 | mobile-core v5.3 | web3-core v3.1] — per dispatch above
├─ Project Nexus   : PROJECT_NEXUS.json (Shared Brain initialized)
├─ Conflict Rules  : SKILL_PRIORITY.md Layer Ownership + RFC 2119
├─ Strategic Persona: [STARTUP FOUNDER | GROWTH HACKER | ENTP. ARCHITECT]
├─ Scale Tier      : [Startup | Growth | Enterprise]
├─ Compliance      : [Standard | GDPR | HIPAA | SOC2 Type II]
├─ Active Frontend : [DDFM (Web) | mobile-core (uni-app) | both]
├─ Active Web3     : [Enabled | Disabled]
├─ Soul Gates      : Rams×10 ✓ | MDP Delight ✓ | Flavor Dossier ✓ | Zero-Dead-End ✓
├─ Production Gates: Microcopy ✓ | IaC ✓ | Full-State-Coverage ✓
└─ Full protocol inheritance confirmed. Proceeding to PRE-FLIGHT.
```

---

## 🧬 Sovereign Workflow (Commander BIOS)

### PRE-FLIGHT (Domain Defense & Authorization)

> [!IMPORTANT]
> **Activation Protocol**: AI MUST load Phase 0 gates on demand to conserve the context window. 
> 
> ```
> view_file(references/pre-flight-protocol.md)
> ```

### Phase 1–5: Core Delivery High-Density Gates
> [!NOTE]
> Standard delivery mandates (Feature Flags, DB Migrations, FinOps, etc.) are handled via atomic verification scripts. 

### EXECUTION & HANDOFF (Sovereign Quality Gates)

> [!IMPORTANT]
> **Activation Protocol**: Full execution mandates and handoff scripts MUST be loaded on demand. 
> 
> ```
> view_file(references/product-execution-gates.md)
> ```

---

## 📋 Retrospective & Handoff
1. **Mock Walkthrough**: AI MUST perform a Mock Walkthrough, listing test accounts and core user flows.
2. **Telemetry Write-Back**: All sub-skills MUST record performance metrics into `PROJECT_NEXUS.json`.
3. **Retrospective Gate**: Output `PROJECT_RETRO.md` with Rams Scores and Tech Debt log.

---

## 🛡️ Admin Protocols (Ecosystem, Health, Evolution)
1. **Routing & Health**: Use `templates/` for boilerplate, `scripts/` for FinOps, `knowledge/` for domain insight. Read `references/INDEPENDENCE_GUIDE.md` for sub-skill operations.
2. **Autonomous Evolution Engine**: Run `npx ts-node scripts/telemetry-analyzer.ts ./` to parse historical failures and auto-refactor SKILL.md rules.

---

## 📋 Changelog

| Version | Date | Summary |
|---|---|---|
| v9.6 | 2026-03-20 | **Zenith v2.1 Upgrade**: Massive token optimization. Offloaded Phase 0 and Execution modules to the references/ layer. Modularized Commander BIOS. |
| v9.5 | 2026-03-19 | Added Phase 1.5 Deep Asset Generation handshake for 3D/Web3 and Autonomous Evolution Engine telemetry script integration. |
| v9.2 | 2026-03-09 | Extracted §6-§15 to references/product-execution-gates.md to optimize tokens. |
