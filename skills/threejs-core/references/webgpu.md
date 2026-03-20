# WebGPU · TSL Node Materials · Compute Shader
## Three.js Modern Rendering Path (r163+)

> WebGPU is not the future �?it is the present. Production-ready since r163.
> TSL (Three.js Shading Language) is the cross-WebGL/WebGPU unified shading system.
> Write node materials today �?your code runs on both WebGL and WebGPU unchanged.

---

## Table of Contents

1. [WebGPURenderer �?Migration Path](#1-webgpurenderer--migration-path)
2. [TSL Node Materials �?Fundamentals](#2-tsl-node-materials--fundamentals)
3. [TSL Advanced �?Custom Node Shaders](#3-tsl-advanced--custom-node-shaders)
4. [Compute Shader �?GPU Particle Simulation](#4-compute-shader--gpu-particle-simulation)
5. [WebGL vs WebGPU Capability Matrix](#5-webgl-vs-webgpu-capability-matrix)
6. [Graceful Degradation Strategy](#6-graceful-degradation-strategy)

---

## 1. WebGPURenderer �?Migration Path

```javascript
// ── Setup (Three.js r163+) ────────────────────────────────────────
import WebGPURenderer from 'three/addons/renderers/webgpu/WebGPURenderer.js';

const renderer = new WebGPURenderer({ antialias: true, powerPreference: 'high-performance' });
await renderer.init(); // �?WebGPU requires async initialization
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
document.body.appendChild(renderer.domElement);

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera); // Same API as WebGLRenderer
}
animate();
```

### Migration Checklist

```
Changes required:
�?new WebGLRenderer() �?new WebGPURenderer()
�?Add: await renderer.init()
�?EffectComposer (WebGL) �?PostProcessing (WebGPU, optional)

Unchanged (fully compatible):
�?Scene, Camera, all geometry types
�?MeshStandardMaterial, MeshPhysicalMaterial, MeshBasicMaterial
�?All light types (DirectionalLight, SpotLight, etc.)
�?OrbitControls, GLTFLoader, all texture loaders
�?GSAP animations (they operate on JS objects, renderer-agnostic)
�?Most @react-three/drei components
�?Shadow maps, fog, environment maps
```

---

## 2. TSL Node Materials �?Fundamentals

### Why TSL Instead of Raw GLSL

```
Raw ShaderMaterial (GLSL strings):
  vertexShader:   `...GLSL...`   �?WebGL only, not composable, hard to debug
  fragmentShader: `...GLSL...`   �?must rewrite for WebGPU

TSL NodeMaterial (composable nodes):
  colorNode = mix(colorA, colorB, t)  �?WebGL + WebGPU, composable, type-safe
  positionNode = position.add(offset)  �?Can be combined, shared, reused
```

### Core Nodes Reference

```javascript
import {
  // Geometry inputs
  positionLocal, positionWorld, positionView,
  normalLocal, normalWorld, normalView,
  uv, uv1,                               // UV channels
  tangentLocal, tangentWorld,

  // Camera / scene
  cameraPosition, viewportSize, screenUV,

  // Time
  timerLocal,   // time since scene init (affected by timeScale)
  timerGlobal,  // absolute time

  // Math nodes
  float, vec2, vec3, vec4,
  int, bool,
  add, sub, mul, div,
  sin, cos, tan, abs, pow, sqrt, exp, log,
  clamp, saturate, mix, step, smoothstep,
  dot, cross, normalize, length, reflect, refract,
  min, max, sign, floor, ceil, fract,
  mod, atan, asin, acos,

  // Color
  color,    // Constant color: color(0xff4400) or color('#ff4400')

  // Texture
  texture,  // texture(map, uv())

  // Dynamic values
  uniform,    // uniform(0.5) �?JS-readable/writable
  attribute,  // attribute('aPhase', 'float') �?vertex attribute

  // Material nodes
  MeshStandardNodeMaterial,
  MeshPhysicalNodeMaterial,
  SpriteNodeMaterial,

  // Utility
  Fn,           // Create reusable node functions
  If, Else,     // Conditional (for Compute shaders)
} from 'three/addons/nodes/Nodes.js';
// r168+: import from 'three/tsl'
```

### First TSL Material: Animated Color

```javascript
import { MeshStandardNodeMaterial, timerGlobal, sin, float, color, mix }
  from 'three/addons/nodes/Nodes.js';

const mat = new MeshStandardNodeMaterial();

// t oscillates 0�?�? over time (period ~6.28s)
const t = sin(timerGlobal).mul(0.5).add(0.5);

// Color node: mix between orange-red and blue in time
mat.colorNode = mix(color(0xff4400), color(0x0044ff), t);

// �?No uniform updates needed �?TSL updates automatically each frame
scene.add(new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), mat));
```

### Second TSL Material: Vertex Displacement

```javascript
import {
  MeshStandardNodeMaterial,
  positionLocal, normalLocal, timerGlobal,
  sin, mul, add, uniform, float,
} from 'three/addons/nodes/Nodes.js';

const mat = new MeshStandardNodeMaterial({ metalness: 0.8, roughness: 0.2 });

// Uniforms �?modifiable from JS at runtime
const uAmplitude  = uniform(0.2);
const uFrequency  = uniform(3.0);

// Displacement: position += normal * sin(pos.x * freq + time) * amplitude
const wave = sin(
  positionLocal.x.mul(uFrequency).add(timerGlobal)
).mul(uAmplitude);

mat.positionNode = positionLocal.add(normalLocal.mul(wave));

// Runtime update from JS �?no .uniforms.uAmplitude.value syntax needed
window.addEventListener('mousemove', (e) => {
  uAmplitude.value = (e.clientX / window.innerWidth) * 0.4;
});
```

---

## 3. TSL Advanced �?Custom Node Shaders

### Reusable Fresnel Node

```javascript
import {
  Fn, normalWorld, cameraPosition, positionWorld,
  normalize, dot, sub, clamp, pow, float,
} from 'three/addons/nodes/Nodes.js';

// Encapsulated as reusable function �?use in any material
const fresnel = Fn(([power]) => {
  const viewDir = normalize(sub(cameraPosition, positionWorld));
  return pow(clamp(float(1).sub(dot(normalWorld, viewDir)), 0, 1), power);
});

// Usage
const mat = new MeshStandardNodeMaterial();
mat.colorNode  = mix(color(0x111111), color(0x00ffcc), fresnel(float(3.0)));
mat.opacityNode = fresnel(float(2.0)).mul(0.85).add(0.1);
mat.transparent = true;
mat.depthWrite  = false;
```

### Holographic Material (TSL)

```javascript
import {
  MeshStandardNodeMaterial,
  timerGlobal, sin, step, uv, normalWorld, cameraPosition, positionWorld,
  normalize, dot, sub, clamp, pow, float, vec3, color, mix,
  uniform,
} from 'three/addons/nodes/Nodes.js';

const hologram = new MeshStandardNodeMaterial();

const uHoloColor = uniform(color(0x00ffcc));

// Scanlines: horizontal bands
const scanline = sin(uv().y.mul(200).add(timerGlobal.mul(5))).mul(0.05).add(0.95);

// Flicker: subtle random brightness oscillation
const flicker = sin(timerGlobal.mul(30)).mul(0.015).add(0.985);

// Fresnel rim
const fresnel = pow(
  clamp(float(1).sub(dot(normalWorld, normalize(sub(cameraPosition, positionWorld)))), 0, 1),
  float(2.0)
);

hologram.colorNode  = uHoloColor.mul(scanline).mul(flicker);
hologram.opacityNode = fresnel.mul(0.8).add(0.1);
hologram.transparent = true;
hologram.depthWrite  = false;
hologram.side = THREE.DoubleSide;
```

---

## 4. Compute Shader �?GPU Particle Simulation

> Compute shaders are WebGPU-exclusive. 100,000 particles simulated on the GPU �?zero CPU overhead.

```javascript
import WebGPURenderer from 'three/addons/renderers/webgpu/WebGPURenderer.js';
import {
  StorageInstancedBufferAttribute,
  Fn, instanceIndex, uniform, float, vec3, vec4,
  sin, cos, clamp, storage, compute, mix,
  timerGlobal, If,
} from 'three/addons/nodes/Nodes.js';

const COUNT = 100_000;

// ── GPU Buffers ───────────────────────────────────────────────────
const posBuffer = new StorageInstancedBufferAttribute(COUNT, 4); // x,y,z,pad
const velBuffer = new StorageInstancedBufferAttribute(COUNT, 4); // vx,vy,vz,life

// Initialize on CPU �?then GPU takes over
for (let i = 0; i < COUNT; i++) {
  const angle = Math.random() * Math.PI * 2;
  const r     = Math.sqrt(Math.random()) * 5;
  posBuffer.array[i*4+0] = Math.cos(angle) * r;
  posBuffer.array[i*4+1] = (Math.random() - 0.5) * 0.5;
  posBuffer.array[i*4+2] = Math.sin(angle) * r;
  posBuffer.array[i*4+3] = 1.0;
  const spd = Math.random() * 0.02 + 0.01;
  velBuffer.array[i*4+0] = (Math.random() - 0.5) * spd;
  velBuffer.array[i*4+1] = Math.random() * spd * 2;
  velBuffer.array[i*4+2] = (Math.random() - 0.5) * spd;
}

// ── Compute Shader ────────────────────────────────────────────────
const posNode = storage(posBuffer, 'vec4', COUNT);
const velNode = storage(velBuffer, 'vec4', COUNT);

const uGravity = uniform(-0.001);
const uBound   = uniform(6.0);
const uDelta   = uniform(0.016);

const computeParticles = Fn(() => {
  const pos = posNode.element(instanceIndex);
  const vel = velNode.element(instanceIndex);

  vel.y.addAssign(uGravity);   // Gravity
  pos.addAssign(vel);           // Integrate position

  // Y boundary: reset to top
  If(pos.y.lessThan(uBound.negate()), () => {
    pos.y.assign(uBound);
    vel.y.assign(float(0.01));
  });

  // Horizontal boundary: wrap
  If(pos.x.greaterThan(uBound),         () => { pos.x.assign(uBound.negate()); });
  If(pos.x.lessThan(uBound.negate()),   () => { pos.x.assign(uBound); });
})().compute(COUNT);

// ── Render Particles ──────────────────────────────────────────────
import { SpriteNodeMaterial } from 'three/addons/nodes/Nodes.js';

const spriteMat = new SpriteNodeMaterial({ transparent: true, depthWrite: false,
  blending: THREE.AdditiveBlending });

// Position from GPU buffer directly
spriteMat.positionNode = posNode.element(instanceIndex).xyz;

// Size varies by height
spriteMat.scaleNode = float(0.06).mul(
  clamp(posNode.element(instanceIndex).y.add(uBound).div(uBound.mul(2)), 0.1, 1)
);

// Color varies by speed
spriteMat.colorNode = mix(
  vec3(0.0, 0.5, 1.0),
  vec3(1.0, 0.3, 0.0),
  clamp(velNode.element(instanceIndex).length(), 0, 1)
);

const geo = new THREE.InstancedBufferGeometry();
geo.instanceCount = COUNT;
geo.setIndex([0,1,2,0,2,3]);
geo.setAttribute('position', new THREE.Float32BufferAttribute(
  [-0.5,-0.5,0, 0.5,-0.5,0, 0.5,0.5,0, -0.5,0.5,0], 3));

scene.add(new THREE.Mesh(geo, spriteMat));

// ── Render Loop ───────────────────────────────────────────────────
async function animate() {
  requestAnimationFrame(animate);
  uDelta.value = Math.min(clock.getDelta(), 0.033);
  await renderer.computeAsync(computeParticles); // �?GPU compute before render
  renderer.render(scene, camera);
}
animate();
```

---

## 5. WebGL vs WebGPU Capability Matrix

| Capability | WebGL 2.0 | WebGPU |
|:---|:---:|:---:|
| Compute Shader | �?| �?|
| Storage Buffer (large R/W) | �?| �?|
| GPU particle simulation (100K+) | Difficult | �?Native |
| TSL Node Materials | �?(transpiled) | �?Native |
| Multi-draw indirect | �?| �?|
| Traditional GLSL | �?| WGSL (TSL abstracts it) |
| Browser support (2026) | Universal | Chrome/Edge/Firefox �? Safari partial |
| Mobile support | Universal | Chrome Android �? iOS Safari partial |

---

## 6. Graceful Degradation Strategy

```javascript
// Auto-detect and fall back: WebGPU first, WebGL if unavailable
async function createRenderer(canvas) {
  if (navigator.gpu) {
    try {
      const { default: WebGPURenderer } = await import(
        'three/addons/renderers/webgpu/WebGPURenderer.js'
      );
      const r = new WebGPURenderer({ canvas, antialias: true });
      await r.init();
      console.info('�?WebGPU renderer');
      return { renderer: r, isWebGPU: true };
    } catch (e) {
      console.warn('WebGPU init failed, falling back to WebGL:', e.message);
    }
  }
  const r = new THREE.WebGLRenderer({ canvas, antialias: true });
  console.info('�?WebGL renderer');
  return { renderer: r, isWebGPU: false };
}

// Conditional feature activation
const { renderer, isWebGPU } = await createRenderer(canvas);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputColorSpace = THREE.SRGBColorSpace;

if (isWebGPU) {
  startComputeParticles(renderer);  // GPU simulation
} else {
  startCPUParticles();              // InstancedMesh fallback
}
```
