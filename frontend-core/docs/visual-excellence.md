# DDFM Visual Excellence Rules (On-Demand)
## Texture · Bento Grids · Typography · Brand Magnetic Field · Motion

> **Status**: ACTIVE — Loaded on-demand by DDFM SKILL.md.
> **Load Triggers**:
> - §22 Texture → Any high-end, premium, or "Apple-like" UI project.
> - §23 Bento → Landing pages, dashboards, feature showcases.
> - §24 Typography → Content-heavy apps or marketing sites.
> - §26 Brand Magnetic Field → Any new project initialization (Phase 0A).
> - §27 Motion → Any project with animations or transitions.
> **Usage**: `view_file(docs/visual-excellence.md)`

---

## 2️⃣2️⃣ Texture and Depth (Material Sovereignty)
- **Mandate**: Avoid "Flat" design. High-tier UIs use material metaphors (Glass, Paper, Metal) to create hierarchy.
- **Glassmorphism Strategy**: Use `backdrop-filter: blur(12px)` with a slightly opaque white/black border (`1px solid rgba(255,255,255,0.1)`) to simulate physical glass layers.
- **Shadow Philosophy**: Never use pure black `#000` for shadows. Use a "Diffuse Shadow" based on the background hue (e.g., `box-shadow: 0 10px 30px oklch(20% 0.05 250 / 0.1)`).
- **Inner Glow**: Buttons and cards MUST have a subtle 1px inner top border to simulate edge lighting:
  ```css
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 4px 24px rgba(0,0,0,0.35);
  ```

---

## 2️⃣3️⃣ Asymmetric Bento Grid Mandate (Anti-Generic Layouts)
- **Mandate**: Symmetric equal-column grids (e.g., 3×3, 4×4 identical card layouts) are FORBIDDEN for landing pages, dashboards, and feature showcases. Equal grids are the top signal of generic AI-generated layouts.
- **Implementation**: AI MUST implement non-uniform `grid-template-areas` creating visual tension through size contrast:
  ```css
  /* ✅ CORRECT — Bento asymmetric grid */
  .bento-grid {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr;
    grid-template-rows: auto;
    gap: var(--spacing-md);
  }
  .feature-hero  { grid-column: 1; grid-row: 1 / 3; } /* Large anchor block */
  .feature-stat  { grid-column: 2; grid-row: 1; }     /* Small supplemental */
  .feature-chart { grid-column: 2 / 4; grid-row: 2; } /* Wide supporting block */
  ```
- **Size Contrast Ratio**: The largest grid cell MUST be at minimum **2× the area** of the smallest adjacent cell.
- **Diagonal Breathing**: At least one grid cell must span 2 columns or 2 rows to create non-linear reading paths. Pure row-by-row grids are NOT acceptable for hero content sections.

---

## 2️⃣4️⃣ Cinematic Typography System
- **Mandate**: AI MUST use a dual-role font system. Using the same font-size scale for both display headlines and body text is an automatic failure.
- **Font Role Segregation**:
  - **Display Role** (Hero headings, stat numbers, pull quotes): `font-family: 'Inter', 'SF Pro Display', system-ui`; `letter-spacing: -0.03em` to `-0.05em`; `line-height: 1.05` to `1.15`; weight `700–900`.
  - **Body Role** (Paragraphs, labels, table cells): `letter-spacing: 0em` to `0.01em`; `line-height: 1.55` to `1.7`; weight `400–500`.
- **Minimum Scale Steps**: Font-size system MUST define at minimum **6 named scale steps**:
  ```css
  --text-xs: clamp(0.65rem, 1.2vw, 0.75rem);
  --text-sm: clamp(0.8rem, 1.5vw, 0.875rem);
  --text-base: clamp(0.9rem, 1.8vw, 1rem);
  --text-lg: clamp(1rem, 2.2vw, 1.125rem);
  --text-xl: clamp(1.2rem, 3vw, 1.5rem);
  --text-display: clamp(2rem, 6vw, 4.5rem); 
  ```
- **Number Typography**: Stat numbers MUST use `font-variant-numeric: tabular-nums` to prevent jumps.

---

## 2️⃣6️⃣ Brand Magnetic Field System
- **Mandate**: Enterprise-grade products are recognizable from a single screenshot. Requires a unique "Brand Magnetic Field" constellation.
- **Brand Magnetic Field Declaration**: AI MUST output the following in Phase 0A:
  ```
  🧲 [Brand Magnetic Field Declared]
  ├─ Core Visual Metaphor: {e.g., "Arctic calm meets industrial precision"}
  ├─ 3 Forbidden Visual Clichés: {e.g., "blue-purple sci-fi gradients"}
  ├─ Tone of Voice: {e.g., "authoritative but warm"}
  └─ Design Peer Reference: {e.g., "Linear's speed + Notion's calm"}
  ```
- **Consistency Enforcement**: Every component MUST be checked against this Field. HARD BLOCK on contradictions.

---

## 2️⃣7️⃣ Multi-Stage Motion Choreography (Stagger Cascade)
- **Mandate**: Elements MUST arrive in intentional sequence, not simultaneously. Use the Breathing Curve (`cubic-bezier(0.4, 0, 0.2, 1)`, 400ms).
- **Delay Cascade**:
  1. Nav / Header: 0ms
  2. Hero / H1: 50ms
  3. Primary CTA: 100ms
  4. Support Blocks: 150ms
  5. Secondary Cards: 200ms
  6. Footer: 250ms
- **Rage-Click Guard**: `<300ms` repeat click → skip all motion.

---

## 📋 Changelog

| Version | Date | Summary |
|---|---|---|
| v1.0 | 2026-03-09 | Extracted from DDFM SKILL.md §§22, 23, 24, 26, 27 to optimize token budget. |
