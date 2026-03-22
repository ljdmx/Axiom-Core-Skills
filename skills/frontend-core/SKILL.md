---
name: frontend-core
description: Next-gen design system orchestrator for building sovereign, aesthetically superior web interfaces with extreme performance.
version: "10.2"
last_updated: "2026-03"
trigger_keywords: 
  - "create component"
  - "design system"
  - "frontend component"
  - "brand design"
  - "UI development"
  - "visual design"
  - "dashboard"
  - "landing page"
  - "responsive layout"
  - "dark mode"
  - "animation"
  - "mobile UI"
  - "UI/UX"
  - "color scheme"
  - "accessibility"
auto_activate: true
metadata:
  pattern: tool-wrapper, reviewer
  design-philosophy: ddfm-v10
token_budget:
  core_load: 10000      # SKILL.md only (must load first)
  full_load: 38000      # Full load ceiling
---

# Design-Driven Frontend Manifesto (DDFM)
> **Visual Manifest**: [Axiom Core Zenith Billboard](../_core_axioms/dashboards/zenith_billboard.html)
> **Token Depth Optimization**: To prevent exceeding processing limits, AI MUST NOT read all component rules simultaneously. It MUST dynamically navigate to `references/components/` (or equivalent documentation) to load ONLY the exact interactive constraints needed for the current component being coded.

## 🌐 Enterprise-Grade Visual Design Handbook (Methodology Edition)

---

**Step 0 —Aesthetic & A11y Audit [Reviewer]**:

> **Pattern: Reviewer**. Before any code change, AI MUST load `references/a11y-checklist.md` and score the current UI. Any score < 8.0 requires immediate remediation.

| Metric | Threshold | implementation |
|---|---|---|
| Contrast Ratio | 4.5:1 (AA) | WCAG 2.1 Compliance |
| Interactive Size | 44x44px | Touch target safety |
| Kinetic Soul | Spring-based | NO CSS `linear` easing |

---

## 🧘 Design Soul Constitution (10 Laws & Master Keys)

> [!IMPORTANT]
> The foundational 10 Laws of Aesthetic Sovereignty and Master Keys have been extracted to optimize token context.
> **AI MUST read `./references/SOVEREIGN_AESTHETICS.md` if evaluating overall product design or grading UI soul.**
> ```
> view_file(./references/SOVEREIGN_AESTHETICS.md)
> ```

---

> [!IMPORTANT]
> **Aesthetic Sovereignty**: Deliver "Surgical UI" by default. 
> **Functional Fidelity**: UI must be 100% functional. Every card, button, and chart must be connected to real data streams.
> **Business Edge-Case Mapping**: Do not stop at [Empty/Loading/Error]; explicitly model Business Edge-Cases (e.g., [Payment Timeout], [Device Offline]).
> **Language Purity**: NEVER mix Chinese and English. Use i18n pattern for all text.
> **Accessibility First (A11y)**: WCAG 2.1 AA compliance by default.
> **Generative UI Sandbox (V10 Rule)**: DDFM components MUST NOT be directly pushed to FSPC blindly. They must be generated as isolated Micro-Frontends (MFE). AI MUST invoke a local Storybook/Sandbox environment to render the component, capture a virtual visual regression AST (e.g., using Playwright visual match diffs), and verify 100% pixel-perfect layout alignment BEFORE handing it off to `product-core`.
> **Unified Exquisite Iconography (v10.1)**: NEVER mix icon families. You MUST strictly use exactly ONE premium vector icon library across the entire project. **Phosphor Icons v2.1 (Duotone or Fill weights)** is the absolute mandated world-class standard. All icons MUST have identical `stroke-width` (e.g., 1.5px), corner radius, and scale. 
> **Icon Auto-Discovery Gate (Zenith)**: AI MUST verify the exact export names of icons (e.g., `MagnifyingGlass`, `House`) against the installed package version. If an export is missing (e.g., `Quote` vs `Quotes`), AI MUST perform an AST-level search or check documentation before generating imports to prevent `SyntaxError`.
> **MUST READ**: `view_file(../_core_axioms/protocols/KERNEL_BOOTSTRAP.md)` —Inherit Global Nexus, Architectural Sovereign, and Soul Manifesto rules.
> **Standard Gates**: `view_file(../_core_axioms/protocols/STANDARD_GATES.md)` —Inherit 3-Axis Soul Diagnostic and Rejection Gate.

