---
name: threejs-core
description: >
  World-class Three.js and React Three Fiber (R3F) 3D scene development skill with
  DDFM Soul Framework integration. Use for any 3D, WebGL, WebGPU, shaders, or 3D 
  rendering tasks. Version: Three.js r152+ · r163+ (WebGPU + TSL).
version: "10.0"
last_updated: "2026-03"
metadata:
  pattern: tool-wrapper, generator
  graphics-engine: three-r163
---

# Three.js · React Three Fiber
> **Visual Manifest**: [Axiom Core Zenith Billboard](../_core_axioms/dashboards/zenith_billboard.html)

## World-Class 3D Skill Pack —Soul Edition


> Every scene you build must be a living entity with a soul.
> Technology decides what is possible. Visual language decides whether it's worth experiencing.
> Core Mission: Produce 3D experiences that make observers stop scrolling and hold their breath.

**Version Coverage**: Three.js `r152+` · React Three Fiber `8+` · WebGPU `r163+`
> Before upgrading → `references/diagnostics.md §4` —Breaking Change Map

> **MUST READ**: `view_file(../_core_axioms/protocols/KERNEL_BOOTSTRAP.md)` —Inherit Global Nexus, Architectural Sovereign, and Soul Manifesto rules.
> **Standard Gates**: `view_file(../_core_axioms/protocols/STANDARD_GATES.md)` —Inherit 3-Axis Soul Diagnostic and Rejection Gate.

---

## ★ Intent Decision Tree —Find Your Path in 10 Seconds

```
What are you building—
│  ├─ Product / Jewelry / Watch showcase
│    └─ R3F + PresentationControls + ContactShadows + Environment
│       → patterns-catalog.md §1
│  ├─ Data visualization (globe / network / statistics)
│    └─ Vanilla Three.js + InstancedMesh + CustomShader
│       → patterns-catalog.md §2, §8
│  ├─ Hero background / WebGL landing page FX
│    └─ Vanilla Three.js + PostProcessing + Bloom
│       → patterns-catalog.md §4, §6, §7
│  ├─ Game / Physics interaction
│    └─ R3F + @react-three/rapier + useFrame
│       → references/physics.md
│  ├─ 100K+ particles / GPU simulation
│    └─ WebGPU + Compute Shader (r163+), or InstancedMesh (WebGL fallback)
│       → references/webgpu.md §4, references/particles.md
│  ├─ Custom shader / special material FX
│    └─ ShaderMaterial (WebGL) or TSL NodeMaterial (WebGL + WebGPU)
│       → references/advanced-shaders.md, references/webgpu.md §2—
│  ├─ Scroll-driven narrative page
│    └─ GSAP ScrollTrigger + R3F or Vanilla
│       → patterns-catalog.md §5, this doc §5.2
│  └─ Performance problem / black screen / color shift / missing shadows
    └─ references/diagnostics.md —30-Second Triage Guide
```

---

## Reference Index

| File | Contents | When to Read |
|:---|:---|:---|
| `../_core_axioms/SOUL_MANIFESTO.md` | **DDFM Soul Axes · DIL System · Rejection Table · Soul Microinteractions** | Before every new scene |
| `./references/visual-language.md` | Light dramatics · Camera grammar · OKLAB color · Anti-mediocrity protocol | Before every new scene |
| `./references/math-and-shaders-axioms.md` | **GLSL Purity · Math Classes · Memory Management** | Custom shaders & math logic |
| `./references/diagnostics.md` | Perf diagnosis · 30-sec error triage · GC defense · Version migration | When things break |
| `./references/webgpu.md` | WebGPURenderer · TSL Node Materials · Compute Shader | **STRICT BLOCK**: DO NOT READ unless explicitly requested. |
| `./references/advanced-shaders.md` | GLSL noise · Fresnel · SDF raymarching · Holographic shader | Custom shaders |
| `./references/particles.md` | Points system · InstancedMesh · GPU particles · Attractor fields | Particle scenes |
| `./references/patterns-catalog.md` | 8 complete scene templates with full code | Quick start |
| `./references/physics.md` | Rapier physics · Rigid bodies · Character controller | Physics interaction |
| `./references/mobile-xr.md` | Mobile optimization · WebXR · AR hit testing | Cross-platform |

---

## Table of Contents

