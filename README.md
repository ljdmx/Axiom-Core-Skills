# 🌌 Axiom Core Skills

[![Architecture Tier](https://img.shields.io/badge/Architecture-V10%20Agentic-purple?style=for-the-badge)](https://github.com/your-username/Axiom-Core-Skills)
[![Zero-Error Shield](https://img.shields.io/badge/AST%20Dry--Run-Protected-success?style=for-the-badge)](https://github.com/your-username/Axiom-Core-Skills)
[![Philosophy](https://img.shields.io/badge/Philosophy-SOUL%20Manifesto-blue?style=for-the-badge)](https://github.com/your-username/Axiom-Core-Skills)

> *Beyond simple code generation. Comprehensive Agent-Oriented Architecture.*  
> Axiom Core Skills is an advanced, modular framework designed to equip any LLM Agent with the tools for autonomous orchestration, self-correction, and robust Full-Stack development.

## 🚀 Core Philosophy
Axiom operates on three foundational paradigms:
1. **Design-Driven Fidelity**: Strict adherence to consistent visual design. A single vector icon set (`Lucide`/`Phosphor`), uniform styling, and deliberate kinetic interactions, rather than generic bootstrap templates.
2. **Robust Backend Infrastructure**: Secure and scalable backend execution featuring Infrastructure-as-Code (IaC) generation (`Terraform` / `Pulumi`), local `tflint` integration, and AST compile guards to minimize runtime failures.
3. **Physical & Spatial Interaction**: Applications meant to feel engaging and natural. Enforces physics-bound motion (`kinetics-state`), Z-depth spatial awareness (for WebXR), and native haptic feedback on mobile interfaces.

---

## 📂 Repository Structure

The framework architecture is highly modularizing, isolating intent, design, and execution.

```text
Axiom-Core-Skills/
|   init.bat                                      # Windows CMD memory wiping executable wrapper
|   init.js                                       # Node.js cross-platform environment wipe logic
|   init.py                                       # Python cross-platform environment wipe logic
|   init.sh                                       # Bash environment reset and formatting script (Linux/Mac)
|   README.md                                     # Global documentation (English)
|   README_CN.md                                  # Global documentation (Chinese)
|
+---backend-core
|   |   divine_interface.md                       # Backend architectural constraints and database rules
|   |   SKILL.md                                  # Core skill configuration and generative instructions
|   |
|   +---blueprints
|   |   +---enterprise-rbac
|   |   |       README.md                         # Global documentation (English)
|   |   |
|   |   +---go-microservice
|   |   |       README.md                         # Global documentation (English)
|   |   |
|   |   +---java-spring-boot
|   |   |       README.md                         # Global documentation (English)
|   |   |
|   |   +---nestjs-modular-monolith
|   |   |       README.md                         # Global documentation (English)
|   |   |
|   |   +---payment-integrations
|   |   |       README.md                         # Global documentation (English)
|   |   |
|   |   \---python-fastapi-serverless
|   |           README.md                         # Global documentation (English)
|   |
|   +---docs
|   |   +---domain-auth
|   |   |       backend-rules-advanced.md         # Advanced security and authentication logic
|   |   |
|   |   +---domain-infra
|   |   |       protocols.md                      # TCP/UDP, gRPC, and REST/GraphQL interface standards
|   |   |       tech-debt-template.md             # Technical debt tracking and mitigation template
|   |   |
|   |   \---domain-schema
|   |           adr-template.md                   # Architecture Decision Record (ADR) template
|   |
|   +---red_team
|   |       security_audit.ts                     # Automated penetration testing and fuzzing utility
|   |
|   +---scripts
|   |       db-init.js                            # Database schema initialization script
|   |       smart-config.js                       # Environment variable validation script
|   |
|   +---templates
|   |   |   _meta.json                            # Template metadata and LLM routing rules
|   |   |
|   |   +---go
|   |   |   \---gin
|   |   |           auth_handler.go               # Go Gin OAuth/JWT handler template
|   |   |           main.go                       # Go application entrypoint template
|   |   |           models.go                     # Go GORM database models template
|   |   |
|   |   +---java
|   |   |   \---spring-boot
|   |   |           AuthController.java           # Spring Boot authentication controller
|   |   |           GlobalExceptionHandler.java   # Global error interceptor
|   |   |           SecurityConfig.java           # Spring Security filter chains
|   |   |
|   |   +---python
|   |   |   \---fastapi
|   |   |           auth_router.py                # FastAPI JWT routing template
|   |   |           database.py                   # SQLAlchemy/Tortoise ORM setup
|   |   |           main.py                       # FastAPI application entrypoint
|   |   |
|   |   \---typescript
|   |       +---controllers
|   |       |       auth.controller.ts            # TypeScript auth logic
|   |       |       crud.controller.ts            # Generic CRUD controller template
|   |       |
|   |       +---routes
|   |       |       rest.routes.ts                # RESTful API routing template
|   |       |
|   |       \---services
|   |           |   generic.service.ts            # Generic repository service
|   |           |
|   |           \---logging
|   |                   logger.service.ts         # Winston/Pino logging service
|   |
|   \---tools
|           audit-skill.js                        # AST Sandbox logic and dry-run verifier
|
+---frontend-core
|   |   SKILL.md                                  # Core skill configuration and generative instructions
|   |
|   +---docs
|   |       a11y-checklist.md                     # WCAG 2.1 Accessibility compliance rules
|   |       design-math.md                        # Golden ratio and sizing scale calculations
|   |       design-philosophy.md                  # Core Dieter Rams / Apple design philosophy
|   |       design-token-system.md                # CSS variable and theme token definition
|   |       frontend-rules-extended.md            # Extended rules for DOM manipulation
|   |       kinetics-state.md                     # Spring physics and animation timings
|   |       MANIFEST.md                           # Frontend aesthetic and development manifesto
|   |       visual-excellence.md                  # Typography, whitespace, and color theory
|   |
|   +---templates
|   |   |   _meta.json                            # Template metadata and LLM routing rules
|   |   |
|   |   +---animations
|   |   |       micro-interactions.md             # Hover, active, and focus state interaction logic
|   |   |
|   |   +---components
|   |   |       data-table.tsx                    # Virtualizing responsive data table component
|   |   |       error-boundary.tsx                # React Error Boundary fallback UI component
|   |   |       loading-spinner.tsx               # SVG micro-animated loading indicator
|   |   |
|   |   +---forms
|   |   |       multi-step-checkout.md            # Multi-step e-commerce checkout flow design
|   |   |
|   |   +---layouts
|   |   |       dashboard.layout.tsx              # Sidebar + Header dashboard layout
|   |   |
|   |   +---pages
|   |   |       login.page.tsx                    # Authentication entry page template
|   |   |
|   |   +---ui-kits
|   |   |       minimalist-luxury.md              # Clean, whitespace-heavy design system
|   |   |       premium-dark-theme.md             # OLED-optimized dark mode design system
|   |   |
|   |   \---utils
|   |           api-client.ts                     # Axios/Fetch wrapper with interceptors
|   |
|   \---tools
|           aesthetic-scorer.js                   # Visual regression and layout quality evaluator
|           audit-skill.js                        # AST Sandbox logic and dry-run verifier
|
+---mobile-core
|   |   SKILL.md                                  # Core skill configuration and generative instructions
|   |
|   +---docs
|   |   |   components.md                         # Mobile-specific UI components (Bottom Sheets, etc)
|   |   |   design-advanced.md                    # Advanced gesture handling and multi-touch
|   |   |   design.md                             # iOS HIG / Material Design baseline rules
|   |   |   publishing.md                         # App Store / Google Play deployment checklist
|   |   |
|   |   +---classic
|   |   |       classic.md                        # Cross-platform bridge optimization rules
|   |   |
|   |   \---uts
|   |           uni-app-x.md                      # Vue 3 + UTS native compilation rules
|   |
|   \---tools
|           audit-skill.js                        # AST Sandbox logic and dry-run verifier
|
+---product-core
|   |   SKILL.md                                  # Core skill configuration and generative instructions
|   |   SKILL_PRIORITY.md                         # Defines execution priority for multi-agent workflows
|   |
|   +---capabilities
|   |       registry.json                         # Index of all available sub-agent commands
|   |
|   +---docs
|   |       INDEPENDENCE_GUIDE.md                 # Guide on running agents autonomously
|   |       MANIFEST.md                           # Frontend aesthetic and development manifesto
|   |       pivot-intelligence.md                 # Logic for pivoting requirements mid-sprint
|   |       product-execution-gates.md            # Quality gates required before moving phases
|   |
|   +---governance
|   |       strategic_advisory.md                 # High-level software architecture advisory
|   |
|   +---knowledge
|   |       business-intelligence.md              # Rules for SaaS metrics and KPI tracking
|   |
|   +---scripts
|   |       auto-fix.js                           # Auto-patcher for lint and type errors
|   |       deploy-wizard.js                      # Interactive deployment CLI script
|   |       telemetry-analyzer.ts                 # Background script tracking code evolution anomalies
|   |       validate.js                           # Pre-commit validation hook script
|   |
|   +---templates
|   |   |   ci-cd-pipelines.md                    # GitHub Actions / GitLab CI templates
|   |   |   product-brief.template.md             # Template for initial PRD generation
|   |   |   product-spec.template.md              # Detailed technical specification template
|   |   |   project-nexus.template.json           # Initial schema for project handoff
|   |   |   project-plan.template.md              # Agile sprint planning template
|   |   |
|   |   +---monorepo-full-stack
|   |   |   |   package.json                      # Monorepo workspace dependencies
|   |   |   |   README.md                         # Global documentation (English)
|   |   |   |
|   |   |   \---scripts
|   |   |           db-migrate.js                 # Database migration runner
|   |   |           db-seed.js                    # Database mock data seeder
|   |   |           deploy.js                     # Monorepo deployment orchestrator
|   |   |           dev.js                        # Local development server runner
|   |   |           setup.js                      # Environment initialization script
|   |   |           test.js                       # Jest/Vitest test runner
|   |   |
|   |   +---react-spring-boot
|   |   |       README.md                         # Global documentation (English)
|   |   |
|   |   \---vue-nestjs-monorepo
|   |           README.md                         # Global documentation (English)
|   |
|   \---tools
|           audit-skill.js                        # AST Sandbox logic and dry-run verifier
|           ecosystem-validator.js                # Verifies correct interaction between core modules
|
+---threejs-core
|   |   SKILL.md                                  # Core skill configuration and generative instructions
|   |
|   \---docs
|           advanced-shaders.md                   # GLSL / TSL shader authoring guidelines
|           boilerplates.md                       # Three.js / React Three Fiber setup code
|           diagnostics.md                        # WebGPU frame-rate and memory leak debugging
|           mobile-xr.md                          # Mobile WebXR AR/VR constraints
|           particles.md                          # Instanced mesh and Compute Shader particle limits
|           patterns-catalog.md                   # Common 3D interaction patterns
|           physics.md                            # Rapier / Cannon.js physics integration rules
|           red-lines.md                          # Strict FORBIDDEN performance violations
|           visual-language.md                    # Post-processing and lighting aesthetic rules
|           webgpu.md                             # WebGPU modern rendering pipelines
|
+---web3-core
|   |   SKILL.md                                  # Core skill configuration and generative instructions
|   |
|   +---assets
|   |   \---templates
|   |       |   .env.example                      # Blockchain RPC and Private Key template
|   |       |   deploy.s.sol                      # Foundry deployment script template
|   |       |   foundry.toml                      # Foundry toolchain configuration
|   |       |   hardhat.config.ts                 # Hardhat toolchain configuration
|   |       |
|   |       \---.github
|   |           \---workflows
|   |                   ci.yml                    # Smart contract testing workflow
|   |                   pr-check.yml              # Gas reporting and security lint workflow
|   |
|   +---docs
|   |       account-abstraction.md                # ERC-4337 Account Abstraction patterns
|   |       crosschain.md                         # LayerLayer / Bridge integration rules
|   |       data-infra.md                         # The Graph / Subsquid indexing rules
|   |       defi.md                               # AMM / Lending protocol security patterns
|   |       deploy.md                             # Mainnet deployment checklists
|   |       frontend-ethersjs.md                  # Ethers.js v6 integration patterns
|   |       frontend-wagmi.md                     # Wagmi / Viem React integration patterns
|   |       l2-deployment.md                      # Optimism/Arbitrum rollup deployment rules
|   |       nft.md                                # ERC-721/1155 optimization rules
|   |       security.md                           # Reentrancy, Oracle manipulation defense guide
|   |       solidity-core.md                      # Solidity 0.8+ strict coding standards
|   |       solidity-patterns.md                  # Diamond Proxy / UUPS upgradeability patterns
|   |       testing.md                            # Fuzzing and Invariant testing with Foundry
|   |       toolchain.md                          # Foundry vs Hardhat decision matrix
|   |
|   \---tools
|           audit-skill.js                        # AST Sandbox logic and dry-run verifier
|
\---_core_axioms
    |   client.md                                 # Prompt injection bridging for memory hydration
    |   context-memory-system.md                  # Theory behind the agentic sliding-window memory
    |   KERNEL_BOOTSTRAP.md                       # Global entry point. ALL agents must read this first
    |   knowledge_graph_schema.md                 # The architectural diagram of this exact directory
    |   NEXUS_PROTOCOL.md                         # Federated handoff contracts between different cores
    |   NEXUS_SPEC.md                             # Low-level standard for the NEXUS_PROTOCOL
    |   SOUL_MANIFESTO.md                         # 👑 The Supreme Design-Driven Aesthetic Code
    |   template-matching-algorithm.md            # Logic for selecting correct boilerplates
    |   template-quality-assurance.md             # Pre-flight checklist for AST template hydration
    |
    +---evolution
    |       analytics.json                        # Refusal/acceptance and LLM performance metrics
    |       patch_history.json                    # Autonomous tracker for user mutations
    |
    \---memory
        |   project_graph.json                    # Active & past project inter-dependencies
        |   snippet_vault.json                    # Cached architectural AST snippets
        |   user_profile.json                     # Base coding styles, themes, and developer ID
        |
        \---vector_vault
                schema.json                       # RAG semantic vector embedding definitions
```

---

## 🏗️ The 7 Core Modules

| Module | Purpose | Key Capabilities |
|:---|:---|:---|
| 🧠 **`_core_axioms`** | The Central Knowledge Base | RAG Vector Vault Memory, Global Nexus Rules, System Manifestos. |
| 👑 **`product-core`** | The Orchestrator | Phase 1.5 Asset Handshake. Manages full-stack development schedules. |
| 🎨 **`frontend-core`** | The UI Engine | MFE Component Sandboxing, visual conformity, layout constraints. |
| 📱 **`mobile-core`** | Native Physicality | `vibrateShort()` integrations, cubic-bezier scroll physics, Spatial OS readiness. |
| 🛡️ **`backend-core`** | Infrastructure & Security | Self-healing Cloud Infrastructure (`tflint`), AST Fuzzing tests. |
| 🌐 **`web3-core`** | Decentralization | Hardhat/Foundry cross-invocation. Verified on-chain asset state. |
| 🪐 **`threejs-core`** | Spatial Computing | Vanilla WebGPU depth anchoring. WebXR `z-index` handling. |

---

## ⚡ Quick Start: Initialize Your Environment

This repository features **Evolutionary Memory Trackers**. When initialized, your AI Agent will begin tracking your unique coding preferences via `patch_history.json`. 

To begin your project thoughtfully with a clean slate, **you must initialize the memory metrics**:

```bash
# Clone the repository
git clone https://github.com/your-username/Axiom-Core-Skills.git
cd Axiom-Core-Skills

# Reset the memory pool for your local environment
./init.sh
# (Alternatively, run `node init.js` / `python init.py` / `init.bat` depending on your OS)
```

**Usage**: Configure your local AI Agent (e.g., Cursor, Claude Desktop, FastMCP) to read `_core_axioms/KERNEL_BOOTSTRAP.md` before executing new tasks. The agent will inherit and learn from these systematic constraints over time.

---
*Developed for robust software engineering. Governed by the SOUL Manifesto.*
