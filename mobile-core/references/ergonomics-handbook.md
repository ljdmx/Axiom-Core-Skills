# 📱 Mobile Ergonomics & Tactile Handbook (v10.0)

## 1. The Thumb Zone Protocol
All interactive elements MUST reside in the **Natural Thumb Zone** (bottom 2/3 of screen).
- **Primary CTA**: Centered bottom or bottom-right (for right-hand dominance).
- **Navigation**: Bottom-tab bar only. NO top-left hamburger menus without a bottom alternative.

## 2. Tactile Semantics
- **Haptic Feedback**: Use `uni.vibrateShort()` on all primary action successes.
- **Physical Resistance**: Implement spring-based translation on scroll peaks (`tension: 170, friction: 26`).

## 3. Visual Hierarchy on Hardware
- **Dynamic Type**: Honor system settings. Use `rpx` for scale but respect `system-font-size`.
- **Contrast**: `4.5:1` minimum for text on high-glare outdoor scenarios.

---

## 📋 Reviewer Check
- [ ] Is every button >= 44x44px—
- [ ] Is the primary action reachable with one hand—
- [ ] Are animations < 300ms to prevent lag perception—