0. [Pre-Flight Calibration](#0-pre-flight-calibration)
1. [Scene Architecture & Setup](#1-scene-architecture--setup)
2. [Geometry & PBR Materials](#2-geometry--pbr-materials)
3. [Lighting System Design](#3-lighting-system-design)
4. [Animation System](#4-animation-system)
5. [Camera & Controls](#5-camera--controls)
6. [Postprocessing & Visual FX](#6-postprocessing--visual-fx)
7. [Performance Budgets & Optimization](#7-performance-budgets--optimization)
8. [GLSL Shader Protocol](#8-glsl-shader-protocol)
9. [Asset Loading —KTX2, GLTF, HDR](#9-asset-loading--ktx2-gltf-hdr)
10. [React Three Fiber Patterns](#10-react-three-fiber-patterns)
11. [Soul Quality Red Lines](#11-soul-quality-red-lines)

---

### Step 0 —Scene Archetype Selection [Generator]

> **Pattern: Generator**. Choose a base archetype before building:
1. **Showcase**: `templates/init-scene.js` -> Optimal for product detail pages.
2. **Narrative**: `templates/camera-emotional-script.js` -> Optimal for landing pages.

### Step 1 —Scene Hydration & Soul Integration
1. **Load Blueprint**: Populate the chosen template with custom geometry/textures.
2. **Reviewer Pass**: Run A11y and Performance audit (Reviewer pattern) to ensure 60FPS.

| Context | Stack |
|:---|:---|
| React application | R3F + drei (always) |
| Standalone canvas / HTML | Vanilla Three.js |
| Performance-critical / mobile heavy | Vanilla + instancing |
| GPU particles / compute simulation | WebGPU r163+ |
| Cross-platform product | Vanilla core + R3F wrapper |

### Soul Axis Pre-Check (from SOUL_MANIFESTO.md)

Before choosing any technical approach, identify the scene's dominant soul axis:
- **Understanding** → Camera starts at the user's expected viewpoint; zero learning curve interaction
- **Respect** → No forced auto-rotation; no motion that can't be paused; WCAG AA contrast
- **Companionship** → Float animations at breathing frequency (~0.25 Hz); warm material palette

---

## 1. Scene Architecture & Setup

### 1.1 Vanilla Three.js —Production Boilerplate

> Loading the standard scene boilerplate is mandatory for vanilla projects.
> ```javascript
> view_file(references/boilerplates.md) // See §1.1
> ```

### 1.2 Scene Hierarchy

> ```javascript
> view_file(references/boilerplates.md) // See §1.2
> ```

---

## 2. Geometry & PBR Materials

### 2.1 MeshStandardMaterial —Defaults

> ```javascript
> view_file(references/boilerplates.md) // See §2.1
> ```

### 2.2 Geometry —Segment Budget

> ```javascript
> view_file(references/boilerplates.md) // See §2.2
> ```

### 2.3 Material Hierarchy Rule

> Every scene must have 3 tiers of material fidelity. Uniform roughness/metalness across all objects is the mark of amateur work.

| Tier | Role | Roughness | Metalness | envMapIntensity |
|:---|:---|:---:|:---:|:---:|
| Hero | Main subject | 0.0—.2 | 0.7—.0 | 1.5—.5 |
| Supporting | Secondary objects | 0.3—.5 | 0.2—.5 | 0.6—.0 |
| Background | Atmospheric fill | 0.7—.0 | 0.0—.1 | 0.1—.3 |

> **World-Class PBR Dictation (Zero-Plasticity Rule)**: AI MUST NEVER generate generic `.setHex()` materials for hero assets. The AI MUST utilize a hyper-precise optical dictionary specifying exact IOR, roughness curves, and albedo hexes (e.g., Physical Gold = `metalness: 1.0, roughness: 0.15, color: 0xffd700`; Water = `transmission: 1.0, ior: 1.33`) to ensure WebXR and Vision OS immersion parity.

---

## 3. Lighting System Design

> Read `references/visual-language.md §1—` before implementing any lights.
> **Single dominant key light = all dramatic tension. Equal multi-light = CAD model, no soul.**

### 3.1 Dominant Key Light Setup

> ```javascript
> view_file(references/boilerplates.md) // See §3.1
> ```

### 3.2 Environment Map

> ```javascript
> view_file(references/boilerplates.md) // See §3.2
> ```

### 3.3 Mood Palettes

| Mood | Ambient | Key | Fill | Rim |
|:---|:---|:---|:---|:---|
| **Cinematic Night** | `0x050510 × 0.05` | `0x4488ff × 4.0` | `0xff6644 × 0.3` | `0xffffff × 1.0` |
| **Studio Product** | `0xffffff × 0.05` | `0xfff8f0 × 4.0` | `0xe8f0ff × 0.4` | `0xffffff × 1.2` |
| **Sci-Fi Neon** | `0x000005 × 0.03` | `0x00ffcc × 5.0` | `0xff0088 × 0.5` | `0x0088ff × 1.0` |
| **Warm Interior** | `0xff9944 × 0.08` | `0xffcc88 × 4.0` | `0x88aacc × 0.3` | `0xffaa66 × 0.6` |
| **Zenith White (Studio)** | `0xffffff × 0.1` | `0xfffefc × 3.5` | `0xe0f7ff × 0.5` | `0xffffff × 1.5` |

### 3.4 Light Pollution Clearance Protocol

Before adding any light, ask three questions:
1. **Whose drama does it steal—** Does it reduce the key light's shadow direction—
2. **What dead black does it fix—** Is it truly unreadable shadow, or dramatic shadow being misread—
3. **Is the scene quieter without it—** If yes —remove it.

---

## 4. Animation System

### 4.1 Delta-Time (Mandatory)

```javascript
> **[TOKEN OPTIMIZATION]**
> To reduce context payload:
> **AI MUST load:** `view_file(references/animation-patterns.md)` to access all GSAP sequencing and Soul Easing code blocks.

### 4.1 Delta-Time & Soul Easing

> ```javascript
> view_file(references/boilerplates.md) // See §4.1
> ```

### 4.4 useFrame in R3F

> Standard frame loop patterns are detailed in `references/boilerplates.md` §4.4.

---

## 5. Camera & Controls

### 5.1 OrbitControls

> ```javascript
> view_file(references/boilerplates.md) // See §5.1
> ```

### 5.2 Scroll-Driven Camera Path

> ```javascript
> view_file(references/boilerplates.md) // See §5.2
> ```

### 5.3 FOV Emotional Grammar

> FOV is emotional distance —see `references/visual-language.md §4` for full grammar.
> ```javascript
> camera.fov = 20;  // Compressed epic —monumental, distant, reverent
> camera.fov = 35;  // Cinema standard —natural, refined, premium
> // ...
> camera.updateProjectionMatrix();
> ```

---

## 6. Postprocessing & Visual FX

### 6.1 EffectComposer Stack (Vanilla)

> ```javascript
> view_file(references/boilerplates.md) // See §6.1
> ```

### 6.2 @react-three/postprocessing (R3F)

> ```jsx
> view_file(references/boilerplates.md) // See §6.2
> ```

---

## 7. Performance Budgets & Optimization

### 7.1 Platform Budgets

| Platform | Draw Calls | Triangles | Shadow Maps | Post FX |
|:---|:---|:---|:---|:---|
| **Desktop** | ≥ 200 | ≥ 500K | 2K × 2048 | Full stack |
| **Mobile** | ≥ 50 | ≥ 100K | 1K × 1024 | None or 1 pass |
| **Low-end** | ≥ 20 | ≥ 50K | Off | Off |

### 7.2 Core Techniques

> InstancedMesh, LOD, GC Defense, and Raycaster throttling are detailed in `references/boilerplates.md`.
> **Automatic Camera-Distance LOD Protocol**: Any geometry exceeding 50K polygons MUST automatically mount a `THREE.LOD` component, specifying strict distance degradation thresholds (e.g., swapping to a low-poly proxy mesh past 100 units) to guarantee high-FPS mobile compatibility.
> Full diagnosis → `references/diagnostics.md §1`

### 7.3 Quick Diagnostics

> ```javascript
> view_file(references/boilerplates.md) // See §7.3
> ```

---

## 8. GLSL Shader Protocol

### 8.1 ShaderMaterial Template

```javascript
const material = new THREE.ShaderMaterial({
  uniforms: {
    uTime:       { value: 0 },
    uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    uColor:      { value: new THREE.Color(0x4488ff) },
  },
  vertexShader: /* glsl */`
    uniform float uTime;
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;

    void main() {
      vUv      = uv;
      vNormal  = normalize(normalMatrix * normal);
      vPosition = (modelMatrix * vec4(position, 1.0)).xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */`
    uniform float uTime;
    uniform vec3 uColor;
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;

    void main() {
      // Fresnel rim (see advanced-shaders.md §2 for full implementation)
      vec3 viewDir = normalize(cameraPosition - vPosition);
      float fresnel = pow(1.0 - dot(vNormal, viewDir), 3.0);
      vec3 color = mix(uColor, vec3(1.0), fresnel * 0.5);
      gl_FragColor = vec4(color, 1.0);
    }
  `,
});

// Update in render loop —never forget this
material.uniforms.uTime.value = clock.getElapsedTime();
```

> **Token Decompression Via Static Shader Linking (Zero-Boilerplate)**: To radically conserve tokens and prevent context window exhaustion, AI MUST NOT iteratively output foundational GLSL math logic (e.g., Simplex 3D Noise, SDF booleans) multiple times. ALL complex mathematical shader logic and heavy material configurations MUST be centralized within a static `ShadersLib.js` or external static resource layer, and referenced via external string compilation during the shader pipeline. Never inline heavy shaders.
> For advanced GLSL: noise functions, SDF raymarching, holographic → `references/advanced-shaders.md`
> For TSL Node Materials (WebGL + WebGPU) → `references/webgpu.md §2—`

---

## 9. Asset Loading —KTX2, GLTF, HDR

### 9.0 Texture Compression —KTX2 (Required for Mobile)

> **Without KTX2, mobile scenes crash from texture memory overflow. This is not an optimization —it is a requirement. AI MUST strictly use the standardized KTX2Loader template block rather than hallucinating custom setup logic.**

> ```javascript
> view_file(references/boilerplates.md) // See §9.0
> ```

### 9.1 GLTF Loading

> Custom center/normalize logic can be found in `references/boilerplates.md`.

### 9.2 Loading Manager with Entry Ritual

> ```javascript
> view_file(references/boilerplates.md) // See §9.2
> ```

---

> **[TOKEN OPTIMIZATION]** 
> To reduce context payload:
> **AI MUST load:** `view_file(references/react-three-patterns.md)` to access the R3F boilerplate, Drei usage, and Zustand state management patterns.

---

> **[TOKEN OPTIMIZATION]** 
> To reduce context payload:
> **AI MUST load:** `view_file(references/soul-red-lines.md)` for the strict ✅/❌ execution gates.

---

## Quick Reference: Scene Recipes

| Scene Type | Stack | Key Components | Reference |
|:---|:---|:---|:---|
| Product visualizer | R3F | GLTF + PresentationControls + ContactShadows | patterns-catalog.md §1 |
| Data globe | Vanilla | SphereGeometry + InstancedMesh + CustomShader | patterns-catalog.md §2 |
| Glass morphism cards | R3F | MeshTransmissionMaterial + Bloom | patterns-catalog.md §3 |
| Neon grid floor | Vanilla | ShaderMaterial + AdditiveBlending | patterns-catalog.md §4 |
| Scroll narrative | R3F | GSAP ScrollTrigger + camera path | patterns-catalog.md §5 |
| Liquid metal sphere | Vanilla | Displacement vertex shader + Fresnel | patterns-catalog.md §6 |
| Particle galaxy | Vanilla | Points + galaxy spiral algorithm | patterns-catalog.md §7 |
| 3D hero text | R3F | Text3D + MeshTransmissionMaterial + Float | patterns-catalog.md §8 |
| 1M+ WebGPU Fluid (State Machine) | WebGPU | Compute Shader + StorageBuffer | references/webgpu.md §4 |
| Holographic material | WebGPU | TSL NodeMaterial + Fresnel node | references/webgpu.md §3 |
| Physics sandbox | R3F | @react-three/rapier + RigidBody | references/physics.md |
| AR / VR Hand-Tracking | R3F | @react-three/xr + PhysX Hitboxes (No Raycasts) | references/mobile-xr.md |
| SDF raymarcher | Vanilla | Fullscreen ShaderMaterial | references/advanced-shaders.md §3 |