---

## 0️⃣ Intent Disambiguation Layer (Activate First)

> [!IMPORTANT]
> AI MUST classify the UI project on **three axes** BEFORE applying any rule. Output classification explicitly: `[Grade: Enterprise | Locale: LTR+RTL | Compliance: Standard]`

| Axis | Consumer | Enterprise/Tool | Compliance |
|---|---|---|---|
| **UI Grade** | Marketing, B2C, Landing Pages | B2B SaaS, Dashboards, Admin Panels | Regulated: Healthcare, Finance, Gov |
| **Localization** | Single language / LTR only | Multi-language / LTR | Multi-language + RTL (Arabic, Hebrew, Persian) |
| **Interaction Density** | Airy, parallax, emotional animations | Dense datagrids, bulk actions, keyboard-only | Accessibility-first, forced Reduced Motion |

**Activation Rules**:
- `Grade = Consumer` —Prioritize: Spring animations, glassmorphism, hero imagery, emotional saturated palettes.
- `Grade = Enterprise` —Prioritize: data density, sortable table headers, keyboard-only flows, print stylesheets.
- `Localization = RTL` —Enforce: `dir="rtl"` on `<html>`, replace all directional CSS (e.g., `margin-left` —`margin-inline-start`), audit icon mirroring (arrows, back/forward icons), test with Arabic/Hebrew dummy content.
- `Compliance` active —Enforce: WCAG 2.1 AAA for critical actions (contrast  7:1), forced `prefers-reduced-motion` support, skip-navigation links.

**Skill Kickoff Card** (AI MUST output immediately after §0, UNLESS activated by FSPC):
> **[SILENT MODE]**: If activated via FSPC, SUPPRESS this output entirely. Run silently.
```
🎨 [DDFM v9.2 Activated  FSPC-Aware Mode]
├─ UI Grade: [Consumer | Enterprise | Compliance]
├─ Locale: [LTR | RTL] | Dark Mode: First-Class Citizen
├─ Active: OKLCH + Spring 400/30 + Bento Grid + Stagger Cascade
├─ Soul Scorecard Baseline (Target: 7.0/10):
🌟 ├─ Understand: /10 | Respect: /10 | Companion: /10 | Delight: /10 | Ethics: /10
└─ Zero-AI Taste Protocol active. Describe your UI requirement.
```
- **Failure Protocol**: If Overall Soul Score < 7.0, propose design intervention BEFORE coding.
## 1️⃣-3️⃣ & 5️⃣ Core Design & Interaction Protocols (High-Density)

| Section | Mandate | Implementation / Execution |
|---|---|---|
| **§1 Tokens** | Design Sovereignty | No Magic Values or System Default Colors. All dimensions/colors/shadows MUST use CSS Custom Properties. CI fails on raw hex/pixel violations. Enforce strict HSL/OKLCH dynamic gradients, advanced glassmorphism, and soft UI depth layers. |
| **§2 Colors** | Circadian Rhythm | 🎨 5% Brand. UI MUST inherently adapt OKLCH color temperature dynamically based on the local timezone (Circadian mapping), surpassing simple binary dark modes. WCAG AA (4.5:1) min contrast. |
| **§3 State Sync** | URL Sovereignty | Sync pagination/filters to URL search params. Optimistic UI (`useOptimistic`) + offline caching (`IndexedDB`). |
| **§5 Kinetics** | Physics-Based | Mandatory 200-300ms bezier curve transitions for micro-interactions to guarantee premium feel. INP < 200ms. Spring (`400/30`) for visceral; Breathing (`bezier`) for calm. Virtualize lists > 200 rows. **Premium Resources**: Use `Magic UI` (Animated Beam/Marquee), `Aceternity UI` (Background Beams/Sparkles), and `Motion Primitives` for high-fidelity interactive components. |

