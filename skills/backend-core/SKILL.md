---
name: backend-core
description: Architectural sovereignty framework for designing resilient, API-first enterprise backend ecosystems.
version: "10.2"
standalone_ready: true  # Mode-A: works without product-core
fspc_compatible: true   # Mode-B: supports product-core FSPC orchestration
last_updated: "2026-03"
trigger_keywords: ["create API", "backend service", "database design", "microservice", "REST API", "GraphQL", "API architecture", "backend architecture", "authentication", "authorization", "caching", "deployment", "CI/CD", "observability", "rate limiting", "webhooks", "event-driven", "queue", "build backend", "server-side", "Node.js", "NestJS", "FastAPI", "Express", "Django", "Spring Boot", "Prisma"]
auto_activate: true
metadata:
  pattern: tool-wrapper, reviewer, generator
  architecture-style: adbm-v10
token_budget:
  core_load: 8000       # SKILL.md only (must load first)
  full_load: 36000      # Full load ceiling
---

# API-Driven Backend Manifesto (ADBM)

## 🧮 Token Budget & Context Constraints
To prevent LLM context exhaustion, ADBM enforces a strict Token Budget. AI MUST NOT load non-essential reference files simultaneously.
| Component | Token Budget | Usage Strategy |
|---|---|---|
| **Core Load (SKILL.md)** | ~8,000 | Always loaded. Defines sovereign rules. |
| **Domain Modules** | ~4,000—6,000 | Loaded dynamically via `view_file` as needed. |
| **Max Capacity** | 36,000 | Hard threshold. AI MUST unload previous phase context. |

> **Visual Manifest**: [Axiom Core Zenith Billboard](../_core_axioms/dashboards/zenith_billboard.html)
> **Standard Gates**: `view_file(../_core_axioms/protocols/STANDARD_GATES.md)` —Inherit 3-Axis Soul Diagnostic and Rejection Gate.

> **MUST READ**: `view_file(./references/domain-infra/protocols.md)` —RFC 2119 Rules and Core Protocols.
> **Sovereign Interface**: Load `view_file(./references/divine_interface.md)` for high-order API design patterns and zero-placeholder mandates.

> **Extended Protocols**: Load `view_file(./references/backend-rules-extended.md)` for detailed GDPR compliance and chaos engineering resilience rules.

## 5 - 10 Enterprise Data & Security (High-Density)

| Section | Mandate | Implementation / Execution |
|---|---|---|
| **§5 Data Model** | DDD + Relational | Mermaid Aggregate Root. Soft delete. UUIDv7 IDs. Cursor pagination only for > 10K rows. Connection pools maxed. Idempotency (e.g. `x-idempotency-key`) MUST be present on ALL mutating POST/PUT/DELETE requests. |
| **§6 Distributed** | Sync < 200ms | Offload > 500ms tasks to BullMQ. Mandatory DLQ. Saga pattern for distributed state reconciliation. |
| **§7 Cache** | Stampede Defense | Mutex locks (`SETNX`) + Jittered TTLs. Cache NULLs (Anti-Penetration). |
| **§8 Observability** | JSON Trinity | Structured JSON Logs + OpenTelemetry Traces + Prometheus Metrics. P1/P2 alerting rules. **Digital Carbon Footprint**: Map CPU/Memory usage to carbon estimates in telemetry. |
| **§8.1 Carbon Guard**| O(N) Mandate | **HARD BLOCK** on nested loops or O(N^2) complexity for datasets > 100 items. Mandate O(N) or O(log N) for all collection operations. |
| **§9 Security** | Edge Defense | Argon2 hashing. Log redaction. edge-first auth. No SQL, XSS, or SSRF risks. Audit Log. |

## 11 - 12 Advanced Rules: Contract Testing & GraphQL (On-Demand)

> [!IMPORTANT]
> §11 (Contract Testing) and §12 (GraphQL Governance) are context-specific. Load on-demand to save tokens.
>
> ```
> view_file(./references/domain-auth/backend-rules-advanced.md)
> ```

| Section | Topic | Load When |
|---|---|---|
| §11 | API Contract Testing, E2E Business Flow, Mutation Testing | Service-to-service API dependencies |
| §12 | GraphQL: N+1 prevention, Persisted Queries, Introspection, Schema Governance | Project uses GraphQL |

