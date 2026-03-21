# uni-app Cross-Platform Publishing Detailed Flow
<!-- TRIGGER: publishing, cloud package, certificates, AppStore, Google Play, HarmonyOS, CI/CD, automated deployment -->

## WeChat Mini-Program

### Prerequisites
1. Register a WeChat Mini-Program account: https://mp.weixin.qq.com
2. Obtain AppID (Login Dashboard → Development → Development Management → Development Settings)
3. Download and install WeChat DevTools

### Publishing Steps
1. In HBuilderX menu: **Issue → Mini-Program - WeChat**, enter AppID, click Issue.
2. Build artifacts are generated in `unpackage/dist/build/mp-weixin`.
3. Open WeChat DevTools → Import this directory.
4. Click the **Upload** button (fill in the version number and release notes).
5. Login to Mini-Program Dashboard → Version Management → Submit for Review → Publish after approval.

### Sub-packaging (Required if > 2MB)

```json
// pages.json
{
  "subPackages": [
    {
      "root": "pages/sub/",
      "pages": [
        { "path": "detail/detail" }
      ]
    }
  ]
}
```

---

## Alipay Mini-Program

1. Register Alipay Mini-Program: https://open.alipay.com
2. HBuilderX: **Issue → Mini-Program - Alipay**
3. Import `unpackage/dist/build/mp-alipay` using **Alipay DevTools**.
4. Upload to dashboard for review and publish.

---

## Baidu Mini-Program

1. Register Baidu Mini-Program: https://smartprogram.baidu.com
2. HBuilderX: **Issue → Mini-Program - Baidu**
3. Import `unpackage/dist/build/mp-baidu` using **Baidu DevTools**.
4. Submit for review in the Baidu Smart Program Management Center.

---

## Douyin Mini-Program

1. Register Douyin Mini-Program: https://developer.open-douyin.com
2. HBuilderX: **Issue → Mini-Program - Douyin**
3. Import and publish using **Douyin DevTools**.

---

## H5 Web

### Nginx Deployment Example

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/h5;
    index index.html;

    # Enable gzip
    gzip on;
    gzip_types text/plain application/javascript text/css;

    # SPA history mode routing support
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### manifest.json H5 Configuration

```json
{
  "h5": {
    "router": { "mode": "history" },
    "publicPath": "/",
    "title": "App Title"
  }
}
```

---

## App (Android / iOS)

### Android Signature Certificate Generation

```bash
keytool -genkey -alias <Alias> \
        -keyalg RSA -keysize 2048 \
        -validity 36500 \
        -keystore <CertificateName>.keystore
```

Fill in: Organization info, Password (memorize it; cannot be recovered if lost).

### Cloud Packaging Flow (HBuilderX)

1. Menu: **Issue → Native App - Cloud Packaging**
2. Android Options:
   - Upload `.keystore` file
   - Fill in certificate alias, password
   - Select CPU type (Recommended: arm64-v8a + armeabi-v7a)
3. iOS Options:
   - Upload `.p12` certificate
   - Upload `.mobileprovision` profile
4. Click package, wait (Usually 5-15 minutes)
5. Download `.apk` / `.ipa`

### Android Publishing Channels

- **Tencent MyApp**: https://open.tencent.com
- **Huawei AppGallery**: https://developer.huawei.com/consumer/cn
- **Xiaomi GetApps**: https://dev.mi.com
- **OPPO / vivo** Open Platforms
- **Self-hosted Download Page**: Host the apk on a server for direct download.

### iOS Publishing to App Store

1. Register Apple Developer Account ($99/year)
2. Create App record in Xcode / App Store Connect
3. For Cloud Packaging, select **Distribution Certificate** (NOT Development certificate)
4. Upload ipa using Transporter or Xcode
5. Submit for review in App Store Connect (Usually 1-3 business days)

### iOS Enterprise Distribution (Internal Testing)

