# Native Plugin Boilerplate (UTS / Swift / Kotlin)

This directory serves as the foundation for high-performance device capability extension bypassing webview limitations.

## Requirements
- Code must reside in language-specific modules (`android/` or `ios/`).
- Native UI threading models must be strictly respected (e.g., executing UI operations on the Main Thread).
- Cross-platform unified interface definitions (UTS) are mandatory before implementing platform-specific code.
