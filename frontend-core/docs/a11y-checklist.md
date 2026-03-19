# DDFM Accessibility Checklist (WCAG 2.1 AA)
## Complete A11y Verification Protocol

> **Status**: ACTIVE — Run before every component handoff.
> **Standard**: WCAG 2.1 Level AA (Level AAA for Compliance-grade UIs per §0).
> **Automated Check**: `npx axe-core` + `@axe-core/playwright` in E2E tests.

---

## 🎨 Perceivable

### Color & Contrast
- [ ] Normal text (< 18px): contrast ratio ≥ **4.5:1** against background
- [ ] Large text (≥ 18px or 14px bold): contrast ratio ≥ **3:1**
- [ ] UI components (borders, icons, focus rings): contrast ≥ **3:1**
- [ ] Information is NEVER conveyed by color alone (e.g., error states also use icons + text)
- [ ] Dark mode: re-verified all ratios against dark background tokens (not just light mode)
- [ ] `--semantic-*` tokens validated in both light AND dark mode (DDFM §28)

### Images & Media
- [ ] All `<img>` have meaningful `alt` text; decorative images use `alt=""`
- [ ] SVG icons used interactively have `role="img"` + `aria-label`
- [ ] Video content has captions; audio has transcripts
- [ ] No information conveyed by image alone without text equivalent

### Typography & Readability
- [ ] Base font size ≥ 16px (allows browser zoom without breaking layout)
- [ ] Line height ≥ 1.5 for body text
- [ ] Text can be resized to 200% without horizontal scrolling on desktop
- [ ] `clamp()` fluid type scales verified at minimum and maximum viewport sizes

---

## 🕹️ Operable

### Keyboard Navigation
- [ ] ALL interactive elements reachable via Tab in logical DOM order
- [ ] Focus order matches visual/logical reading order
- [ ] `:focus-visible` ring visible on ALL interactive elements (`outline: none` is HARD BLOCK)
- [ ] Skip-navigation link (`<a href="#main-content">Skip to content</a>`) at top of every page
- [ ] Modal dialogs: focus trapped inside, Escape closes, focus returns to trigger on close
- [ ] Dropdown menus: Arrow keys navigate, Enter selects, Escape closes
- [ ] Drag-and-drop: keyboard alternative provided (e.g., Up/Down to reorder)
- [ ] No keyboard traps except intentional modal focus trapping

### Motion & Timing
- [ ] `prefers-reduced-motion`: ALL animations disabled/reduced when active
- [ ] No auto-playing media that cannot be paused
- [ ] No content that flashes more than 3 times per second (seizure risk)
- [ ] Time-limited sessions warn user ≥ 20 seconds before expiry with option to extend

---

## 🤔 Understandable

### Forms
- [ ] All form inputs have visible `<label>` (not just placeholder)
- [ ] Error messages: specific, actionable (not "Invalid input")
- [ ] `aria-describedby` links error text to input field
- [ ] `aria-required="true"` on required fields
- [ ] `autocomplete` attributes set where applicable (name, email, tel, etc.)
- [ ] Password fields: `autocomplete="current-password"` or `"new-password"`

### Language & Structure
- [ ] `<html lang="...">` set to correct locale
- [ ] Page `<title>` is unique and descriptive (DDFM §18)
- [ ] Heading hierarchy: single `<h1>` per page, logical H1→H2→H3 flow, no skipped levels
- [ ] Link text is descriptive ("View report" not "Click here")
- [ ] Buttons have descriptive text (icon-only buttons need `aria-label`)
- [ ] Error pages (404, 500) still have accessible navigation

---

## 🛡️ Robust

### Semantic HTML
- [ ] Use semantic elements: `<nav>`, `<main>`, `<aside>`, `<header>`, `<footer>`, `<section>`, `<article>`
- [ ] Buttons use `<button>`, not `<div onClick>` or `<a>` without href
- [ ] Tables have `<th scope="col/row">` headers; complex tables have `<caption>`
- [ ] Lists use `<ul>`/`<ol>` not styled `<div>` elements
- [ ] Custom components: ARIA roles, states, and properties match expected widget patterns

### ARIA Usage
- [ ] ARIA labels don't duplicate visible text (screen readers read both)
- [ ] `aria-live` regions used for dynamic content updates (toasts, alerts, status)
- [ ] `aria-expanded` on toggles (accordion, dropdown, sidebar)
- [ ] `aria-disabled` + `disabled` attribute on disabled elements
- [ ] No ARIA overriding native HTML semantics unless absolutely necessary

### SSR/Hydration (DDFM §11)
- [ ] No hydration mismatch errors in console
- [ ] Dynamic values (timestamps, random IDs) isolated to `"use client"` components
- [ ] Error boundaries wrap ALL data-fetching sections

---

## 🤖 Automated Testing Commands

```bash
# Per-component axe-core check (Playwright)
npx playwright test --grep "a11y"

# Full page accessibility audit
npx @axe-core/cli http://localhost:3000 --exit

# Lighthouse accessibility (minimum 90)
npx lighthouse http://localhost:3000 --only-categories=accessibility --output=json

# Color contrast check (all token pairs)
node tools/aesthetic-scorer.js --contrast-check
```

---

## 📋 Changelog

| Version | Date | Summary |
|---|---|---|
| v1.0 | 2026-03-09 | Initial creation — WCAG 2.1 AA complete checklist aligned with DDFM §5, §8, §10, §11, §17 rules |
