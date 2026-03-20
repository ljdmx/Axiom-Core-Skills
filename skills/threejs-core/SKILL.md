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
> **Visual Manifest**: [Axiom Core Zenith Billboard](../_core_axioms/zenith_billboard.html)

## World-Class 3D Skill Pack —Soul Edition


> Every scene you build must be a living entity with a soul.
> Technology decides what is possible. Visual language decides whether it's worth experiencing.
> Core Mission: Produce 3D experiences that make observers stop scrolling and hold their breath.

**Version Coverage**: Three.js `r152+` · React Three Fiber `8+` · WebGPU `r163+`
> Before upgrading → `references/diagnostics.md §4` —Breaking Change Map

> **MUST READ**: `view_file(../_core_axioms/KERNEL_BOOTSTRAP.md)` —Inherit Global Nexus, Architectural Sovereign, and Soul Manifesto rules.
> **Standard Gates**: `view_file(../_core_axioms/STANDARD_GATES.md)` —Inherit 3-Axis Soul Diagnostic and Rejection Gate.

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
| `visual-language.md` | Light dramatics · Camera grammar · OKLAB color · Anti-mediocrity protocol | Before every new scene |
| `diagnostics.md` | Perf diagnosis · 30-sec error triage · GC defense · Version migration | When things break |
| `webgpu.md` | WebGPURenderer · TSL Node Materials · Compute Shader | **STRICT BLOCK**: DO NOT READ unless fluid/million-particle compute is explicitly requested. |
| `advanced-shaders.md` | GLSL noise · Fresnel · SDF raymarching · Holographic shader | Custom shaders |
| `particles.md` | Points system · InstancedMesh · GPU particles · Attractor fields | Particle scenes |
| `patterns-catalog.md` | 8 complete scene templates with full code | Quick start |
| `physics.md` | Rapier physics · Rigid bodies · Character controller | Physics interaction |
| `mobile-xr.md` | Mobile optimization · WebXR · AR hit testing | Cross-platform |

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
// ❌Anti-pattern: fixed increment —speed is framerate-dependent
mesh.rotation.y += 0.01; // 60fps ≥ 144fps speed

// ✅Correct: delta-time ensures frame-rate independence
const clock = new THREE.Clock();
function animate() {
  const delta = clock.getDelta();
  const elapsed = clock.getElapsedTime();

  mesh.rotation.y += delta * Math.PI * 0.5; // 90°/sec regardless of FPS

  // Companionship: breathing float at human respiratory frequency
  // ~0.25 Hz = 12—8 breaths/min = 4s cycle → reinforces Companionship axis
  mesh.position.y = Math.sin(elapsed * Math.PI * 0.5) * 0.08; // 8% amplitude max

  renderer.render(scene, camera);
}
```

### 4.2 Soul Animation Principles (DDFM-Aligned)

All animations must pass these gates —violation = immediate refusal:

| Use Case | Architecture | Validation Rule |
|:---|:---|:---|
| Vanilla WebGL Canvas | `Three.js r152+` | No boilerplate wrappers. Pure OOP or Data-Oriented structure. |
| React Declarative 3D | `R3F 8+` + `Drei` | Zustand for state. `useFrame` minimal usage. |
| Immersive WebXR / Spatial | `Three.js` / WebXR API | AI MUST architect scene with Z-depth anchoring for Apple Vision Pro / Meta Quest. Enable `renderer.xr.enabled = true`. Ensure UI components map to physical world coordinates (e.g. `ThreeMeshUI`). User interaction shifts from pointer-events to raycasting & hand-tracking logic. |

> **IMPORTANT**: Never combine frameworks incorrectly. Do not use DOM manipulation inside a R3F `useFrame`. Do not use `document.getElementById` when a ref is available.

| Rule | Limit | Rationale |
|:---|:---|:---|
| Duration | 100—00ms | Above 300ms feels sluggish; below 100ms feels mechanical |
| Easing | ease-out / cubic-bezier | Linear = robotic; bounce/spring = childish |
| Amplitude | ≥ 8% of rest value | More = anxiety, not delight |
| Trigger | User action or state change only | Auto-playing loops = disrespect |
| Reduced motion | Always respected | Inclusivity is non-negotiable |

```javascript
// ★ Soul Microinteraction #1 —Understanding Axis
// Input focus pulse: "The app is gently listening"
// On focus, single 600ms box-shadow breath (not repeated)
element.addEventListener('focus', () => {
  gsap.fromTo(mesh.material, { emissiveIntensity: 0 },
    { emissiveIntensity: 0.3, duration: 0.6, ease: 'power2.out',
      onComplete: () => gsap.to(mesh.material, { emissiveIntensity: 0, duration: 0.4 }) });
});

