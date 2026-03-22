# Mobile Configuration Templates

This document contains standard configuration files for uni-app mobile projects.

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
