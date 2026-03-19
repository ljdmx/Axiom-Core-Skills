# DDFM Advanced Design System: Material · Responsive · Performance · A11y
<!-- TRIGGER: materials, lighting, Specular, Glow, Tablet, Foldables, Wide screens, Responsive, Performance Budget, Fallback, A11y, Accessibility, Data Visualization, ucharts -->
> This file is an advanced extension of `design.md`. Condition for loading: Requirements involve ONE of the TRIGGER keywords above.
> For core Design Tokens, Colors, Typography, and Animation Systems, please see `references/design.md`.

---

## Table of Contents

1. [Data Visualization Sovereignty](#1-data-visualization-sovereignty)
2. [Material & Lighting System](#2-material--lighting-system)
3. [Wide Screen & Responsive Computation](#3-wide-screen--responsive-computation)
4. [Performance Budgets & Fallback Tiers](#4-performance-budgets--fallback-tiers)
5. [High-Order Mobile Product Reference Frames](#5-high-order-mobile-product-reference-frames)
6. [Accessibility & Inclusive Design (A11y)](#6-accessibility--inclusive-design-a11y)

---

## 1. Data Visualization Sovereignty

> uni-app Recs: `ucharts` (Best for all platforms)  
> uni-app x Recs: Native canvas or uts-wrapped chart plugins

### Chart Type Decision Tree

| Data Pattern | Correct Chart | Anti-Pattern |
|----------|----------|--------|
| Time Trend | Line / Area Chart | Pie Chart |
| Part-to-Whole (≤5) | Donut | 3D Pie Chart |
| Category Comparison (>6) | Horizontal Bar | Vertical Bar |
| Single KPI | Metric Card + Mini Sparkline | Full Axis Chart |
| Geolocation / Density | Heatmap | Data Table |
| Distribution / Outliers | Boxplot / Scatter | Bar Chart |

### Chart Best Practices

```vue
<template>
  <view class="chart-container">
    <!-- Loading: Skeleton (Exactly matches chart dimensions) -->
    <view v-if="loading" class="chart-skeleton skeleton-shimmer" />

    <!-- Empty: Illustration + CTA (Empty axes are strictly forbidden) -->
    <view v-else-if="!data.length" class="chart-empty">
      <image src="/static/chart-empty.svg" mode="aspectFit" />
      <text class="chart-empty-text">No data available, please adjust filters</text>
    </view>

    <!-- Chart -->
    <qiun-data-charts
      v-else
      type="line"
      :opts="chartOpts"
      :chartData="chartData"
    />
  </view>
</template>

<style lang="scss">
@use '@/uni.scss' as *;
.chart-container {
  background-color: $color-bg-surface;
  border-radius: $radius-lg;
  padding: $space-4;
  box-shadow: $shadow-sm;
}
.chart-skeleton { height: 400rpx; border-radius: $radius-md; }
.chart-empty {
  height: 400rpx;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: $space-3;
}
.chart-empty-text { font-size: $text-sm; color: $color-text-tertiary; }
</style>
```

```javascript
// Chart Configuration Best Practices
const chartOpts = {
  // Low-interference palette (Monochrome base + 1 semantic highlight)
  color: ['#1A1A1A', '#8E8E8E', '#2D7D46'],
  // Y-axis starts from data_min * 0.9 (Forced zero baselines distort trends)
  yAxis: { min: (min) => min * 0.9, max: (max) => max * 1.1, splitNumber: 4 },
  dataLabel: false,        // Disable raw number labels (Visual noise)
  legend: { show: false }, // Disable built-in legend when a dedicated legend area is present
  grid: { top: 20, bottom: 50, left: 60, right: 20 }
}
```

---

## 2. Material & Lighting System

Surpass basic background colors to build physical credibility. High-order design relies not just on blocks of color, but stacked textures.

### 2.1 Multi-Dimensional Materials (C-Level Extraordinary Experience · Pure CSS)

**[1] Procedural Noise Texture**: Overlay this layer on core brand zones to break cheap solid-color aesthetics.
```scss
.mx-noise-overlay {
  position: absolute;
  inset: 0;
  opacity: 0.03;
  pointer-events: none;
  background-image: repeating-conic-gradient(rgba(0,0,0,0.8) 0%, transparent 0.0001%);
  background-size: 100% 100%;
}
```

**[2] Depth Blur Arrays**: Establish true Z-axis perception, replacing single-layer shadows.
```scss
.layer-deep-blur {
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.05),
              0 16rpx 48rpx rgba(0,0,0,0.08),
              0 48rpx 120rpx rgba(0,0,0,0.12);
}
```

**[3] Physical Specular & Glow**:
- **Specular**: Dark mode card tops MUST brutally enforce `border-top: 1px solid rgba(255,255,255,0.12)` for a faint specular highlight edge.
- **Radial Glow**: Embed ultra-faint glows in deep black backgrounds:  
  `background: radial-gradient(circle at 50% 0%, var(--dynamic-ambient, rgba(107,70,193,0.15)), transparent 60%), #161616;`

### 2.2 Context-Aware Dynamic Theming

The atmosphere of a high-order interface should not be a rigid static color, but determined by the content the user currently consumes (Album covers, movie posters, product cards).

- **Dynamic Environment Var Injection**: Use a Color Extractor algorithm to grab the `Vibrant` or `Muted` dominant color of the image.
- **Correlated Rendering**: Bind the extracted Hex/RGB to the outer container's `--dynamic-ambient` variable.
- **Immersive Feedback**: This variable permeates the full-screen background **Radial Glow** and the primary card's **Ambient Shadows**, achieving an epic "infinite pages, infinite colors" enveloping sensation.

---

## 3. Wide Screen & Responsive Computation

uni-app inherently works across all platforms. With the rise of iPad OS and foldable screens, simply scaling interfaces 2x horizontally is disastrous.

- **Breakpoint Control**: Detect `windowWidth > 600px` or evaluate `pad`.
- **Macro Structural Migration (Master-Detail)**: Mobile's "List → Detail page" transition morphs into Wide-screen "Left 35% List + Right 65% Detail" Master-Detail layout.
- **Bento Wide-Screen Adaptation**: A 2-column Bento on mobile should stretch to 3+ columns on wide screens.

```javascript
// Check window width during App.vue initialization
const sys = uni.getSystemInfoSync()
const isWideScreen = sys.windowWidth > 600
// isWideScreen ? 'layout-master-detail' : 'layout-single'
```

---

## 4. Performance Budgets & Fallback Tiers

The zenith of design often comes with performance taxation; a floor must be programmed for low-end devices.

### 4.1 Hardware Fallbacks

Automatically evaluate device constitution during `App.vue` initialization:
```javascript
const sys = uni.getSystemInfoSync()
if (sys.platform === 'android' /* && low-end device verification */) {
  uni.setStorageSync('device-tier', 'low')
}
```
**Fallback Expressions**:
- Cancel ALL background Blur filters.
- Skeleton screen scanning animations deactivated, reverting to static pure gray.
- Disable complex overflow computations for image border-radius in long lists.

### 4.2 Volume & Memory Targets

- **First Contentful JS Bundle Budget**: Post-Gzip required `< 200KB` (H5/MP only).
- **Component Unmount Assertions**: When scrolling virtual lists, memory fluctuations must remain within tight bounds; implicit closures causing image Node retention are strictly prohibited.

---

## 5. High-Order Mobile Product Reference Frames (World-Class Reference)

When constructing a UI but feeling uncertain about the execution, use the core philosophy of these products as absolute yardsticks:

- **Linear / Vercel**: Absolutely rational dark mode control, single-pixel light and shadow application, almost violent perception of response speed.
- **Craft Notes / Notion**: Extremely high tolerance for massive "Void", quiet gesture interactions, de-color-blocking.
- **Things 3 / Apple HIG**: Seamless gesture damping as physical metaphors, precise tuning of gigantic, exaggerated Display Typography.

---

## 6. Accessibility & Inclusive Design (A11y)

As an enterprise-grade skill package, Accessibility is NEVER an appendix; it is the Product Constitution.

### 6.1 Physical Interaction Guarantees (Minimum Touch Target)

- **Minimum Touch Hotspot**: The physical tap zone for all clickable elements MUST be **≥ 44×44pt** (Translated to uni-app as `88rpx × 88rpx` minimums).
- If the visual element is small (e.g., `32rpx` outline icon), transparent parent container padding cushions MUST be used to expand the zone. Demanding users tap exact visual pixels is strictly prohibited.

### 6.2 Accessibility Tree

- Complex components (Segmented selectors, progress wheels) must be designed with appropriate labeling in native environments, relaying content significance to screen readers via `aria-label` / `aria-role` or equivalent attributes.

### 6.3 Vestibular Disorders & Photosensitivity Protection

- **Honor Motion Toggles**: Force the introduction of fallbacks at the root level as an unbypassable global assertion.

```scss
@media (prefers-reduced-motion: reduce) {
  /* Disable all animations */
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 6.4 Cognitive Accessibility & A11y 2.0

True accessibility is not just cold screen readers; it is multi-sensory synesthesia.
- **UI Sound Physical Acoustics**: During destructive ops or large payments, invoke `uni.vibrateShort({ type: 'heavy' })` + Underlying audio engine playing low-frequency synth waves. Audial + Tactile + Visual unity builds a cognitive moat.
- **Fluid Typography Degration**: When users activate "Huge Text" OS modes, `clamp`-based fluid scaling frameworks must flexibly accommodate text shifting; container out-of-bounds or overlapping is never allowed.
- **Skeleton Drop-downs**: If `prefers-reduced-motion: reduce` is detected, skeleton screens automatically gracefully degrade into static fade-in displays.
