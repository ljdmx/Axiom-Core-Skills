# Syntax Dictionary (uni-app Classic vs uni-app x)

## CSS Cross-Mode Compatibility Strategy
```scss
// ✅Supported by both modes
.safe-layout {
  display: flex;
  flex-direction: column; 
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
  // color: inherit;
  // font-size: inherit;
  // background-image: url()
  // position: fixed;
  // grid: ...;
}

// Text Styles: In ucss, this only works on <text> components
// ✅Correct (Both modes)
// <text class="text-primary">Content</text>
```

## Conditional Compilation Reference
```js
// #ifdef APP-PLUS
console.log('uni-app Classic App Environment')
// #endif

// #ifdef APP
console.log('uni-app x App Environment')
// #endif

// #ifdef H5
console.log('Web/H5 Environment')
// #endif

// #ifdef HARMONY
console.log('HarmonyOS Next')
// #endif
```

```html
<!-- #ifdef H5 -->
<div class="h5-specific">H5 Exclusive Element</div>
<!-- #endif -->

<!-- #ifdef APP-PLUS || APP -->
<view class="app-specific">App Exclusive Element</view>
<!-- #endif -->
```

| Identifier | Meaning | Applicable Mode |
|--------|------|---------|
| `APP-PLUS` | uni-app Classic App | Classic |
| `APP` | uni-app x App | x |
| `H5` | Web/H5 | Both |
| `MP-WEIXIN` | WeChat Mini-program | Both |
| `HARMONY` | HarmonyOS Next | x |
