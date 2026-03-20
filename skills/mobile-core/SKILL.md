---
name: mobile-core
description: Unified uniapp stack for cross-platform mobile excellence, spanning JS/Vue3 to Pure Native performance.
version: "10.0"
last_updated: "2026-03"
trigger_keywords: ["mobile app", "uniapp", "iOS app", "Android app", "cross-platform", "mobile UI", "uni-app", "uts", "uview", "tm-ui", "mobile performance"]
auto_activate: true
metadata:
  pattern: tool-wrapper, reviewer
  mobile-standard: uniapp-v3-uts
token_budget:
  core_load: 9200
  full_load: 34000
---

# Unified Mobile Excellence Core
> **Visual Manifest**: [Axiom Core Zenith Billboard](../_core_axioms/zenith_billboard.html)

## 0️⃣ Ergonomic Reviewer Pass [Reviewer]


> **Pattern: Reviewer**. AI MUST audit the mobile UI against the "Thumb Zone" ergonomic map.
1. **Interactive Elements**: Must be within the bottom 2/3 of the screen.
2. **Contextual Scaling**: Phased disclosure for small-screen hardware.
3. **Aesthetic Anchor**: Use consistent Phosphor Icons v2.1.

---

## 🏛️—Architecture: The Mobile Sovereign

### Step 1: Deep Requirement Inquiry & DIL Confirmation [New]
Before outputting any solution, you MUST clarify requirements through deep inquiry (target users, pain points, scenarios, business pressure).
**You MUST ask the user for their desired Design Intensity Level (DIL)**, default L3:
- **L1 (Calibration)**: Soul diagnosis + Rejection judgment + Key suggestions.
- **L2 (Experience)**: Critical flow design + 3-Axis diagnosis.
- **L3 (Full-Scale)**: Complete structural solution of the App's soul.
- **L4 (Ecosystem)**: Long-term system design + Failure pre-plans + Soul guarding roadmap.


> Full code for 5-sense synergy (tactile/auditory semantics) and Aura Diffusion background engine can be found in `references/design.md` §4-§5.

### Step 2: The Rejection Gate
If you determine the requirement meets any of the following, **you MUST explicitly reject it and guide the user to elevate it**:
- Introduce unnecessary visual stimulation— Following short-term trends or feature bloat—
- Transfer cognitive load to the user— Complicating things just to "look advanced"—
- Sacrifice honesty, environmental friendliness, or inclusivity—

### Step 3: Environment Shield (Conflict Defense)
- **Target Platform**: App only— Mini-program only— Multi-platform—
- **Conflict Audit**: H5 routing sovereignty audit (forbid parallel import of `vue-router`); Sass compiler generation detection.
- **Web3 Silent Tolerance**: If the user project explicitly involves Web3 features (e.g., wallet connection) while in standalone mode, AI MUST flexibly `view_file(../web3-core/references/frontend-wagmi.md)` to borrow key integration rules rather than hard-failing or waiting for full FSPC orchestration.

### Step 4: Confirm Development Mode
- **uni-app Classic** (.vue) vs **uni-app x** (.uvue).

### Step 5: Output Guardian Boot Card
```
🛡️—[mobile-core v5.3 Activated]
├─ Core Soul: [App's Core Mission]
├─ Mode:    [uni-app Classic | uni-app x]
├─ Global Nexus: [Detect PROJECT_NEXUS.json... Yes/No]
└─ Gate: Rejection Gate Passed
```
*Note: This package operates independently. If `PROJECT_NEXUS.json` is detected (optional), it will automatically inherit the full-stack/backend architectural context.*
> **MUST READ**: `view_file(../_core_axioms/KERNEL_BOOTSTRAP.md)` —Inherit Global Nexus, Architectural Sovereign, and Soul Manifesto rules.

### 🔗 FSPC-Driven Orchestration Entry Point

