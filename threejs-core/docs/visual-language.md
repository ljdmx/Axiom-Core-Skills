# Visual Language Reference
## Light Dramatics · Camera Grammar · OKLAB Color · Anti-Mediocrity Protocol

> "Technology decides what is possible. Visual language decides whether it's worth experiencing."
> This document is the soul layer of the skill pack.
> Without it, you write code. With it, you build worlds.

---

## Table of Contents

1. [Light Dramatics Theory](#1-light-dramatics-theory)
2. [Shadow as Compositional Language](#2-shadow-as-compositional-language)
3. [OKLAB Perceptual Color System](#3-oklab-perceptual-color-system)
4. [Camera Composition Grammar](#4-camera-composition-grammar)
5. [Depth of Field as Narrative Weapon](#5-depth-of-field-as-narrative-weapon)
6. [Anti-Mediocrity 3D Aesthetic Protocol](#6-anti-mediocrity-3d-aesthetic-protocol)
7. [Entry Ritual Design](#7-entry-ritual-design)

---

## 1. Light Dramatics Theory

### The Single Dominant Key Light Law

World-class 3D visuals (Apple product pages, Awwwards SOTD, luxury jewelry brands) follow one iron law:

> **One overwhelmingly strong key light creates all the tension.
> Every other light only rescues dead blacks. No other light performs.**

Traditional "3-point lighting" is an industrial studio workflow — not the optimal path to art.
When three lights share equal intensity, they cancel each other's shadows and produce a CAD model, not an artwork.

```javascript
// ❌ Mediocre: equal intensity — mutual cancellation, no drama
const key  = new THREE.DirectionalLight(0xffffff, 1.0);
const fill = new THREE.DirectionalLight(0xffffff, 0.8);
const rim  = new THREE.DirectionalLight(0xffffff, 0.9);
// Result: flat, even, soulless — looks like a hardware product manual

// ✅ Dramatic: key dominates, everything else supports
const key = new THREE.DirectionalLight(0xfff4e0, 4.0); // Overwhelmingly warm
const fill = new THREE.DirectionalLight(0xb0c8ff, 0.3); // Cool — barely visible
const rim  = new THREE.DirectionalLight(0xffffff, 0.8); // Separates from BG
const amb  = new THREE.AmbientLight(0xffffff, 0.05);    // Prevents dead black only
```

### Light Hardness Philosophy

Light source type determines shadow edge hardness. Hardness communicates emotional weight:

| Source | Shadow Hardness | Emotional Language | Scene Type |
|:---|:---:|:---|:---|
| `DirectionalLight` (distant) | Hard | Drama, tension, epic | Product hero, sci-fi |
| `SpotLight` (mid-distance) | Medium-hard | Focus, performance, secrecy | Jewelry, watch, stage |
| `RectAreaLight` (area light) | Soft | Studio, professional, neutral | Automotive, electronics |
| `HemisphereLight` | None | Outdoor, natural, open | Architecture, landscape |
| HDR Environment only | Very soft diffuse | Cinematic, immersive | Luxury goods |

```javascript
// SpotLight — the dramatic spotlight
const spot = new THREE.SpotLight(0xfff8f0, 8.0);
spot.position.set(3, 8, 3);
spot.target.position.set(0, 0, 0);
spot.angle     = Math.PI / 8;  // Narrow cone = more drama
spot.penumbra  = 0.3;          // Edge softness (0=hard cut, 1=very soft)
spot.decay     = 2;            // Physically correct distance falloff
spot.castShadow = true;
spot.shadow.mapSize.set(2048, 2048);
spot.shadow.bias = -0.001;
scene.add(spot, spot.target);

// RectAreaLight — studio area light (requires init)
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';
RectAreaLightUniformsLib.init(); // Call once at startup

const rectLight = new THREE.RectAreaLight(0xfff0e0, 5, 2, 4); // color, intensity, w, h
rectLight.position.set(-3, 2, 2);
rectLight.lookAt(0, 0, 0);
scene.add(rectLight);
// Note: RectAreaLight only affects MeshStandardMaterial and MeshPhysicalMaterial
```

### Light Pollution Clearance Protocol

Before adding any light, three questions — if any answer is "no", do not add the light:
1. **Does it fix a specific, unacceptable dead black?** (not all shadows are bad)
2. **Is it weaker than 10% of the key light's intensity?**
3. **Does the scene look better with it than without it — objectively?**

```javascript
// Diagnostic: temporarily disable all non-key lights
// If the scene is still beautiful with only the key light, composition is sound
function isolateKeyLight(scene) {
  scene.traverse((obj) => {
    if (obj.isLight && obj.userData.role !== 'key') obj.visible = false;
  });
}
// Tag lights with roles:
keyLight.userData.role = 'key';
fillLight.userData.role = 'fill';
rimLight.userData.role  = 'rim';
```

---

## 2. Shadow as Compositional Language

> Shadows are not a byproduct of lighting. They are the only proof that an object exists in space.

### Shadow Direction = Narrative Direction

```javascript
// Upper-left key light → shadow falls lower-right
// Matches Western painting convention — feels "normal" and stable
keyLight.position.set(-5, 8, 3);

// Light from below → shadow falls upward = horror, supernatural, wrong
keyLight.position.set(0, -5, 2);

// Light from behind → silhouette, no cast shadow = sacred, divine, mystery
keyLight.position.set(0, 2, -8);
```

### Colored Shadows

```javascript
// Real-world shadows carry ambient light color (blue sky → shadows lean purple-blue)
// Three.js default shadows are pure black — this never occurs in nature

// ★ Use ShadowMaterial for colored, atmospheric shadows
const shadowPlane = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.ShadowMaterial({
    color: 0x1a0a2e,    // Deep purple-black — not pure black
    opacity: 0.4,
    transparent: true,
  })
);
shadowPlane.rotation.x = -Math.PI / 2;
shadowPlane.receiveShadow = true;
scene.add(shadowPlane);
```

### Dual-Layer Contact Shadows (Highest Quality)

```jsx
// R3F: two layers = near sharp contact + far diffuse atmosphere
<ContactShadows position={[0, -0.01, 0]} opacity={0.75} blur={0.5}
                scale={4} color="#1a0a2e" />  {/* Sharp contact layer */}
<ContactShadows position={[0, -0.01, 0]} opacity={0.25} blur={3.0}
                scale={9} color="#1a0a2e" />  {/* Diffuse atmosphere layer */}
```

---

## 3. OKLAB Perceptual Color System

### Why RGB mix() Produces "Mud"

```glsl
// ❌ RGB space interpolation — passes through gray midpoint, colors "die"
vec3 red  = vec3(1.0, 0.0, 0.0);
vec3 blue = vec3(0.0, 0.0, 1.0);
vec3 mid  = mix(red, blue, 0.5); // = vec3(0.5, 0.0, 0.5) — dark mud purple

// ✅ OKLAB space interpolation — perceptually uniform, midpoint stays vivid
// Red to blue passes through orange → yellow → green → cyan → blue
// Colors remain saturated and alive throughout the transition
```

### Complete OKLAB GLSL Implementation

```glsl
// Source: Björn Ottosson (oklab.org) — MIT License
// Include in every shader that does color interpolation

vec3 linearToOklab(vec3 c) {
  float l = 0.4122214708*c.r + 0.5363325363*c.g + 0.0514459929*c.b;
  float m = 0.2119034982*c.r + 0.6806995451*c.g + 0.1073969566*c.b;
  float s = 0.0883024619*c.r + 0.2817188376*c.g + 0.6299787005*c.b;
  float l_ = pow(l, 1.0/3.0), m_ = pow(m, 1.0/3.0), s_ = pow(s, 1.0/3.0);
  return vec3(
    0.2104542553*l_ + 0.7936177850*m_ - 0.0040720468*s_,
    1.9779984951*l_ - 2.4285922050*m_ + 0.4505937099*s_,
    0.0259040371*l_ + 0.7827717662*m_ - 0.8086757660*s_
  );
}

vec3 oklabToLinear(vec3 c) {
  float l_ = c.x + 0.3963377774*c.y + 0.2158037573*c.z;
  float m_ = c.x - 0.1055613458*c.y - 0.0638541728*c.z;
  float s_ = c.x - 0.0894841775*c.y - 1.2914855480*c.z;
  float l = l_*l_*l_, m = m_*m_*m_, s = s_*s_*s_;
  return vec3(
    +4.0767416621*l - 3.3077115913*m + 0.2309699292*s,
    -1.2684380046*l + 2.6097574011*m - 0.3413193965*s,
    -0.0041960863*l - 0.7034186147*m + 1.7076147010*s
  );
}

// ★ The core function: mix colors in OKLAB space
vec3 mixOklab(vec3 srgbA, vec3 srgbB, float t) {
  vec3 linA = pow(srgbA, vec3(2.2)); // sRGB → linear
  vec3 linB = pow(srgbB, vec3(2.2));
  vec3 labA = linearToOklab(linA);
  vec3 labB = linearToOklab(linB);
  vec3 labM = mix(labA, labB, t);
  return pow(oklabToLinear(labM), vec3(1.0/2.2)); // linear → sRGB
}

// Usage in fragment shader:
// vec3 gradient = mixOklab(vec3(1.0,0.27,0.0), vec3(0.08,0.27,0.87), vUv.x);
// Produces: red → orange → yellow → green → cyan → blue (vivid throughout)
```

### Perceptual Luminance for Emissive Calibration

```javascript
// Human eye sensitivity: green >> red >> blue
// Same emissiveIntensity looks 10× brighter in green than blue

function perceivedLuminance(hex) {
  const c = new THREE.Color(hex);
  return 0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b;
}

// Calibrate emissiveIntensity by perceived luminance inverse
const neonBlue  = { color: 0x0044ff, intensity: 3.0 }; // L=0.07 → needs boost
const neonGreen = { color: 0x00ff44, intensity: 0.7 }; // L=0.71 → already bright
const neonRed   = { color: 0xff2200, intensity: 1.8 }; // L=0.21 → moderate

// Apply to material
mesh.material.emissive.setHex(neonBlue.color);
mesh.material.emissiveIntensity = neonBlue.intensity;
```

### JS Layer: Linear Space Color Lerp

```javascript
// THREE.Color.lerpColors() interpolates in sRGB — produces mud like GLSL mix()
// ✅ Correct: interpolate in linear space
function lerpColorsLinear(colorA, colorB, t) {
  const a = colorA.clone().convertSRGBToLinear();
  const b = colorB.clone().convertSRGBToLinear();
  return a.lerp(b, t).convertLinearToSRGB();
}

// Use for dynamic color animation
const brandColor  = new THREE.Color(0xff4400);
const accentColor = new THREE.Color(0x0044ff);
function animate() {
  const lerpedColor = lerpColorsLinear(brandColor, accentColor, scrollProgress);
  mesh.material.color.copy(lerpedColor);
}
```

---

## 4. Camera Composition Grammar

### FOV Emotional Language

FOV is not "how much you see" — it is **emotional distance**:

```javascript
// FOV reference table — commit this to memory
camera.fov = 20;  // Compressed epic: monumental, distant, reverent, telephoto
camera.fov = 35;  // Cinema standard: natural, refined, premium (Apple product pages)
camera.fov = 50;  // Human eye: neutral, documentary, honest
camera.fov = 75;  // Wide: spatial, game-like, immersive
camera.fov = 110; // Fisheye: distorted, dramatic, claustrophobic
camera.updateProjectionMatrix(); // Always after FOV change

// ★ Sweet spots by scene type:
// Luxury product: 35–45°   (compressed compression = premium feel)
// Architecture: 25–35°     (tall spaces feel even taller)
// Game / exploration: 60–75°
// Epic landscape: 20–30°
// Intimate portrait: 45–55°
```

### Rule of Thirds in 3D Space

```javascript
// ★ Never center the subject (unless intentional symmetric gravitas)
// Place subject at 1/3 or 2/3 of the frame

// Shift lookAt to offset subject in frame
const subject = new THREE.Vector3(0, 0, 0);
const fovRad   = camera.fov * Math.PI / 180;

// Subject appears in right-upper third
const offsetX = -0.38 * Math.tan(fovRad / 2); // 38% right of center
const offsetY = -0.22 * Math.tan(fovRad / 2); // 22% above center

camera.lookAt(
  subject.x + offsetX,
  subject.y + offsetY,
  subject.z
);

// For a more dynamic feel: after lookAt, add slight Z rotation (Dutch angle)
camera.rotation.z = THREE.MathUtils.degToRad(5); // 5° tilt = tension + dynamism
```

### Camera Height Psychology

```javascript
// Height communicates power relationship between viewer and subject

// Low (camera below subject): subject is powerful, monumental, sacred
camera.position.set(0, -1.5, 6); camera.lookAt(0, 0, 0);

// Level (camera = subject height): equality, intimacy, peer relationship
camera.position.set(0, 0, 6);   camera.lookAt(0, 0, 0);

// High (camera above subject): god-view, overview, control, data
camera.position.set(0, 5, 6);   camera.lookAt(0, 0, 0);

// Extreme top-down: map view, data visualization, loss of emotional connection
camera.position.set(0, 15, 0);  camera.lookAt(0, 0, 0);
```

### FOV Zoom Animation (Cinematic Impact)

```javascript
// Sudden FOV narrowing = "the moment arrives" — used at reveal climaxes
gsap.to(camera, {
  fov: 28,
  duration: 2.2,
  ease: 'power3.inOut',
  onUpdate: () => camera.updateProjectionMatrix(),
});

// Slow wide-to-narrow during scroll = building epic tension
// Use with ScrollTrigger scrub
```

---

## 5. Depth of Field as Narrative Weapon

> DOF is not a visual effect. It is a command: "**Look here.**"
> A scene where everything is sharp has no story to tell.

```jsx
// R3F: DOF with dynamic focus tracking
import { DepthOfField } from '@react-three/postprocessing';
import { useFrame, useThree } from '@react-three/fiber';
import { useRef } from 'react';

function NarrativeDOF({ heroRef }) {
  const dofRef = useRef();
  const { camera } = useThree();

  useFrame(() => {
    if (!heroRef.current || !dofRef.current) return;

    const heroPos = new THREE.Vector3();
    heroRef.current.getWorldPosition(heroPos);
    const dist = camera.position.distanceTo(heroPos);

    // Smooth focus tracking — simulates human eye's focus delay
    const currentFocus = dofRef.current.circleOfConfusionMaterial
      .uniforms.focusDistance.value;
    const targetFocus = dist / camera.far;

    dofRef.current.circleOfConfusionMaterial.uniforms.focusDistance.value =
      THREE.MathUtils.lerp(currentFocus, targetFocus, 0.04);
  });

  return (
    <DepthOfField
      ref={dofRef}
      focusDistance={0.01}
      focalLength={0.025}
      bokehScale={3.5}
      height={480}
    />
  );
}
```

```javascript
// Vanilla: BokehPass with interactive focus
import { BokehPass } from 'three/addons/postprocessing/BokehPass.js';

const bokeh = new BokehPass(scene, camera, {
  focus: 8.0, aperture: 0.002, maxblur: 0.004
});
composer.addPass(bokeh);

// Mouse-driven focus (click to focus on what you point at)
renderer.domElement.addEventListener('click', (e) => {
  mouse.set(
    (e.clientX / window.innerWidth)  * 2 - 1,
    -(e.clientY / window.innerHeight) * 2 + 1,
  );
  raycaster.setFromCamera(mouse, camera);
  const hits = raycaster.intersectObjects(scene.children, true);
  if (hits.length > 0) {
    // Animate focus transition — smooth like a real camera
    gsap.to(bokeh.uniforms.focus, { value: hits[0].distance, duration: 0.5 });
  }
});
```

---

## 6. Anti-Mediocrity 3D Aesthetic Protocol

### The 3D "AI Aesthetic" Identification Checklist

These patterns are immediate indicators of mediocre 3D work. Any match = rewrite:

```
□ Blue-purple spinning orb with halo glow
  → Every AI demo looks like this. It communicates nothing. Replace with organic displaced form.

□ Perfectly symmetric geometric grid arrays (cubes/spheres in rows)
  → No tension, no organic life, no story. Use golden angle distribution.

□ Particles: all same size, speed, color
  → Not particles — it's a dot matrix. Add per-instance variation.

□ OrbitControls without damping shipped to production
  → Snapping feels cheap. Always: enableDamping = true, dampingFactor = 0.06.

□ HDR overexposed (everything at max brightness)
  → No shadow depth. Tune toneMappingExposure to preserve dark areas.

□ Global bloom (threshold = 0 or very low)
  → Everything glows equally = cheap phone filter. Selective bloom only.

□ Pure black background (#000000)
  → Technically "wrong" — no real environment is pure black. Use 0x0a0a0f with fog.

□ Loading completes → objects instantly appear
  → Missing entry ritual. Add 3-stage reveal (light → subject → camera).

□ helvetiker font (Three.js default 3D font)
  → 1990s feel. Use custom typeface JSON or drei Text3D with a proper font.

□ All objects same roughness (e.g., roughness=0.5 everywhere)
  → No material hierarchy. Apply Hero/Supporting/Background tier system.
```

### Organic Distribution vs Grid Distribution

```javascript
// ❌ Grid: uniform, mechanical, soulless
for (let i = 0; i < 1000; i++) {
  positions[i*3]   = (i % 10) * 1.0;
  positions[i*3+1] = Math.floor(i / 10) * 0.5;
}

// ✅ Golden angle (sunflower) distribution: natural, mathematically beautiful
const PHI = Math.PI * (3 - Math.sqrt(5)); // Golden angle ≈ 137.508°
for (let i = 0; i < 1000; i++) {
  const angle = i * PHI;
  const r     = Math.sqrt(i / 1000) * 8;
  positions[i*3]   = Math.cos(angle) * r + (Math.random()-0.5) * 0.3;
  positions[i*3+1] = (Math.random()-0.5) * 2 * Math.pow(r/8, 0.5);
  positions[i*3+2] = Math.sin(angle) * r + (Math.random()-0.5) * 0.3;
  sizes[i]  = Math.random() * 2.5 + 0.5;  // Size variation
  speeds[i] = Math.random() * 0.6 + 0.4;  // Speed variation
  phases[i] = Math.random() * Math.PI * 2; // Phase variation
}
```

### Material Hierarchy Implementation

```javascript
// Three tiers — no overlap between them
const HERO_MAT = new THREE.MeshPhysicalMaterial({
  roughness: 0.05, metalness: 0.92,
  clearcoat: 1.0,  clearcoatRoughness: 0.08,
  envMapIntensity: 2.2,
  // Optional: anisotropy for brushed metal
  // anisotropy: 0.8, anisotropyRotation: Math.PI / 4,
});

const SUPPORT_MAT = new THREE.MeshStandardMaterial({
  roughness: 0.4, metalness: 0.3,
  envMapIntensity: 0.7,
});

const BG_MAT = new THREE.MeshStandardMaterial({
  roughness: 0.85, metalness: 0.0,
  envMapIntensity: 0.15, // Barely reflects — recedes from attention
});
```

---

## 7. Entry Ritual Design

> A scene without an entry ritual is a door without a handle.
> The ritual communicates: "We prepared this world for your arrival."

### Three-Stage Entry Ritual

```javascript
// ★ The psychological contract:
// Stage 1 (Environment): "A world exists here"  → atmosphere establishes before subject
// Stage 2 (Subject):     "Something lives here" → hero object rises with gravity
// Stage 3 (Approach):    "It welcomes you"      → camera closes in (companionship gesture)

renderer.domElement.style.opacity = '0';

loadingManager.onLoad = () => {
  const ritual = gsap.timeline({ delay: 0.2 });

  // Stage 1: Environment (0ms–1500ms)
  // Fog thins, key light brightens — space establishes
  ritual
    .fromTo(scene.fog, { density: 0.08 }, { density: 0.018, duration: 1.5,
      ease: 'power2.out' }, 0)
    .from(keyLight, { intensity: 0, duration: 2.0, ease: 'power2.inOut' }, 0.1)
    .to(renderer.domElement.style, { opacity: 1, duration: 0.6, ease: 'power2.out' }, 0.1);

  // Stage 2: Subject enters (400ms–2200ms)
  // Rises from below — gravity, physical honesty (Respect axis: honest physics)
  ritual
    .from(heroMesh.position, { y: heroMesh.position.y - 3,
      duration: 1.8, ease: 'power3.out' }, 0.4)
    .from(heroMesh.material, { opacity: 0, duration: 1.0,
      ease: 'power2.out' }, 0.4);

  // Stage 3: Camera approaches (600ms–3100ms)
  // Closes in slowly — "the world comes to meet you" (Companionship axis)
  ritual
    .from(camera.position, {
      z: camera.position.z + 2.5,
      duration: 2.5,
      ease: 'power2.inOut',
      onUpdate: () => camera.lookAt(0, 0, 0),
    }, 0.6);

  ritual.play();
};
```

### Scene Exit Ritual (Transition Away)

```javascript
// Exit is just as important as entry — Respect axis: no jarring cuts
function exitScene(onComplete) {
  const exit = gsap.timeline({ onComplete });
  exit
    .to(heroMesh.material, { opacity: 0, duration: 0.4, ease: 'power2.in' }, 0)
    .to(renderer.domElement.style, { opacity: 0, duration: 0.5, ease: 'power2.in' }, 0.1)
    .to(keyLight, { intensity: 0, duration: 0.5 }, 0);
}
```
