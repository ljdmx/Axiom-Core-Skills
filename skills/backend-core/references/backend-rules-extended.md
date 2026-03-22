# Extended Compliance and Resilience Rules (Backend-Core)

## GDPR / CCPA Compliance Protocol
- **Mandate**: Personally Identifiable Information (PII) must not exist in raw logs or unmapped databases.
- **Rules**:
  1. **Auto-Hashing**: Emails, phone numbers, and SSNs MUST be salted and hashed (e.g. bcrypt or argon2) before DB insertion if exact-match is needed, or encrypted (AES-GCM) if retrieval is needed.
  2. **Log Redaction**: Winston/Pino logger configurations MUST contain PII scrubbers replacing specific fields with `[REDACTED]`.

## Chaos Engineering & Resilience
- **Mandate**: Never assume a downstream database or generic API will be available.
- **Rules**:
  1. **Circuit Breakers**: ANY external HTTP call must be wrapped in a Circuit Breaker (e.g. Opossum in Node).
  2. **Rate Limiting**: All public gateways MUST implement leaky bucket or token bucket rate limiting to prevent DDoS.
  3. **Simulated Failure (Chaos)**: Code MUST include a chaos-testing flag (`CHAOS_MODE=true`) which randomly degrades API speeds by 2000ms or drops 5% of packets to ensure frontend gracefully handles timeouts.

## 25 Panic-Recovery & Chaos Engineering Paradigm (Bulletproof Process)
- **Mandate**: The Node/Python/Go process MUST NEVER crash or `exit(1)` due to an unhandled exception in a route handler, async worker, or third-party API timeout. Furthermore, it explicitly must survive systemic dependency failures.
- **Chaos & Circuit Breaker Execution**: All external API calls and inter-service communications MUST be wrapped in a Circuit Breaker pattern. AI MUST inject a documented Chaos Engine configuration (e.g., occasional synthetic failure injection in staging mode) to prove architectural resilience.
- **Execution**: AI MUST wrap the entire top-level application router, all queue workers, and event subscribers in a universal `Catch-All / Panic-Recovery` middleware.
- **Reporting**: When a panic is caught, it MUST return a 500 RFC 7807 error to the user (with `human_readable_cause: "Our servers experienced a temporary structural anomaly..."`), log the stack trace to structured JSON, and trigger an alert hook. The process MUST stay alive.

## 26 Technical Debt Quantification Protocol
- **Mandate**: `[DEFERRED]` architectural items as internal engineering notes are invisible to business stakeholders and create silent risk accumulation. Every deferred item MUST be expressed in business-language cost terms, making the trade-off decision explicit.
- **Updated `[DEFERRED]` Format** (MUST use this format, no exceptions):
  ```
  [DEFERRED: {component}]
  ├─ What: {brief technical description}
  ├─ Trigger: {measurable condition when this becomes urgent, e.g., "MAU > 10K" or "DB read QPS > 500"}
  ├─ Business Risk: {consequence in user-facing terms, e.g., "p95 API latency exceeds 500ms, degrading checkout conversion"}
  ├─ Resolution Cost: ~{N} engineering sprints
  └─ Priority: P{1|2|3}
  ```
- **Debt Register Integration**: All `[DEFERRED]` items MUST be auto-collected into a `references/TECH_DEBT.md` registry at session end. This register is a first-class project artifact delivered alongside code. AI MUST automatically inject this debt ledger into `PROJECT_NEXUS.json` so that future sessions will actively prioritize technical debt repayment scheduling.
- **Debt Aging Rule**: Any `[DEFERRED]` item that has been in the registry for > 3 project milestones without being resolved MUST be automatically escalated from P3 -> P2 -> P1. Stale debt is compounding debt.

## 27 Multi-Tenant Migration Ladder
- **Mandate**: Most products start small (Shared Schema) and grow. Without a pre-planned migration path, tenant isolation upgrades become traumatic, data-loss-risking events that kill teams and products. This section defines the safe upgrade ladder.
- **Self-Healing IaC (V10 Rule)**: When enterprise delivery is requested, AI MUST automatically generate Terraform (`.tf`) or Pulumi (`.ts`) scripts matching the backend needs. AI MUST invoke `tflint` or an equivalent static analyzer if executed locally. Architecture components are provisioned as code, self-audited before PR.
- **Migration Path: Shared Schema RLS -> Separate Schema**:
  ```
  Phase 1 -> Dual-Write Window (Zero Downtime)
  Phase 2 -> Read Migration
  Phase 3 -> Cutover (Remove old RLS)
  ```
