# High-Order Component Pattern Library: Design Guardian Edition

> High-Order App Paradigms: Figma, Notion, Arc, Linear, Superhuman.
> Core Goal: Components are not merely visual cascades; they are vessels carrying souls.
> Every component must pass the **Three Axes of Soul Calibration** before output.
<!-- TRIGGER: component, navbar, FAB, action sheet, form, input, segmented -->

---

## Table of Contents
1. [Custom Navigation Bar](#1-custom-navigation-bar)
2. [Floating Action Button (FAB)](#2-floating-action-button-fab)
   - 1.5 [Context-Aware Image Card](#1-5-context-aware-image-card)
3. [Bottom Action Sheet](#3-bottom-action-sheet)
4. [Swipeable Cards](#4-swipeable-cards)
5. [Message Toast](#5-message-toast)
6. [Data Tables](#6-data-tables)
7. [Forms - Floating Label Input](#7-forms-floating-label-input)
8. [Segmented Control](#8-segmented-control)
9. [Empty State Gallery](#9-empty-state-gallery)
10. [Advanced Skeleton Screen Library](#10-advanced-skeleton-screen-library)

---

**Core Standard**: Deprecate rigid `isScrolled` booleans. Migrate to binding `scrollTop` for **Scroll-Driven Choreography with progressive interpolation blurring**.

**Nav Aligner Protocol [100pt Requirement]**:
- **Pivot Sovereignty**: The "Back/Exit" buttons of all secondary immersive pages MUST align physically.
- **Mandatory Alignment Parameters**:
  - `top`: `env(safe-area-inset-top)`
  - `left`: `$space-4` (H5 is `$space-2`)
  - `size`: The trigger area must be at least `88rpx * 88rpx` to ensure gesture friendliness.
- **Visual Consistency**: Uniformly use minimalist `✕` or `←`.

```xml
<design_reasoning>
  1. Origin of Intent: The navigation bar should "retreat" when scrolling to make way for content.
  2. Soul Detail: Background Gaussian Blur (Filter Blur) increases linearly with scrolling, simulating the real physical evolution of glass material.
  3. Mediocrity Judgment: Rejected abrupt border-bottom, used rgba(0,0,0, $opacity) to achieve flexible vanishing edges.
</design_reasoning>
```

```vue
<template>
  <!-- Dynamically calculate opacity and backdrop-filter (H5/Web) -->
  <view class="nav-container theme-bg" :style="navStyle">
    <!-- Status bar placeholder -->
    <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
    <!-- Nav bar main body -->
    <view class="nav-bar" :style="{ height: navBarHeight + 'px' }">
      <view class="nav-left" @click="goBack">
        <text class="icon-back">→ /text>
      </view>
      <!-- Title gradually appears on scroll (0 -> 100px progress) -->
      <view class="nav-title" :style="{ opacity: titleOpacity }">
        <text class="text-heading">{{ title }}</text>
      </view>
      <view class="nav-right">
        <slot name="right"></slot>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// Driven by onPageScroll from the parent page
const props = defineProps({ title: String, scrollTop: { type: Number, default: 0 } })
const statusBarHeight = ref(20)
const navBarHeight = ref(44)

// Calculate interpolation based on scroll distance (Max 100px threshold)
const scrollProgress = computed(() => Math.min(props.scrollTop / 100, 1))
const titleOpacity = computed(() => scrollProgress.value)

const navStyle = computed(() => {
  // #ifndef APP 
  return {
    backgroundColor: `rgba(255, 255, 255, ${scrollProgress.value * 0.7})`,
    backdropFilter: `blur(${scrollProgress.value * 20}px)`,
    borderBottomColor: `rgba(0, 0, 0, ${scrollProgress.value * 0.05})`
  }
  // #endif
  
  // App-side ucss does not support backdropFilter, downgrade to opacity
  return {
    backgroundColor: `rgba(255, 255, 255, ${scrollProgress.value})`
  }
})

onMounted(() => { /* Real height calculation logic remains the same */ })
const goBack = () => uni.navigateBack()
</script>

<style lang="scss">
@use '@/styles/tokens.scss' as *;
.nav-container {
  position: sticky; top: 0; z-index: $z-sticky; width: 100%;
  border-bottom: 1px solid transparent; // Preset border
}
.nav-bar { flex-direction: row; align-items: center; justify-content: space-between; padding: 0 $space-4; }
</style>
```

---

## 1.5 Context-Aware Image Card

**Core Standard**: Extract the image's vibrant color and inject it as the background Ambient Glow. Infinite pages, infinite colors.

```vue
<!-- Parent preset CSS variable: --dynamic-ambient: #Extracted Hex -->
<template>
  <view class="ambient-card" :style="{ '--dynamic-ambient': vibrantColor }">
    <image :src="coverImage" class="ambient-cover" @load="extractColor" />
    <view class="ambient-info">
      <text class="text-heading">{{ title }}</text>
    </view>
  </view>
</template>

<style lang="scss">
.ambient-card {
  position: relative;
  background-color: var(--dynamic-ambient, #FFFFFF); // Fallback to white
  // Generative ambient light: Soft diffused shadows radiating from the internal ambient color
  box-shadow: 0 16rpx 48rpx var(--dynamic-ambient, rgba(0,0,0,0.1));
  border-radius: 32rpx;
}
</style>
```

---

## 2. Floating Action Button (FAB)

**Soul Check**:
- **Sense of Being Understood**: Clear visual hierarchy (Multiple lighting projections) indicating its authority as the core action point.
- **Sense of Companionship**: Accompanied by slight tactile feedback (Haptics) when clicked, simulating the texture of pressing a physical button.

**100pt Advance: Five-Senses Synergy [New]**:
- **Tactile**: Call `uni.vibrateShort({ type: 'light' })` the moment it's clicked.
- **Auditory**: (H5/App) Play a silent echo of the underlying `tap.mp3`.

```vue
<template>
  <view class="fab-wrapper" @click="onClick" hover-class="fab-press">
    <view class="fab-btn">
      <text class="fab-icon">+</text>
    </view>
  </view>
</template>

<style lang="scss">
@use '@/styles/tokens.scss' as *;
.fab-wrapper {
  position: fixed;
  right: $space-4;
  bottom: calc($space-8 + constant(safe-area-inset-bottom));
  bottom: calc($space-8 + env(safe-area-inset-bottom));
  z-index: $z-sticky;
}
.fab-btn {
  width: 112rpx;
  height: 112rpx;
  border-radius: $radius-full;
  background-color: $color-brand;
  align-items: center;
  justify-content: center;
  box-shadow: $shadow-lg; /* Diffused light source projection */
}
.fab-icon {
  color: #FFFFFF;
  font-size: 56rpx;
  font-weight: 300;
}
.fab-press {
  transform: scale(0.92);
  transition: transform $duration-instant $ease-spring;
}
</style>
```

---

## 3. Bottom Action Sheet

**Soul Check**:
- **Sense of Respect**: Provides explicit `sheet-handle` gesture guidance, allowing swipe-down to close, respecting the user's right to leave.

**Core Standard**: Smooth gesture damping, rounded corner processing, prevent slip-through scrolling.

```xml
<design_reasoning>
  1. Origin of Intent: Provide temporary deep operations without losing context.
  2. Soul Detail: The bounce back of $ease-spring simulates the resistance of opening a physical drawer.
  3. High-Order Paradigm: Benchmarking Linear's side slide menu.
</design_reasoning>
```

```vue
<template>
  <view class="mask" v-if="visible" @click="close" @touchmove.stop.prevent>
    <view class="sheet" :class="{ 'sheet-show': showSheet }" @click.stop>
      <view class="sheet-handle"></view>
      <view class="sheet-header">
        <text class="text-heading">{{ title }}</text>
      </view>
      <scroll-view class="sheet-content" scroll-y>
        <slot></slot>
      </scroll-view>
    </view>
  </view>
</template>

<style lang="scss">
@use '@/styles/tokens.scss' as *;
.mask {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: $color-bg-overlay;
  z-index: $z-modal;
  justify-content: flex-end;
}
.sheet {
  background-color: $color-bg-surface;
  border-top-left-radius: $radius-2xl;
  border-top-right-radius: $radius-2xl;
  padding-bottom: env(safe-area-inset-bottom);
  transform: translateY(100%);
  transition: transform $duration-normal $ease-spring;
}
.sheet-show {
  transform: translateY(0);
}
.sheet-handle {
  width: 72rpx;
  height: 8rpx;
  border-radius: $radius-full;
  background-color: $color-border-strong;
  align-self: center;
  margin-top: $space-3;
}
.sheet-header {
  padding: $space-4;
  align-items: center;
}
</style>
```

---

## 4. Swipeable Cards

**Core Standard**: Physical bounce sensation, elastic damping, refuse stiff displacements.

```vue
<!-- App-side using movable-area for physical feedback,
     H5/Mini-program utilizes css scroll-snap -->
<template>
  <scroll-view class="snap-scroll" scroll-x :show-scrollbar="false">
    <view class="snap-row">
      <view class="snap-card" v-for="i in 5" :key="i">
        <text class="text-heading">Card {{i}}</text>
      </view>
    </view>
  </scroll-view>
</template>

<style lang="scss">
@use '@/styles/tokens.scss' as *;
.snap-scroll {
  width: 100%;
  white-space: nowrap;
  /* #ifndef APP */
  scroll-snap-type: x mandatory;
  /* #endif */
}
.snap-row {
  flex-direction: row;
  padding: $space-4;
}
.snap-card {
  width: 600rpx;
  height: 360rpx;
  margin-right: $space-3;
  background-color: $color-bg-elevated;
  border-radius: $radius-xl;
  padding: $space-5;
  /* #ifndef APP */
  scroll-snap-align: center;
  /* #endif */
}
</style>
```

---

## 5. Message Toast

**Core Standard**: No modal blocking, dynamic Gaussian blur reflections, does not interfere with the user's primary flow.

```vue
<template>
  <view class="toast-wrapper" :class="{'toast-enter': visible}">
    <view class="toast-content" :class="`toast-${type}`">
      <text class="toast-text">{{ message }}</text>
    </view>
  </view>
</template>

<style lang="scss">
@use '@/styles/tokens.scss' as *;
.toast-wrapper {
  position: fixed;
  top: 120rpx; /* Avoid Nav bars */
  left: $space-4;
  right: $space-4;
  align-items: center;
  z-index: $z-toast;
  pointer-events: none;
  opacity: 0;
  transform: translateY(-20rpx) scale(0.95);
  transition: all $duration-normal $ease-spring;
}
.toast-enter {
  opacity: 1;
  transform: translateY(0) scale(1);
}
.toast-content {
  padding: $space-3 $space-5;
  border-radius: $radius-full;
  background-color: rgba(26,26,26,0.95); /* Extremely dark color brings contrast perception */
  box-shadow: $shadow-md;
}
.toast-text {
  color: #FFFFFF;
  font-size: $text-sm;
  font-weight: $font-medium;
}
</style>
```

---

## 6. Data Tables

**Core Standard**: Mobile horizontal scrolling, fixed first column, compact Text Role typography.

```vue
<template>
  <scroll-view class="table-scroll" scroll-x>
    <view class="table">
      <view class="table-header row">
        <text class="cell cell-fixed text-caption">Metric</text>
        <text class="cell text-caption" v-for="i in 5" :key="i">Q{{i}}</text>
      </view>
      <view class="row" v-for="row in 3" :key="row">
        <text class="cell cell-fixed text-body font-medium">Revenue</text>
        <text class="cell text-body text-kpi" v-for="i in 5" :key="i">24M</text>
      </view>
    </view>
  </scroll-view>
</template>

<style lang="scss">
@use '@/styles/tokens.scss' as *;
.table-scroll { width: 100%; border-radius: $radius-md; background-color: $color-bg-surface; }
.table { display: flex; flex-direction: column; }
.row {
  flex-direction: row;
  border-bottom: 1px solid $color-border;
  height: 96rpx;
  align-items: center;
}
.table-header { background-color: $color-bg-elevated; height: 80rpx; }
.cell { width: 160rpx; text-align: right; padding-right: $space-3; }
.cell-fixed {
  width: 200rpx; text-align: left; padding-left: $space-4;
  /* #ifndef APP */
  position: sticky; left: 0; background-color: inherit; z-index: 2;
  /* #endif */
}
</style>
```

---

## 7. Forms - Floating Label Input

**Core Standard**: When the input is focused, the label floats up, and color gradients indicate status.

```vue
<template>
  <view class="input-group" :class="{'is-focused': focused, 'has-val': value.length > 0}">
    <text class="float-label">Account</text>
    <input class="input-field" v-model="value" @focus="focused=true" @blur="focused=false" />
  </view>
</template>

<style lang="scss">
@use '@/styles/tokens.scss' as *;
.input-group {
  position: relative;
  background-color: $color-bg-elevated;
  height: 112rpx;
  border-radius: $radius-md;
  padding: 0 $space-3;
  justify-content: center;
}
.float-label {
  position: absolute;
  left: $space-3;
  top: 36rpx;
  color: $color-text-tertiary;
  font-size: $text-base;
  transition: all $duration-normal $ease-spring;
  /* ucss limits: cannot use transform-origin etc., use explicit top+fsize transform */
}
.is-focused .float-label, .has-val .float-label {
  top: 16rpx;
  font-size: $text-xs;
  color: $color-brand;
}
.input-field {
  height: 48rpx;
  margin-top: 36rpx;
  font-size: $text-base;
  color: $color-text-primary;
}
</style>
```

---

## 8. Segmented Control

**Core Standard**: iOS native-texture slider trailing the finger; switching moments trigger ultra-light Haptics.

```vue
<template>
  <view class="segment-box">
    <view class="segment-slider" :style="{ left: current * 50 + '%' }"></view>
    <view class="segment-item" @click="handleSwitch(0)">
      <text class="segment-text" :class="{'active': current===0}">Monthly</text>
    </view>
    <view class="segment-item" @click="handleSwitch(1)">
      <text class="segment-text" :class="{'active': current===1}">Yearly (Save 20%)</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const current = ref(0)
const handleSwitch = (index: number) => {
  if (current.value === index) return
  current.value = index
  // Reaching extreme points of mechanical feedback, forcefully inject haptic collision
  // #ifndef H5
  uni.vibrateShort({ type: 'light' })
  // #endif
}
</script>

<style lang="scss">
@use '@/styles/tokens.scss' as *;
.segment-box {
  flex-direction: row;
  background-color: $color-bg-elevated;
  border-radius: $radius-sm;
  padding: 4rpx;
  height: 64rpx;
  position: relative;
}
.segment-slider {
  position: absolute;
  top: 4rpx; bottom: 4rpx;
  width: calc(50% - 4rpx);
  background-color: $color-bg-surface;
  border-radius: $radius-xs;
  box-shadow: $shadow-sm;
  transition: left $duration-normal $ease-spring;
}
.segment-item { flex: 1; align-items: center; justify-content: center; z-index: 2; }
.segment-text { font-size: $text-sm; color: $color-text-secondary; font-weight: $font-medium; }
.active { color: $color-text-primary; }
</style>
```

---

## 9. Empty State Gallery

**Core Standard**: Reject rigid placeholders and rough loading icons. Forcibly use pure code (SVG / CSS) to build elegant geometric Micro-Narratives. Examples: breathing concentric circles, floating geometric abstract arrays. Extreme Void, emotional illustrations, attractive main action buttons.

```vue
<template>
  <view class="empty-state">
    <view class="empty-graphic-morph">
      <!-- Generative pure code drawing: using CSS animations or SVG paths to build ultra-premium geometry -->
      <view class="morph-ring ring-1"></view>
      <view class="morph-ring ring-2"></view>
      <view class="morph-ring ring-3"></view>
    </view>
    <text class="text-heading empty-title optical-hang">No Inbox Found</text>
    <text class="text-caption empty-desc">All your processed stories and tasks will be archived here.\nEnjoy the peace of clearing everything.</text>
    <view class="btn-primary empty-btn btn-pressable">
      <text class="btn-text">Create New Task</text>
    </view>
  </view>
</template>

<style lang="scss">
@use '@/styles/tokens.scss' as *;
.empty-state {
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: $space-12 $space-6;
}

// Pure CSS generative micro-narrative: Breathing concentric rings array
.empty-graphic-morph {
  position: relative;
  width: 240rpx; height: 240rpx;
  margin-bottom: $space-8;
  align-items: center;
  justify-content: center;
}
.morph-ring {
  position: absolute;
  border-radius: $radius-full;
  border: 1px solid rgba(107, 70, 193, 0.15); // Ambient ambient light
}
/* ucss must use uni.createAnimation instead */
/* #ifndef APP */
.ring-1 { width: 80rpx; height: 80rpx; animation: breathe $duration-breath infinite alternate ease-in-out; }
.ring-2 { width: 140rpx; height: 140rpx; animation: breathe $duration-breath infinite alternate-reverse ease-in-out; }
.ring-3 { width: 220rpx; height: 220rpx; border: 1px dashed rgba(107, 70, 193, 0.2); animation: rotate 15s linear infinite; }

@keyframes breathe {
  0% { transform: scale(0.95); opacity: 0.5; }
  100% { transform: scale(1.1); opacity: 1; }
}
@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
/* #endif */

.empty-title { margin-bottom: $space-2; }
.empty-desc { text-align: center; margin-bottom: $space-8; line-height: $leading-loose; }
.empty-btn { width: 320rpx; align-items: center; }
.btn-text { color: #fff; font-size: $text-base; font-weight: $font-medium; }
</style>
```

---

## 10. Advanced Skeleton Screen Library

**Core Standard**: Matches the final real layout structure with smooth transparent skeleton flashing. All skeleton components MUST implement placeholder sizes accurately.

```vue
<!-- Classic Mode Skeleton Screen (Supports CSS animation) -->
<template>
  <view v-if="loading" class="skeleton-page">
    <view class="skeleton-header">
      <view class="sk sk-avatar" />
      <view class="sk-lines">
        <view class="sk sk-line sk-line--full" />
        <view class="sk sk-line sk-line--half" />
      </view>
    </view>
    <view class="sk sk-card" />
    <view class="sk sk-card sk-card--short" />
  </view>
</template>

<style lang="scss">
@use '@/uni.scss' as *;
%sk-base {
  border-radius: $radius-sm;
  @extend .skeleton-shimmer;  // Reference global shimmer effect
}
.skeleton-page { padding: $space-4; flex-direction: column; }
.skeleton-header { flex-direction: row; align-items: center; margin-bottom: $space-4; }
.sk-avatar { @extend %sk-base; width: 80rpx; height: 80rpx; border-radius: $radius-full; flex-shrink: 0; }
.sk-lines  { flex: 1; flex-direction: column; margin-left: $space-3; gap: $space-2; }
.sk-line   { @extend %sk-base; height: 28rpx; }
.sk-line--full { width: 100%; }
.sk-line--half { width: 55%; }
.sk-card  { @extend %sk-base; height: 200rpx; width: 100%; margin-bottom: $space-3; }
.sk-card--short { height: 120rpx; }
</style>
```

---

## 11. Component State Matrix

> **If the number of combinations is ≥ 6, the state matrix MUST be declared before coding**

```text
[Declaration Example: Submit Button]
State × Role Combinations = 4 × 3 = 12 → Must declare

[idle]    × [visitor]  → Hidden
[idle]    × [user]     → Blue solid "Submit"
[idle]    × [admin]    → Blue solid "Submit" + Next to it "Draft" outlined button
[loading] × [user]     → Grayed out + spinner (Prevent duplicate clicks)
[success] × [user]     → Green ✅"Submitted" (Cannot operate again)
[error]   × [user]     → Red border input + Specific error desc. + Retry button
```

```typescript
// ★ Explicitly use string enums, absolutely forbid multiple boolean combos
type ComponentState = 'idle' | 'loading' | 'success' | 'empty' | 'error' | 'disabled'

// ❌FOREVER forbid writing it this way:
// const isLoading = ref(false)
// const isError = ref(false)
// -> When isLoading=true AND isError=true, what renders—
```

---

## 12. Headless Compound Components

**Core Standard**: Separate the interaction state machine (states, event distribution, A11y logic) from the visual layer. The minimalist `<Accordion>` collapsing panel paradigm.

```vue
<!-- Parent Component: Manages all logic and state distribution (Core Headless ideology) -->
<template>
  <view class="accordion-root">
    <slot></slot>
  </view>
</template>
<script setup lang="ts">
import { provide, ref } from 'vue'
const activeValues = ref<string[]>([])
const toggleItem = (val: string) => { 
  /* Handle expand/collapse state cycle */ 
}
provide('accordion-ctx', { activeValues, toggleItem })
</script>

<!-- Child Component Trigger: Only responsible for triggering display and structural mounting -->
<template>
  <view class="accordion-trigger" @click="handleToggle" hover-class="btn-press">
    <text class="text-subheading"><slot></slot></text>
    <text class="icon-chevron" :class="{'is-open': isOpen}">→ /text>
  </view>
</template>

<!-- Child Component Content: Only responsible for animation and height scaling feedback -->
<template>
  <view class="accordion-content" :class="{'is-open': isOpen}">
    <slot></slot>
  </view>
</template>
```