> **MUST READ**: `view_file(./references/kinetics-state.md)` —Kinetics, Animations, and State Machine Logic.

## 6️⃣-9️⃣ Premium Polish & Pipeline (High-Density)

| Section | Mandate | Implementation / Execution |
|---|---|---|
| **§6 Skeletons** | CLS Elimination | No generic spinners. Exact-dimension skeleton placeholders mirroring success state geometry. |
| **§7 Texture** | Material Realism | Noise overlays (opacity 0.02) + soft diffuse shadows. Multi-layered `box-shadow` depth. |
| **§8 Layout** | The Three Paradigms | **Kenya Hara (Void)**: Spacing as content. **Arc**: Spatial immersion. **Notion**: Block-fluidity. **Ultrawide (21:9) Mandate**: Layouts MUST use fixed `max-width` column anchoring bounded by heavy symmetric negative space; NEVER default to simple fluid flex expansion that breaks cognitive grouping. |
| **§9 Media** | LCP Optimization | WebP/AVIF only. Mandatory `width/height`. `fetchpriority="high"` for LCP hero. |

## 1️⃣0️⃣-1️⃣3️⃣ Technical & Architecture Constraints (On-Demand)
> [!IMPORTANT]
> Detailed rules for XSS Guards, Error Boundaries, Rendering Islands, and Data Mocking have been extracted.
> ```
> view_file(./references/advanced-ui-rules.md)
> ```

## 1️⃣4️⃣-1️⃣8️⃣ Extended Rules (On-Demand Load)

> [!IMPORTANT]
> These rules apply to specific contexts (Data-Vis, i18n, Forms, SEO). Load on demand to conserve token budget.
> **Trigger**: Any project with dashboards —load §14. Multi-language → §16. Forms > 3 fields → §17. Public pages → §18.
>
> ```
> view_file(./references/frontend-rules-extended.md)
> ```

| Section | Topic | Load When |
|---|---|---|
| §14 | Data Visualization (chart types, anti-flicker) | Project has dashboards or charts |
| §15 | Visual Proportion Table (desktop/mobile) | Generating layout-heavy components |
| §16 | i18n Engineering + RTL Support | Multi-language or Arabic/Hebrew locale |
| §17 | Form UX Golden Rules (validation, a11y) | Forms with > 3 fields or multi-step flows |
| §18 | Public Page SEO (OG tags, JSON-LD, CWV) | Any public-facing route |

## 1️⃣9️⃣-2️⃣2️⃣ Advanced Design Coherence Protocols (On-Demand)
> [!IMPORTANT]
> Scoring protocols, state matrices, zero-drift checks, and texture realism rules have been extracted.
> ```
> view_file(./references/advanced-ui-rules.md)
> ```

## 2️⃣2️⃣-2️⃣7️⃣ Visual Excellence (On-Demand Load)

> [!IMPORTANT]
> These rules define high-tier aesthetics (Texture, Bento, Typography, Brand Soul, Motion). Load on demand.
>
> ```
> view_file(./references/SOVEREIGN_AESTHETICS.md)
> ```

| Section | Topic | Load When |
|---|---|---|
| §22 | Texture and Depth | Creating premium layer materials (glass, paper) |
| §23 | Asymmetric Bento Grids | Landing pages or non-generic dashboards |
| §24 | Cinematic Typography | Setting up the typography system |
| §26 | Brand Magnetic Field | **MANDATORY** at start of all new projects |
| §27 | Motion Choreography | When implementing any animations |

## 2️⃣5️⃣ Zero-AI-Aesthetic & Aesthetic Firewall (On-Demand)
> [!IMPORTANT]
> The Zero-AI Aesthetic protocol (banning generic shadows, centered grids, and gradients) and the Adversarial Persona system have been extracted.
> ```
> view_file(./references/advanced-ui-rules.md)
> ```


