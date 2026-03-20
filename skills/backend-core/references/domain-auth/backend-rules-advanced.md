# ADBM Advanced Rules (On-Demand)
## Contract Testing Â· GraphQL Â· DLQ Governance Â· LLM Protocol Â· Local-First Â· Data TTL

> **Status**: ACTIVE â€?Loaded on-demand by ADBM SKILL.md.
> **Load Triggers**:
> - Â§11 Contract Testing â†?any project with service-to-service API dependencies
> - Â§12 GraphQL â†?project uses GraphQL schema
> - Â§14 DLQ â†?project uses message queues
> - Â§15 LLM â†?project calls an LLM/AI model API
> - Â§19â€“Â?0 â†?consumer/B2C apps with strong privacy requirements
> **Usage**: `view_file(references/backend-rules-advanced.md)`

---

## 1ï¸âƒ£1ï¸âƒ£ API Contract Testing & E2E Business Flow Verification
- **Mandate**: API documentation (Swagger/OpenAPI) is not enough; contracts must be executable.
- **Implementation**: Service dependencies MUST be verified using Consumer-Driven Contract Testing (e.g., Pact or Dredd) in CI/CD.
- **E2E Business Flow**: Generated integration tests MUST traverse complete business lifecycles (e.g., Register Device â†?Send OK Telemetry â†?Send Fault â†?Trigger Alert â†?Clear Alert), NOT just isolated endpoint tests.
- **Contract Version Locking**: Consumer Contract files MUST be namespaced by API version (`tests/contracts/v1/`, `tests/contracts/v2/`). Contracts for deprecated versions MUST be **frozen** (read-only, enforced via CI file-change guard). Only `sunset_date` metadata may be appended. This ensures backward-compatibility verification remains executable throughout the deprecation window.
- **Mutation Testing**: For critical payment and auth endpoints, integrate `stryker` or equivalent mutation testing to validate that tests genuinely catch business logic regressions â€?not just code coverage percentages.

---

## 1ï¸âƒ£2ï¸âƒ£ GraphQL Governance (When Applicable)
- **N+1 Prevention**: ALL GraphQL resolvers MUST use `DataLoader` to batch and deduplicate database calls.
- **Persisted Queries**: In production, disable arbitrary ad-hoc queries. Use Persisted Queries only to limit attack surface.
- **Introspection Off**: Disable Schema Introspection in production environments to prevent API enumeration attacks.
- **Complexity Limits**: Enforce query depth and complexity limits to prevent DoS via deeply nested or aliased queries.
- **Schema Governance**: All schema changes MUST go through a `schema.graphql` diff review in CI. Breaking changes (removing fields, changing types) require a deprecation period matching Â§1 versioning rules. Use `graphql-inspector` in CI to automate breaking-change detection.
- **Subscription Backpressure**: Any GraphQL subscription with real-time data streams MUST implement server-side backpressure â€?do not push raw DB change events faster than clients can process.

---

## 1ï¸âƒ£4ï¸âƒ£ DLQ Governance & Replay Protocol
- **Alert Threshold**: Emit `CRITICAL` alert if DLQ depth > 100 messages persists for > 5 minutes.
- **Triage Decision Tree**:
  - `transient error` (network, timeout) â†?**Replay** with exponential backoff + jitter. Max 3 replays.
  - `data corruption / schema mismatch` â†?**Quarantine** (move to `dlq.poison`), notify data team. NEVER auto-replay.
  - `downstream outage` â†?**Hold** replay, activate circuit breaker, page on-call engineer.
- **Replay Safety**: All replayed messages MUST carry original `Idempotency-Key`. Max replay rate = 50 messages/min.
- **Ownership Mandate**: Every DLQ MUST carry a `DLQ_OWNER` tag. Ownerless DLQs are a deploy blocker.
- **DLQ Dashboard**: Every production deployment MUST include a DLQ monitoring dashboard (Grafana panel or equivalent) showing: current depth, replay rate, quarantine count, and owner contact. Silent DLQs are silent outages.

