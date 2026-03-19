# ADR-{NUMBER}: {Short Title}
## Architecture Decision Record

> **Status**: [ PROPOSED | ACCEPTED | DEPRECATED | SUPERSEDED by ADR-{N} ]
> **Date**: {YYYY-MM-DD}
> **Deciders**: {Names or roles}
> **Compliance Tier**: [ Standard | GDPR | HIPAA | SOC2 ]

---

## Context & Problem Statement

> *What is the issue that motivates this decision? What is the context or state of the system at the time of this decision?*

{Describe the architectural challenge, the system state, and why a decision is needed now. Be specific about constraints (e.g., "Current p95 latency is 450ms; SLO requires 200ms").}

**Scale Tier at Decision Time**: [ Startup | Growth | Enterprise ]

---

## Decision Drivers

- {driver 1 — e.g., "Must support 10K RPS within 6 months"}
- {driver 2 — e.g., "Team has no Go experience — TypeScript constraint"}
- {driver 3 — e.g., "GDPR data residency requires EU-only infrastructure"}

---

## Considered Options

| Option | Summary | Pros | Cons |
|---|---|---|---|
| **Option A** | {Brief description} | {Advantages} | {Disadvantages} |
| **Option B** | {Brief description} | {Advantages} | {Disadvantages} |
| **Option C (Status Quo)** | Keep existing approach | No migration cost | {Why it fails} |

---

## Decision Outcome

**Chosen Option**: **Option {X}** — {one-line justification}

### Consequences

**Positive**:
- {outcome 1}
- {outcome 2}

**Negative / Trade-offs**:
- {trade-off 1}
- {trade-off 2}

**Deferred**:
- {What we are NOT solving now and when it will be revisited}

---

## Implementation Plan

> *High-level steps to implement the decision. Link to tickets/PRs where applicable.*

1. {Step 1}
2. {Step 2}
3. {Step 3}

**Estimated effort**: ~{N} engineering days  
**Target completion**: {Sprint / Date}

---

## Validation Criteria

> *How will we know this decision was correct? What metrics confirm success?*

- [ ] {Metric}: {Target value} by {Date}
- [ ] {Test}: {Expected result}
- [ ] Retrospective review scheduled: {Date}

---

## RFC 2119 Compliance Impact

> *List any ADBM/DDFM rules this decision affects or supersedes.*

| Rule | Level | Impact |
|---|---|---|
| ADBM §{N}: {Name} | MUST / SHOULD | {How this ADR affects it} |

---

## Related ADRs

- Supersedes: ADR-{N} *(if applicable)*
- Related to: ADR-{N}, ADR-{N}

---

<!-- 
USAGE INSTRUCTIONS:
1. Copy this template to docs/adr/ADR-{NUMBER}-{kebab-title}.md
2. Increment ADR number sequentially from 0001
3. First ADR is always: ADR-0001-initial-technology-stack.md
4. Link this ADR from the PRODUCT_SPEC.md Architecture section
-->