## 13 Breaking Change Detector Protocol
- **Trigger**: Fires when AI modifies any of: endpoint path, HTTP method, request schema, response schema, status codes, or auth requirements.
- **Mandatory Actions (before committing)**:
  1. Scan codebase: `grep -rn "old_endpoint_path" ./` —enumerate all callers (frontend, tests, other services).
  2. Output **Breaking Change Impact Report**: `{ endpoint, change_type, affected_files[], migration_action }`.
  3. If callers found without migration path —**HARD BLOCK**. Propose backward-compatible alternative (e.g., add `/v2/` alongside `/v1/`).
- **Contract Registration**: Document in `tests/contracts/` (Pact/Dredd) before merging to `main`.

## 14 - 15 Advanced Rules: DLQ & LLM Protocol (On-Demand)

> [!IMPORTANT]
> §14 (DLQ Governance) and §15 (LLM-Driven Protocol) are context-specific. Load on-demand.
>
> ```
> view_file(./references/domain-auth/backend-rules-advanced.md)
> ```

| Section | Topic | Load When |
|---|---|---|
| §14 | DLQ Governance, Replay Protocol, Triage Decision Tree, DLQ Dashboard | Project uses message queues |
| §15 | LLM Streaming, Async GenAI, Quota Middleware, Prompt Firewall, Cost Observability | Project calls LLM APIs |

## 16 Digital Carbon Footprint & Occam's Razor
- **Mandate**: Respect computing resources. Do not use Kafka or Kubernetes for a 100-request-per-day system.
- **Execution**: Apply Occam's Razor. Always propose the simplest, lowest-carbon architecture first (e.g., Serverless Scale-to-Zero, Rust/WASM Edge Functions for ultra-low latency, or single Postgres + SQLite). 
- **Carbon Scoring (Mandatory)**: The architecture brief MUST include a `Carbon Impact Score` (1-10, lower is better). If the score is > 6 for a small-scale Tier, the AI MUST provide a lower-carbon alternative (e.g., replacing a heavy polling loop with Webhooks).
- **Statement**: "This architecture minimizes idle compute resources in compliance with Digital Carbon Footprint protocols. Estimated Impact Score: {Score}/10."

## 17 Long-Lasting Clean Architecture
- **Mandate**: Do not intertwine core business logic with framework-specific magic (e.g., Next.js App Router handlers or Express middleware layers).
- **Execution**: Implement Hexagonal Architecture. Core domain handlers MUST be pure functions, agnostic of the HTTP transport or specific cloud vendor, ensuring the code outlives the framework by 10+ years. Reject "hype-driven" over-coupling.

## 18 Local-First & Frictionless Privacy (Rewind Paradigm)
- **Mandate**: The user's data belongs to the user. If data does not NEED to be shared across a network, it MUST NOT be persisted to the server.
- **Execution**: Drafts, personal history, and deep reflection data MUST be stored in the client's `IndexedDB` or OPFS. The backend should operate strictly as a dumb, End-to-End Encrypted (E2EE) sync channel utilizing deterministic CRDT (Conflict-free Replicated Data Type) states for flawless offline-first multi-user collaboration. Refuse to be a data-surveillance panopticon.

## 19 - 20 Advanced Rules: Sync Engine & Data Privacy (On-Demand)

> [!IMPORTANT]
> §19 (Zero-Friction Sync) and §20 (Right to be Forgotten) apply to consumer/B2C apps and GDPR-regulated products.
> Enterprise SaaS: evaluate against data retention compliance before applying.
>
> ```
> view_file(./references/domain-auth/backend-rules-advanced.md)
> ```

| Section | Topic | Load When |
|---|---|---|
| §19 | Zero-Friction Sync Engine, CRDT conflict resolution (Linear Paradigm) | Consumer/developer tools with real-time sync |
| §20 | Right to be Forgotten, DB TTLs, GDPR Art.17 erasure propagation | GDPR-regulated or consumer privacy products |

## 21 View-Model Transformation Layer (UI-Driven BFF)
- **Mandate**: The primary role of a backend is NOT to expose raw DB row arrays to the frontend. Serving raw relational data and expecting the frontend to compute charts, aggregates, and stat cards causes main-thread blockage, visible jank, and ruined UX.
- **Implementation**: For every dashboard panel, chart, or KPI stat card identified in the PRD or UI wireframe, AI MUST generate a dedicated, aggregated **View-Model endpoint** alongside the base CRUD API:
  ```typescript
  // ❌GET /api/v1/telemetry (returns 10k raw rows) -> 🛑 BLOCK
  // ✅GET /api/v1/metrics/trend-chart (returns pre-aggregated series) 
  ```
