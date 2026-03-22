# Low-End Android Degradation Protocol

- **Mandate**: World-class apps degrade gracefully on $100 devices.
- **Rules**:
  1. **CSS Filter Disable**: On devices detecting low memory or low tier (via `uni.getSystemInfoSync`), instantly disable all `backdrop-filter: blur`, replacing them with a flat 90% opacity solid color representation.
  2. **WebView Fallback**: `uni-app x` native rendering failing complex canvas operations MUST gracefully fall back to a `webview` wrapping the H5 variant without crashing.