// ★ Soul Microinteraction #2 —Respect Axis
// Tap confirmation ripple: "My intent is solemnly confirmed"
// 180ms outward diffusion from touch point, then natural dissipation
function tapRipple(origin) {
  const ring = createRingMesh(); // thin flat torus
  ring.position.copy(origin);
  scene.add(ring);
  gsap.to(ring.scale, { x: 3, y: 3, z: 3, duration: 0.18, ease: 'power2.out' });
  gsap.to(ring.material, { opacity: 0, duration: 0.18, ease: 'power2.in',
    onComplete: () => { scene.remove(ring); ring.geometry.dispose(); ring.material.dispose(); }
  });
}

// ★ Soul Microinteraction #3 —Companionship Axis
// Content soft float-up: "Gliding into view like an old friend"
// 220ms fade-in + 8% upward slide on page transition
function enterScene(objects) {
  objects.forEach((obj, i) => {
    obj.position.y -= 0.3;
    obj.material.opacity = 0;
    obj.material.transparent = true;
    gsap.to(obj.position, { y: obj.position.y + 0.3, duration: 0.22,
      delay: i * 0.05, ease: 'power2.out' });
    gsap.to(obj.material, { opacity: 1, duration: 0.22, delay: i * 0.05 });
  });
}

// ★ Reduced motion respect —mandatory
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (prefersReduced) {
  gsap.globalTimeline.timeScale(0); // Stop all GSAP
  clock.stop();                     // Stop Three.js clock
}
```

### 4.3 GSAP Cinematic Sequences

```javascript
import gsap from 'gsap';

// Three-stage scene entry ritual (Understanding → Respect → Companionship)
const entryTl = gsap.timeline({ delay: 0.3 });
entryTl
  // Stage 1: Environment establishes (space exists before subject)
  .to(scene.fog, { density: 0.015, duration: 1.5, ease: 'power2.out' }, 0)
  .from(keyLight, { intensity: 0, duration: 2.0, ease: 'power2.inOut' }, 0.2)
```

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

> For advanced GLSL: noise functions, SDF raymarching, holographic → `references/advanced-shaders.md`
> For TSL Node Materials (WebGL + WebGPU) → `references/webgpu.md §2—`

---

## 9. Asset Loading —KTX2, GLTF, HDR

### 9.0 Texture Compression —KTX2 (Required for Mobile)

> **Without KTX2, mobile scenes crash from texture memory overflow. This is not an optimization —it is a requirement.**

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

## 10. React Three Fiber Patterns

### 10.1 Canvas Setup

```jsx
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Stats } from '@react-three/drei';
import { Suspense } from 'react';
import * as THREE from 'three';

export default function App() {
  return (
    <Canvas
      camera={{ fov: 60, near: 0.1, far: 100, position: [0, 2, 8] }}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.0,
        outputColorSpace: THREE.SRGBColorSpace,
      }}
      shadows="soft"
    >
      <Suspense fallback={<LoadingOverlay />}>
        <Environment preset="studio" />
        <Scene />
        <OrbitControls enableDamping dampingFactor={0.06} />
      </Suspense>
      {process.env.NODE_ENV === 'development' && <Stats />}
    </Canvas>
  );
}
```

### 10.2 Drei Essentials

```jsx
import {
  OrbitControls,            // Damped camera controls
  Environment,              // HDR environment maps
  useGLTF,                  // GLTF hook with caching + preload
  useTexture,               // Texture hook with caching
  MeshTransmissionMaterial, // Glass / crystal
  Float,                    // Breathing float wrapper
  Text3D,                   // 3D text (troika)
  Stars,                    // Particle star field
  Sparkles,                 // Magic sparkle particles
  ContactShadows,           // Fake soft floor shadows
  PresentationControls,     // Drag-rotate without full orbit
  Html,                     // HTML overlay in 3D space
} from '@react-three/drei';

// Always preload to avoid layout shift
useGLTF.preload('/models/hero.glb');

function Model() {
  const { scene } = useGLTF('/models/hero.glb');
  return <primitive object={scene} castShadow receiveShadow />;
}

// Float calibrated to Companionship axis breathing frequency
<Float speed={1.5} rotationIntensity={0.12} floatIntensity={0.25}
       floatingRange={[-0.08, 0.08]}>
  <Model />
</Float>
```

### 10.3 State Management (Zustand + Zero Re-renders in useFrame)

```jsx
import { create } from 'zustand';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';

const useSceneStore = create((set) => ({
  selectedId:   null,
  isAnimating:  true,
  bloomStrength: 0.8,
  setSelected:  (id) => set({ selectedId: id }),
  setAnimating: (v)  => set({ isAnimating: v }),
}));

