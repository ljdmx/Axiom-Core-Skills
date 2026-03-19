# TECH_DEBT.md — Technical Debt Register
## Project: {Project Name} | Last Updated: {Date}

> **Purpose**: Centralized registry of all `[DEFERRED]` architectural items. This is a first-class project artifact delivered alongside code. Debt is not hidden — it is made visible, quantified, and assigned.
> **Update Policy**: AI MUST append to this file at every session end. Human engineers own resolution.
> **Aging Rule**: Any item stale for > 3 milestones auto-escalates: P3 → P2 → P1.

---

## 📊 Debt Summary

| Priority | Count | Estimated Resolution Cost |
|---|:---:|---|
| P1 (Critical — resolve this sprint) | 0 | — |
| P2 (High — resolve this quarter) | 0 | — |
| P3 (Medium — backlog) | 0 | — |
| **Total** | **0** | **— engineering sprints** |

---

## 🔴 P1 — Critical

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

## 🟠 P2 — High Priority

<!-- Add P2 items here using the template above -->

*(No P2 items)*

---

## 🟡 P3 — Backlog

<!-- Add P3 items here using the template above -->

*(No P3 items)*

---

## ✅ Resolved

> Items that have been implemented and removed from active debt.

| Item | Resolved In | PR / ADR | Resolution Date |
|---|---|---|---|
| *(empty)* | — | — | — |

---

## 📏 Debt Velocity Metrics

> Track these metrics sprint-over-sprint to ensure debt isn't accumulating faster than it's resolved.

| Metric | Current | Target | Trend |
|---|---|---|---|
| New debt items added this sprint | 0 | ≤ 2 | — |
| Debt items resolved this sprint | 0 | ≥ 1 | — |
| P1 items older than 1 milestone | 0 | 0 | ✅ |
| Total open debt (sprints) | 0 | ≤ 10 | — |

---

## 🔁 Auto-Escalation Log

> Items that have been automatically escalated due to the Debt Aging Rule (> 3 milestones unresolved).

| Date | Item | Escalation | Reason |
|---|---|---|---|
| *(empty)* | — | — | — |

---

<!--
USAGE INSTRUCTIONS:
1. Place this file at: /docs/TECH_DEBT.md in each project repository
2. AI appends new [DEFERRED] items at each session end
3. Engineering team reviews and assigns owners in sprint planning
4. Resolved items move to the "Resolved" table — never delete them
5. Link this file from README.md under "Architecture & Technical Debt"
-->
