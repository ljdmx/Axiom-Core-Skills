# uni-app x Complete Guide
## UTS Language + uvue Rendering Engine + Native Performance
<!-- TRIGGER: uni-app x, UTS, uvue, native, Kotlin, Swift, ArkTS, HarmonyOS -->

> Requires HBuilderX ≥ 3.9  
> Official Documentation: https://doc.dcloud.net.cn/uni-app-x/

---

## Table of Contents

1. [uni-app x Core Concepts](#1-uni-app-x-core-concepts)
2. [Create Project](#2-create-project)
3. [UTS Language Essentials](#3-uts-language-essentials)
4. [uvue CSS Standards (Differences from Classic)](#4-uvue-css-standards-differences-from-classic)
5. [uvue Page Development Template](#5-uvue-page-development-template)
6. [Component Development](#6-component-development)
7. [API Calls and Native Capabilities](#7-api-calls-and-native-capabilities)
8. [Migration Guide (From uni-app Classic)](#8-migration-guide-from-uni-app-classic)

---

## 1. uni-app x Core Concepts

```
The essence of uni-app x:
  UTS Code  →  Android: Kotlin native code (No JS engine)
           →  iOS:     Swift code
           →  Harmony: ArkTS code
           →  Web/MP:  JavaScript

The essence of uvue:
  .uvue page → Native UI components (Not WebView)
           → Layout engine = flex (Only this one)
           → No style inheritance (Parent styles do not affect children)
           → Only class selectors (No tag / #id / [attr])

Performance Class:
  uni-app x Android ≥ Native Kotlin app
  uni-app x iOS     ≥ Native Swift app (In some scenarios)
```

**Summary of Important Limitations:**

| Limitation | Explanation |
|------|------|
| No Hot Update | Compiled to binary; official wgt hot update not supported |
| No npm packages | Cannot use JS ecosystem npm packages, UTS plugins required |
| Flex Layout Only | CSS Grid / position (limited) etc. unavailable |
| No Style Inheritance | Each component's style is isolated; `inherit` is invalid |
| Only Class Selectors | No tag selectors, no ID selectors |
| Default is Vertical | `flex-direction` defaults to `column` (not row) |
| Text Styles on Text Only| `font-size` etc. only take effect on `<text>` components |
| Strong Typing | No abuse of `any` type, variables must declare types |
| No CSS Variables | ucss does not support `var(--xxx)`; use SCSS variables |

---

## 2. Create Project

```
HBuilderX → File → New → Project
→ Select "uni-app x" type
→ Select the "Hello uni-app x" template (Official component/API demo)
→ HBuilderX version must be ≥ 3.9
```

### Project Directory Structure

```
my-uni-app-x/
├── pages/
│    └── index/
│        └── index.uvue        # ★ Note the extension is .uvue (not .vue)
├── components/
│    └── my-button.uvue        # Custom component
├── static/                   # Static resources
├── utils/
│    └── request.uts           # ★ Utility function extension is .uts (not .ts)
├── uni_modules/              # Plugins (Must be compatible with uni-app x)
├── App.uvue                  # Global lifecycle
├── main.uts                  # ★ Entry file (not .ts)
├── manifest.json
├── pages.json
└── uni.scss                  # Global SCSS (Compile-time variables, not CSS variables)
```

---

## 3. UTS Language Essentials

### UTS vs TypeScript Core Differences

```typescript
// ─── ✅Basic Syntax (Almost identical to TS) ───
const name: string = 'hello'
let count: number = 0

// ─── ✅Function Declaration ───
function add(a: number, b: number): number {
  return a + b
}

// ─── ✅Interfaces & Types ───
interface User {
  id: number
  name: string
  avatar: string | null
}

// ─── ⚠️ No `any` type (Strong type constraint) ───
// ❌const data: any = {}      // Forbidden
// ✅const data: UTSJSONObject = {}   // Use UTSJSONObject instead

// ─── ⚠️ No `undefined` (Use `null` instead) ───
// ❌let x: number | undefined
// ✅let x: number | null = null

// ─── ⚠️ Variables MUST be initialized ───
// ❌let n: number            // Invalid, must be assigned
// ✅let n: number = 0        // Valid
// ✅let n: number | null = null  // Valid

// ─── ✅Type Inference (Literals) ───
const title = 'Hello'          // Auto-inferred as string
const num = 42                 // Auto-inferred as number

// ─── ✅Arrays ───
const list: string[] = ['a', 'b']
const ids: Array<number> = [1, 2, 3]

// ─── ✅UTSJSONObject (Replaces `any` object) ───
const config: UTSJSONObject = {
  url: 'https://api.example.com',
  timeout: 10000
}
const url = config['url'] as string

// ─── ✅Optional Chaining (Supported) ───
const len = user—.name—.length —— 0

// ─── ⚠️ Platform-specific APIs (Needs conditional compilation) ───
// #ifdef APP-ANDROID
// Can call Android native APIs (Kotlin code)
// #endif
// #ifdef APP-IOS
// Can call iOS native APIs (Swift code)
// #endif
```

### Async Processing

```typescript
// ✅async/await (Supported)
async function fetchUser(): Promise<User> {
  const res = await uni.request({
    url: 'https://api.example.com/user'
  })
  // uni-app x's API return values are statically typed
  return res.data as User
}

// ✅Promise (Supported)
function loadData(): Promise<string[]> {
  return new Promise<string[]>((resolve, reject) => {
    uni.request({
      url: '/api/list',
      success: (res) => resolve(res.data as string[]),
      fail: (err) => reject(err)
    })
  })
}
```

---

## 4. uvue CSS Standards (Differences from Classic)

### Core Difference Comparison

| CSS Feature | uni-app Classic | uni-app x (ucss) |
|---------|------------|-----------------|
| Layout Model | flex + block + grid | **flex ONLY** |
| Default Direction | row (Horizontal)| **column (Vertical)**|
| Style Inheritance | ✅Supported | ❌**Parent/Child isolated** |
| Selectors | Multiple | **Class ONLY** |
| CSS Variables | ✅`var(--xx)` | ❌**Use SCSS Variables** |
| `position: fixed` | ✅| Limited Support |
| `background-image` | ✅| Limited Support |
| Text Style Scope | Any element | **text component ONLY** |
| `inherit` / `unset` | ✅| ❌|

### SCSS Variables Replacing CSS Variables

```scss
// uni.scss (Globally imported, compile-time variables, usable by both modes)
// ★ ucss does NOT support CSS custom properties (i.e., var(--xxx)), MUST use SCSS $variables instead.

// Complete Design Token Variable Definitions: see mobile-design.md §2 Complete Design Token Implementation.
// (Repetitive SCSS definitions omitted here, actual projects MUST include all color, spacing, and typography variables dictated by mobile-design.md)
```

### uvue Practical Layout Template

```scss
// ─── Page Container (Vertical by default) ───
.page {
  flex: 1;                      // Fill height
  flex-direction: column;       // Explicit declaration (ucss default is already column)
  background-color: $color-bg-base;
}

// ─── Horizontal Container (MUST explicitly declare row) ───
.row {
  flex-direction: row;
  align-items: center;
}

// ─── Text Styles: Write ONLY on <text> components ───
.text-primary {
  font-size: $text-base;
  font-weight: $font-medium;
  color: $color-text-primary;   // ucss doesn't support some rgba syntax, use full rgba()
}
.text-secondary {
  font-size: $text-sm;
  color: $color-text-secondary;
}

// ─── Cards (ucss box-shadow is only partially supported on App) ───
.card {
  background-color: $color-bg-surface;
  border-radius: $radius-lg;
  padding: $space-4;
  margin-bottom: $space-3;
  // App's shadow alternative: Use border or background color differences to express hierarchy
  border-width: 1rpx;
  border-color: $color-border;
  border-style: solid;
}

// ─── Forbidden usage in ucss ───
// .bad { display: block; }      // ❌Only flex
// .bad { color: inherit; }      // ❌No inheritance
// .bad { grid-template: ...; }  // ❌No grid
// #title { font-size: 32rpx; }  // ❌No ID selector
```

---

## 5. uvue Page Development Template

```vue
<!-- pages/index/index.uvue -->
<template>
  <view class="page">

    <!-- Loading (Skeleton Screen) -->
    <view v-if="pageState === 'loading'" class="skeleton-wrap">
      <view class="skeleton-line skeleton-line--full" />
      <view class="skeleton-line skeleton-line--three-quarter" />
      <view class="skeleton-line skeleton-line--half" />
    </view>

    <!-- Empty State -->
    <view v-else-if="pageState === 'empty'" class="empty-wrap">
      <image class="empty-img" src="/static/empty.svg" mode="aspectFit" />
      <text class="empty-title">No data yet</text>
      <button class="btn-primary" @click="handleCreate">
        <text class="btn-text">+ Create Now</text>
      </button>
    </view>

    <!-- Error State -->
    <view v-else-if="pageState === 'error'" class="error-wrap">
      <text class="error-text">{{ errorMsg }}</text>
      <button class="btn-ghost" @click="loadData">
        <text class="btn-text">Reload</text>
      </button>
    </view>

    <!-- Normal Content -->
    <view v-else class="content">
      <!-- ★ Text styles MUST be on the text component in ucss -->
      <text class="page-title">{{ title }}</text>

      <!-- List (Note: <text> cannot nest <view>) -->
      <view
        v-for="(item, index) in list"
        :key="index"
        class="card"
        @click="handleClick(item)"
      >
        <view class="card-header row">
          <text class="card-title">{{ item.name }}</text>
          <text class="card-badge">{{ item.status }}</text>
        </view>
        <text class="card-desc">{{ item.desc }}</text>
      </view>
    </view>

  </view>
</template>

<script lang="uts">
// ★ Use script lang="uts" in uni-app x
import { ref, onMounted } from 'vue'

// Strongly Typed Interface Definition
interface ListItem {
  id: number
  name: string
  desc: string
  status: string
}

// Explicit string state enum
type PageState = 'idle' | 'loading' | 'success' | 'empty' | 'error'

export default {
  setup() {
    const pageState = ref<PageState>('idle')
    const errorMsg  = ref<string>('')
    const title     = ref<string>('My List')
    const list      = ref<ListItem[]>([])

    async function loadData() : Promise<void> {
      pageState.value = 'loading'
      try {
        const res = await uni.request({
          url: 'https://api.example.com/items'
        })
        const data = res.data as UTSJSONObject
        const items = data['list'] as ListItem[]
        list.value = items
        pageState.value = items.length > 0 ? 'success' : 'empty'
      } catch (e) {
        pageState.value = 'error'
        errorMsg.value = 'Loading failed, please check network'
      }
    }

    function handleClick(item: ListItem) : void {
      uni.navigateTo({ url: `/pages/detail/detail—id=${item.id}` })
    }

    function handleCreate() : void {
      uni.navigateTo({ url: '/pages/create/create' })
    }

    onMounted(() => { loadData() })

    return { pageState, errorMsg, title, list, loadData, handleClick, handleCreate }
  }
}
</script>

<style lang="scss">
@use '@/uni.scss' as *;

.page {
  flex: 1;
  flex-direction: column;
  background-color: $color-bg-base;
}

// Skeleton (Flashing animations need simplification in ucss)
.skeleton-wrap { padding: $space-4; flex-direction: column; }
.skeleton-line {
  height: 28rpx;
  background-color: $color-bg-elevated;
  border-radius: $radius-sm;
  margin-bottom: $space-2;
}
.skeleton-line--full         { width: 100%; }
.skeleton-line--three-quarter { width: 75%; }
.skeleton-line--half         { width: 50%; }

// Empty State
.empty-wrap {
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: $space-12;
}
.empty-img   { width: 200rpx; height: 200rpx; }
.empty-title {
  font-size: $text-lg;
  color: $color-text-secondary;
  margin-top: $space-4;
  margin-bottom: $space-5;
}

// Content Area
.content { padding: $space-4; flex-direction: column; }
.page-title {
  font-size: $text-xl;
  font-weight: $font-bold;
  color: $color-text-primary;
  margin-bottom: $space-4;
}

// Card
.card {
  background-color: $color-bg-surface;
  border-radius: $radius-lg;
  padding: $space-4;
  margin-bottom: $space-3;
  border-width: 1rpx;
  border-color: $color-border;
  border-style: solid;
  flex-direction: column;
}
.card-header {
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: $space-2;
}
.card-title {
  font-size: $text-lg;
  font-weight: $font-medium;
  color: $color-text-primary;
}
.card-badge {
  font-size: $text-xs;
  color: $color-success;
  background-color: rgba(45, 125, 70, 0.1);
  padding: 4rpx 12rpx;
  border-radius: $radius-full;
}
.card-desc {
  font-size: $text-sm;
  color: $color-text-secondary;
  line-height: 1.5;
}

// Button (In ucss, button text also uses the text component)
.btn-primary {
  background-color: $color-brand;
  border-radius: $radius-md;
  padding: $space-3 $space-6;
  align-items: center;
  justify-content: center;
}
.btn-ghost {
  background-color: transparent;
  border-width: 1rpx;
  border-color: $color-brand;
  border-style: solid;
  border-radius: $radius-md;
  padding: $space-3 $space-6;
  align-items: center;
  justify-content: center;
}
.btn-text {
  font-size: $text-base;
  font-weight: $font-medium;
  color: #FFFFFF;
}
.btn-ghost .btn-text { color: $color-brand; }

// Error State
.error-wrap {
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: $space-8;
}
.error-text {
  font-size: $text-base;
  color: $color-error;
  margin-bottom: $space-4;
  text-align: center;
}

// Row Layout Helper
.row { flex-direction: row; align-items: center; }
</style>
```

---

## 6. Component Development

```vue
<!-- components/stat-card.uvue -->
<template>
  <view class="stat-card">
    <text class="stat-label">{{ label }}</text>
    <text class="stat-value">{{ value }}</text>
    <text class="stat-unit">{{ unit }}</text>
  </view>
</template>

<script lang="uts">
// uni-app x Component Props MUST be strongly typed
export default {
  props: {
    label: { type: String,  required: true  },
    value: { type: Number,  required: true  },
    unit:  { type: String,  default: ''     }
  }
}
</script>

<style lang="scss">
@use '@/uni.scss' as *;
.stat-card {
  flex-direction: column;
  align-items: flex-start;
  padding: $space-4;
}
.stat-label {
  font-size: $text-xs;
  color: $color-text-tertiary;
  font-weight: $font-medium;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}
.stat-value {
  font-size: $text-display;
  font-weight: $font-bold;
  color: $color-text-primary;
  line-height: 1.1;
  margin-top: $space-1;
}
.stat-unit {
  font-size: $text-sm;
  color: $color-text-secondary;
  margin-top: 4rpx;
}
</style>
```

---

## 7. API Calls and Native Capabilities

```typescript
// ─── Routing (Identical to Classic mode) ───
uni.navigateTo({ url: '/pages/detail/detail—id=1' })
uni.navigateBack({ delta: 1 })
uni.reLaunch({ url: '/pages/login/login' })

// ─── Storage (Identical to Classic mode) ───
uni.setStorageSync('key', 'value')
const val = uni.getStorageSync('key') as string

// ─── System Info & Safe Area (Strongly Typed) ───
const sysInfo = uni.getSystemInfoSync()
const statusBarHeight: number = sysInfo.statusBarHeight —— 0

// Android Notch and iOS Bottom Home Indicator safe calculation
const safeAreaInsets = sysInfo.safeAreaInsets
const bottomSafeHeight: number = safeAreaInsets—.bottom —— 0
// At this point: .fixed-bottom { paddingBottom: `${bottomSafeHeight}px` }

// Custom Navbar Calculation:
// statusBarHeight acts as top placeholder padding-top, plus a 44px fixed navbar content area

// ─── Network Requests (Strongly typed return) ───
async function fetchData() : Promise<void> {
  const res = await uni.request({ url: 'https://api.example.com/data' })
  // res.data is `any`, requires type assertion
  const data = res.data as UTSJSONObject
}

// ─── Call Android Native API (Only in .uts files) ───
// #ifdef APP-ANDROID
import Context from 'android.content.Context'
const context = UTSAndroid.getAppContext()!
// #endif

// ─── Call iOS Native API ───
// #ifdef APP-IOS
// import Foundation from 'Foundation'
// #endif
```

---

## 8. Migration Guide (From uni-app Classic)

### Migration Checklist

```
File Renaming:
  ✅pages/xxx/xxx.vue  → pages/xxx/xxx.uvue
  ✅utils/xxx.ts       → utils/xxx.uts
  ✅main.ts            → main.uts
  ✅App.vue            → App.uvue

Script Reconstruction:
  ✅<script lang="ts"> → <script lang="uts">
  ✅Remove all `any` types → Replace with specific types or UTSJSONObject
  ✅undefined              → null
  ✅Uninitialized vars      → MUST be initialized
  ✅npm packages           → Find uni-app x compatible plugins (ext.dcloud.net.cn)

CSS Reconstruction (Largest Workload):
  ✅CSS Vars var(--xx) → SCSS Vars $xx
  ✅display: block     → Delete (Defaults to flex column)
  ✅display: flex      → KEEP, add flex-direction: row/column
  ✅Inherited styles   → Explicitly declare styles in each child component
  ✅id/tag selectors   → Change to class selectors
  ✅color/font on view → Move to <text> component
  ✅grid layout        → Change to nested flex implementation

Progressive Migration Recommended Order:
  1. Migrate Web and Mini-program versions first (Only change CSS, keep JS)
  2. Modify iOS (After changing CSS, iOS Swift driver is still compatible with JS)
  3. Modify Android last (Must convert all JS to UTS)
```

### Common Pitfalls

```
Pitfall 1: ucss flex defaults to vertical
  Classic mode view defaults to row, x mode defaults to column
  → Explicitly add `flex-direction: row` wherever horizontal layout is needed

Pitfall 2: Text styles don't take effect
  Writing color/font-size on <view> is invalid on App side
  → Must write font-related styles on <text> components

Pitfall 3: v-html is not supported
  uni-app x does not support v-html
  → Use `rich-text` component instead (Be mindful of XSS protection)

Pitfall 4: scroll-view direction
  In ucss, horizontal scroll-view requires setting `scroll-x="true"` and a fixed height

Pitfall 5: Conditional compilation identifiers
  Classic App: // #ifdef APP-PLUS
  uni-app x App: // #ifdef APP
  → Pay attention to the distinction
```