> **Trigger —Hardened Conditions (ALL three must be true)**:
> 1. `PROJECT_NEXUS.json` exists in project root
> 2. `nexus.fspc_version` field is present (proves FSPC initialized this Nexus)
> 3. `nexus.sub_skill_outputs.adbm.status != 'pending'` (proves FSPC completed §0B Architecture)
>
> If any condition fails → Exit FSPC-Driven Mode, run standard standalone Guardian Boot Steps 1—.

When in **FSPC-Driven Mode**, skip Guardian Boot Steps 1— and execute this compressed entry instead:

```
1. read PROJECT_NEXUS.json
2. Inherit: project_name, soul_scorecard, architecture_decisions from Nexus
3. Inherit: dil_level from PROJECT_NEXUS.json.sub_skill_outputs.ddfm.dil_level (default L3)
4. Confirm mode (Classic vs uni-app x) —STILL required, ask user if not in Nexus
5. Output compressed Boot Card:
   🛡️—[mobile-core v5.3 —FSPC-Driven Mode]
   ├─ Inherited Soul: [PROJECT_NEXUS.json → soul_scorecard.overall]
   ├─ Mode: [uni-app Classic | uni-app x]
   ├─ Scale Tier (inherited): [from FSPC classification]
   └─ Proceeding directly to Generation
```

**On Completion**: AI MUST write mobile deliverables to `PROJECT_NEXUS.json.sub_skill_outputs.mobile_core`:
```json
{
  "active": true,
  "mode": "Classic",
  "platform_targets": ["App", "H5", "WeChat"],
  "pages_config_path": "src/pages.json",
  "status": "complete"
}
```

### 💾 Standalone Teardown Protocol (Mode-A Only)

> Execute ONLY when running in standalone mode (no PROJECT_NEXUS.json or FSPC-Driven conditions not met).

After completing the final page/component delivery, AI MUST generate `MOBILE_SUMMARY.md` in the project root:

```markdown
# Mobile Project Summary
## Platform Targets: [App | H5 | WeChat | ...]
## Mode: [Classic | uni-app x]
## Pages Generated:
- /home —[purpose]
- /profile —[purpose]
## Key Components: [list top 5]
## Pending Optimizations: [tech debt, device-specific bugs]
## Release Checklist:
- [ ] HBuilderX cloud build
- [ ] Platform-specific certification (WeChat developer account, App Store, etc.)
- [ ] Run `node tools/audit-skill.js src/` before submission
```

### 0.1—.4 Soul Derivation & Audit Core (High-Density)

| Core Protocol | Mandatory Requirements (Mandate) | Quantitative Gate / Execution |
|---|---|---|
| **0.1 Soul Derivation** | Write `<design_reasoning>` before outputting code | Includes: True Intent, 3-Axis Tone, Rejection Check. Explain which axis the animation duration/curve reinforces. |
| **0.2 Self-Audit** | Output Token Audit and Consistency Score at code end | MUST check `pages.json`, No hardcoded colors/spacing. Single-screen whitespace ratio ≥ 60%. Navbar back coordinates perfectly aligned. |
| **0.3 Sovereign Component** | Avoid strong coupling with routing & global Store (Fail-Safe) | Components build their own state machines. Maintain micro-interactions under network loss or route freeze without dying. |
| **0.4 Aesthetic Alignment** | Reject: Symmetrical grids, stiff animation, crowded typography | **Require**: Asymmetrical Bento whitespace, Cubic Bezier press physics, extreme weak highlights/transparent noise, editorial negative-spacing titles. |

> **Mandatory Audit**: Before delivering the final package to the user, you MUST run `node tools/audit-skill.js [target_path]` to audit the page flow.


---

## 1️⃣ Mode Selection Decision Tree

