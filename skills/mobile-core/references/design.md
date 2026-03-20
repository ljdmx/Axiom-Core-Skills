# DDFM Mobile Design System: Design Guardian Edition
## Soul Framework · Dieter Rams' 10 Principles · High-Order App Paradigms
<!-- TRIGGER: design system, Token, animation, color, dark mode, skeleton screen, typography, layout, Bento Grid, Three Axes of Soul, DDFM -->

> The App you design must be a living entity with a soul.
> Core Mission: Guard the soul of the App, prevent all mediocrity and degradation.

---

## Table of Contents

0. [Soul Framework Calibration](#0-soul-framework-calibration)
1. [Dieter Rams' 10 Principles Application](#1-dieter-rams-10-principles-application)
2. [Complete Design Token Implementation](#2-complete-design-token-implementation)
3. [Color System & Digital Materiality](#3-color-system--digital-materiality)
4. [Multisensory Semantics Protocol](#4-multisensory-semantics-protocol)
5. [Typography System & Optical Alignment](#5-typography-system--optical-alignment)
6. [Layout Philosophy & Bento Grid](#6-layout-philosophy--bento-grid)
7. [Animation System: Gravity & Physical Gestures](#7-animation-system-gravity--physical-gestures)
8. [Gatekeeper Refusal Protocol](#8-gatekeeper-refusal-protocol)
9. [Zero-AI-Aesthetic Protocol](#9-zero-ai-aesthetic-protocol)
10. [Failure Contingency & Design Red Lines](#10-failure-contingency--design-red-lines)

> For advanced content (Materials/Lighting/Wide Screen/Performance/A11y) → `references/design-advanced.md`

---

## 0. Soul Framework Calibration

Before drawing a single pixel, you must perform a 3-axis calibration on the soul of the App. This determines whether your design is built for "highly efficient problem-solving" or "deep emotional companionship".

| Dimension | Definition | Core Signal | High-Order Padarigms |
| :--- | :--- | :--- | :--- |
| **Sense of Being Understood (Understanding)** | The user feels "you get me" | Zero learning curve, intuition-driven, predicting the user's next move. | Linear, Figma, Raycast |
| **Sense of Being Respected (Respect)** | Zero cognitive exploitation, burden-free | No forced notifications, no addictive logic, extreme privacy, WCAG AA default. | Notion, Apple Health, Cron |
| **Sense of Companionship (Companionship)** | Warm and lasting digital companionship | Micro-interactions evoke joy, building long-term resonance through "materiality". | Calm, Headspace, Arc |

---

## 1. Dieter Rams' 10 Principles Mobile Application

| Principle | Mobile DDFM Implementation | Guardian Red Line |
| :--- | :--- | :--- |
| **Innovative** | Explore new solutions based on physical gestures (e.g., scroll-driven). | Meaningless over-decoration is strictly forbidden. |
| **Useful** | Solve core pain points; perfect closed-loop of function and aesthetics. | Feature stacking causing page chaos is strictly forbidden. |
| **Aesthetic** | Beauty stems from proportion, typography, and emotional resonance. | Cheap neon-style color schemes are strictly forbidden. |
| **Understandable** | Interactions are self-explanatory, matching cognitive mental models. | Transferring cognitive burden to users is strictly forbidden. |
| **Unobtrusive** | The tool retreats, letting the user focus on content. | Popping up modal layers when the user is focused is strictly forbidden. |
| **Honest** | UI representation must follow logic (gravity, causality). | Exaggerating operational results is strictly forbidden. |
| **Long-lasting** | Aesthetic sovereignty lasting beyond 24 months. | Chasing short-term visual trends is strictly forbidden. |
| **Thorough to the last detail** | Even the 16ms of a micro-animation must be precise. | Outputting misaligned or hardcoded code is strictly forbidden. |
| **Environment-friendly** | Consider digital carbon footprint and user attention ecology. | Plundering users' deep focus is strictly forbidden. |
| **As little design as possible** | Extreme restraint, remove all the "unnecessary". | **Less, but better**. |

---

## 2. Complete Design Token Implementation

### uni-app Classic —`src/styles/tokens.scss`

```scss
// ════════════════════════════════════
// ★ COLOR TOKENS —Light & Dark Sets
// ════════════════════════════════════

// ── Light Mode ──
$color-brand:          #1A1A1A;     // Brand Color (Full screen ≥ %)
$color-brand-subtle:   #333333;

$color-bg-base:        #F8F8F4;    // Page Background (Warmth, not pure white)
$color-bg-surface:     #FFFFFF;    // Card/Surface
$color-bg-elevated:    #EFEFE9;    // Hover/Interactive Background
$color-bg-overlay:     rgba(0,0,0,0.4); // Overlay/Mask

$color-text-primary:   rgba(0, 0, 0, 0.88);
$color-text-secondary: rgba(0, 0, 0, 0.55);   // ★ Use opacity, not gray hex
$color-text-tertiary:  rgba(0, 0, 0, 0.35);
$color-text-disabled:  rgba(0, 0, 0, 0.25);
$color-text-inverse:   rgba(255, 255, 255, 0.95);

// Semantic Colors (Emotionally precise —Not pure green/red/blue)
$color-success:        #2D7D46;    // Calm Confirmation (Dark green, not neon)
$color-warning:        #B86800;    // Gentle Warning (Amber, not orange)
$color-error:          #C0392B;    // Restrained Error (Brick red, not fire engine red)
$color-info:           #2C5F8A;    // Neutral Guidance (Slate blue)
$color-delight:        #6B46C1;    // Surprise/Celebration Exclusive (Violet)

$color-border:         rgba(0, 0, 0, 0.08);
$color-border-strong:  rgba(0, 0, 0, 0.15);

// ── Dark Mode ——Independent Deduction, Not Simple Inversion ──
// ⚠️ It is strictly forbidden to directly define static SCSS variables (like `$color-bg-dark`) expecting them to auto-switch at runtime!
// SCSS is a compile-time language and cannot hot-reload when users switch dark mode.
// We will demonstrate later: Dark mode solutions for both tracks (CSS vars for H5/MP, Class overrides for App uvue).

// ════════════════════════════════════
// ★ SPACING TOKENS —8pt Grid
// ════════════════════════════════════
$space-1:  8rpx;     // Micro spacing (Between icon and text)
$space-2:  16rpx;    // Compact (Tag padding)
$space-3:  24rpx;    // Standard Small (Line spacing)
$space-4:  32rpx;    // Standard (Card padding)
$space-5:  40rpx;    // Standard Large
$space-6:  48rpx;    // Section spacing
$space-8:  64rpx;    // Large section spacing
$space-10: 80rpx;    // Chapter spacing
$space-12: 96rpx;    // Extra large void (Empty state/Hero area)

// ════════════════════════════════════
// ★ BORDER RADIUS TOKENS
// ════════════════════════════════════
$radius-xs:   4rpx;
$radius-sm:   8rpx;
$radius-md:   16rpx;
$radius-lg:   24rpx;
$radius-xl:   32rpx;
$radius-2xl:  40rpx;
$radius-full: 9999rpx;  // Pill shape

// ════════════════════════════════════
// ★ OPTICAL AMBIENT SHADOWS
// ════════════════════════════════════
// Reject pure black shadows. Extract brand or surface color as the glow base, blending a soft tulle feel.
$shadow-sm:  0 2rpx 8rpx rgba(26,26,26,0.06), 0 1rpx 2rpx rgba(26,26,26,0.04);
$shadow-md:  0 4rpx 16rpx rgba(26,26,26,0.08), 0 2rpx 4rpx rgba(26,26,26,0.05);
$shadow-lg:  0 8rpx 32rpx rgba(26,26,26,0.12), 0 4rpx 8rpx rgba(26,26,26,0.06);
$shadow-xl:  0 16rpx 48rpx rgba(26,26,26,0.16), 0 8rpx 16rpx rgba(26,26,26,0.08);

// ★ Dark Mode Ambient Color & Hue Shifting
// Pure black shadows are forbidden in dark mode; they must carry a cool/warm bias (e.g., black with a hint of purple-blue, cool and deep, with high transparency diffusion).
$shadow-dark-sm:  0 2rpx 8rpx rgba(15, 10, 25, 0.40);
$shadow-dark-md:  0 4rpx 16rpx rgba(15, 10, 25, 0.55);
$shadow-dark-lg:  0 8rpx 32rpx rgba(15, 10, 25, 0.65);

// ════════════════════════════════════
// ★ Z-INDEX TOKENS —Strict Layering (5 Layers Only)
// ════════════════════════════════════
$z-base:    0;
$z-sticky:  10;    // Sticky Nav
$z-overlay: 20;    // Dropdowns
$z-modal:   30;    // Modals
$z-toast:   40;    // Global Toasts
// ❌Arbitrary magic numbers like z-index: 9999 are forbidden.

// ════════════════════════════════════
// ★ TYPOGRAPHY TOKENS
// ★ Fluid Typographic Scale - Major Third 1.250x
// Preferably use CSS `clamp` function so font sizes transition perfectly like fluid when the screen stretches.
// For ucss that doesn't support `clamp`, hardcode the optimal value for the screen or calculate dynamically via UTS computed.
$text-xs:      clamp(20rpx, 16rpx + 0.53vw, 24rpx);   // (Base / 1.56)
$text-sm:      clamp(24rpx, 20rpx + 0.53vw, 28rpx);   // (Base / 1.25)
$text-base:    clamp(28rpx, 24rpx + 0.53vw, 32rpx);   // Base Size
$text-lg:      clamp(36rpx, 32rpx + 0.53vw, 40rpx);   // (Base * 1.25)
$text-xl:      clamp(44rpx, 40rpx + 0.53vw, 48rpx);   // (Base * 1.56)
$text-2xl:     clamp(56rpx, 48rpx + 1.06vw, 64rpx);   // (Base * 2.00)
$text-display: clamp(76rpx, 64rpx + 1.59vw, 88rpx);   // (Base * 2.66)
$text-hero:    clamp(100rpx, 80rpx + 2.66vw, 120rpx); // (Base * 3.55)

// Font Weight (≥ 3 levels)
$font-regular:  400;
$font-medium:   500;
$font-semibold: 600;
$font-bold:     700;
$font-black:    900;

// Line Height
$leading-tight:  1.15;  // Large Titles (Tight)
$leading-normal: 1.55;  // Body Text
$leading-loose:  1.75;  // Long-form Reading

// Letter Spacing
$tracking-tight:  -0.03em;  // Display Titles
$tracking-normal: 0em;
$tracking-wide:   0.05em;   // Uppercase Tags/Badges

// Animation (Transition support is limited in ucss)
$duration-instant: 80ms;
$duration-fast:    150ms;
$duration-normal:  250ms;
$duration-slow:    400ms;
$duration-breath:  600ms;
$ease-spring:  cubic-bezier(0.34, 1.56, 0.64, 1);
$ease-breath:  cubic-bezier(0.4, 0, 0.2, 1);
$ease-exit:    cubic-bezier(0.4, 0, 1, 1);
```

---

## 3. Color System & Digital Materiality

### 3.1 High-Order Color Narrative & OKLCH Materiality

**Mandatory Upgrade: Fully embrace Digital Materiality**. Color is no longer just filler; it is a medium with "temperature" and "depth".

**OKLCH Perceptual Color Model [100pt Requirement]**:
- **Baseline**: Abandon HSL/RGB, fully adopt `oklch()`. It ensures human visual perception consistency across different hues at the same Lightness (L).
- **Ambient Light Tracking**: All Surfaces must undergo slight Hue Shifting based on the underlying background, creating frosted glass and true depth perception.

```scss
// ★ OKLCH Haute Couture Palette Example
$brand-base: oklch(0.6 0.18 256); // Brand Primary (Perceptual Blue)
$surface-tint: oklch(0.98 0.01 256); // Background with a hint of brand warmth
```

**Emotional Color Semantic Extension**:
Beyond basic `success`/`error`/`warning`, high-order systems require finer emotional granularity:
- `$color-delight`: Surprise purple for celebrations/upgrades.
- `$color-calm`: Tranquil cyan-gray for meditation/completed states.
- `$color-urgent`: Piercing orange-red for countdowns/urging.

**Dynamic Color Contrast Formula**:
All text/icon color combinations must run on top of the Contrast Formula (WCAG 2.1):
```scss
// Human Perception Contrast Calculation Concept:
// L = 0.2126 * R + 0.7152 * G + 0.0722 * B
// Contrast Ratio = (max(L1, L2) + 0.05) / (min(L1, L2) + 0.05)
// Must satisfy: Normal Body ≥ 4.5:1, Large Titles/Graphics ≥ 3.0:1
```

### 3.2 Color Proportion Rule (Mandatory)

```text
Background Layers    60—0%   → $color-bg-base / $color-bg-surface
Main Content         20—0%   → $color-text-primary / Icons / Content Area
Emphasized Info       5—5%   → $color-text-secondary / Tags / Aux Info
Brand Color           ≥ 5%    → Logos / Main CTA Buttons ONLY  ←★ Most Important
```

### Button Hierarchy (Only 1 primary button per screen)

```scss
// Maximum 1 solid button per screen (Highest priority action)
.btn-primary {
  background-color: $color-brand;
  border-radius: $radius-md;
  padding: $space-3 $space-6;
  // It is forbidden to have a second solid filled button on the same screen
}

// Secondary Actions → Outlined buttons
.btn-secondary {
  background-color: transparent;
  border: 2rpx solid $color-brand;
  // Use this style for competitive actions
}

// Low Priority → Pure text
.btn-ghost {
  background-color: transparent;
  // Cancel/Back/Secondary links
}
```

### Dark Mode Adaptation (Full Dual-Mode Solution)

To take effect in both Classic and Native uvue, a dual-track mechanism must be employed. **Using `filter: invert()` which ruins images and textures is strictly forbidden. Writing a few lines of SCSS variables that won't take effect is forbidden.**

```vue
<!-- [Solution A] uni-app Classic (H5/MP): Based on CSS Custom Properties -->
<style>
/* Recommended to place in App.vue or global.css */
page, :root {
  --color-bg-surface: #FFFFFF;
  --color-text-primary: rgba(0,0,0,0.88);
}
@media (prefers-color-scheme: dark) {
  page, :root {
    --color-bg-surface: #161616;
    --color-text-primary: rgba(255,255,255,0.9);
  }
}
.card { background-color: var(--color-bg-surface); color: var(--color-text-primary); }
</style>
```

```vue
<!-- [Solution B] uni-app x App side: Based on dynamic root class binding -->
<!-- uvue natively does not support `var(--)`, must listen via JS and dynamically bind root container class overrides -->
<script setup lang="uts">
import { ref, onMounted } from 'vue'

const isDark = ref(false)

onMounted(() => {
  const sys = uni.getSystemInfoSync()
  isDark.value = sys.theme === 'dark'
  
  uni.onThemeChange((res) => {
    isDark.value = res.theme === 'dark'
  })
})
</script>

<template>
  <view class="page-container" :class="{ 'theme-dark': isDark }">
    <view class="card"><text class="card-text">Dynamic Dark Content</text></view>
  </view>
</template>

<style lang="scss">
@use '@/styles/tokens.scss' as *;
// Define static color values
$surface-light: #FFFFFF;
$surface-dark:  #161616;
$text-light:    rgba(0,0,0,0.88);
$text-dark:     rgba(255,255,255,0.9);

// Extract default (Light) styles
.card { background-color: $surface-light; padding: $space-4; }
.card-text { color: $text-light; }

// .theme-dark class override
.theme-dark .card { background-color: $surface-dark; }
.theme-dark .card-text { color: $text-dark; }
</style>
```

## 4. Multisensory Semantics Protocol

A 100-point App must possess multi-dimensional perceivability.

### 4.1 Auditory Soul
Every crucial state should be equipped with "silent-level" sound effect Tokens (based on Web Audio or Native APIs).
- **Success**: A 3000Hz ultra-short high-frequency upward chime (water drop feel).
- **Error**: A 200Hz low-frequency thud with damping.
- **Interaction**: Extremely light Friction Sound feedback.

### 4.2 Haptic Semantics —Guardian Semantic Library
Not just physical vibrations, but semantic feedback tied to mental states.
When calling `guardian.haptic(label)`, the skill package should generate code based on the following semantics:

| Semantic Label | Mental Model | Implementation Logic | Scenario Examples |
| :--- | :--- | :--- | :--- |
| **understood** | Ultra-light confirmation, meaning "I got it". | `vibrateShort({ type: 'light' })` | Switch toggles, Tab clicks, Input focus. |
| **companion** | Gentle companionship, simulating a heartbeat pulse. | Two consecutive ultra-light vibrations (100ms apart) | Task completion, successful data sync. |
| **respect** | Boundary reminder, with resistance. | `vibrateShort({ type: 'medium' })` | Exit confirmation, destructive slider. |
| **guard** | Forced intervention, warning of danger. | Consecutive heavy vibrations or Stagger mode | Core data deletion, unauth access. |

### 4.3 Aura Diffusion Reflective Field Engine

**[Hard Requirement]**: High-order Apps are forbidden to use pure monochrome backgrounds. A digital material field with a sense of flow MUST be injected.

#### Implementation Guidelines
1. **Diffuse Reflection Model**: Use `radial-gradient` instead of `background-color`.
2. **Edge Blurring**: Must combine with `filter: blur(80px)` to ensure background color blocks are "halos", not shapes.
3. **Breathing Animation**: Animation cycle set to `15s-25s`, simulating biological breathing rhythms. High-frequency refreshes are forbidden.

```scss
.dynamic-aura {
  position: absolute;
  top: 10%; left: 0; right: 0; bottom: 30%;
  background: radial-gradient(circle at center, rgba($color-brand, 0.04) 0%, transparent 75%);
  filter: blur(80px);
  z-index: 0;
  animation: aura-drift 20s infinite alternate ease-in-out;
}

@keyframes aura-drift {
  from { opacity: 0.3; transform: translate(0, 0); }
  to { opacity: 0.6; transform: translate(2%, 5%); }
}
```

---

## 5. Typography System & Optical Alignment

### Hierarchy Rules (Pages must have ≥ 3 visual weight levels)

```scss
// ★ High-Order Typography Role Separation System
// The world's best design systems (like Apple SF Pro, Inter) distinguish spacing for Display vs Body Text.

// [1] Display Role (For titles above 32rpx): Extremely tight letter spacing, minimal line height, heavy font weight
.text-display {
  font-size: $text-display;
  font-weight: $font-black;
  letter-spacing: -0.04em;  // Crucial: Massive titles MUST contract with negative letter spacing
  line-height: $leading-tight;
  color: $color-text-primary;
}

// Heading —Page/Module Titles (High Weight)
.text-heading {
  font-size: $text-xl;
  font-weight: $font-bold;
  letter-spacing: -0.03em;
  line-height: $leading-tight;
  color: $color-text-primary;
}

// Subheading —(Medium Weight)
.text-subheading {
  font-size: $text-lg;
  font-weight: $font-semibold;
  color: $color-text-primary;
}

// ★ Typeface Pairing Protocol
// .text-display { font-family: 'InstrumentSerif', serif; }
// .text-body { font-family: system-ui, -apple-system, sans-serif; }

// ★ Optical Alignment
.optical-hang {
  margin-left: -0.4em; // Offset default whitespace of leading quotes or giant characters
}

// [2] Text Role (For body text below 28rpx): Standard zero letter spacing, comfortable line height, moderate weight
.text-body {
  font-size: $text-base;
  font-weight: $font-regular;
  letter-spacing: 0em;
  line-height: $leading-normal;
  color: $color-text-primary;
}

// Caption —Aux explanations (Low weight, demoted via opacity)
.text-caption {
  font-size: $text-sm;
  color: $color-text-secondary;   // rgba opacity, not gray hex
  line-height: $leading-normal;
}

// Meta —Lowest weight (Timestamps/Annotations)
.text-meta {
  font-size: $text-xs;
  color: $color-text-tertiary;
  letter-spacing: $tracking-wide;
}

// KPI Number Anti-Jitter (Real-time data scenarios)
.text-kpi {
  font-size: $text-display;
  font-weight: $font-black;
  font-variant-numeric: tabular-nums;
  // ucss doesn't support font-feature-settings, use font-variant-numeric instead
}
```

---

## 6. Layout Philosophy & Bento Grid

### Void (Negative Space) Rules

```
★ Any Hero area or feature block must have at least 25% conscious whitespace.
★ If removing a decorative element makes it quieter, remove it.
★ Use background color differentials (rgba diff < 0.04) instead of divider lines.
★ Use spacing instead of borders.
```

### Mobile Asymmetric Bento Grid

```vue
<!-- C-Level —Asymmetric Bento Layout (Strictly forbid symmetrical layouts like equal 3-grids) -->
<!-- ⚠️ Warning: uni-app x (ucss/App) absolutely DOES NOT support flex-wrap and gap. Avoid them entirely. -->
<template>
  <view class="bento-grid">
    <!-- Top-level composite Row, internally sliced into Left & Right Columns -->
    <view class="bento-row">
      <!-- Anchor Hero Block (Occupies left half, aspect ratio driven by children) -->
      <view class="bento-hero card-premium">
        <text class="bento-label">Core Feature</text>
        <text class="bento-value">98.6°</text>
      </view>
      <!-- Right Side Two Small Blocks (Vertical stacking) -->
      <view class="bento-stat-col">
        <view class="bento-stat card-light">
          <text class="bento-stat-label">Today</text>
          <text class="bento-stat-value">24</text>
        </view>
        <view class="bento-stat card-light">
          <text class="bento-stat-label">This Week</text>
          <text class="bento-stat-value">168</text>
        </view>
      </view>
    </view>
    <!-- Full-width Bottom Block -->
    <view class="bento-wide card-medium">
      <slot name="chart" />
    </view>
  </view>
</template>

<style lang="scss">
@use '@/uni.scss' as *;

// ★ Asymmetric Grid: Largest block ≥ 2× size of the smallest block
// This uses pure nested Flex (Cols inside Rows) perfectly tailored for uni-app x ucss, abandoning gap and flex-wrap
.bento-grid {
  flex-direction: column;
  padding: $space-4;
}

.bento-row {
  flex-direction: row;
  margin-bottom: $space-3;
}

// ★ Golden Ratio 1:1.618
// Sever the mediocrity of 2:1, use the absolute divine cut of 62% : 38%.
.bento-hero  { 
  flex: 62; 
  aspect-ratio: 1; 
  margin-right: $space-3; 
}
.bento-stat-col {
  flex: 38;
  flex-direction: column;
}
.bento-stat { 
  flex: 1; /* Split height equally */
  width: 100%; 
}
.bento-stat:first-child { margin-bottom: $space-3; }
.bento-wide  { width: 100%; height: 300rpx; }

// Three-Tier Card Lighting (Progressive Hierarchy)
.card-light {
  background-color: $color-bg-surface;
  border-radius: $radius-lg;
  padding: $space-4;
  box-shadow: $shadow-sm;
}
.card-medium {
  background-color: $color-bg-surface;
  border-radius: $radius-xl;
  padding: $space-5;
  box-shadow: $shadow-md;
}
.card-premium {
  // Gradient Background (Forbid solid color filling large areas)
  background: linear-gradient(
    135deg,
    rgba(26, 26, 26, 0.95) 0%,
    rgba(50, 50, 50, 0.90) 50%,
    rgba(26, 26, 26, 0.95) 100%
  );
  border-radius: $radius-xl;
  padding: $space-5;
  box-shadow: $shadow-xl;
}

.bento-label  { font-size: $text-xs; color: rgba(255,255,255,0.5); letter-spacing: $tracking-wide; }
.bento-value  { font-size: $text-hero; font-weight: $font-black; color: #FFFFFF; line-height: 1.0; margin-top: $space-2; }
.bento-stat-label { font-size: $text-xs; color: $color-text-tertiary; }
.bento-stat-value { font-size: $text-2xl; font-weight: $font-bold; color: $color-text-primary; margin-top: $space-1; }
</style>
```

---

## 7. Animation System

> **Two Hard Rules: ① Spatial translation animation ≥ 250ms; ① MUST respect prefers-reduced-motion**

### 7.1 Page Transitions & Gestures

- **Page Transitions**: Moving from a list to a detail view should utilize highly directional spatial translation. Exiting a modal should feature a downward gravitational acceleration.
- **Physical Gesture Response**: The core experience of modern mobile is gestures. Pull-to-refresh MUST incorporate physical damping.

### 7.2 Soul Pulse Standards

**[Hard Constraint: Unobtrusive Pulse]**
- **Duration**: 100—80ms (Never exceed 300ms).
- **Easing Curve**: `Cubic-bezier(0.25, 0.1, 0.25, 1)` or `ease-out` (Pursue ultimate naturalness, linear is forbidden).
- **Amplitude**: The maximum amplitude of opacity/scale/translation is constrained within 8%.
- **Trigger**: Auto-play is strictly forbidden. Must be triggered by user action or natural state flow.

### 7.3 Triple-Axis Pulse Strategy

| Soul Axis | Animation Logic | Emotional Projection | Tech Implementation |
| :--- | :--- | :--- | :--- |
| **Understanding** | Input focus pulse | "The App is gently listening" | On focus, perform a single 600ms extreme-easing `box-shadow` breath. |
| **Respect** | Tap confirmation ripple | "My intent is solemnly confirmed" | From the touch point, diffuse a faint beige ripple for 180ms, then naturally dissipate. |
| **Companionship** | Content soft float-up | "Gliding into view like an old friend" | On page transition, content executes a 220ms fade-in + 8% physical slide up. |

> **Refusal Animation Checklist (Veto):** Any bouncing, spinning, explosions, particle effects; animations >300ms; auto-playing celebration animations.

### 7.4 Scroll-Driven Choreography

High-order interface animations are not necessarily triggered by touch, but driven by a "Scroll Timeline". There should NEVER be abrupt mutations based on a discrete `isScrolled` boolean.

- **Fluid Interpolation**: Capture the page's `onPageScroll` or use the `scroll-view`'s `@scroll` event to extract `scrollTop`.
- **Glassmorphism Nav Progression**: Background Blur and opacity MUST interpolate progressively via `opacity = clamp(0, scrollTop / 100, 1)`.
- **Parallax Hero Diminishment**: The top Cover or Hero Title should lag downward via `scrollTop * 0.4` (Gravity) while fading away via `opacity = 1 - scrollTop / 200`.

### Animation SCSS + CSS Implementation

```scss
// ─── Animation Tokens (Defined in tokens.scss) ───
// $ease-spring, $ease-breath, $ease-exit
// $duration-instant to $duration-breath

// ─── Stagger Cascade ───
@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(20rpx); }
  to   { opacity: 1; transform: translateY(0); }
}

.animate-in        { animation: fadeSlideUp $duration-slow $ease-breath both; }
.stagger-nav       { animation-delay: 0ms; }
.stagger-hero      { animation-delay: 50ms; }
.stagger-cta       { animation-delay: 100ms; }
.stagger-cards     { animation-delay: 150ms; }
.stagger-footer    { animation-delay: 200ms; }

// ─── Button Press (Elastic Bounce) ───
.btn-pressable {
  transition: transform $duration-instant $ease-spring;
  &:active { transform: scale(0.96); }
}

// ─── Skeleton Shimmer ───
@keyframes shimmer {
  0%   { background-position: -750rpx 0; }
  100% { background-position: 750rpx 0; }
}

.skeleton-shimmer {
  background: linear-gradient(
    90deg,
    $color-bg-elevated 25%,
    rgba(255,255,255,0.5) 50%,
    $color-bg-elevated 75%
  );
  background-size: 1500rpx 100%;
  animation: shimmer 1.4s ease-in-out infinite;
}

// ─── MANDATORY: Respect Reduced Motion ───
@media (prefers-reduced-motion: reduce) {
  .animate-in, [class*="stagger-"], .skeleton-shimmer, .btn-pressable {
    animation: none !important;
    transition: none !important;
    transform: none !important;
  }
}
```

### uni-app x Animations (ucss workaround strategy)

```vue
<script lang="uts">
// ucss has limited support for transition/animation
// Use uni.createAnimation to implement native animations

function pressEffect(el: string) : void {
  const anim = uni.createAnimation({
    duration: 80,
    timingFunction: 'ease-in-out'
  })
  anim.scale(0.96).step()
  // Bind to element via :animation="animData"
  setTimeout(() => {
    anim.scale(1.0).step()
  }, 80)
}

// Fade In Animation
function fadeIn() : void {
  const anim = uni.createAnimation({
    duration: 250,
    timingFunction: 'ease-out'
  })
  anim.opacity(1).step({ duration: 250 })
}
</script>
```

---

## 8. Gatekeeper Refusal Protocol

| Refusal Criteria | Soul Damage Point | Alternative (Guardian Path) |
| :--- | :--- | :--- |
| **Introducing unnecessary visual stimuli—** | Destroys the peace of the "base background". | Use micro-gradients or noise textures to simulate physical materiality. |
| **Chasing short-term trends (e.g. Neon/3D)—** | Harms the "Long-lasting" principle. | Stick to neutral, Haute Couture Design Tokens. |
| **Transferring cognitive load to users—** | Harms "Sense of Being Understood". | Predict user intent, provide a zero-curve intuitive path. |
| **Feature bloat / Fragmented logic—** | Causes the App's soul to die, degrading to a mere tool. | Extreme restraint, less is better, merge redundant portals. |
| **Sacrificing Honesty, Ecology, or Inclusivity—** | Ethical collapse, harms "Sense of Respect". | Default WCAG AA, Accessibility First, transparent privacy. |

---

## 9. Zero-AI-Aesthetic Protocol (V2.0 Sharp)

### 🚫 Rejection Criteria: If detected, rewrite immediately
- **Symmetric Mediocrity**: The use of perfectly equal 3-grids/4-grids is strictly forbidden.
- **Dead Interactions**: Linear translations without any damping or bezier curves are strictly forbidden.
- **Anemic Color**: Using pure colors (#FFFFFF or #000000) directly on large background areas is strictly forbidden.
- **Information Overload**: Exceeding 2 visual focal points per page is strictly forbidden.

---

## 10. Failure Contingency & Design Red Lines

To ensure the App's soul does not vanish in future iterations, Red Lines must be set.

### Top 3 Most Likely Ways to Fail
1. **Commercial Erosion**: Forcing deceptive buttons to hit KPIs, destroying the "Sense of Respect".
2. **Feature Obesity**: Constantly adding new features causes trunk logic distortion, destroying the "Unobtrusive" principle.
3. **Technical Laziness**: Sacrificing high-order haptic/gesture feedback for the sake of compatibility, destroying the "Honest" principle.

### Uncompromising Red Lines (The Last Wall)
- **First Red Line**: Any form of forced interruption (Modal Overload) is forbidden.
- **Second Red Line**: Hardcoding any color values in the logical layer is forbidden.
- **Third Red Line**: Sacrificing 25% of the sacred negative space (Void) is forbidden.

---

> For advanced topics, see `references/design-advanced.md`:  
> Data Visualization · Materials & Lighting · Wide-Screen Responsive · Performance Budgets · Accessibility A11y
