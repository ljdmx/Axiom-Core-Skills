# 🕯️ SOUL Emissive Standards: 3D Emotional Lighting

> **Translating the Soul Manifesto into Volumetric Reality**

## 🎭 Emotional State → Light Mapping

| Soul Axis Focus | Color Temp (K) | Intensity | Motion / Pulse | Rationale |
| :--- | :--- | :--- | :--- | :--- |
| **Understand** | `5600K` (Daylight) | `1.5 cd/m²` | Static / High Sharpness | Clarity of data, focus, cold precision. |
| **Respect** | `4500K` (Neutral) | `0.8 cd/m²` | Subtle Ambient Fade | Balanced authority, non-intrusive glow. |
| **Companion** | `2700K` (Warm) | `1.2 cd/m²` | Slow Sinusoidal Pulse | Human-centric warmth, safety, rhythm. |

## 🧪 Technical Implementation (Three.js)

### 1. The "Sentient" Glow
Use `UnrealBloomPass` with thresholding tied to the `RAMS_SCORE`.
- `score < 7`: Threshold `1.0` (Minimal bloom)
- `score >= 9`: Threshold `0.3` (Cinematic glow)

### 2. Mood-Driven Ambient Occlusion
- **Critical State**: Increase `HBAO` intensity + `Axiom-Red` tint.
- **Success State**: Soft `Axiom-Green` rim lighting at `45°` angle.

## 🔮 Material Sovereignty
All reflective materials MUST use `MeshPhysicalMaterial` with:
- `transmission: 0.9`
- `roughness: 0.1`
- `thickness: 2.0` (Glassmorphism emulation in 3D)