```
                    ┌─ Need max native performance—── YES ──→ uni-app x
                    │      (Complex animations/games/high-frequency)
                    │  
Your Requirement ───┤─ Mainly WeChat Mini-program/H5/Multi-platform—── YES ──→ uni-app Classic
                    │      (Rich ecosystem, full npm support)
                    │  
                    └─ Brand new App, pursuing pure native feel—── YES ──→ uni-app x
                          (Compiled to Kotlin for Android, Swift for iOS)
```

### Core Comparison Cheat Sheet

| Dimension | uni-app Classic | uni-app x |
|------|-------------|-----------|
| **Requires HBuilderX** | Required for packaging | Required for Dev + Packaging (≥ .9)|
| **Logic Language** | JS / TypeScript | **UTS** (Strongly typed, TS-like)|
| **Page Files** | `.vue` | `.uvue` |
| **Rendering Method** | JS Engine + WebView/Native Hybrid | **Pure Native Rendering** (uvue engine)|
| **CSS Capabilities** | Full CSS (H5) / Subset (Mini-program/App)| **Only flex layout**, no style inheritance |
| **CSS Variables** | Supports `--var` | **Not Supported** (Use SCSS variables instead)|
| **Style Inheritance** | Supported | **Not Supported**, parent-child isolation |
| **Selectors** | Multiple | **Only class selectors** |
| **Default flex dir** | row (horizontal)| **column (vertical)**|
| **npm Packages** | Supported (JS ecosystem)| Not supported (Requires uts plugins)|
| **Hot Update wgt** | ✅Supported | ❌Not officially supported (Compiled to binary)|
| **Android Performance**| Medium (JS bridge lag)| **Native-Level** (Compiled to Kotlin)|
| **HarmonyOS Next** | Limited support | ✅Compiled to ArkTS |
| **Learning Curve** | Low (Vue devs jump right in)| Medium (Must adapt to strong typing + CSS limits)|
| **Ecosystem Maturity**| ⭐⭐⭐⭐⭐| ⭐⭐⭐(Growing rapidly)|
| **Applicable Scenes** | Small-Medium projects, rapid delivery, Mini-programs | High-perf Apps, complex interactions, native feel |

> **Progressive Migration Plan**: First migrate older Web/iOS/Mini-program versions to uni-app x (only modifying CSS),
> later change JS to UTS to be compatible with Android.

---

## 2️⃣ Common Engineering Standards

### File Naming Conventions

| Specification | uni-app Classic | uni-app x |
|------|-------------|-----------|
| Page Component | `pages/xxx/xxx.vue` | `pages/xxx/xxx.uvue` |
| Common Component | `components/xxx.vue` | `components/xxx.uvue` |
| Logic Script | `utils/xxx.ts` / `.js` | `utils/xxx.uts` |
| Style Tokens | `styles/tokens.scss` | `styles/tokens.scss` (at compile time) |

### Modern Sass Standards [New]

**【Hard Constraint】**: The project must adapt to the future Dart Sass 3.0 standard.
- **Forbid `@import`**: All style files MUST switch to using `@use '@/styles/tokens.scss' as *;`.
- **Modern Compiler**: If it's a Vite project, you MUST explicitly enable `modern-compiler` in `vite.config.ts`.
- **Modular Sovereignty**: Visibly control variable scope through namespaces or `as *`; style pollution is forbidden.

### Generic `pages.json` Configuration Template

```json
{
  "pages": [
    {
      "path": "pages/index/index",
      "style": {
        "navigationBarTitleText": "Home",
        "navigationBarBackgroundColor": "#0A0A0A",
        "navigationBarTextStyle": "white",
        "enablePullDownRefresh": true
      }
    }
  ],
  "globalStyle": {
    "navigationBarTextStyle": "white",
    "navigationBarBackgroundColor": "#0A0A0A",
    "backgroundColor": "#F8F8F4",
    "rpxCalcMaxDeviceWidth": 960,
    "rpxCalcBaseDeviceWidth": 375
  },
  "tabBar": {
    "color": "rgba(0,0,0,0.38)",
    "selectedColor": "#1A1A1A",
    "backgroundColor": "#FAFAF8",
    "borderStyle": "white",
    "list": [
      {
        "pagePath": "pages/index/index",
        "text": "Home",
        "iconPath": "static/icons/tab-home.png",
        "selectedIconPath": "static/icons/tab-home-active.png"
      }
    ]
  }
}
```

