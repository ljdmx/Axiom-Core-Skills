# DDFM Extended Rules (On-Demand)

> **Status**: ACTIVE —Loaded on-demand by DDFM SKILL.md when the corresponding feature area is relevant.
> **Load Trigger**: Any project involving dashboards, internationalization, forms with > 3 fields, or public-facing pages.
> **Usage**: `view_file(./references/frontend-rules-extended.md)`

---

## Data Visualization Sovereignty (Data-Vis)
- **Mandate**: Dashboards require strict charting rules. AI MUST select the correct chart type before implementation.
- **Chart Type Decision Tree**:
  - Trend over time: Line / Area Chart
  - Part-to-whole comparison: Donut (≥ 5 segments) / Stacked Bar
  - Distribution / outliers: Box Plot / Scatter
  - Categorical comparison: Horizontal Bar
  - Geo / spatial density: Choropleth / Heatmap
  - KPI single value: Stat card + sparkline
- **Visual Rules**: Use low-interference palette. Auto-scale Y-axis.
- **Empty State**: Charts MUST display a styled empty state illustration when data is absent.
- **Real-Time Anti-Flicker**: Throttle re-renders to max 2 fps and use smooth interpolation.
- **Table Rules**: Complex data tables MUST support pagination, sortable headers, column resizing, row selection, and text truncation.

## Internationalization (i18n) Engineering
- **Mandate**: Language Purity is not just visual; it is structural.
- **Execution**: NEVER hardcode user-facing strings in components. AI MUST generate `locales/en.json` (and others) and use i18n keys (e.g., `t('device.status.offline')`).
- **RTL / Bidirectional Support**: When `Localization = RTL`:
  1. Set `<html dir="rtl" lang="ar">` at the document root.
  2. Replace ALL directional CSS properties with logical equivalents (`margin-inline-start`, `padding-inline-end`).
  3. Mirror directional icons.
  4. Test layout with Arabic placeholder text to detect text-overflow.

## Form UX Golden Rules
- **Mandate**: B2B forms must be fault-tolerant and highly communicative.
- **Rules**:
  1. **Inline Validation**: Errors MUST appear inline instantly on blur/change.
  2. **A11y Linkage**: Error text MUST be linked to inputs via `aria-describedby` or `aria-errormessage`.
  3. **Stepper Pattern**: Any form > 5 steps MUST be broken into a Wizard.
  4. **Field Grouping**: Related fields MUST be visually grouped using `<fieldset>` + `<legend>`.
  5. **Password UX**: Password fields MUST include a show/hide toggle.
  6. **Destructive Actions**: Any form submission that deletes data MUST require a confirmation step.
  7. **Screen Reader (A11y) Tab Order**: Inputs MUST logically follow the DOM. Use `aria-live="polite"` for error rendering to ensure blind users hear the error immediately without context loss.

## Fluid Motion & Cubic-Bezier Blueprint
- **Mandate**: `ease-in-out` and `linear` are banned for interactive elements. Physical spring-based or custom bezier curves MUST be invoked to maintain the "Zen" interactive feel.
- **Reference Curves**:
  - `Smooth Entry (Apple Spring equivalent)`: `cubic-bezier(0.25, 1, 0.5, 1)`
  - `Emphasized Deceleration`: `cubic-bezier(0.16, 1, 0.3, 1)` (Use for modal entries)
  - `Subtle Exit`: `cubic-bezier(0.5, 0, 0.75, 0)` (Use for toasts/modals exiting)
- **Constraint**: No transition should exceed 300ms unless it is a full-page architectural shift (max 800ms).

## Public Page SEO Mandate
- **Mandate**: SEO is not an afterthought; it is structural.
- **Execution**: Every public-facing page MUST:
  1. Define unique `<title>` and `<meta name="description">`.
  2. Implement Open Graph tags.
  3. Emit a `robots.txt` and `sitemap.xml`.
  4. Inject JSON-LD `Schema.org` structured data.
  5. Implement canonical URLs (`<link rel="canonical">`).
  6. **Core Web Vitals SEO Gate**: Google's ranking algorithm penalizes pages with INP > 200ms or LCP > 2.5s.

---

### Visual Proportions (Generic)
| Element | Desktop Coverage | Mobile Coverage |
| --- | --- | --- |
| Background | 60—0% | 40—0% |
| Main Content | 20—0% | 45—5% |
| Premium/High-Value | 5—5% | 3—% |
| Core Brand Color | ≥ 5% | ≥ 5% |
