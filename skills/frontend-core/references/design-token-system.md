# DDFM Design Token System Standard
## Naming Conventions, Token Hierarchy & Governance Rules

> **Status**: ACTIVE â€?Reference when creating or auditing a project's design token system.
> **Authority**: This document is the canonical naming standard for all DDFM-generated token systems.

---

## ðŸ—ï¸?Token Hierarchy (3 Layers)

```
Layer 1: Primitive Tokens   â†?Raw values, named for what they ARE
Layer 2: Semantic Tokens    â†?Named for what they DO (reference Primitives)
Layer 3: Component Tokens   â†?Named for specific component usage (reference Semantics)
```

**Example flow**:
```css
/* Layer 1: Primitive */
--oklch-jade-62: oklch(62% 0.15 152);
--scale-4:       4px;

/* Layer 2: Semantic */
--color-success: var(--oklch-jade-62);
--spacing-sm:    var(--scale-4);

/* Layer 3: Component */
--badge-success-bg:    var(--color-success);
--list-item-padding-y: var(--spacing-sm);
```

**Rule**: Components NEVER reference Layer 1 directly. Themes override Layer 2 only.

---

## ðŸŽ¨ Color Token Naming Convention

### Format: `--color-{role}-{variant}`

| Role | Usage | Example |
|---|---|---|
| `brand` | Logo, primary CTA | `--color-brand-primary`, `--color-brand-subtle` |
| `neutral` | Text, backgrounds, borders | `--color-neutral-900`, `--color-neutral-100` |
| `success` | Calm confirmation | `--color-success`, `--color-success-subtle` |
| `caution` | Gentle alertness | `--color-caution`, `--color-caution-subtle` |
| `destructive` | Firm warning | `--color-destructive`, `--color-destructive-subtle` |
| `info` | Neutral guidance | `--color-info`, `--color-info-subtle` |
| `delight` | Reward moments only | `--color-delight` (use sparingly per Â§28) |
| `empty` | Empty state backgrounds | `--color-empty` |
| `surface` | Card/container backgrounds | `--color-surface-0`, `--color-surface-1`, `--color-surface-2` |
| `overlay` | Modal backdrops | `--color-overlay` |

### Dark Mode Convention
```css
:root {
  --color-success: oklch(62% 0.15 152);   /* Light mode: warm jade */
}
@media (prefers-color-scheme: dark) {
  --color-success: oklch(72% 0.15 160);   /* Dark mode: higher L, same hue */
}
/* Rule: NEVER just invert. Re-derive L value for dark context. */
```

---

## ðŸ“ Spacing Token Naming Convention

### Format: `--spacing-{t-shirt-size}` (based on 4px base unit)

```css
--spacing-0:   0px;
--spacing-1:   4px;    /* xs */
--spacing-2:   8px;    /* sm */
--spacing-3:   12px;
--spacing-4:   16px;   /* md â€?default base */
--spacing-5:   20px;
--spacing-6:   24px;   /* lg */
--spacing-8:   32px;   /* xl */
--spacing-10:  40px;
--spacing-12:  48px;   /* 2xl */
--spacing-16:  64px;   /* 3xl */
--spacing-24:  96px;   /* section gap */
--spacing-32:  128px;  /* hero spacing */
```

**Rule**: ALL spacing in components MUST reference these tokens. Raw `px` values in component files are a `stylelint` violation.

---

## ðŸ”  Typography Token Naming Convention

```css
/* Font Families */
--font-display: 'Inter', 'SF Pro Display', system-ui;  /* Hero, stat numbers */
--font-body:    'Inter', system-ui, sans-serif;         /* Paragraphs, labels */
--font-mono:    'JetBrains Mono', 'Fira Code', monospace; /* Code blocks */

/* Font Scale (clamp for fluid) */
--text-xs:      clamp(0.65rem, 1.2vw, 0.75rem);
--text-sm:      clamp(0.8rem, 1.5vw, 0.875rem);
--text-base:    clamp(0.9rem, 1.8vw, 1rem);
--text-lg:      clamp(1rem, 2.2vw, 1.125rem);
--text-xl:      clamp(1.2rem, 3vw, 1.5rem);
--text-2xl:     clamp(1.5rem, 4vw, 2rem);
--text-display: clamp(2rem, 6vw, 4.5rem);

/* Font Weights */
--font-weight-regular:   400;
--font-weight-medium:    500;
--font-weight-semibold:  600;
--font-weight-bold:      700;
--font-weight-black:     900;

/* Line Heights */
--leading-tight:   1.1;   /* Display only */
--leading-snug:    1.35;  /* Headings */
--leading-normal:  1.55;  /* Body text */
--leading-relaxed: 1.75;  /* Long-form reading */

/* Letter Spacing */
--tracking-tighter: -0.04em;  /* Display titles */
--tracking-tight:   -0.02em;  /* H2/H3 headings */
--tracking-normal:   0em;     /* Body copy */
--tracking-wide:     0.05em;  /* All-caps labels */
```

---

## ðŸªŸ Border & Shadow Token Naming Convention

```css
/* Border Radius */
--radius-sm:   4px;
--radius-md:   8px;
--radius-lg:   12px;
--radius-xl:   16px;
--radius-full: 9999px;  /* Pill shape â€?use sparingly */

/* Shadows (elevation tiers) */
--shadow-card:   0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
--shadow-hover:  0 4px 6px -1px rgba(0,0,0,0.08), 0 2px 4px -1px rgba(0,0,0,0.05);
--shadow-modal:  0 20px 25px -5px rgba(0,0,0,0.15), 0 10px 10px -5px rgba(0,0,0,0.05);
--shadow-overlay:0 25px 50px -12px rgba(0,0,0,0.25);
/* Rule: shadow-depth MUST increase monotonically card â†?hover â†?modal â†?overlay */

/* Dark mode inner highlight (per Â§7) */
--shadow-inner-highlight: inset 0 1px 0 rgba(255,255,255,0.08);
```

---

## ðŸ”¢ Z-Index Token Naming Convention (5 Layers Max)

```css
--z-base:     1;    /* Normal stacking context */
--z-dropdown: 10;   /* Menus, tooltips, hover cards */
--z-sticky:   40;   /* Sticky headers, sidebars */
--z-modal:    50;   /* Modal dialogs */
--z-toast:    60;   /* Toast notifications */
--z-overlay:  70;   /* Full-screen overlays */
```

**HARD BLOCK**: `z-index: 9999` or any value not in this list requires architectural justification.

---

## âœ?Token Linting Enforcement

```json
// .stylelintrc.json
{
  "rules": {
    "color-no-invalid-hex": true,
    "declaration-property-value-disallowed-list": {
      "color": ["/^#/", "/^rgb/", "/^hsl/"],
      "background-color": ["/^#/", "/^rgb/", "/^hsl/"],
      "border-color": ["/^#/", "/^rgb/", "/^hsl/"]
    }
  }
}
```
> This forces all color values through CSS Custom Properties (tokens). Raw hex in component files = CI failure.

---

## ðŸ“‹ Changelog

| Version | Date | Summary |
|---|---|---|
| v1.0 | 2026-03-09 | Initial creation â€?complete 3-layer hierarchy, naming conventions for color/spacing/typography/shadow/z-index, stylelint enforcement |