- **Naming Convention**: View-Model endpoints MUST live under `/metrics/`, `/analytics/`, or `/summaries/` namespaces to distinguish them from standard CRUD endpoints.
- **BFF Visual Sync (Loading Companionship)**: View-Model endpoints MUST include meta-headers estimating rendering complexity (e.g., `X-Expected-Render-Complexity: High`). This serves as a contract allowing the frontend (DDFM) to preemptively prepare deep, accurate skeleton structures rather than generic spinners.
- **Caching Mandate**: All View-Model endpoints MUST be cached in Redis with a sensible TTL (`60s` for real-time dashboards, `1h` for daily reports). Cache invalidation MUST be triggered by the corresponding mutation events (not just TTL expiry).
- **Anti-Pattern Enforcement**: Any frontend component that iterates a large array (> 100 items) purely for aggregation purposes (`.reduce()`, `.filter().length`, `_.groupBy()`) is a HARD BLOCK signal —refactor into a server-side View-Model endpoint instead.
- **Trace Visualization Mandate**: For complex business logic or multi-step sagas, AI MUST generate a **Mermaid-based Trace Diagram** within the handler's documentation/comments to provide visual structural clarity.

## 21.5 Local Telemetry Sync Engine (Zenith)
- **Mandate**: Dashboards running locally (`file://`) often fail to sync due to CORS. 
- **Execution**: AI MUST generate a `data_bridge.js` (or `axiom_data.js`) containing a serialized version of the project's JSON state (`PROJECT_NEXUS.json`) to be loaded via a standard `<script>` tag. This ensures real-time telemetry visibility without requiring a local web server for the dashboard.

## 22 Cinematic Database Seeding (Production Demo Fidelity)
- **Mandate**: A database seeded with `User 1`, `Product 2`, `Test Title` is a failed product. The seed data is the product's first impression. It MUST be indistinguishable from real production data at first glance.
- **Hyper-Realistic Data Constraints**:
  1. **Names & Identities**: Use culturally diverse, real-sounding full names (not `John Doe`). Avatars MUST use specific, high-quality Unsplash photo IDs (e.g., `https://images.unsplash.com/photo-1494790108377-be9c29b29330—w=200&h=200&fit=crop`) —never use generated avatars or placeholder squares.
  2. **Content & Copy**: Algorithmically generated gibberish (e.g., "Lorem Ipsum", random strings) is STRICTLY FORBIDDEN. Seed data MUST map to curated, high-fidelity JSON dictionaries appropriate to the specific domain. Article titles, product descriptions, and notification messages MUST be domain-accurate. For a SaaS product: use realistic feature names, changelog entries, and user feedback. For IoT: use real device model names, realistic sensor readings within plausible ranges.
  3. **Data Volume & Distribution**: Seed data MUST represent a realistic usage curve (e.g., 20% power users with 500+ items, 60% average users with 10-100 items, 20% new users with < 5 items). A flat distribution is not realistic.
  4. **Timestamps**: MUST be backfilled realistically (e.g., `created_at` values distributed over the past 6 months, not all within 1 second).
- **Execution**: The `seed.ts` / `seed.py` script MUST be runnable via `npm run seed` / `python seed.py` in ONE command from a fresh clone, with no manual configuration required.

## 23 First-Class Object Storage Mandate (S3/R2 Presigned URLs)
- **Mandate**: Any feature involving user-uploaded files (avatars, cover images, documents, media) MUST use a cloud object storage provider (AWS S3, Cloudflare R2, or equivalent) via Presigned URLs. Storing binary file data in the primary database or on the application server filesystem is a **HARD BLOCK**.
- **Presigned URL Upload Flow** (MUST implement exactly):
  ```
  1. Client POSTs {filename, size, type} -> 2. Server validates & returns S3 PUT url & upload_id -> 3. Client PUTs to S3 directly -> 4. Client POSTs confirm {upload_id} -> 5. Server saves CDN URL.
  ```
- **Security Requirements**: The presigned URL endpoint MUST require authentication. The `content_type` MUST be strictly validated against an allowlist (`image/jpeg`, `image/png`, `image/webp`, etc.). File `size_bytes` MUST be validated server-side before presign generation —client-side claims are not trusted.
- **CDN Delivery**: All public assets MUST be served via a CDN (CloudFront, Cloudflare) —never via a direct S3 bucket URL. The `public_cdn_url` stored in the DB is always the CDN URL.
- **Fallback Rule (Startup Tier)**: If the project is classified as `Scale = Startup` with no cloud budget, AI MUST use `Cloudflare R2` as default (generous free tier, S3-compatible API). Do NOT use local filesystem storage as a temporary shortcut.