### Generic `manifest.json` Key Configuration

```json
{
  "name": "App Name",
  "appid": "__UNI__XXXXXXX",
  "versionName": "1.0.0",
  "versionCode": 100,
  "darkmode": true,
  "themeLocation": "theme.json",
  "mp-weixin": {
    "appid": "wx...",
    "setting": { "urlCheck": false },
    "darkmode": true
  },
  "app-plus": {
    "distribute": {
      "android": { "packagename": "com.example.app" },
      "ios": { "bundleId": "com.example.app" }
    }
  }
}
```

### Dark Mode `theme.json` (Generic)

```json
{
  "page": {
    "navigationBarBackgroundColor": { "@light": "#FFFFFF", "@dark": "#0C0C0C" },
    "navigationBarTextStyle":       { "@light": "black",   "@dark": "white" },
    "backgroundColor":              { "@light": "#F5F5F0", "@dark": "#0C0C0C" },
    "backgroundTextStyle":          { "@light": "light",   "@dark": "dark" }
  }
}
```

---

## 3️⃣ Run & Debug Quick Reference

### HBuilderX Method (Generic)

| Target | Operation Path |
|------|---------|
| H5 | Run → Run to browser |
| WeChat Mini-Program | Run → Run to mini-program simulator → WeChat DevTools |
| Android Device | Enable USB Debugging → Run → Run on device |
| iOS Device | Mac + Xcode → Run → Run on device |
| Custom Base | **uni-app x Recommended**: Run on device after making custom base |

### CLI Method (uni-app Classic ONLY)

```bash
npm run dev:h5           # H5 local server
npm run dev:mp-weixin    # WeChat Mini-Program → import dist/dev/mp-weixin in WeChat DevTools
npm run dev:mp-alipay    # Alipay Mini-Program
npm run dev:app-plus     # App (with HBuilderX base)

npm run build:h5
npm run build:mp-weixin
npm run build:mp-alipay
npm run build:app-plus
```

> **uni-app x has no CLI**, you must use HBuilderX 3.9+

---

## 4️⃣ Packaging & Publishing Quick Reference

> Full process in `references/publishing.md`

| Target | uni-app Classic | uni-app x |
|------|------------|-----------|
| H5 | `build:h5` → Upload to server | Same as left |
| WeChat Mini-Program | `build:mp-weixin` → Upload via WeChat DevTools | Same as left |
| Android | Cloud Package (needs .keystore)| Cloud Package (HBuilderX 3.9+)|
| iOS | Cloud Package (needs .p12 + .mobileprovision)| Same as left |
| HarmonyOS | Limited Support | ✅Cloud Package Support |
| Hot Update | ✅wgt package | ❌Not supported |

---

## 5️⃣ Design System Framework

> **Full Design System in `references/design.md`**  
> The following are the highest priority core rules; all code must obey them.

### Ten Laws of Design (Hard Rules)

| # | Law | Rewrite if Violated |
|---|---|---------|
| 1 | **Brand Color ≥ 5%**, only for Logo / Main CTA | ✅|
| 2 | **Only 1** solid primary button per screen | ✅|
| 3 | Secondary text uses **opacity** (`rgba`), NOT hardcoded gray | ✅|
| 4 | Forbid **symmetrical grids** (3x3 / 4x4 equal width) | ✅|
| 5 | Loading state MUST be **Skeleton**, forbid bare spinners | ✅|
| 6 | Empty state MUST be **Illustration + CTA**, forbid "No Data" text | ✅|
| 7 | All colors/spacing referenced via **Token Variables** | ✅|
| 8 | Dark mode requires **Dual Token Set**, not simple inversion | ✅|
| 9 | Animation respects `prefers-reduced-motion` | ✅|
| 10 | State relies on **String Enum**, forbid multi-boolean checks | ✅|

