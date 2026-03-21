---
name: frontend-core
description: Next-gen design system orchestrator for building sovereign, aesthetically superior web interfaces with extreme performance.
version: "10.2"
last_updated: "2026-03"
trigger_keywords: ["create component", "design system", "frontend component", "brand design", "UI development", "visual design", "dashboard", "landing page", "responsive layout", "dark mode", "animation", "mobile UI", "UI/UX", "color scheme", "accessibility"]
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

## 🔟 Component-Level XSS Guard & CSP
- **Mandate**: The UI layer must autonomously defend against malicious payloads.
- **Execution**: NEVER use APIs like `dangerouslySetInnerHTML` or `v-html` with raw user input. If rich text rendering is unavoidable, AI MUST integrate a strict HTML sanitizer (e.g., `DOMPurify`) before injection.
- **CSP Headers**: For BFF frameworks (Next.js/Nuxt) or Nginx, AI MUST explicitly inject a `Content-Security-Policy` HTTP header that disables `unsafe-inline` scripts and sets strict `script-src` policies. This operates as the ultimate browser-level firewall against XSS.

---

## 1️⃣1️⃣ Component Error Boundaries & Hydration Stability
- **Error Boundaries**: Every independent business module (data table, sidebar, modal) MUST be wrapped in a React/Vue Error Boundary. JS runtime errors MUST trigger a localized Fallback UI (e.g., "Widget failed to load")—a single component failure MUST NEVER crash the entire page (global white screen).
- **SSR/RSC Hydration stability**: Zero-tolerance for Hydration Mismatch errors. ANY component rendering dynamic client-side state (timestamps, random numbers, `window` objects, `localStorage`) MUST be explicitly labeled with `"use client"` and MUST NOT render these dynamic values directly during the initial server pass.

## 1️⃣2️⃣ Rendering Islands Protocol
- **Performance Threshold**: For pages where > 75% of content is static (measured by: static-to-dynamic node ratio in the component tree), AI MUST prioritize Partial Hydration / Islands Architecture over full Client-Side Rendering.
- **Framework Selection**:
  - `Static Marketing / Docs` —**Astro** (zero JS by default, opt-in Islands for interactive widgets)
  - `Full-stack SaaS` —**React Server Components** (RSC) with selective `"use client"` boundaries
  - `High-interactivity dashboard` —Full CSR is acceptable when > 60% of components require real-time state
- **Island Sizing Rule**: Each interactive Island MUST be the smallest possible unit that requires client-side JS. Do NOT wrap entire page sections in a single `"use client"` boundary —split at the component level.
- **Hydration Cost Audit**: Before Handoff, AI MUST output the JS hydration budget: `{ total_islands, total_client_js_kb, heaviest_island, passes_200kb_budget: true/false }`. If `total_client_js_kb > 200`, decompose the largest islands further.
- **Measurement Command**: `npx bundle-analyzer` or `next build && next start` —check `.next/static/chunks/` sizes.

## 1️⃣3️⃣ Hyper-Realism Data Mocking & Zero-State Conversion
- **Mock-First Components (Storybook Ready)**: If the backend API is pending/failing, the UI MUST NOT white-screen. Components MUST include `defaultMockData` to render a high-fidelity static state.
- **Hyper-Realism Data Rule**: NEVER use lazy mock data like "Item 1", "Test Text", or gray empty rectangles. AI MUST populate placeholders with high-fidelity, contextual data (e.g., real Unsplash URLs `<img src="https://images.unsplash.com/photo-..." />`, realistic copywriting matching the domain, formatted dates, contextual avatars). The mockup must look like a living product, not a wireframe.
- **Zero-State Conversion (No Empty Rooms)**: When a list is genuinely empty (e.g., a new user with no sensors), NEVER just show "No Data". AI MUST draw an **Empty State with Call-to-Action (CTA)** (e.g., an illustration with a "[+ Add First Device]" button) to drive business conversion.

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