> [!IMPORTANT]
> These design math and OKLCH color rules are extracted to references/design-math.md to optimize token usage. Read when defining semantic tokens or spatial rhythmic grids.

## 🧠 AI Execution Protocol —Unified Delivery Workflow

**Execute in strict order for EVERY product:**
0. `Clean Slate` —Delete default framework boilerplate (e.g., `page.tsx`). Wipe default `globals.css` before applying DDFM tokens.
1. `Classify & Define Tokens` —Classify UI as Consumer-Grade or Enterprise/Tool-Grade. Create CSS Day/Night variables. Model states as explicit strings (not booleans).
2. `Load Proportions` —Follow Brand —%, Background 60-70% rule. Scan `[UI Templates](templates/)` to avoid reinventing components.
3. `Generate Component` —Strict semantic HTML. Sanitize rich text (`DOMPurify`). Optimize images (`loading`, `width`, `height`, `fetchpriority`). Apply Spring/Cubic-Bezier animations. Preload LCP logic. Dynamic import heavy libs.
4. `Embed Skeleton & Optimistic Logic` —Build exact-dimension loading skeletons. Write optimistic mutations (`useOptimistic` or manual rollback).
5. `Quality Gate` —Verify all items below. Items marked **🛑 HARD BLOCK** must pass before handoff. Items marked **⚠️ WARN** must be logged and resolved before final delivery but do not block component handoff:

   | Check | Level |
   |---|---|
   | XSS safety (no raw `dangerouslySetInnerHTML`) | 🛑 HARD BLOCK |
   | SSR hydration isolation (`"use client"` where needed) | 🛑 HARD BLOCK |
   | Business Edge-Cases (payment timeout, offline) modeled | 🛑 HARD BLOCK |
   | Mobile-First breakpoints applied | 🛑 HARD BLOCK |
   | Anti-Gimmick Gate (No unnecessary 3D/animations hiding bad UX) | 🛑 HARD BLOCK |
   | Mock-First fallback (`defaultMockData`) present | ⚠️ WARN |
   | Data-Vis chart type matches decision tree | ⚠️ WARN |
   | i18n keys used (no hardcoded user-facing strings) | ⚠️ WARN |
6. `Aesthetic & A11y Audit` - Run `node [Aesthetic Scorer](tools/aesthetic-scorer.js)`. **The script's output score is the canonical authority for Design Coherence Score (§19) - its rubric identically mirrors the three-axis protocol (Layout Rhythm, Color Harmony, Spatial Hierarchy) defined in §19.** Run Lighthouse `--accessibility` or `npx axe-core`. Run a deterministic contrast ratio computation (simulating OKLCH/Hex) **separately** for light mode AND dark mode before DOM layout - both MUST pass WCAG 4.5:1 for normal text and 3:1 for large text. **All checks must score >= 90. Block handoff if any fails.**
7. `Visual Regression Gate` —Run `npx playwright screenshot` on all modified pages and compare pixel diffs against baseline snapshots (`pixelmatch` or `Chromatic`). If pixel diff > 0.1% on unintended areas —**BLOCK** handoff, output diff report, await explicit approval.
## 🛠️Template Catalog (Reference Blueprints)
To accelerate implementation, AI MUST leverage these premium templates when applicable:
- **UI Kits & Themes**: `templates/ui-kits/premium-dark-theme.md`, `templates/ui-kits/minimalist-luxury.md`
- **Micro-interactions**: `templates/animations/micro-interactions.md`
- **Complex Modules**: `templates/forms/multi-step-checkout.md`