---

## 1ï¸âƒ£5ï¸âƒ£ LLM-Driven Application Protocol (AI-Native)
- **Streaming by Default (UX Protection)**: ANY endpoint calling an LLM MUST default to Server-Sent Events (SSE) or WebSockets to stream tokens incrementally. A synchronous HTTP wait blocking for > 5 seconds is an automatic architecture failure.
- **Async GenAI Task Offload**: For long-generation tasks (Images, Search, complex Agents), the core endpoint MUST respond `202 Accepted` and offload generation to a Celery/BullMQ worker loop, enabling client-side long-polling or WebSocket notification.
- **Business Routing Constraint (Billing/Quota lock)**: Isolated AI endpoints without commerce routing are technically orphaned. ANY heavy generative API MUST have an explicit `Quota Middleware` (decrementing DB credits or Redis rate-limiters) executing *before* the expensive LLM execution.
- **Prompt & Abuse Firewall**: Backend middleware MUST implement an explicit sanitization layer to block Prompt Injection (Jailbreaks) and enforce strict Token/Length constraints upstream of the LLM parser.
- **Cost Observability**: Every LLM API call MUST log: `{model_name, prompt_tokens, completion_tokens, cost_usd, latency_ms, user_id}` to a dedicated `llm_usage_log` table. Without this, LLM costs are invisible until the AWS bill arrives.
- **Fallback Chain**: Define a fallback model chain for production resilience: `primary_model â†?fallback_model â†?cached_response â†?graceful_degradation_message`. Never let an LLM API outage white-screen the user.

---

## 1ï¸âƒ£9ï¸âƒ£ Zero-Friction Graph Aggregation (Linear Paradigm)
> **Scope**: Consumer apps, developer tools, personal productivity. Enterprise multi-tenant SaaS: evaluate per data residency requirements.

- **Mandate**: Eliminate waiting. The user must never see a loading spinner when reading their own workspace.
- **Execution**: Implement a **Sync Engine** pattern initialization. The backend pushes a highly compressed, incremental state payload via WebSocket or GraphQL immediately upon connection. All subsequent CRUD operations are executed synchronously in the client's memory graph while the backend syncs silently in the background.
- **Conflict Resolution**: When two clients modify the same resource concurrently, use CRDT (Conflict-free Replicated Data Types) or Last-Write-Wins with vector clocks â€?never silently overwrite either client's work.

---

## 2ï¸âƒ£0ï¸âƒ£ Right to be Forgotten by Default
> **Scope**: Consumer apps, GDPR-regulated products, personal data platforms. Enterprise SaaS with compliance mandates must verify this pattern against retention policies before applying.

- **Mandate**: A clean database is a calm database. Digital hoarding is a toxic anti-pattern.
- **Execution**: Implement strict Database TTLs. Any intermediate state, error log, draft, or unused asset MUST have an automatic TTL (e.g., 7 days) to dissolve back into nothingness. The schema must enforce ephemeral data hygiene at the SQL layer.
- **GDPR Article 17 Compliance**: For GDPR-regulated products, Right-to-Erasure requests must propagate to ALL data stores: primary DB, Redis cache, CDN cache (via cache invalidation), search indexes (Elasticsearch), and analytics events. Partial erasure is a compliance violation.
- **Audit Trail Exception**: Audit logs and financial transaction records have separate legal retention requirements (typically 5â€? years). These MUST be exempted from TTL-based deletion and documented in the Data Retention Policy.

---

## ðŸ“‹ Changelog

| Version | Date | Summary |
|---|---|---|
| v1.0 | 2026-03-09 | Extracted from ADBM SKILL.md Â§11, Â§12, Â§14, Â§15, Â§19â€“Â?0. Enhanced each section with additional rules: mutation testing, GraphQL schema governance, DLQ dashboard mandate, LLM cost observability + fallback chain, CRDT conflict resolution, GDPR erasure propagation |