### 5.1 Ergonomic & Physical Sovereignty (Native Parity)

| Rule | Execution Detail |
|---|---|
| **Ergonomic Thumb Zone** | Primary CTAs and high-frequency navigation MUST reside in the bottom 40% of the screen. Top-left back buttons are FORBIDDEN for primary flows unless a global swipe-to-go-back gesture is deeply integrated and infallible. |
| **Physical Gravity & Elasticity** | Animations and scroll bounds MUST map to physical world mass and spring dynamics. Define precise cubic-bezier curves for rubber-band overscroll effects. Linear or stiff easing is a hard violation of mobile native feel. **Integration**: Recommend `Auto Animate` (FormKit) for frictionless list transitions. |
| **Spatial Computing Readiness (V10 Rule)** | Ensure Z-axis layering (`z-index`) and glassmorphism elements are architected cleanly so that they can be lifted directly into WebXR / Apple Vision Pro spatial environments without refactoring. Design UI panels as hovering frosted glass panes anchored to physical space. |
| **Haptic Companionship** | For all critical physical interactions (e.g., submitting a payment, deleting an item, toggling a switch, or pull-to-refresh), AI MUST automatically wire up `uni.vibrateShort()` to provide subtle tactile feedback. This completes the illusion of life and physical reality. **Lottie Mandate**: Use `Lottie Files` for all high-fidelity Success, Error, and Empty states to mirror premium native App standards. |
| **Unified Iconography** | NEVER mix icon families. You MUST strictly use exactly ONE premium vector icon library (**Phosphor Icons v2.1**) across the entire project. All icons MUST have identical thickness and style. Reject native emojis or mis-matched SVGs. |

### CSS Cross-Mode Compatibility Strategy

```scss
// ★ Safe Subset between uni-app x (ucss) & uni-app Classic
// Adhere to this subset to migrate code between modes with minimal cost

// ✅Supported by both modes
.safe-layout {
  display: flex;
  flex-direction: column;   // x defaults to col, classic defaults to row, explicit is safer
  align-items: center;
  justify-content: center;
  padding: 20rpx;
  margin: 10rpx;
  width: 100%;
  height: auto;
  background-color: #FFFFFF;
  border-radius: 16rpx;
  overflow: hidden;
}

// ⚠️ Supported by uni-app Classic ONLY (ucss unsupported)
.classic-only {
  // color: inherit;         // ucss unsupported
  // font-size: inherit;     // ucss has no style inheritance
  // background-image: url() // ucss bg-img support is very limited
  // position: fixed;        // ucss support is limited
  // grid: ...;              // ucss does not support grid
}

// Text Styles: In ucss, this only works on <text> components
// ✅Correct (Both modes)
// <text class="text-primary">Content</text>

// ❌ucss Error (Writing text styles on view is invalid)
// <view class="text-primary"> Invalid on uni-app x App side </view>
```

---

## 6️⃣ Conditional Compilation (Dual-Mode Compatibility Core)

```js
// ─── Platform Conditional Compilation ───
// #ifdef APP-PLUS
console.log('uni-app Classic App Environment')
// #endif

// #ifdef APP
console.log('uni-app x App Environment')
// #endif

// #ifdef H5
console.log('Web/H5 Environment')
// #endif

// #ifdef MP-WEIXIN
console.log('WeChat Mini-program')
// #endif

// #ifndef MP
console.log('Not a mini-program platform')
// #endif
```

```html
<!-- Template Conditional Compilation -->
<!-- #ifdef H5 -->
<div class="h5-specific">H5 Exclusive Element</div>
<!-- #endif -->

<!-- #ifdef APP-PLUS || APP -->
<view class="app-specific">App Exclusive Element</view>
<!-- #endif -->
```

