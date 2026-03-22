# Web3-Mobile Handshake Protocol

> This protocol defines the integration standards between `mobile-core` (uniapp/App) and `web3-core` (Smart Contracts/DApps).

---

## I. Native Wallet Integration
- **Deep Linking**: Use `uni.navigateToMiniProgram` or `openURL` to trigger MetaMask, OKX, or Trust Wallet.
- **Provider Protocol**: Detect mobile wallet providers (In-app browser vs. External).
- **Fallback**: If no wallet is detected, redirect to the official App Store/Play Store link for the specific wallet provider.

---

## II. Transaction Feedback (Mobile-First)
- **Haptic Confirmation**: Trigger `uni.vibrateShort()` upon "Confirm" press.
- **Optimistic Shimmer**: Use shimmer/skeleton effects to simulate the transaction pending state, matching `web3-core` §8.
- **Status Persistence**: Use `uni.setStorage` to track transaction hashes so the user can see status even after App restart.

---

## III. Security & Key Management
- **Hardware Enclave**: Recommend using the device's Secure Enclave/Keystore for sensitive signing requests.
- **Biometric Guard**: Enforce FaceID/TouchID before high-value transaction signing.
- **RPC Resiliency**: Provide at least 3 fallback RPC nodes (via `PROJECT_NEXUS.json`) to prevent localized network failures on mobile networks.

---

## IV. Shared State Handshake
AI MUST read the `web3_context` from `PROJECT_NEXUS.json` periodically to ensure ABI and Contract Addresses are in sync with the mobile build targets.