## 24 OpenAPI Spec-First Protocol (“Contract Before Controller"
- **Mandate**: Writing controller code before defining the API contract is architectural malpractice. The OpenAPI 3.1 specification is the single source of truth -> all code is derived from it, not the reverse.
- **Execution Order** (MUST follow exactly):
  ```
  Step A -> Generate `.openapi/api.yaml` (OpenAPI 3.1) for ALL endpoints
  Step B -> Run `npx @stoplight/spectral-cli lint .openapi/api.yaml` -> HARD BLOCK on errors
  Step C -> Generate server-side type definitions from spec (`openapi-typescript` / `fastapi-codegen`)
  Step D -> Write controller code, referencing ONLY the generated types —no freehand type declarations
  Step E -> Validate running implementation: `dredd .openapi/api.yaml http://localhost:3000`
  ```
- **Spec Quality Rules**: The `.openapi/api.yaml` MUST define, for every endpoint: `operationId`, all possible response schemas (including `4XX` and `5XX`), `security` requirements, and at least 1 `example` per request/response body.
- **Reverse Engineering Prohibition**: If a project is inherited with existing controllers but no spec, AI MUST generate the spec FIRST by reading the codebase (`reverse-spec`), validate it, and make the spec authoritative BEFORE touching any controller logic.
- **Breaking Change Lock**: Once the spec is published (tagged in git), any change that would alter an existing `operationId`'s request or response schema triggers the ADBM §13 Breaking Change Detector Protocol.

## 25 - 27 Advanced Enterprise Mechanics (On-Demand Load)

> [!IMPORTANT]
> §25 (Panic-Recovery), §26 (Tech Debt Quantification), and §27 (Multi-Tenant Migration) have been extracted to optimize token budgets. Load on-demand.
>
> ```
> view_file(./references/backend-rules-extended.md)
> ```

---

## 🌐 Blueprint Router Matrix
AI MUST select stack based on detected runtime, but NEVER load all blueprints. Use `view_file` to load ONLY the specific blueprint needed:

| Architecture Task | Blueprint to Load |
|---|---|
| NestJS Modular Monolith | `view_file(blueprints/modular-monolith/nestjs-modular-monolith/README.md)` |
| FastAPI Serverless | `view_file(blueprints/serverless/python-fastapi-serverless/README.md)` |
| Go Microservice | `view_file(blueprints/microservices/go-microservice/README.md)` |
| Kafka / CQRS integration | `view_file(blueprints/integrations/kafka-cqrs/README.md)` |
| RBAC Enterprise System | `view_file(blueprints/enterprise-modules/enterprise-rbac/README.md)` |
| General Docker Integration | `view_file(blueprints/docker-compose.yml)` |

## 🤖 AI Execution Protocol
Apply when user requests: API/backend creation, enterprise architecture, database design.

**EXECUTION Workflow**:
> **Smart Config Pre-Check**: If the project has complex environment configuration or multi-cloud deployment targets, read `scripts/smart-config.js` to auto-generate environment-specific config. Trigger: user mentions 'multi-env', 'staging/prod parity', or 'cloud config'.


> **Multimodal Blueprinting Protocol (Step 0)**: 
> 1. If the user provides a **Diagram, Whiteboard, or Screenshot**: AI MUST use `vision` to extract the architecture tree, data relationships, and UI flow.
> 2. Output `[Multimodal Extraction Complete]`.
> 3. Generate the corresponding `.openapi/api.yaml` (Step A) directly from the visual blueprint.

1. **Blueprint Scan**: Use `list_dir` on the `[Blueprints Directory](blueprints/)`. ALWAYS copy the blueprint scaffold. Do NOT write from scratch if a blueprint exists.
2. **DDD Pre-Schema**: Output Aggregate Root Tree -> Define State Enums -> Record Time-Series split strategy BEFORE writing any schema file.
3. **Schema Design**: Implement Enterprise Data Model + Connection Pool + Idempotency + Cursor Pagination rules.
4. **Controller & Router**: Implement RFC 7807 Errors, Versioning, and strict Rate Limiting middleware.
5. **Service Layer**: Identify slow ops -> Auto-offload to Async Queues. Design Sagas for distributed states.
6. **Data/Cache Layer**: Inject Jitter, Mutex Locks, and Anti-Penetration logic.
7. **Telemetry & Contracts**: Setup JSON Logging, Trace IDs, Prometheus metrics, and Contract Testing definitions.
8. **Red Team Audit & Gate 0C Sync**: Run static dependency supply chain analysis (`npm audit --json` or `pip-audit`), block on High/Critical CVEs. **MANDATORY**: AI MUST execute `red_team/security_audit.ts` naitvely acting as a PR review check, explicitly testing for OWASP Top 10 vulnerabilities, and verify results against `product-core` Gate 0C requirements before handoff.

**⚠️ FAILURE DECISION TREE**:
- Step 1-3 fail -> retry x 2 -> human. Step 4-5 fail -> isolate+retry x 2. Step 6 fail -> disable cache. Step 7 fail -> WARN+continue. Step 8 fail -> HARD BLOCK.

## 26.5 Zenith Ascension: Topology Validation & Zero-Runtime-Error Gate
- **Zero-Error Initialization (Sandbox Init)**: Ensure dependency consistency by executing a typed init script (e.g., `node tools/sandbox-init.js` or `sh ./scripts/bootstrap_env.sh`) immediately before infrastructure bring-up. The script MUST silently install missing dependencies and inject essential environment variables to guarantee a zero-error first run.
- **Pre-Flight Topology Audit**: Before any API server is started, AI MUST execute an environmental dependency tree validation script locally via relative paths (e.g., `node ./scripts/validate-env.js`).
- **Path Resolution**: AI MUST use relative paths and invoke `node tools/path_resolver.js` to ensure reliable file resolution across different OS environments.
- **Autonomous Error Handling**: All internal validation scripts (`audit-workspace.js`, `topology-dry-run.js`) MUST implement pervasive `try/catch` wrapping and structured JSON logging. Unhandled exceptions are a hard failure of the Sovereign Architecture.

## 26.6 Zenith Ascension II: Topology Dry-Run & Sandbox Orchestration
- **Mandatory Pre-Boot Dry-Run**: Before initializing robust databases or executing migrations, AI MUST verify network topology and port availability via lightweight probes (e.g., `node ./scripts/topology-dry-run.js`).
- **Graceful Sandbox Fallbacks (Standalone Mode)**: If external Docker/Postgres environments are unresponsive during initialization, or if `product-core` orchestrators are missing, AI MUST autonomously pivot to an in-memory (`SQLite`) sandbox environment heavily pre-seeded with `standalone_mock` data to guarantee seamless, zero-error local development spin-up.

## 26.7 Zenith Ascension III: High-Concurrency Fallback API (Circuit Breakers)
- **High-Concurrency Exceptions**: AI MUST implement explicit Fallback API routing for operations prone to traffic spikes (e.g., heavy aggregations, external integrations). If the primary DB/Service response time crosses a 2000ms threshold or rejects connections, traffic MUST automatically trip a Circuit Breaker, returning a cached simplified response or entering an async Queue flow, never an unhandled `500 Internal Server Error`.

## Admin Protocols (Ecosystem, Health, Evolution)
1. **Routing & Health**: Use `blueprints/` and `red_team/security_audit.ts`. **Mandatory Audit**: Run `node tools/audit-skill.js [target_path]` before handoff. Verify Gate 0C security compliance.
2. **Evolution**: If a rule causes repeated Retrospective failure or tools >18mo old, generate `skill-amendment-proposal.md`.
---

## 📋 Changelog

| Version | Date | Summary |
|---|---|---|
| v10.2 | 2026-03-20 | Zenith: §8.1 Carbon Guard, Multimodal Blueprinting, version aligned. |
| v8.2 | 2026-03-09 | Added Global Nexus Protocol sync mandate |
| v8.1 | 2026-03-09 | §11-12 (Contract Testing/GraphQL), §14-15 (DLQ/LLM), §19-20 (Sync/Privacy) extracted to `references/backend-rules-advanced.md` (saves ~6K tokens). Fixed duplicate §26 —Multi-Tenant Migration Ladder renamed to §27. Expanded `red_team/security_audit.ts` to full OWASP Top 10 coverage. Added smart-config.js trigger. Created `references/adr-template.md` and `references/tech-debt-template.md`. |
| v8.0 | 2026-02-28 | OpenAPI Spec-First (§24), Panic-Recovery Paradigm (§25), Tech Debt Quantification (§26), Multi-Tenant Migration Ladder. LLM Protocol (§15), Object Storage (§23), Cinematic Seeding (§22). |

---

## Changelog

| Version | Date | Summary |
|---|---|---|
| v10.2 | 2026-03-20 | Zenith Refined: Added 8.1 Carbon Guard and Multimodal Blueprinting. |
| v10.1 | 2026-03-20 | Global English cleanup and ASCII standardization. |
| v10.0 | 2026-03-09 | Initial Zenith v10 release. |
