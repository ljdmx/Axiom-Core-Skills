# TECH_DEBT.md â€?Technical Debt Register
## Project: {Project Name} | Last Updated: {Date}

> **Purpose**: Centralized registry of all `[DEFERRED]` architectural items. This is a first-class project artifact delivered alongside code. Debt is not hidden â€?it is made visible, quantified, and assigned.
> **Update Policy**: AI MUST append to this file at every session end. Human engineers own resolution.
> **Aging Rule**: Any item stale for > 3 milestones auto-escalates: P3 â†?P2 â†?P1.

---

## ðŸ“Š Debt Summary

| Priority | Count | Estimated Resolution Cost |
|---|:---:|---|
| P1 (Critical â€?resolve this sprint) | 0 | â€?|
| P2 (High â€?resolve this quarter) | 0 | â€?|
| P3 (Medium â€?backlog) | 0 | â€?|
| **Total** | **0** | **â€?engineering sprints** |

---

## ðŸ”´ P1 â€?Critical

> Items that, if left unresolved beyond trigger condition, will cause service degradation or compliance violations.

<!-- Template for each item:

### [DEFERRED: {Component/System}]
- **What**: {Brief technical description}
- **Trigger**: {Measurable condition, e.g., "MAU > 10K" or "DB read QPS > 500"}
- **Business Risk**: {User-facing consequence, e.g., "p95 API latency exceeds 500ms, degrading checkout conversion by ~3%"}
- **Resolution Cost**: ~{N} engineering sprints
- **Assignee**: {Team / Role}
- **Added**: {Date} | **Last Review**: {Date} | **Escalated From**: P{N} on {Date}

-->

*(No P1 items)*

---

## ðŸŸ  P2 â€?High Priority

<!-- Add P2 items here using the template above -->

*(No P2 items)*

---

## ðŸŸ¡ P3 â€?Backlog

<!-- Add P3 items here using the template above -->

*(No P3 items)*

---

## âœ?Resolved

> Items that have been implemented and removed from active debt.

| Item | Resolved In | PR / ADR | Resolution Date |
|---|---|---|---|
| *(empty)* | â€?| â€?| â€?|

---

## ðŸ“ Debt Velocity Metrics

> Track these metrics sprint-over-sprint to ensure debt isn't accumulating faster than it's resolved.

| Metric | Current | Target | Trend |
|---|---|---|---|
| New debt items added this sprint | 0 | â‰?2 | â€?|
| Debt items resolved this sprint | 0 | â‰?1 | â€?|
| P1 items older than 1 milestone | 0 | 0 | âœ?|
| Total open debt (sprints) | 0 | â‰?10 | â€?|

---

## ðŸ” Auto-Escalation Log

> Items that have been automatically escalated due to the Debt Aging Rule (> 3 milestones unresolved).

| Date | Item | Escalation | Reason |
|---|---|---|---|
| *(empty)* | â€?| â€?| â€?|

---

<!--
USAGE INSTRUCTIONS:
1. Place this file at: /references/TECH_DEBT.md in each project repository
2. AI appends new [DEFERRED] items at each session end
3. Engineering team reviews and assigns owners in sprint planning
4. Resolved items move to the "Resolved" table â€?never delete them
5. Link this file from README.md under "Architecture & Technical Debt"
-->
