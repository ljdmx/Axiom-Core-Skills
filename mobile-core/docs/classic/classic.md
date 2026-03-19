# uni-app Classic Mode Complete Guide
## JS / TypeScript + Vue3 + Vite
<!-- TRIGGER: uni-app classic, Vue3, mini-program, H5, Pinia, uniCloud, request -->

---

## Table of Contents

1. [Create Project](#1-create-project)
2. [Project Directory Structure](#2-project-directory-structure)
3. [Page Development Template](#3-page-development-template)
4. [State Management (Pinia)](#4-state-management-pinia)
5. [Network Request Encapsulation](#5-network-request-encapsulation)
6. [Common API Cheat Sheet](#6-common-api-cheat-sheet)
7. [Styling Standards](#7-styling-standards)
8. [Performance Optimization](#8-performance-optimization)

---

## 1. Create Project

### Method A: CLI + Vue3 + Vite (Recommended for Engineering)

```bash
# TypeScript Version (Highly Recommended)
npx degit dcloudio/uni-preset-vue#vite-ts my-project
cd my-project && npm install

# JavaScript Version
npx degit dcloudio/uni-preset-vue#vite my-project

# If network fails, download from Gitee
# https://gitee.com/dcloud/uni-preset-vue
```

### Method B: HBuilderX Visual

1. **File → New → Project → uni-app**
2. Recommended Template: `uni-ui Project Template` (Built-in common components)
3. Vue Version Selection: Vue3

### Upgrade Compiler

```bash
npx @dcloudio/uvm@latest alpha     # Update to latest alpha version
npx @dcloudio/uvm@latest           # Update to latest stable version
```

---

## 2. Project Directory Structure

```
my-project/
├── src/
│   ├── pages/
│   │   └── index/
│   │       └── index.vue          # Independent directory for each page
│   ├── components/                # Public components (Supports easycom auto-import)
│   ├── static/                    # Static resources not processed by Vite (Icons <40KB)
│   ├── styles/
│   │   ├── tokens.scss            # ★ Design Tokens
│   │   ├── typography.scss        # Typography system
│   │   └── animation.scss         # Animation variables
│   ├── store/
│   │   └── index.ts               # Pinia store
│   ├── utils/
│   │   ├── request.ts             # Global request encapsulation
│   │   └── platform.ts            # Platform utility functions
│   ├── types/                     # TypeScript type definitions
│   ├── uni_modules/               # Plugin market plugins
│   ├── App.vue                    # Global lifecycle + Global styles import
│   ├── main.ts
│   ├── manifest.json
│   ├── pages.json
│   └── uni.scss                   # @use './styles/tokens.scss' as *;
├── vite.config.ts
└── tsconfig.json
```

---

## 3. Page Development Template

```vue
<template>
  <view class="page">

    <!-- ① Skeleton Screen (No bare loading spinners) -->
    <template v-if="pageState === 'loading'">
      <view class="skeleton">
        <view class="skeleton-item skeleton-header" />
        <view class="skeleton-item skeleton-body" />
        <view class="skeleton-item skeleton-body skeleton-body--short" />
      </view>
    </template>

    <!-- ② Empty State (Must have illustration + CTA) -->
    <template v-else-if="pageState === 'empty'">
      <view class="empty-state">
        <image class="empty-img" src="/static/empty.svg" mode="aspectFit" />
        <text class="empty-title">No content yet</text>
        <text class="empty-desc">Click the button below to start creating</text>
        <button class="btn-primary" @click="handleCreate">+ Create your first</button>
      </view>
    </template>

    <!-- ③ Error State (Provide retry path) -->
    <template v-else-if="pageState === 'error'">
      <view class="error-state">
        <image src="/static/error.svg" mode="aspectFit" />
        <text class="error-msg">{{ errorMsg }}</text>
        <button class="btn-ghost" @click="fetchData(true)">Reload</button>
      </view>
    </template>

    <!-- ④ Normal Content -->
    <template v-else>
      <view class="content animate-in stagger-hero">
        <text class="page-title">{{ title }}</text>
        <view class="card-list animate-in stagger-cards">
          <view
            v-for="item in list"
            :key="item.id"
            class="card"
            @click="() => handleItemClick(item)"
          >
            <text class="card-title">{{ item.name }}</text>
            <text class="card-desc">{{ item.desc }}</text>
          </view>
        </view>
      </view>
    </template>

  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad, onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app'
import { request } from '@/utils/request'

// ★ Explicit string enums for states, forbid multiple boolean combinations
type PageState = 'idle' | 'loading' | 'success' | 'empty' | 'error'

interface ListItem { id: number; name: string; desc: string }

const pageState = ref<PageState>('idle')
const errorMsg   = ref('')
const title      = ref('Page Title')
const list       = ref<ListItem[]>([])
let   page       = 1

async function fetchData(refresh = false) {
  if (refresh) page = 1
  pageState.value = 'loading'
  try {
    const res = await request<{ list: ListItem[] }>({
      url: '/api/items',
      data: { page }
    })
    if (refresh) list.value = res.list
    else list.value.push(...res.list)
    pageState.value = list.value.length ? 'success' : 'empty'
  } catch (e: any) {
    pageState.value = 'error'
    errorMsg.value = e.message || 'Loading failed, please check your network'
  }
}

function handleItemClick(item: ListItem) {
  uni.navigateTo({ url: `/pages/detail/detail?id=${item.id}` })
}

function handleCreate() {
  uni.navigateTo({ url: '/pages/create/create' })
}

onLoad(() => fetchData(true))

onPullDownRefresh(async () => {
  await fetchData(true)
  uni.stopPullDownRefresh()
})

onReachBottom(() => {
  page++
  fetchData()
})
</script>

<style lang="scss" scoped>
@use '@/styles/tokens.scss' as *;
@use '@/styles/animation.scss' as *;

.page {
  flex: 1;
  background-color: $color-bg-base;
  min-height: 100vh;
}

// Skeleton implementation: see design.md §8 Skeleton Screen Protocol
// (Core CSS is centralized in the design system, only reference notes are kept here)

// Empty State
.empty-state {
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  padding: $space-12 $space-6;
  gap: $space-3;
}
.empty-img   { width: 240rpx; height: 240rpx; opacity: 0.7; }
.empty-title { font-size: $text-xl; font-weight: $font-semibold; color: $color-text-primary; }
.empty-desc  { font-size: $text-sm; color: $color-text-tertiary; text-align: center; }

// Error State
.error-state {
  display: flex; flex-direction: column;
  align-items: center; padding: $space-12 $space-6; gap: $space-3;
}
.error-msg { font-size: $text-base; color: $color-error; text-align: center; }

// Content Area
.content { padding: $space-4; }
.page-title {
  font-size: $text-xl; font-weight: $font-bold;
  letter-spacing: -0.02em; color: $color-text-primary;
  display: block; margin-bottom: $space-4;
}

// Cards
.card {
  background: $color-bg-surface;
  border-radius: $radius-lg;
  padding: $space-4;
  margin-bottom: $space-3;
  box-shadow: $shadow-sm;
  transition: transform $duration-instant $ease-spring,
              box-shadow $duration-fast $ease-breath;
  &:active { transform: scale(0.98); box-shadow: none; }
}
.card-title { font-size: $text-lg; font-weight: $font-medium; color: $color-text-primary; }
.card-desc  { font-size: $text-sm; color: $color-text-secondary; margin-top: $space-1; }

@keyframes shimmer {
  0%   { background-position: -750rpx 0; }
  100% { background-position: 750rpx 0; }
}
</style>
```

---

## 4. State Management (Pinia)

```typescript
// store/user.ts
import { defineStore } from 'pinia'

interface UserState {
  token: string
  userInfo: { id: number; name: string; avatar: string } | null
  status: 'idle' | 'loading' | 'success' | 'error'
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    token: uni.getStorageSync('token') || '',
    userInfo: null,
    status: 'idle'
  }),

  getters: {
    isLoggedIn: (state) => !!state.token
  },

  actions: {
    async login(phone: string, code: string) {
      this.status = 'loading'
      try {
        const res = await request<{ token: string; userInfo: any }>({
          url: '/api/login',
          method: 'POST',
          data: { phone, code }
        })
        this.token = res.token
        this.userInfo = res.userInfo
        uni.setStorageSync('token', res.token)
        this.status = 'success'
      } catch {
        this.status = 'error'
        throw new Error('Login failed')
      }
    },

    logout() {
      this.token = ''
      this.userInfo = null
      uni.removeStorageSync('token')
      uni.reLaunch({ url: '/pages/login/login' })
    }
  }
})
```

---

## 5. Network Request Encapsulation

```typescript
// utils/request.ts
const BASE_URL = import.meta.env.VITE_API_BASE || 'https://api.example.com'

interface RequestOptions {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  data?:   Record<string, unknown>
  header?: Record<string, string>
  showLoading?: boolean
}

export function request<T = unknown>(options: RequestOptions): Promise<T> {
  const {
    url, method = 'GET', data, header = {},
    showLoading = false
  } = options

  const token = uni.getStorageSync('token')
  if (token) header['Authorization'] = `Bearer ${token}`

  if (showLoading) uni.showLoading({ title: 'Loading...', mask: true })

  return new Promise((resolve, reject) => {
    uni.request({
      url: BASE_URL + url,
      method,
      data,
      header: { 'Content-Type': 'application/json', ...header },
      timeout: 10000,
      success(res) {
        if (showLoading) uni.hideLoading()
        if (res.statusCode === 401) {
          uni.removeStorageSync('token')
          uni.reLaunch({ url: '/pages/login/login' })
          return reject(new Error('Session expired'))
        }
        if (res.statusCode >= 400) {
          const msg = (res.data as any)?.message || `Request failed ${res.statusCode}`
          uni.showToast({ title: msg, icon: 'error' })
          return reject(new Error(msg))
        }
        resolve(res.data as T)
      },
      fail(err) {
        if (showLoading) uni.hideLoading()
        const msg = navigator.onLine ? 'Server error' : 'Network connection failed'
        uni.showToast({ title: msg, icon: 'error' })
        reject(new Error(msg))
      }
    })
  })
}
```

---

## 6. Common API Cheat Sheet

```typescript
// ─── Routing ───
uni.navigateTo({ url: '/pages/detail/detail?id=1' })      // Push
uni.redirectTo({ url: '/pages/index/index' })              // Replace current page
uni.reLaunch({ url: '/pages/index/index' })                // Close all pages
uni.switchTab({ url: '/pages/index/index' })               // Switch TabBar
uni.navigateBack({ delta: 1 })                             // Back

// Routing parameters (Complex objects)
const data = JSON.stringify({ id: 1, name: 'Test' })
uni.navigateTo({ url: `/pages/detail/detail?data=${encodeURIComponent(data)}` })
// Receive: onLoad((opts) => { const d = JSON.parse(decodeURIComponent(opts.data)) })

// ─── Storage ───
uni.setStorageSync('key', value)
const val = uni.getStorageSync('key')
uni.removeStorageSync('key')
uni.clearStorageSync()

// ─── Interaction ───
uni.showToast({ title: 'Success', icon: 'success', duration: 2000 })
uni.showLoading({ title: 'Submitting...', mask: true })
uni.hideLoading()
uni.showModal({
  title: 'Confirm Deletion',
  content: 'Cannot be recovered after deletion. Continue?',
  confirmColor: '#C0392B',
  success(res) { if (res.confirm) { /* Execute deletion */ } }
})

// ─── Media ───
uni.chooseImage({
  count: 9,
  sizeType: ['compressed'],
  sourceType: ['album', 'camera'],
  success: (res) => { console.log(res.tempFilePaths) }
})
uni.previewImage({ current: url, urls: [url1, url2] })

// ─── System Info & Safe Area ───
const sysInfo = uni.getSystemInfoSync()
const statusBarHeight = sysInfo.statusBarHeight || 0  // Status bar height

// CSS Safe area adaptation (Recommended for H5 / Mini-programs):
// padding-bottom: constant(safe-area-inset-bottom);
// padding-bottom: env(safe-area-inset-bottom);

// JS Custom navbar calculation formula (Mini-program side):
// #ifdef MP-WEIXIN
const menuButton = uni.getMenuButtonBoundingClientRect()
const customNavHeight = (menuButton.top - statusBarHeight) * 2 + menuButton.height
// Final total placeholder height = statusBarHeight + customNavHeight
// #endif

// ─── Clipboard ───
uni.setClipboardData({ data: 'Content to copy', success: () => uni.showToast({ title: 'Copied' }) })

// ─── Sharing ───
// Configure in the page's onShareAppMessage lifecycle:
// onShareAppMessage(() => ({ title: 'Share Title', path: '/pages/index/index', imageUrl: '' }))
```

---

## 7. Styling Standards

See `references/design.md` for details. Below are quick rules:

```scss
// Size unit: rpx (Responsive, 750rpx = Screen width)
// Design draft 750px standard: 1px = 1rpx

// Background Images: Mini-programs do not support local background images
// Less than 40KB -> Automatically convert to base64
// Greater than 40KB -> Put on CDN, use network address

// Font icon reference (Need to convert font file to base64 or host on server)
@font-face {
  font-family: 'iconfont';
  src: url('//at.alicdn.com/t/font_xxx.woff2') format('woff2');
}

// H5 Proxy Configuration (Development environment CORS)
// vite.config.ts server.proxy: { '/api': { target: 'https://backend.com', changeOrigin: true } }
```

---

## 8. Performance Optimization

### Long List Virtualization (>200 items MUST use)

```vue
<!-- Use recycle-list (uni-app built-in) or @tanstack/virtual -->
<recycle-list :list-data="bigList" :item-size="120">
  <cell-slot>
    <view class="list-item">
      <text>{{ item.name }}</text>
    </view>
  </cell-slot>
</recycle-list>
```

### Image Lazy Loading

```html
<image
  :src="item.imageUrl"
  mode="aspectFill"
  lazy-load
  :style="{ width: '100%', height: '400rpx' }"
/>
```

### Sub-package Loading (Required for WeChat Mini-program 2MB limit)

```json
// pages.json
{
  "subPackages": [
    {
      "root": "pages/sub-feature/",
      "pages": [
        { "path": "page-a/page-a" },
        { "path": "page-b/page-b" }
      ]
    }
  ],
  "preloadRule": {
    "pages/index/index": {
      "network": "all",
      "packages": ["pages/sub-feature/"]
    }
  }
}
```

---

## 9. Web / H5 Exclusive: SEO & Open Graph

When compiling to H5, Vue defaults to an SPA, which is not search-friendly. If marketing distribution is needed, the following configurations MUST be made:

### 9.1 Dynamic Meta & SSR Strategy

- **SSR (Server-Side Rendering)**: uni-app's SSR mode can be enabled in `vite.config.ts` and `manifest.json`, allowing search engine crawlers to fetch direct HTML.
- **Page-level Dynamic Meta Injection**:
```vue
<script setup>
import { onMounted } from 'vue'
onMounted(() => {
  // #ifdef H5
  document.title = 'Dynamic Product Title - My App'
  const meta = document.createElement('meta')
  meta.name = 'description'
  meta.content = 'This is the detailed description of the product, good for SEO crawling'
  document.head.appendChild(meta)
  // #endif
})
</script>
```

### 9.2 Open Graph Protocol (Social Sharing Cards)

To display beautiful rich-media preview cards when links are shared in Telegram, Twitter, or Discord, `og:` tags MUST be embedded in the `index.html` template in the project root:
```html
<meta property="og:title" content="App Name" />
<meta property="og:description" content="Connecting you and me with ultimate experience" />
<meta property="og:image" content="https://cdn.example.com/cover.png" />
<meta property="og:url" content="https://app.example.com" />
<meta name="twitter:card" content="summary_large_image" />
```

---

## 10. uniCloud Cloud-Native & Backend Architecture

For full-stack businesses, `uniCloud` provides extremely fast Serverless infrastructure. Please follow these advanced architecture guidelines (prefer Aliyun Space):

### 10.1 clientDB Read-Write Separation Rule

- **Queries (Read)**: It is recommended to directly use `<unicloud-db>` or `const db = uniCloud.database()` on the frontend for querying. Strictly match schema-based access control (Action/Permission) to achieve ultimate direct-connection rendering speed.
- **Writes (Write/Update)**: Complex business mutations (e.g., involving transactions, inventory deductions, cross-table state transitions) **MUST** be executed via Cloud Objects. It is strictly forbidden to bypass business logic validation by using `db.collection().add()` directly on the frontend.

### 10.2 Cloud Object Standards

The traditional single cloud function mixed-stew is no longer recommended. You MUST use object-oriented `Cloud Object`.
```javascript
// uniCloud/cloudobjects/order/index.obj.js
module.exports = {
  _before: function () { 
    // Intercept with authorization before all methods 
    const clientInfo = this.getClientInfo()
    if (!clientInfo.uid) throw new Error('Unauthorized request')
  },
  async create(data) {
    // Database transaction processing...
    return { errCode: 0, msg: 'success' }
  }
}
```
**Frontend Call**:
```javascript
const orderObj = uniCloud.importObject('order', { customUI: true }) // customUI prevents auto-toast
await orderObj.create({ itemId: 1 })
```

### 10.3 Unified Identity Core: uni-id

Never hand-write password Hashes or Token issuance yourself.
It is mandatory to provide a basic runtime environment based on `uni-id-pages` and `uni-id-common`. It natively built-in: WeChat mini-program one-click login, Apple login, SMS verification codes, RBAC (Role-Based Access Control) permission systems, and a complete Token refresh lifecycle.