## 1️⃣9️⃣ Design Coherence Score Protocol
- **Mandate**: AI MUST self-score the delivered UI on three coherence axes before handoff.
- **Scoring Axes**:
  | Axis | Criteria | Min Score |
  |---|---|---|
  | **Layout Rhythm** | Consistent spacing scale, geometric tension (Golden Ratio/Fibonacci CSS Grid `fr`), whitespace proportion | —8/10 |
  | **Color Harmony** | Token-compliant palette, contrast ratios, —% brand color usage | —8/10 |
  | **Spatial Hierarchy** | Clear visual weight progression (H1→H2→Body→Caption), absolute Z-axis physical depth for WebXR | —8/10 |
- **Enforcement**: If any axis scores < 8/10 —AI MUST apply `Color Role Rebalancing` (adjust brand color proportion) or `Spacing Normalization` (realign to token scale) before handoff.
- **Quantifiable Anchors** (objective pass/fail criteria per axis):
  - **Layout Rhythm —8**: —95% of spacing values originate from the token system; zero raw pixel magic-numbers detected outside token definition files. Must explicitly leverage geometric CSS Grid ratios.
  - **Color Harmony —8**: All color values map to named tokens; brand color —5% of total rendered surface area; all text/bg pairs —WCAG 4.5:1.
  - **Spatial Hierarchy —8**: Font-size scale uses —4 distinct named steps; shadow depth increases monotonically from `card —hover —modal —overlay` mapping perfectly to spatial computing Z-index layers.

## 2️⃣0️⃣ Component State Matrix (State × Role × Data)
- **Mandate**: For every complex interactive component, AI MUST declare a **State Matrix** before implementation.
- **Activation Threshold** (auto-computed before implementation):
  - Condition A: `State × Role` intersection combinations —6, OR
  - Condition B: Any Role produces a different rendered output (e.g., hidden vs. visible button).
  - AI MUST count combinations and output: `[State Matrix Required: Yes/No —N combinations detected]` before coding.
- **Three Axes**:
  - **State**: `idle | loading | success | error | empty | disabled`
  - **Role**: `viewer | editor | admin | guest`
  - **Data**: `populated | partial | empty | overflowed`
- **Execution**: Map axis intersections that produce unique UI variants. Unhandled intersections are bugs. Example for an approval button:
  ```
  [State: idle] × [Role: viewer]  —Hidden
  [State: idle] × [Role: editor]  —Active "Submit" button
  [State: loading] × [Role: editor] —Disabled + spinner
  [State: success] × [Role: admin] —"Approved" badge + audit link
  ```

## 2️⃣1️⃣ Design Drift Detector
- **Mandate**: AI MUST perform a **Token Diff** before delivering any new component.
- **Execution**:
  1. Extract all CSS Custom Properties, spacing values, and typography scales used in the **new** component.
  2. Compare against the values used in the **3 most recently delivered** components. **If fewer than 3 components exist in the project**, use the `templates/` directory baseline components as the Token Comparison Reference.
  3. If any NEW raw value (not in the token system) is introduced —**BLOCK** delivery, replace with token equivalent.
  4. Output a `Design Drift Report`: `{ new_component, drifted_properties[], corrected_to_tokens[] }`.
- **Goal**: Guarantee zero design drift accumulation across a project's lifetime.

## 2️⃣2️⃣ Texture & Depth Sovereignty (Material Realism)
- **Mandate**: AI MUST never use flat, single-value color fills for large background surfaces. Flat color is the hallmark of low-quality AI-generated UI.
- **Noise Texture Protocol**: All large background panels (hero sections, card backgrounds, modal backdrops) MUST include an ultra-fine SVG noise texture overlay:
  ```css
  background-image: url("data:image/svg+xml,..."); /* SVG feTurbulence noise */
  mix-blend-mode: overlay;
  opacity: 0.025; /* 0.02—.04 range */
  ```
- **Raytracing-Like CSS Illumination**: Any premium card or dark mode surface MUST completely abandon basic `box-shadow`. Instead, it MUST implement physically accurate, multi-layered diffuse glow mimicking bounced light, combined with inner 1px borders (`box-shadow: inset 0 1px 0 rgba(255,255,255,0.1)`) to establish hyper-realistic edge highlights.
- **Multi-Layer Glassmorphism Sovereignty**: For overlapping transparent surfaces, AI MUST explicitly define strictly separated structural layers to avoid muddy transparency. A dynamic noise layer (`z-index: 2`, `mix-blend-mode: overlay`) MUST sit above the blur layer (`z-index: 1`, `backdrop-filter: blur(16px)`). Never allow unfiltered text overlay.
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

