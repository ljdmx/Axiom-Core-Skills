# PRODUCT_SPEC.md ‚Ä?{Product Name}
## Product Requirements Document (PRD)

> **Version**: 0.1 (Draft)  
> **Status**: [ DRAFT | APPROVED | LOCKED ]  
> **Scale Tier**: [ Startup | Growth | Enterprise ]  
> **Compliance**: [ Standard | GDPR | HIPAA | SOC2 Type II ]  
> **PRD Lock**: NEVER begin code generation until STATUS = APPROVED (FSPC PRD Sign-Off Lock)

---

## üéØ Product Vision

### One-Line Pitch
> *"{Product Name} is the {category} that helps {target user} {core outcome} without {key friction/pain}."*

### Soul Blueprint (FSPC ¬ß0 Mandate)
1. **Core Soul**: {What emotional truth does this product embody?}
2. **Wireframe Narrative**: {What is the product's "day in the life" story?}
3. **Rams 10-Law Mapping**: {Which of the 10 laws (Innovative/Useful/Aesthetic...) is the primary anchor?}
4. **Paradigm Lineage**: {Which existing products does this borrow from? e.g., "Linear's speed + Notion's calm"}
5. **Anti-Mediocrity Oath**: {What will we NEVER do? What's your "forbidden" list?}

### Soul Scorecard
| Axis | Score /10 | Notes |
|---|:---:|---|
| Understand (You get me) | ‚Ä?| |
| Respect (No burden) | ‚Ä?| |
| Companion (Warmth) | ‚Ä?| |
| Delight (Surprise) | ‚Ä?| |
| Ethics (No dark patterns) | ‚Ä?| |
| **Overall** | **‚Ä?* | Target ‚â?7.0 |

---

## üë• User Personas & Role √ó Permission Matrix

### Target Personas
| Persona | Description | Core Job To Be Done | Aha Moment |
|---|---|---|---|
| **{Role 1}** | {Who they are} | {What they need to accomplish} | {The moment they "get" the product} |
| **{Role 2}** | | | |

### Role √ó Permission Matrix
| Action | {Role 1} | {Role 2} | Admin | Guest |
|---|:---:|:---:|:---:|:---:|
| Create {Entity} | ‚ú?| ‚ù?| ‚ú?| ‚ù?|
| Read {Entity} | ‚ú?| ‚ú?| ‚ú?| üîí |
| Update {Entity} | ‚ú?| ‚ù?| ‚ú?| ‚ù?|
| Delete {Entity} | ‚ù?| ‚ù?| ‚ú?| ‚ù?|
| Export | üîí | ‚ù?| ‚ú?| ‚ù?|
| Approve | ‚ù?| ‚ù?| ‚ú?| ‚ù?|

> Legend: ‚ú?Allow | ‚ù?Deny | üîí Conditional (specify condition inline)

---

## üß© Core Entities (Minimum 5 Required)

> *If fewer than 5 entities ‚Ä?FSPC Entity Threshold Gate is NOT met. Expand business depth first.*

```mermaid
classDiagram
  {EntityA} <|-- {EntityB} : contains
  {EntityB} <|-- {EntityC} : hosts
```

| Entity | Description | Key Fields | State Machine |
|---|---|---|---|
| **{Entity 1}** | | id, created_at, ... | {states if applicable} |
| **{Entity 2}** | | | |
| **{Entity 3}** | | | |
| **{Entity 4}** | | | |
| **{Entity 5}** | | | |

---

## üí∞ Commercial Loop (MANDATORY ‚Ä?FSPC MVP Commercial Loop Gate)

> *EVERY product MUST define this loop. Missing = PRD REJECTED.*

| Stage | Implementation | Metrics |
|---|---|---|
| **Acquisition** | {How users discover the product} | CAC, traffic source |
| **Activation** | {First value moment ‚Ä?the Aha Moment} | Activation rate ‚â?60% |
| **Monetization** | {Paywall / Quota / Subscription model} | ARPU, MRR |
| **Retention** | {History / assets / saved state that creates switching cost} | D7 ‚â?25%, D30 ‚â?10% |

### Pricing Architecture
| Tier | Price | Feature Limits | Target User |
|---|---|---|---|
| Free | $0 | {specific limits} | {persona} |
| Pro | $X/mo | Unlimited | {persona} |
| Enterprise | Custom | SSO + Audit Log | {persona} |

---

## ‚ú?Features & Delight Moments

### Core Feature Set (M1 ‚Ä?MVP)

| Feature | User Story | FSPC Gate | Status |
|---|---|---|---|
| **{F1}** | As a {role}, I want to {action} so that {outcome} | Soul ‚ú?/ Anti-Toy ‚ú?| ‚Ä?|
| **{F2}** | | | ‚Ä?|
| **{F3}** | | | ‚Ä?|

### Delight Moments (DDFM ¬ß0 ‚Ä?MDP Protocol)
> *At least 3 moments where the product surprises the user with unexpected warmth or magic*

1. **{Delight 1}**: {When it happens} ‚Ü?{What the user feels}
2. **{Delight 2}**: ...
3. **{Delight 3}**: ...

### Microcopy Decisions (FSPC ¬ß12)
| Screen / State | Generic (BLOCKED) | Product-Approved Copy |
|---|---|---|
| Empty state ‚Ä?{Entity list} | "No items found" | "{Domain-specific, slightly poetic CTA}" |
| Error state | "Something went wrong" | "{Cause + action}" |
| Loading | *bare spinner* | "{Contextual micro-message}" |

---

## üèóÔ∏?Architecture Brief

> *Filled during Phase 0B ‚Ä?not required before Phase 0A gate*

| Decision | Choice | Rationale (ADR Link) |
|---|---|---|
| Runtime | {Node.js / Python / Go} | [ADR-0001] |
| Database | {Postgres / MySQL / MongoDB} | |
| Auth | {NextAuth / Supabase / Custom JWT} | |
| Queue | {BullMQ / Celery / None} | |
| Deploy target | {Vercel / Fly.io / AWS} | |
| Tenant model | {Shared RLS / Separate Schema / Separate DB} | |

### FinOps Cost Estimate
| Scenario | Monthly Cost |
|---|---|
| Minimum (< 100 RPS) | $__ |
| Normal (target load) | $__ |
| Peak (5√ó normal) | $__ |
| **Primary Cost Driver** | {Service name} |

---

## üìä SLO Targets

| Flow Category | p99 Latency | Availability |
|---|---|---|
| Auth / Payment | ‚â?100ms | ‚â?99.99% |
| Core CRUD | ‚â?200ms | ‚â?99.9% |
| Reports / Exports | ‚â?5s | ‚â?99.5% |
| Background Jobs | ‚â?60s | ‚â?99.0% |

- **Error Rate SLO**: ‚â?0.1%
- **RPO** (Recovery Point Objective): ‚â?{N} hours
- **RTO** (Recovery Time Objective): ‚â?{N} hours

---

## üîê Compliance Checklist

- [ ] Privacy Policy drafted and linked
- [ ] Data Residency Decision Record created
- [ ] PII fields identified and marked `phi_` / `pii_` in schema
- [ ] Right-to-Erasure (GDPR Art.17) flow designed
- [ ] Cookie consent implemented (if GDPR)
- [ ] Audit Log scope defined

---

## ‚ú?PRD Sign-Off

> **PRD Lock Protocol**: This section is signed off by the USER. AI MUST receive explicit "Approve PRD" before executing `mkdir` or any code generation.

| Reviewer | Status | Date | Notes |
|---|---|---|---|
| Product Owner | ‚è?Pending | ‚Ä?| |
| Tech Lead | ‚è?Pending | ‚Ä?| |

**‚Ü?USER must reply "Approve PRD" to unlock code generation.**
