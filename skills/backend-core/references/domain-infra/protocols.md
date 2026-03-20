# ADBM Rule Compliance Levels & Core Protocols

## ⚖️ Rule Compliance Levels (RFC 2119)

| Level | Meaning | Consequence of Violation |
|---|---|---|
| **MUST / MUST NOT** | Non-negotiable requirement | HARD BLOCK �?do not proceed |
| **SHOULD / SHOULD NOT** | Strongly recommended | Deviation requires explicit justification in ADR |
| **MAY** | Context-dependent, optional | Apply based on project scale & needs |

## 1️⃣�?️⃣ & 1️⃣0️⃣ Core Backend Protocols (High-Density)

| Section | Mandate | Implementation / Execution |
|---|---|---|
| **§1 Versioning** | No Broken Consumers | v1/v2 URI or Header versioning. Rate limiting (Redis): Auth (10/min), CRUD (1000/min), Export (10/hr). |
| **§2 Errors** | RFC 7807 + Empathy | Return `type/title/status/detail` + `human_readable_cause` + `suggested_action`. No leaked stack traces. |
| **§3 Idempotency** | Atomic Mutation | `Idempotency-Key` header + Redis distributed lock (`SETNX`). Cache response for 24h min. |
| **§10 Edge Real-time** | Correct Protocol | **WebSocket** (Bi-di) or **SSE** (Uni-di). Mandatory Heartbeats/Backpressure. |

## 4️⃣ Task-Based API & Anti-Naked-CRUD Protocol
- **Anti-Naked-CRUD**: NEVER expose generic CRUD APIs for core business entities (except for admin dictionaries). APIs MUST be modeled as explicit business verbs (e.g., `POST /devices/:id/report-fault` instead of `PUT /devices/:id`).
- **Read Model Analysis (CQRS lite)**: For dashboards and reporting, AI MUST preemptively design optimized Read-Models or Materialized Views (e.g., "Top 3 faulting zones this month") and explicit aggregation APIs. Do not force the frontend to calculate heavy aggregates from raw data.
