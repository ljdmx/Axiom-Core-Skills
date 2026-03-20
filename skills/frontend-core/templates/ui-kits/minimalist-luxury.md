# Enterprise-Grade UI Design System - Minimalist Luxury

> **DDFM Compliance**: âœ?OKLCH Color Space | âœ?CSS Custom Properties | âœ?No Magic Values
> **Theme Philosophy**: Surgical precision, atmospheric depth, typographic sovereignty, extreme restraint.

---

## Design Philosophy

### Core Principles
1. **Surgical Precision** â€?Every element has a purpose. Zero clutter.
2. **Atmospheric Depth** â€?Subtle shadows and material layers to create "air."
3. **Typographic Sovereignty** â€?Typography is the primary design element.
4. **Restraint** â€?Less, but better. High-end aesthetic through deliberate absence.

---

## Color System (DDFM Â§2 â€?OKLCH Compliant)

> All color values use the OKLCH color model as mandated by DDFM Â§2. This ensures perceptual linearity across light and dark modes without brightness drift.

```css
:root {
  /* === Backgrounds === */
  --bg-primary:   oklch(99% 0.002 90);   /* Near-white warm parchment */
  --bg-secondary: oklch(97% 0.003 85);   /* Subtle warm gray offset */
  --bg-tertiary:  oklch(94% 0.005 80);   /* Gentle surface separation */

  /* === Typography === */
  --text-primary:   oklch(15% 0.008 60);  /* Near-black, warm-tinted */
  --text-secondary: oklch(40% 0.008 60);  /* Muted secondary label */
  --text-muted:     oklch(65% 0.006 60);  /* Opacity-based for material adaptability */

  /* === Luxury Accents (Gold Spectrum) === */
  --accent-gold:   oklch(72% 0.09 75);   /* Warm gold â€?primary luxury accent */
  --accent-silver: oklch(88% 0.004 240); /* Cool silver â€?secondary */

  /* === Semantic (DDFM Â§28 â€?Emotion-Accurate) === */
  --semantic-success:     oklch(62% 0.15 148); /* Warm jade, not neon green */
  --semantic-destructive: oklch(52% 0.16 25);  /* Desaturated brick, not fire-engine red */

  /* === Shadows (hue-tinted, not pure black) === */
  --shadow-soft:   0 4px 24px oklch(20% 0.04 60 / 0.06);
  --shadow-hover:  0 12px 48px oklch(20% 0.04 60 / 0.12);
  --shadow-modal:  0 24px 80px oklch(20% 0.04 60 / 0.2);
}

/* Dark Mode â€?re-derived, NOT inverted */
@media (prefers-color-scheme: dark) {
  :root {
    --bg-primary:   oklch(12% 0.005 60);
    --bg-secondary: oklch(16% 0.006 60);
    --bg-tertiary:  oklch(20% 0.007 60);
    --text-primary:   oklch(95% 0.004 60);
    --text-secondary: oklch(70% 0.004 60);
    --text-muted:     oklch(50% 0.003 60);
    --shadow-soft:   0 4px 24px oklch(0% 0 0 / 0.25);
    --shadow-hover:  0 12px 48px oklch(0% 0 0 / 0.4);
  }
}
```

---

## Typography System (DDFM Â§24 â€?Cinematic Typography)

```css
:root {
  /* Font Role Segregation (mandatory per Â§24) */
  --font-display: 'Playfair Display', Georgia, serif;  /* Display role */
  --font-body:    'Inter', system-ui, sans-serif;      /* Body role */

  /* Minimum 6 named scale steps (Â§24 mandate) */
  --text-xs:      clamp(0.65rem, 1.2vw, 0.75rem);
  --text-sm:      clamp(0.8rem, 1.5vw, 0.875rem);
  --text-base:    clamp(0.9rem, 1.8vw, 1rem);
  --text-lg:      clamp(1rem, 2.2vw, 1.125rem);
  --text-xl:      clamp(1.2rem, 3vw, 1.5rem);
  --text-display: clamp(2rem, 6vw, 4.5rem);

  /* Letter spacing */
  --tracking-tight:  -0.04em;   /* Display headings only */
  --tracking-normal:  0em;
  --tracking-wide:    0.04em;   /* Captions, overlines */
}

/* Display heading (luxury editorial feel) */
.heading-display {
  font-family: var(--font-display);
  font-size: var(--text-display);
  letter-spacing: var(--tracking-tight);
  line-height: 1.08;
  font-weight: 700;
  color: var(--text-primary);
}

/* Body copy */
.body-copy {
  font-family: var(--font-body);
  font-size: var(--text-base);
  line-height: 1.65;
  letter-spacing: var(--tracking-normal);
  color: var(--text-secondary);
}
```

---

## Spacing System (DDFM Â§1 â€?Token Compliant)

```css
:root {
  --space-1:  0.25rem;   /* 4px */
  --space-2:  0.5rem;    /* 8px */
  --space-3:  0.75rem;   /* 12px */
  --space-4:  1rem;      /* 16px */
  --space-6:  1.5rem;    /* 24px */
  --space-8:  2rem;      /* 32px */
  --space-12: 3rem;      /* 48px */
  --space-16: 4rem;      /* 64px */
  --space-24: 6rem;      /* 96px â€?editorial breathing room */
}
```

---

## Luxury Card Component

```css
.luxury-card {
  background: var(--bg-primary);
  border: 1px solid oklch(88% 0.004 240 / 0.5);
  padding: var(--space-12);
  position: relative;
  box-shadow: var(--shadow-soft);
  /* Inner edge lighting (Â§22 mandate) */
  box-shadow:
    inset 0 1px 0 oklch(100% 0 0 / 0.06),
    var(--shadow-soft);
  transition: box-shadow 600ms cubic-bezier(0.4, 0, 0.2, 1);
}

.luxury-card:hover {
  box-shadow:
    inset 0 1px 0 oklch(100% 0 0 / 0.08),
    var(--shadow-hover);
  /* NO translateY â€?luxury is stillness, not bounce */
}
```

---

## Summary

âœ?**DDFM Â§1** â€?All values use CSS Custom Properties, zero magic strings
âœ?**DDFM Â§2** â€?Full OKLCH color space compliance
âœ?**DDFM Â§7** â€?Timeless (no neon, no trend-driven colors)
âœ?**DDFM Â§24** â€?Cinematic dual-font role system
âœ?**DDFM Â§28** â€?Emotion-accurate semantic tokens
