# FSPC Execution & Handoff Gates (On-Demand)
## §6–§15 Delivery Quality Rules

> **Status**: ACTIVE — Loaded on-demand by FSPC SKILL.md.
> **Purpose**: Defines all delivery quality gates for the Execution and Handoff phases of a product build. These rules apply AFTER Phase 0C scaffold is complete.
> **Load Trigger**: Entering the EXECUTION phase OR any HANDOFF milestone.
> **Usage**: `view_file(docs/product-execution-gates.md)`

---

## 6️⃣ Docs-as-Code
A premium software delivery includes a transmission of architectural mindset.
- **Mandate**: A repository is incomplete without user-facing/team-facing documents.
- **Execution**: Deliver `PRODUCT_SPEC.md` and `docs/adr/` (Architecture Decision Records).

## 7️⃣ Telemetry & Analytics by Default
Enterprise-grade SaaS products do not add analytics as an afterthought; it is built into the DNA.
- **Mandate**: Every user flow MUST track "Conversion Events" and "Value Triggers" via injected hooks (`useAnalytics()`).

## 8️⃣ Shift-Left Testing (TDD & BDD First)
Testing is not the final step; it is the blueprint.
- **Mandate**: AI MUST generate E2E/Unit test cases mapping directly to requirements BEFORE writing business logic.
- **Test Pyramid Layering** (required distribution):

  | Layer | When to Write | Min Coverage |
  |---|---|---|
  | Unit (pure functions, utils, validators) | Alongside business logic | ≥ 80% of logic functions |
  | Integration (DB + Queue + Cache interactions) | After service layer | ≥ 60% of critical paths |
  | E2E (complete user-role flows) | After M1 delivery | ≥ 3 full business workflows |
  | Contract (service-to-service API agreements) | Before Quantitative Gate | 100% of inter-service calls |
  | **A11y Scan** (`@axe-core/playwright` assertions) | Alongside E2E tests | **0 critical violations** |

## 9️⃣ Quantitative Quality Gates
A module cannot pass the gate unless it meets hard numerical limits:
- **Frontend Perf Gate**: Target Google Lighthouse Score >= 90.
- **Backend Perf Gate**: Target API Response Time (p95) < 200ms.
- **Coverage Gate**: Critical path test coverage > 80%.

## 🔟 Self-Healing with Circuit Breakers (Anti-Infinite-Loop)
- **Mandate**: Track retry attempts during auto-patching to prevent autonomous loops.
- **Categorization Rule**:
  - **Retryable Errors** (e.g., network timeout, port conflicts, file locks): Auto-retry, Max Retries = 3.
  - **Architectural Errors** (e.g., API Breaking Changes, schema incompatibility, engine type unsupported): MUST NOT retry blindly. Immediately stop, output Root Cause Analysis, and Fallback to Human Decision.

## 1️⃣1️⃣ Rollback, Canary & Incident Response (The "Abort" Sequence)
- **Mandate**: A release is incomplete without a validated rollback plan and triage protocol.
- **Execution**: During the Handoff phase, AI MUST deliver a `ROLLBACK_RUNBOOK.md` detailing:
  1. How to revert the application container (e.g., `docker pull <previous-tag>`).
  2. How to evaluate if an emergency Down-Migration is required for the database.
  3. The exact error rate (>1%) or p99 latency (>2s) thresholds that trigger immediate automatic or manual rollback.
- **On-Call Playbook**: AI MUST generate an `ALERT_PLAYBOOK.md` defining the immediate top 3 triage and diagnostic steps for critical SLO breaches (e.g., "If DB CPU > 90%, check top queries via Pg_Stat_Statements"). This playbook MUST include an **Escalation Matrix**, strictly mapping incident severity (P1/P2/P3), response time SLAs, and the responsible roles (e.g., Platform Lead -> CTO) to prevent incident paralysis.

## 1️⃣2️⃣ Microcopy Sovereignty (Anti-Lorem-Ipsum Mandate)
- **Mandate**: The most persistent "AI taste" in any product is generic, lifeless copywriting. Placeholder text, empty state messages, button labels, and tooltips MUST be treated as first-class product decisions, not afterthoughts.
- **Anti-Generic Copy Rules**:
  - **Empty States**: NEVER output `"No data available"`, `"Nothing here yet"`, or `"No items found"`. MUST write a domain-specific, slightly poetic call-to-action:
    ```
    ❌ "No devices found"
    ✅ "Your fleet is quiet. Add the first sensor to start listening to your infrastructure."

    ❌ "No reports generated yet"
    ✅ "Your analytics canvas is clean. Run the first report to reveal what's beneath the surface."
    ```
  - **Error Messages**: NEVER output `"An error occurred"` or `"Something went wrong"`. ALL error messages MUST explain the cause and the immediate user action (enforces ADBM §2 `human_readable_cause` + `suggested_action`).
  - **Loading States**: NEVER use bare spinners. Loading skeletons MUST be accompanied by a micro-message that reduces anxiety (e.g., `"Syncing your data…"`, `"Building your report…"`).
  - **Button Labels**: NEVER use generic verbs (`Submit`, `OK`, `Click here`). Every button label MUST be a specific action-outcome pair (e.g., `"Send Invitation"`, `"Publish Changes"`, `"Download as PDF"`).