// ★ Read Zustand state in useFrame via .getState() —zero re-renders
function AnimatedMesh() {
  const meshRef = useRef();
  useFrame((state, delta) => {
    // getState() does not subscribe —no re-render triggered
    if (!useSceneStore.getState().isAnimating) return;
    meshRef.current.rotation.y += delta * 0.5;
  });
  return <mesh ref={meshRef}><boxGeometry /><meshStandardMaterial /></mesh>;
}
```

### 10.4 2D/3D Dimensional Blending Protocol (Html Overlay)
When utilizing HTML overlays (e.g., `drei/Html`) over WebGL canvases, AI MUST establish strict Z-Index contracts. Web UI elements (like glass modals or tooltips) must harmonize with the 3D scene without jarring clipping or inappropriate occlusion. The 3D canvas itself should sit at `z-index: 0`, and interactive web elements must reside in an unequivocally higher stacking context.
**Spatial UI Handshake**: 3D subjects MUST respond to 2D UI states (e.g., a hover on a product card triggers a subtle 3D highlight/rotation). This interoperability is mandated via `PROJECT_NEXUS.json` state sync.

### 10.5 Graceful Degradation Protocol (The Fallback Mandate)
WebGPU and complex WebGL shaders fail on low-end or older mobile devices. AI MUST mandate the generation of high-quality fallback assets (e.g., an MP4 video loop of the spinning 3D scene, or a high-res parallax panorama) displayed when WebGL initialization fails or performance budgets are critically breached. A black screen or 2fps slideshow is a failure of the Respect axis.

---

## 11. Soul Quality Red Lines

### ✅Always

```
RENDERER:
✅setPixelRatio(Math.min(devicePixelRatio, 2))   —cap at 2×
✅ACESFilmicToneMapping                          —cinematic tone
✅SRGBColorSpace output (r152+)                  —correct colors
✅Color textures: colorSpace = SRGBColorSpace
✅Normal/roughness textures: colorSpace = LinearSRGBColorSpace

LIGHTING:
✅Single dominant key light (intensity > 3.0)
✅Fill light ≥ 10% of key intensity
✅envMap set on scene for all PBR materials
✅shadow.bias tuned per scene (-0.0005 start)

ANIMATION:
✅All animations use delta-time
✅Breathing float: ~0.25Hz, ≥ 8% amplitude
✅prefers-reduced-motion respected
✅Auto-rotate stops on pointer enter

ASSETS:
✅KTX2 textures (mobile production)
✅DRACO/Meshopt for models > 500KB
✅Geometry/material/texture disposed on unmount
✅Loading complete before scene reveal
```

### ❌Never

```
TECHNICAL:
✅setPixelRatio(window.devicePixelRatio)   —crashes 3× screens
✅mesh.rotation.y += 0.01                  —framerate-dependent
✅new THREE.Vector3() inside animate()     —GC spikes
✅raycaster.intersectObjects() every frame —throttle to 50ms
✅LinearToneMapping                        —flat, lifeless

VISUAL:
✅Equal intensity tri-light                —cancels all drama
✅AmbientLight(0xffffff, 1.0)             —kills all depth
✅Bloom threshold = 0 (everything glows)  —cheap phone filter
✅Pure black/white backgrounds             —no atmosphere
✅Missing outputColorSpace                 —washed-out or oversaturated

SOUL (triggers immediate rewrite):
✅Blue-purple spinning orb               —AI demo cliché
✅Perfectly symmetric geometric grids    —no organic tension
✅Equal-size/speed/color particles       —pixel grid, not particles
✅OrbitControls without damping shipped  —cheap feel
✅Objects appearing instantly on load    —missing entry ritual
✅Auto-rotate never pauses               —disrespectful to user intent
✅helvetiker font (Three.js default)     —1990s feel
✅**Flat AI Textures**: Uniform, noise-free material fills. Mandate `Noise Overlay` for all surfaces.
```

### Pre-Ship Soul Audit

```
Visual Layer:
✅Single dominant light creates clear shadow direction
✅Materials: 3 distinct fidelity tiers (Hero / Supporting / Background)
✅**Texture Noise Blueprint**: High-fidelity grain/noise applied to all materials (from Phase 1.5).
✅Background has atmospheric depth (fog / subtle gradient / hue)
✅Bloom: only intended emitters glow, threshold tuned
✅Camera FOV matches emotional intent (product=35, epic=20, game=75)

Motion Layer:
✅Hero object breathes at ~0.25Hz ≥ 8% amplitude
✅All camera transitions are smoothly interpolated
✅User interactions respond within 100ms perceived latency
✅Auto-rotation pauses on user touch

Technical Layer:
✅Loading has visual progress feedback
✅Resize handler updates camera.aspect and renderer.size
✅Mobile: renderer.info.render.calls < 50
✅prefers-reduced-motion handled

Soul Axis Confirmation (from soul-framework.md):
✅Understanding: camera opens at user's expected viewpoint
✅Respect: no forced animation, no motion they can't stop
✅Companionship: scene has at least one breathing/living element
```

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
| 100K GPU particles | WebGPU | Compute Shader + StorageBuffer | references/webgpu.md §4 |
| Holographic material | WebGPU | TSL NodeMaterial + Fresnel node | references/webgpu.md §3 |
| Physics sandbox | R3F | @react-three/rapier + RigidBody | references/physics.md |
| AR product trial | R3F | WebXR + @react-three/xr | references/mobile-xr.md |
| SDF raymarcher | Vanilla | Fullscreen ShaderMaterial | references/advanced-shaders.md §3 |
