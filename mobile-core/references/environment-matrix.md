# Mobile Compilation Environment Matrix

To guarantee zero-error compilation on first boot for iOS and Android, AI MUST configure the build environment strictly according to this known-good matrix.

## 1. React Native (v0.73.0) Baseline
- **Node.js**: `v18.18.0+`
- **Ruby**: `2.7.6`
- **CocoaPods**: `1.15.2`

### iOS Specification
- **OS**: macOS 14.2+ (Sonoma)
- **Xcode**: `15.2` (Strict Requirement)
- **iOS Target**: `13.0`

### Android Specification
- **Java JDK**: `17` (Corretto or Adoptium)
- **Android Gradle Plugin (AGP)**: `8.1.4`
- **Gradle Wrapper**: `8.3`
- **Min SDK**: `24`
- **Target SDK**: `34`

## 2. uni-app / UTS Baseline
- **HBuilderX**: `4.11+`
- **Vue**: `3.4+` 
- **iOS Target** (for native plugins): `12.0`
- **Android Gradle Plugin**: `8.1.1`

Do NOT assume local global environments are prepared. Guide the user to sync these versions before executing build commands (`pod install` or `./gradlew build`).