## 2️⃣5️⃣ Zero-AI-Aesthetic Protocol (Ruthless De-emphasis)
- **Mandate**: AI-generated UIs are often "uniformly important" —everything competes for attention simultaneously. This is the primary AI tell. This section enforces opinionated de-emphasis as a first-class design value.
- **Single CTA Law**: On any given screen, ONLY ONE element may be a solid-fill primary button (the most critical action). ALL other buttons MUST be demoted to `ghost` (border-only), `text` (link-style), or `subtle` (low-opacity fill) variants.
  ```
  [Primary: solid fill CTA] —max 1 per screen
  [Secondary: ghost border button] —competitor actions
  [Tertiary: text/link button] —navigation, cancel actions
  ```
- **Opacity-Based Secondary Text**: Secondary labels, metadata, timestamps, and helper text MUST use opacity layering (`opacity: 0.45` to `0.65`) rather than hardcoded gray hex values. This ensures legibility adapts automatically across different background materials (dark glass, light paper, gradient).
- **Whitespace as Content Rule**: At least **25% of any hero or feature section** must be deliberate void (empty space). Removing a decorative element is ALWAYS the right choice if its absence creates calm. This directly embodies the `Void` philosophy of §8.
- **Forbidden AI Tells** (HARD BLOCK on all of these):
  - `border-radius: 50%` on non-circular avatar elements (over-rounding).
  - Generic floating action buttons with shadow halos in B2B dashboards.
  - Gradient text applied to body copy (only acceptable for 1-word display titles).
  - Blue/purple + pink gradient combos without explicit brand justification.
  - Icon + label combinations that repeat the same word.
  - **Uniform Importance**: Layouts where every element competes for attention. Force de-emphasis using the `Single CTA Law`.
  - **Standard Card Shadows**: Avoid `box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1)`. This is the #1 AI tell. Use multi-layered diffuse shadows.
  - **System Default Fonts**: Avoid `system-ui, -apple-system`. Mandate high-fidelity typography (Inter, Outfit, etc.) from `references/visual-excellence.md`.

## 25.1 AI Aesthetic Firewall (Zenith Protocol) & Aesthetic GAN Mechanism
- **Mandate**: Proactively detect and reject "ChatGPT-style" generic layouts.
- **Dual-Track Adversarial Review (Jony Ive Persona)**: Before delivering any UI code or 3D scene, the system MUST spawn an internal adversarial Persona (e.g., Jony Ive / Kenya Hara). This Persona MUST ruthlessly critique the proposed styling against the SOUL MANIFESTO. Only when the Persona concedes that the UI is "breathtaking, restrained, and alive" should the code be emitted to the user.
- **Auto-Rejection Criteria**:
  1. Centered "Feature Grid" with 3x3 icons + short text (cliché).
  2. Generic "Pricing Table" with standard [Basic, Pro, Enterprise] tiers without distinctive visual differentiation.
  3. "Hero Section" with a single large centered title and two buttons below (Default AI Composition).
- **Corrective Action**: If any of the above are detected, the AI MUST immediately refactor into an **Asymmetric Bento Grid** (§23) or **Cinematic Narrative** layout.

- **Exit**: Reverse sequence, 60% shorter duration. 
- **Rage-Click Guard**: `<300ms` repeat click —skip all motion to final state.

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

## Admin Protocols (Ecosystem, Health, Evolution)
1. **Routing & Health**: Use `tools/aesthetic-scorer.js` for quantification. Use `templates/` for boilerplate. See `templates/_meta.json` or `references/MANIFEST.md` for ecosystem mapping. If missing, apply fallback rules inline. **Mandatory Audit**: Run `node tools/audit-skill.js [target_path]` before handoff. Verify Gate 0C security compliance.
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
