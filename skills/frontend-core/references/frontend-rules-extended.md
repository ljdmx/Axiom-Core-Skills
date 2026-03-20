# DDFM Extended Rules (On-Demand)
## Data-Vis · Proportions · i18n · Forms · SEO

> **Status**: ACTIVE �?Loaded on-demand by DDFM SKILL.md when the corresponding feature area is relevant.
> **Load Trigger**: Any project involving dashboards, internationalization, forms with > 3 fields, or public-facing pages.
> **Usage**: `view_file(references/frontend-rules-extended.md)`

---

## 1️⃣4️⃣ Data Visualization Sovereignty (Data-Vis)
- **Mandate**: Dashboards require strict charting rules. AI MUST select the correct chart type before implementation.
- **Chart Type Decision Tree**:
  | Data Pattern | Correct Chart | Anti-Pattern |
  |---|---|---|
  | Trend over time | Line / Area Chart | Pie chart |
  | Part-to-whole comparison | Donut (�?5 segments) / Stacked Bar | 3D Pie |
  | Distribution / outliers | Box Plot / Scatter | Bar chart |
  | Categorical comparison | Horizontal Bar | Vertical bar (> 6 cats) |
  | Geo / spatial density | Choropleth / Heatmap | Table |
  | KPI single value | Stat card + sparkline | Full chart |
- **Visual Rules**: Use low-interference palette (monochrome base + 1 semantic highlight). Auto-scale Y-axis from `data_min * 0.9` to `data_max * 1.1` �?never force zero baseline for non-zero datasets.
- **Empty State**: Charts MUST display a styled empty state illustration (not blank axes) when data is absent.
- **Real-Time Anti-Flicker**: For live-updating charts (WebSocket / SSE), throttle re-renders to max 2 fps and use smooth interpolation (`d3.transition` or equivalent) to prevent visual jitter under high-frequency data.
- **Table Rules**: Complex data tables MUST support pagination, sortable headers (with sort direction indicator), column resizing, row selection, and text truncation with tooltip fallback by default.

---

## 1️⃣5️⃣ Visual Proportion & Layout Blueprint

### Desktop Proportion Table
| Element | Coverage Range |
| --- | --- |
| Background | 60�?0% |
| Main Content | 20�?0% |
| Premium/High-Value | 5�?5% |
| Core Brand Color | �?5% |

### Mobile Proportion Variant (viewport width �?768px)
| Element | Coverage Range |
| --- | --- |
| Background | 40�?0% |
| Main Content | 45�?5% |
| Premium/High-Value | 3�?% |
| Core Brand Color | �?5% |

> On narrow screens, background naturally contracts and content expands. AI MUST apply mobile proportions when generating mobile-first layouts or standalone mobile components.

---

## 1️⃣6️⃣ Internationalization (i18n) Engineering
- **Mandate**: Language Purity is not just visual; it is structural.
- **Execution**: NEVER hardcode user-facing strings in components. AI MUST generate `locales/en.json` (and others) and use i18n keys (e.g., `t('device.status.offline')`).
- **RTL / Bidirectional Support**: When `Localization = RTL` (see §0):
  1. Set `<html dir="rtl" lang="ar">` at the document root.
  2. Replace ALL directional CSS properties with logical equivalents: `margin-left` �?`margin-inline-start`, `padding-right` �?`padding-inline-end`, `border-left` �?`border-inline-start`, `text-align: left` �?`text-align: start`.
  3. Mirror directional icons (arrows, chevrons, back-button icons) using `transform: scaleX(-1)` or SVG variants.
  4. Test layout with Arabic placeholder text (`أبجد هوز`) to detect text-overflow and RTL flex/grid issues.

---

## 1️⃣7️⃣ Form UX Golden Rules
- **Mandate**: B2B forms must be fault-tolerant and highly communicative.
- **Rules**:
  1. **Inline Validation**: Errors MUST appear inline instantly on blur/change, never waiting for full form submission.
  2. **A11y Linkage**: Error text MUST be linked to inputs via `aria-describedby` or `aria-errormessage`.
  3. **Stepper Pattern**: Any form > 5 steps MUST be broken into a Wizard/Stepper flow with draft auto-saving capabilities.
  4. **Field Grouping**: Related fields MUST be visually grouped using `<fieldset>` + `<legend>`, not just visual proximity. Screen readers depend on semantic grouping.
  5. **Password UX**: Password fields MUST include a show/hide toggle (`type="text"/"password"` toggle). Never rely on password managers alone.
  6. **Destructive Actions**: Any form submission that deletes data, cancels a subscription, or sends irreversible communications MUST require a confirmation step (type to confirm or separate confirm dialog). Never a single click.

---

## 1️⃣8️⃣ Public Page SEO Mandate
- **Mandate**: SEO is not an afterthought; it is structural to all public routes.
- **Execution**: Every public-facing page MUST:
  1. Define unique `<title>` and `<meta name="description">`.
  2. Implement Open Graph tags (`og:title`, `og:image`, `og:url`, `og:type`).
  3. Emit a `robots.txt` and `sitemap.xml` at the root, regenerated on content updates.
  4. Inject JSON-LD `Schema.org` structured data for rich content (articles, products, FAQs, events).
  5. Implement canonical URLs (`<link rel="canonical">`) on all paginated or filtered views to prevent duplicate content penalties.
  6. **Core Web Vitals SEO Gate**: Google's ranking algorithm penalizes pages with INP > 200ms or LCP > 2.5s. These are not optional performance targets �?they are SEO requirements.

---

## 📋 Changelog

| Version | Date | Summary |
|---|---|---|
| v1.0 | 2026-03-09 | Extracted from DDFM SKILL.md §14–�?8 + enhanced §17 with 3 additional rules and §18 with canonical URLs + CWV gate |