Use Enterprise Developer Account ($299/year) to sign and generate a distribution link:
- Open link in Safari on an authorized Apple device to install directly.

### wgt Hot Update (App Update without Review)

```js
// Detect and install wgt update
uni.request({
  url: 'https://api.example.com/check-update',
  success(res) {
    if (res.data.hasUpdate) {
      plus.runtime.install(res.data.wgtUrl, {}, () => {
        plus.runtime.restart()
      }, (e) => {
        console.error('wgt installation failed', e)
      })
    }
  }
})
```

> ⚠️ wgt hot updates do NOT apply to native plugin changes. In such cases, cloud packaging is strictly required.

---

## HarmonyOS Next Publishing

> Only uni-app x supports compiling to pure-blood HarmonyOS ArkTS.

1. **Prerequisites**
   - Register Huawei Developer Alliance and complete real-name authentication.
   - Create HarmonyOS App in AppGallery Connect.
   - Download and install DevEco Studio.
2. **Generate Signature**
   - Generate `.p12` keystore and `.csr` certificate request in DevEco Studio.
   - Upload `.csr` to AGC dashboard and download `.cer` debug certificate and `.p7b` profile.
3. **HBuilderX Issue**
   - Menu: Issue -> HarmonyOS
   - Enter AppID, select local p12, cer, and p7b signature files.
   - Compile to generate HarmonyOS project directory.
4. **Submit for Review**
   - Open generated HarmonyOS project in DevEco Studio, execute Build App(app).
   - Upload generated `.app` file to AppGallery Connect to submit for review.

---

## Google Play International Publishing

1. **AAB Format Packaging**
   - Google Play strictly requires uploading in `.aab` (Android App Bundle) format. `.apk` is forbidden.
   - Check **Google Play (AAB)** during HBuilderX cloud packaging.
2. **Privacy & Compatibility Compliance**
   - Must provide a detailed Privacy Policy URL.
   - `manifest.json` must include the Target API Level required by Google Play (e.g., `targetSdkVersion: 34`).
   - If sensitive native plugins are included (e.g., location, album), a permissions usage declaration must be filled out in the Google Play Console.
3. **Multi-language & Listing**
   - Prepare international store graphics and English/localized copy.
   - Create app in Google Play Console, upload aab file, release to Internal Testing track first, then promote to Production.

---

## CI/CD Automated Build Pipeline

Implement automated cloud packaging builds via HBuilderX CLI combined with GitHub Actions / GitLab CI:

```yaml
# .github/workflows/build-app.yml Example
name: Build uni-app App
on:
  push:
    tags: [ 'v*' ]

jobs:
  build:
    runs-on: windows-latest # HBuilderX requires Windows/Mac
    steps:
      - uses: actions/checkout@v3
      - name: Setup HBuilderX CLI
        run: | 
          # Assuming cli.exe is executed via pre-installed environment or self-hosted runner
          cli.exe open
          cli.exe publish --platform APP --type android --safemode true --signing-type custom --keystore ./keystore.jks --password ${{ secrets.KS_PASS }} --alias ${{ secrets.KS_ALIAS }}
      - name: Upload Artifact
        uses: actions/upload-artifact@v3
        with:
          name: Android-APK
          path: unpackage/release/apk/*.apk
```

---

## Version Control Standards (`versionCode` Strategy)

In `manifest.json`:

```json
{
  "versionName": "5.2.0", 
  "versionCode": 5002000 // Recommended strong standard: Major(2) + Minor(2) + Patch(3)
}
```

- **versionName**: User-facing display version (e.g., `1.0.4`).
- **versionCode**: Integer used by the underlying system for version comparison. MUST increment, NEVER rollback!
- **Strategy Recommendation**: Forbid manual, arbitrary incrementing of versionCode. Adopt an exact mapping strategy like `1.0.4` -> `1000004` to avoid versionCode conflicts during major version jumps (Android and Google Play are extremely strict about this).