## 2️⃣8️⃣ Zenith Ascension: Zero-Error Execution & Deterministic Aesthetics
- **Zero-Error Initialization (Sandbox Init)**: AI MUST explicitly lock architecture-defining dependencies. Before generating components, AI MUST run a relative path script (e.g., `node ../backend-core/tools/sandbox-init.js` or `sh ./scripts/verify-env.sh`) to assert dependencies and silently install missing packages. Always use standard local bootstrap scripts to guarantee consistent Node, Vite, and Tailwind module versions.
- **Path Resolution**: AI MUST use relative paths and invoke `node tools/path_resolver.js` to ensure reliable file resolution across different OS environments.
- **Self-Healing Validation**: Do not wait for user visual bug reports. AI MUST proactively intercept UI compilation warnings and run local tests via relative paths. If styles fail to compile, AI MUST autonomously loop and fix the engine configuration.
- **Aesthetic Determinism**: The system MUST NEVER output raw, unstyled skeleton components outside of explicit wireframe modes. AI MUST source premium, pre-tested visual configurations (like dynamic blurred glows, Auto-Row fluid grids, and glassmorphism) from local relative `./templates/` directories. World-class aesthetics are a mandatory baseline, never an afterthought.
- **Standalone Mode**: If global `_core_axioms` or `product-core` are missing, the skill MUST still function independently by degrading to its internal minimalistic defaults rather than failing.

## 2️⃣9️⃣ Zenith Ascension II: DOM-AST Validation & Visuals-as-Data
- **Millisecond AST Enforcement**: AI MUST NEVER rely on slow visual browser captures to verify UI aesthetic compliance. AI MUST invoke a deterministic AST parser (e.g., `node ./scripts/ast-style-checker.js`) to scan all generated components.
- **Fail-Fast Aesthetic Breakpoint (Micro-healing)**: If the AST parser detects ANY missing DDFM aesthetic primitives (e.g., missing `hover:` states, `blur-xl`, `bg-brand/10`, `mix-blend-overlay`), AI MUST immediately halt the scanning of the remaining project. It MUST throw an `[Aesthetic Error] Breakpoint`, spawn a lightweight self-healing sub-task to fix the specific component instantly using minimal tokens, and only then resume the scan. NEVER accumulate errors for a final report when they can be fixed instantly.

## Admin Protocols (Ecosystem, Health, Evolution)
1. **Routing & Health**: Use `tools/aesthetic-scorer.js` for quantification. All components MUST score >= 90 before handoff. Use `templates/` for boilerplate. See `templates/_meta.json` or `references/MANIFEST.md` for ecosystem mapping. If missing, apply fallback rules inline. **Mandatory Audit**: Run `node tools/audit-skill.js [target_path]` before handoff. Verify Gate 0C security compliance.
2. **Evolution**: If a rule fails 3+ times, a UI pattern is obsolete, or a tool >18mo old, generate `skill-amendment-proposal.md`.

---

## Changelog

| Version | Date | Summary |
|---|---|---|
| v10.2 | 2026-03-20 | Zenith: AI Aesthetic Firewall (§25.1), Nexus Protocol sync added. |
| v9.3 | 2026-03-19 | Added Zero-Error Compilation Guarantee (AST-level checks in audit-skill.js) and Unified Exquisite Iconography constraint. |
| v9.2 | 2026-03-09 | Added Global Nexus Protocol sync mandate — reads PROJECT_NEXUS.json at session start. |
| v9.1 | 2026-03-09 | Sections 14-18 extracted to references/frontend-rules-extended.md (saves ~8K tokens). Section 12 Rendering Islands expanded with framework selection guide, island sizing rules, hydration cost audit. Added references/a11y-checklist.md and references/design-token-system.md. Updated Admin Protocols to reference new docs. |
| v9.0 | 2026-02-28 | Brand Magnetic Field (section 26), Asymmetric Bento Grid (section 23), Cinematic Typography (section 24), Zero-AI-Aesthetic (section 25), Contextual Color Semantics (section 28), Stagger Cascade (section 27). |
| v8.0 | 2026-01-10 | Design Coherence Score (section 19), Component State Matrix (section 20), Design Drift Detector (section 21), Texture and Depth (section 22). |

---

| Version | Date | Summary |
|---|---|---|
| v10.2 | 2026-03-20 | Implemented AI Aesthetic Firewall (25.1) and Nexus Protocol sync. |
| v10.1 | 2026-03-20 | Global English cleanup and ASCII standardization. |
| v10.0 | 2026-03-09 | Initial Zenith v10 release. |