- **Fake-Name Prohibition**: User names in seed data, demo accounts, and default avatars MUST NOT be `John Doe`, `Test User`, `Admin`, or `user@example.com`. Use culturally diverse, memorable personas (e.g., `Amara Osei`, `Liu Kaiyuan`, `Isabelle Morin`).

## 1️⃣3️⃣ Zero Dead-End Routing Gate ("No Broken Windows" Protocol)
- **Mandate**: A product where navigation dead-ends exist is not a product; it is a mockup. This gate enforces 100% navigational completeness before the Handoff milestone.
- **Final Gate Checklist** (AI MUST self-verify ALL before marking Handoff complete):

  | Link / Interaction | Acceptable Implementation | HARD BLOCK Condition |
  |---|---|---|
  | "Forgot password?" link | Functional flow: enter email → receive OTP/link → reset | `href="#"` or `console.log()` |
  | "Help / Documentation" link | Opens doc page, modal, or email link | `href="#"` or 404 |
  | "Account Settings" link | Navigates to settings page with at least profile + password change | Empty shell page |
  | "Back" / breadcrumb navigation | Working browser history pop or explicit route navigation | No back affordance |
  | "Cancel" buttons in modals | Closes modal with no side effects | No `onClick` handler |
  | "Delete" confirmation dialogs | Full confirm → delete → success toast → redirect flow | Partial implementation |
  | Pagination / Load More | Functional with correct page boundaries | Hardcoded page 1 only |
  | Social login buttons (if present) | Fully wired OAuth flow OR removed entirely | Styled but non-functional |

- **Zero `href="#"` Policy**: AI MUST run a pre-handoff grep: `grep -rn 'href="#"' ./src`. Any result = HARD BLOCK. Replace with real routes, modal triggers, or explicit TODOs tracked in the Tech Debt Register.
- **Zero Untracked TODO Policy**: Run `grep -rn "TODO" ./src`. All TODOs must be either implemented or explicitly added to the Technical Debt Register. Untracked TODOs are a deploy blocker.

## 1️⃣4️⃣ Infrastructure-as-Code Manifest (Deployability Gate)
- **Mandate**: A product that cannot be deployed by following 3 commands is not a product. The entire deployment topology MUST be expressed as code at Handoff.
- **Required IaC Artifacts** (AI MUST generate ALL of these before marking Handoff complete):

  | Artifact | Purpose | Minimum Standard |
  |---|---|---|
  | `docker-compose.yml` | Local full-stack orchestration | App + DB + Redis + Nginx/Caddy + optional Queue worker |
  | `.env.dev` / `.env.production.example` | Environment variable documentation | ALL variables documented, NO secrets committed |
  | `.github/workflows/ci.yml` | CI pipeline | Lint → Typecheck → Test → Build → Docker push |
  | `DEPLOY.md` | Deployment runbook | Step-by-step deploy to target platform (Vercel/Render/Fly.io/Docker) |
  | `ROLLBACK_RUNBOOK.md` | (from §11) | Must include DB rollback decision tree |

- **Cloud-Native Deploy Script**: If the target platform is Vercel/Render/Fly.io, AI MUST generate the corresponding config file (`vercel.json`, `render.yaml`, `fly.toml`) in addition to Docker Compose.
- **One-Command Local Boot Test**: Immediately after generating all IaC artifacts, AI MUST simulate `docker compose up --build` and verify ALL services reach healthy state. A successful boot is the final acceptance criterion for this gate.

## 1️⃣5️⃣ Universal State Coverage Mandate (Skeleton + Empty + Error)
- **Mandate**: For every component that fetches data from an API, AI MUST generate exactly **three companion visual states** alongside the primary "success" state. A component without all three companions is incomplete and will not pass the Handoff gate.
- **The Four Required States** (auto-generated for EVERY data-fetching component):
  ```
  [State: loading]  → Exact-dimension Skeleton (matches success layout geometry, no generic spinner)
  [State: empty]    → Illustrated Empty State + domain-specific CTA (no "No data" text allowed)
  [State: error]    → Error Fallback + action button ("Try Again") + Error Boundary wrap
  [State: success]  → Primary content (the component itself)
  ```
- **Skeleton Geometry Contract**: The skeleton MUST replicate the exact spatial layout of the loaded state. If the success state has a 48px avatar + title + 2 body lines, the skeleton MUST have: a `48px circle` + a `200px wide bar` + two bars at `80%` and `60%` width. Generic full-width bars are NOT acceptable.
- **Error Boundary Wrap**: EVERY data-fetching section MUST be wrapped in a React/Vue Error Boundary. Unhandled JS runtime errors MUST trigger the `[error]` state component, not a global white screen.
- **Cinematic First Run Guarantee**: When the seed data is loaded and the app boots for the first time, 100% of UI components MUST render in `[success]` state. Zero components may display `[empty]` state on a properly seeded database. Violating this is a seed data failure, not a UI failure.
