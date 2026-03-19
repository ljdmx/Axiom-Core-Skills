# Product Business Intelligence — Domain Analysis Framework

> **Status**: ACTIVE — Load when user prompt exceeds 5 Core Entities OR has cross-industry complexity.
> **Purpose**: Provides structured decision templates for DDD analysis, User Journey mapping, and API design. These are cognitive frameworks for the AI, not executable code.

---

## 1️⃣ DDD Domain Analysis Checklist

Before designing any data model, AI MUST classify all business concepts:

| Type | Criterion | Examples |
|---|---|---|
| **Core Entity** | Has unique identity + lifecycle | `User`, `Order`, `Device`, `Invoice` |
| **Value Object** | Immutable, defined by attributes only | `Address`, `Money`, `DateRange`, `SKU` |
| **Aggregate Root** | Controls consistency boundary, has inbound FK arrows | `Order` (owns `OrderItems`) |
| **Domain Service** | Business logic spanning multiple entities | `PricingService`, `InventoryAllocationService` |
| **Domain Event** | Something that happened, past-tense named | `OrderPlaced`, `DeviceOffline`, `PaymentFailed` |

**Aggregate Boundary Rule**: Every write operation MUST target exactly one Aggregate Root. Cross-aggregate consistency is handled by Domain Events + eventual consistency — NEVER by cross-boundary transactions.

---

## 2️⃣ User Journey Anti-Friction Diagnosis

For every core user flow, AI MUST identify the **Drop-Off Risk Zone**:

| Signal | Risk Level | Required Action |
|---|---|---|
| Form has > 5 fields in one step | 🔴 High | Split into multi-step wizard |
| Primary CTA is below the fold | 🟡 Medium | Move CTA into visible viewport |
| Registration required before value | 🔴 High | Add Guest / Social login first |
| Error state shows only red text | 🟡 Medium | Add `human_readable_cause` + action hint |
| Loading state is a bare spinner | 🟡 Medium | Replace with Skeleton + progress message |
| "Aha Moment" is not defined | 🔴 Critical | Define it in PRD before sprint planning |

**Aha Moment Protocol**: Every product MUST define the single action that predicts 30-day retention (e.g., "User creates their first dashboard" for SaaS, "First 3 IoT readings received" for IIoT). All onboarding funnels optimize toward this moment, not toward registration completion.

---

## 3️⃣ Data Model Quality Gates

Before writing any schema, verify against this checklist:

```
□ All entities have: id (UUIDv7), created_at, updated_at, created_by
□ Soft delete: deleted_at IS NULL pattern on User, Order, Payment, Transaction
□ PII fields tagged with phi_ prefix (for HIPAA) or encrypted_at_rest annotation (GDPR)
□ Enum fields use string type with explicit values (not integers)
□ Foreign keys use ON DELETE RESTRICT by default (not CASCADE) — explicit cascade = business decision
□ Indexes on: all FK columns, status, created_at for time-range queries
□ Cursor pagination for any table > 10K rows (offset pagination scales linearly with table size)
□ Aggregate Roots clearly identified in ERD/Mermaid diagram
```

---

## 4️⃣ API Design Decision Tree

```
Is this a state change to a business entity?
│
├─ YES → Use a business verb (NOT naked CRUD)
│          "user submits order"  → POST /orders/:id/submit
│          "device reports fault" → POST /devices/:id/report-fault
│          "payment fails"       → POST /payments/:id/fail
│
└─ NO → Is this a read for UI display?
         │
         ├─ Aggregate/KPI for dashboard → GET /metrics/{chart-name}
         │   (pre-aggregate server-side, never raw rows to frontend)
         │
         └─ Simple resource lookup → GET /resources/:id
```

**Naming Conventions**:
- `POST /resources/:id/{verb}` — business action on a resource
- `GET /metrics/{scope}` — aggregated read model for dashboards
- `GET /summaries/{scope}` — lightweight stat cards
- `GET /exports/{scope}` — async export triggers (responds 202 Accepted)

---

## 5️⃣ UI/UX Conversion Optimization Playbook

| Scenario | Root Cause | Intervention |
|---|---|---|
| Low signup conversion | High-friction form | Social OAuth + Magic Link first |
| Cart abandonment | Trust gap or payment friction | Security badges + guest checkout + Stripe-hosted page |
| Low feature adoption | Poor discoverability | Progressive disclosure + contextual empty states |
| High bounce on complex flows | Cognitive overload | Step indicators + smart defaults + save-draft |
| No repeat usage | No "Aha Moment" captured | Define + track activation event; optimize boarding toward it |

---

## 📋 Changelog

| Version | Date | Summary |
|---|---|---|
| v2.0 | 2026-03-09 | Complete rewrite — eliminated 17KB of non-executable JS pseudocode. Replaced with 5 actionable Markdown decision frameworks. Token footprint: ~2KB (was ~4.5KB). |
| v1.0 | 2026-02-28 | Initial version — contained DataModelAdvisor, APIDesignAdvisor, UXAdvisor JS classes. |