```scss
/* uni-app x: Avoid CSS variables in ucss, use SCSS compile-time variables instead */
/* #ifdef APP */
/* ucss framework —use SCSS variables */
$color-brand: #1A1A1A;
$space-4: 32rpx;
/* #endif */

/* #ifdef H5 */
/* Web framework —CSS custom properties are allowed */
:root { --color-brand: #1A1A1A; }
/* #endif */
```

**Full Platform Identifier Lookup:**

| Identifier | Meaning | Applicable Mode |
|--------|------|---------|
| `APP-PLUS` | uni-app Classic App | Classic |
| `APP` | uni-app x App | x |
| `H5` | Web/H5 | Both |
| `MP-WEIXIN` | WeChat Mini-program | Both |
| `MP-ALIPAY` | Alipay Mini-program | Both |
| `MP-BAIDU` | Baidu Mini-program | Both |
| `MP-TOUTIAO` | Douyin Mini-program | Both |
| `MP-QQ` | QQ Mini-program | Both |
| `MP` | All Mini-programs | Both |
| `HARMONY` | HarmonyOS Next | x |

---

## Extended Reference Index

> **⚙️ Lazy Loading Rule**: Confirm that user requirements match the Trigger keywords before loading the corresponding file. Unconditional bulk loading is FAILING.

| Needs Attention | Target File | Trigger (Match one to load) |
|---------|---------|------------------------|
| uni-app Classic · Vue3 · State Management · uniCloud | `references/classic.md` | uni-app classic, Vue3, mini-program, H5, Pinia, uniCloud |
| uni-app x · UTS · uvue Native Rendering | `references/uni-app-x.md` | uni-app x, UTS, uvue, native, Kotlin, ArkTS |
| Design Token · Colors · Typography · Animations · Skeleton | `references/design.md` | design system, Token, animation, color, dark mode, skeleton, typography |
| Materials/Lighting · Widescreen/Responsive · Web A11y | `references/design-advanced.md` | material, lighting, tablet, foldable, performance budget, accessibility, A11y |
| Advanced Components · Headless · Physical Feedback | `references/components.md` | components, navbar, FAB, popup, form, input |
| Multi-platform Publishing · CI/CD · Certificate Mgmt | `references/publishing.md` | publishing, cloud package, certificates, AppStore, Google Play, CI/CD |

---

> **Official Documentation**  
> uni-app: https://uniapp.dcloud.net.cn  
> uni-app x: https://doc.dcloud.net.cn/uni-app-x/  
> UTS Language: https://doc.dcloud.net.cn/uni-app-x/uts/  
> uvue CSS: https://doc.dcloud.net.cn/uni-app-x/css/  
> uni-ui: https://uniapp.dcloud.net.cn/component/uniui/uni-ui.html  
> uniCloud: https://uniapp.dcloud.net.cn/uniCloud/  
> Plugin Market: https://ext.dcloud.net.cn/

---

## CHANGELOG

| Version | Date | Key Changes |
|------|------|---------|
| **v5.4** | 2026-03 | Added Unified Iconography constraint and Haptic Companionship (`uni.vibrateShort()`) mandate for true native parity. |
| **v5.3** | 2026-03 | Renamed references/ to references/, added global nexus protocol |
| **v5.2** | 2026-03 | Core Suite translation, High-Density Table Compression, Audit Script addition |
| **v5.1** | 2025-xx | Soul Pulse Standards; SEO / Open Graph; uniCloud Architecture Protocol |
| **v5.0** | 2025-xx | 5-Sense Synergy Protocol; DIL Level System; Quantitative Audit Gates |
| **v4.0** | 2025-xx | Design Guardian Boot Protocol; Soul Framework; Zero-AI-Aesthetic Protocol |
