# Diagnostics & Troubleshooting
## 5-Step Performance Diagnosis Â· 30-Second Error Triage Â· GC Defense Â· Version Migration

> "90% of Three.js development time is spent on five problem types.
> This guide resolves all of them in under 30 seconds."

---

## Table of Contents

1. [5-Step Performance Diagnosis](#1-5-step-performance-diagnosis)
2. [GC Spike Defense â€?Object Pool Pattern](#2-gc-spike-defense--object-pool-pattern)
3. [30-Second Error Triage](#3-30-second-error-triage)
4. [Version Migration Breaking Change Map](#4-version-migration-breaking-change-map)
5. [Memory Leak Detection & Cleanup](#5-memory-leak-detection--cleanup)

---

## 1. 5-Step Performance Diagnosis

Execute in order â€?stop at the step that reveals the root cause:

### Step 1: renderer.info â€?Instant Overview

```javascript
function printBudget() {
  const { render, memory } = renderer.info;
  console.table({
    'Draw Calls':  render.calls,       // Target: mobile <50, desktop <200
    'Triangles':   render.triangles,   // Target: mobile <100K, desktop <500K
    'Textures':    memory.textures,    // High = GPU memory pressure â†?KTX2
    'Geometries':  memory.geometries,  // High = not disposing old geometry
    'Programs':    renderer.info.programs?.length, // High = too many ShaderMaterials
  });
}
setInterval(printBudget, 2000); // Print every 2 seconds

// â˜?Interpretation guide:
// Draw Calls high â†?merge / instance / batch
// Textures high   â†?use KTX2 compression, load on demand, dispose old
// Programs high   â†?use uniforms/defines instead of separate ShaderMaterials
```

### Step 2: Stats.js â€?Live FPS + Memory

```javascript
import Stats from 'stats.js'; // npm install stats.js

const stats = new Stats();
stats.showPanel(0); // 0=FPS, 1=ms/frame, 2=MB memory
document.body.appendChild(stats.dom);

function animate() {
  stats.begin();
  // ... scene updates ...
  renderer.render(scene, camera);
  stats.end();
}

// R3F: use drei Stats
import { Stats } from '@react-three/drei';
<Stats showPanel={0} />
```

### Step 3: Chrome DevTools Performance â€?Frame Time Distribution

```
Steps:
1. DevTools â†?Performance panel â†?Record (3â€? seconds of scene)
2. Stop â†?examine Flame Chart

Key areas:
â”œâ”€â”€ Main Thread (yellow JS) â†?JS frame time
â”?  â”œâ”€â”€ > 8ms â†?CPU bottleneck (optimize logic)
â”?  â””â”€â”€ Find tallest call stack â†?that's your target function
â”œâ”€â”€ GPU (green) â†?render time
â”?  â”œâ”€â”€ > 10ms â†?GPU bottleneck (reduce draw calls / simplify shaders)
â”?  â””â”€â”€ Short GPU but low FPS â†?CPU bottleneck or GC
â””â”€â”€ GC Events (red vertical lines) â†?allocating objects every frame
    â””â”€â”€ Frequent â†?go to Â§2 GC Defense immediately

Frame budget:
  60fps = 16.67ms total
  JS: < 6ms
  GPU: < 8ms
  Browser compositor: ~2ms
```

### Step 4: Spector.js â€?GPU-Level Draw Call Audit

```
Install: Chrome extension "Spector.js"

Steps:
1. Open page â†?click extension â†?"Capture frame"
2. Browse each draw call:
   - Shader program being used
   - Textures bound
   - Triangle count
   - State changes (expensive)

What to look for:
â–?Same geometry drawn many times â†?merge or InstancedMesh
â–?Same texture bound/unbound repeatedly â†?texture atlas
â–?Many shader program switches â†?consolidate materials
â–?One draw call taking much longer than others â†?that geometry is too dense
```

### Step 5: renderer.info.programs Audit

```javascript
// Too many shader programs = GPU compilation overhead + state switch cost
renderer.info.programs?.forEach((program, i) => {
  console.log(`Program ${i}:`, program.name || 'unnamed', program.usedTimes);
});

// â˜?Consolidation strategy:
// Instead of: 50 different ShaderMaterials with slight variations
// Use: 1 ShaderMaterial with #defines for variants

const material = new THREE.ShaderMaterial({
  defines: {
    USE_FRESNEL: true,     // Toggle via material.defines
    COLOR_VARIANT: 2,      // Variant selector
  },
  // GLSL: #ifdef USE_FRESNEL ... #endif
});
// Changing defines â†?needsUpdate = true (creates new program â€?use sparingly)
material.defines.COLOR_VARIANT = 3;
material.needsUpdate = true;
```

---

## 2. GC Spike Defense â€?Object Pool Pattern

> **Three.js's most hidden performance killer is not draw calls â€?it's GC pause spikes
> from allocating objects every frame. `new THREE.Vector3()` inside `animate()` = crime.**

### Identifying GC Problems

```javascript
// These patterns inside animate() / useFrame() are toxic
function animate() {
  const dir = new THREE.Vector3(1, 0, 0);          // new every frame â†?GC
  const intersects = raycaster.intersectObjects(objs); // new array every frame â†?GC
  const mat = new THREE.Matrix4();                  // new every frame â†?GC
  const color = new THREE.Color(0xff0000);          // new every frame â†?GC
}

// Chrome DevTools will show frequent red GC events in the timeline
```

### Pre-Allocated Object Pool

```javascript
// Declare ALL reusable objects OUTSIDE animate()
const _v3a   = new THREE.Vector3();
const _v3b   = new THREE.Vector3();
const _v3c   = new THREE.Vector3();
const _quat  = new THREE.Quaternion();
const _mat4  = new THREE.Matrix4();
const _color = new THREE.Color();
const _box   = new THREE.Box3();
const _sphere= new THREE.Sphere();
const _ray   = new THREE.Ray();
const _euler = new THREE.Euler();

// Inside animate() â€?always .set() / .copy() â€?never new
function animate() {
  _v3a.set(1, 0, 0).applyQuaternion(mesh.quaternion);   // âœ?Zero allocation
  _color.setHSL(elapsed % 1.0, 0.8, 0.5);               // âœ?Zero allocation
  _box.setFromObject(mesh);                              // âœ?Zero allocation
  _v3b.copy(mesh.position).add(_v3a);                    // âœ?Zero allocation
}
```

### Vector3 Pool for Dynamic Allocation

```javascript
class Vector3Pool {
  constructor(size = 128) {
    this._pool = Array.from({ length: size }, () => new THREE.Vector3());
    this._index = 0;
  }
  // Caller MUST immediately call .set() on the returned vector
  get() { return this._pool[this._index++ % this._pool.length]; }
  reset() { this._index = 0; } // Call at end of each frame if needed
}

const vecPool = new Vector3Pool(256);
function animate() {
  const pos = vecPool.get().copy(mesh.position);
  const dir = vecPool.get().set(0, 1, 0);
}
```

### Raycaster â€?The Hidden GC Source

```javascript
// intersectObjects() creates a new array every call
// â?Anti-pattern: every frame
function animate() {
  const hits = raycaster.intersectObjects(meshes); // new [] every 16ms
}

// âœ?Throttled: 20fps is sufficient for hover detection
let lastRaycastTime = 0;
function animate() {
  const now = performance.now();
  if (now - lastRaycastTime > 50) { // 50ms = 20fps
    lastRaycastTime = now;
    raycaster.setFromCamera(mouse, camera);
    const hits = raycaster.intersectObjects(meshes, true);
    handleHover(hits);
    // hits[] is garbage-collected next tick â€?acceptable at 20fps
  }
}

// âœ?Even better: only raycast on mouse move, not every frame
window.addEventListener('mousemove', (e) => {
  mouse.set(
    (e.clientX / window.innerWidth)  * 2 - 1,
    -(e.clientY / window.innerHeight) * 2 + 1,
  );
  needsRaycast = true; // Flag â€?process in animate() once per mouse event
}, { passive: true });
```

---

## 3. 30-Second Error Triage

### â?Object Is Black / Invisible

```
Decision tree (check in order, stop at fix):

1. material.color = #000000?
   â†?Set to 0xffffff and check

2. Any lights in the scene?
   â†?Add: scene.add(new THREE.AmbientLight(0xffffff, 1))
   â†?If it appears: lighting was missing
   â†?Still black: continue

3. Swap to MeshBasicMaterial (ignores lighting)
   â†?If it appears: lighting/shadow configuration problem
   â†?Still invisible: geometry or position problem

4. Near/far clipping plane issue?
   â†?Temporarily: camera.near=0.001, camera.far=10000, camera.updateProjectionMatrix()
   â†?If appears: adjust near/far to fit scene

5. Object behind camera?
   â†?console.log(mesh.position, camera.position, camera.rotation)

6. outputColorSpace missing?
   â†?renderer.outputColorSpace = THREE.SRGBColorSpace
```

### â?Colors Look Wrong (Washed Out / Oversaturated / Yellow Tint)

```javascript
// Most common cause: incomplete color space chain
// Check all three lines exist AND are set correctly:
renderer.outputColorSpace = THREE.SRGBColorSpace;     // â‘?Output space
renderer.toneMapping = THREE.ACESFilmicToneMapping;   // â‘?Tone mapping
renderer.toneMappingExposure = 1.0;                   // â‘?Exposure

// Texture color issues:
// Color/albedo textures â†?MUST have SRGBColorSpace
colorTexture.colorSpace = THREE.SRGBColorSpace;

// Non-color textures (normal, roughness, metalness, AO) â†?MUST use linear
normalMap.colorSpace = THREE.LinearSRGBColorSpace;
roughnessMap.colorSpace = THREE.LinearSRGBColorSpace;

// HDR environment wrong? Check:
hdrTexture.mapping = THREE.EquirectangularReflectionMapping; // Required!
```

### â?Model Not Showing / Wrong Position / Wrong Scale

```javascript
// Diagnosis 1: Blender Z-up vs Three.js Y-up
model.rotation.x = -Math.PI / 2; // Common Blender export fix

// Diagnosis 2: Scale problem (Blender 1m = Three.js 1 unit, but export can add 100Ã—)
const box = new THREE.Box3().setFromObject(model);
const size = new THREE.Vector3();
box.getSize(size);
console.log('Model size:', size); // If hundreds or thousands â†?scale down

const targetSize = 2;
model.scale.setScalar(targetSize / Math.max(size.x, size.y, size.z));

// Diagnosis 3: Off-center pivot point from Blender
const center = new THREE.Vector3();
box.getCenter(center);
model.position.sub(center); // Move pivot to world origin

// Debug visualization
scene.add(new THREE.AxesHelper(5));
scene.add(new THREE.BoxHelper(model, 0xffff00));
```

### â?Shadows Missing

```javascript
// Complete shadow checklist â€?every single item required
renderer.shadowMap.enabled = true;               // â‘?Renderer flag
renderer.shadowMap.type = THREE.PCFSoftShadowMap;// â‘?Shadow algorithm
light.castShadow = true;                         // â‘?Light casts
mesh.castShadow = true;                          // â‘?Object casts
ground.receiveShadow = true;                     // â‘?Ground receives
light.shadow.mapSize.set(1024, 1024);            // â‘?Shadow map size
light.shadow.bias = -0.0005;                     // â‘?Bias (shadow acne)
light.shadow.normalBias = 0.02;                  // â‘?Normal bias (thin objects)

// â‘?Shadow camera frustum must cover the entire scene (DirectionalLight only)
const sc = light.shadow.camera;
sc.near = 0.1;  sc.far = 50;
sc.left = sc.bottom = -10;
sc.right = sc.top   =  10;
sc.updateProjectionMatrix();

// Debug: visualize the shadow camera frustum
scene.add(new THREE.CameraHelper(light.shadow.camera));
```

### â?Transparent Objects Z-Fighting / Wrong Order

```javascript
// WebGL depth sort only sorts by Object3D center â€?fragments can still overlap

// Solution A: Additive blending (particles, glows â€?no sorting needed)
material.transparent = true;
material.depthWrite  = false;
material.blending    = THREE.AdditiveBlending;

// Solution B: Alpha test (vegetation, decals â€?no transparency sorting)
material.alphaTest = 0.5; // Pixels below 50% alpha are discarded
material.side = THREE.DoubleSide;
// Advantage: writes to depth buffer â†?stable, no sorting artifacts

// Solution C: renderOrder (manual draw order)
opaqueObjects.renderOrder = 0;
transparentObjects.renderOrder = 1;
// Objects with higher renderOrder draw later (on top)

// Solution D: depthWrite=false + sort (semi-transparent layered objects)
material.transparent = true;
material.depthWrite  = false; // Don't occlude other transparent objects
// Three.js auto-sorts transparent objects by distance
```

### â?OrbitControls Damping Not Working

```javascript
// Most common: forgot controls.update() in render loop
controls.enableDamping = true;
controls.dampingFactor = 0.06;

function animate() {
  controls.update(); // â˜?REQUIRED every frame for damping to function
  renderer.render(scene, camera);
}
```

---

## 4. Version Migration Breaking Change Map

| Version Range | Breaking Change | Old | New |
|:---|:---|:---|:---|
| r125 â†?r126 | Color space API | `.outputEncoding = sRGBEncoding` | `.outputColorSpace = SRGBColorSpace` |
| r125 â†?r126 | Texture encoding | `texture.encoding = sRGBEncoding` | `texture.colorSpace = SRGBColorSpace` |
| r139 â†?r140 | Module paths | `three/examples/jsm/...` | `three/addons/...` |
| r150 â†?r152 | Encoding deprecation | `sRGBEncoding` removed | `SRGBColorSpace` |
| r160 â†?r163 | WebGPU stable | Experimental only | Production ready |
| r165+ | TSL Shading Language | `ShaderMaterial` only | `NodeMaterial` + TSL recommended |

### Version-Safe Adapter

```javascript
import * as THREE from 'three';
const rev = parseInt(THREE.REVISION);

// Color space compatibility (r125 before vs r152+)
function setOutputColorSpace(renderer, value = 'srgb') {
  if (rev >= 152) {
    renderer.outputColorSpace = THREE.SRGBColorSpace;
  } else {
    renderer.outputEncoding = THREE.sRGBEncoding;
  }
}

function setTextureColorSpace(texture, isSRGB = true) {
  if (rev >= 152) {
    texture.colorSpace = isSRGB ? THREE.SRGBColorSpace : THREE.LinearSRGBColorSpace;
  } else {
    texture.encoding = isSRGB ? THREE.sRGBEncoding : THREE.LinearEncoding;
  }
}
```

### Lock Your Versions

```json
{
  "dependencies": {
    "three":                       "0.168.0",
    "@react-three/fiber":          "8.17.0",
    "@react-three/drei":           "9.114.0",
    "@react-three/postprocessing": "2.16.2",
    "@react-three/rapier":         "1.4.0"
  }
}
```
> Use exact versions (no `^` or `~`). Three.js has breaking changes in every minor version.
> Check [migration guide](https://github.com/mrdoob/three.js/wiki/Migration-Guide) before any upgrade.

---

## 5. Memory Leak Detection & Cleanup

### Identifying Leaks â€?Chrome Memory Profiler

```
Steps:
1. DevTools â†?Memory â†?"Take heap snapshot"
2. Perform scene operations (navigate, load models, etc.)
3. Take another snapshot
4. Select "Comparison" view â†?sort by Delta column

Warning signs:
â–?WebGLTexture count growing â†?textures not disposed
â–?Float32Array growing         â†?BufferGeometry not disposed
â–?WebGLProgram growing        â†?ShaderMaterials created repeatedly
â–?Object3D growing            â†?objects added to scene but never removed
```

### Complete Disposal Protocol

```javascript
// Dispose a single mesh â€?handles all sub-resources
function disposeMesh(mesh) {
  // Geometry
  if (mesh.geometry) mesh.geometry.dispose();

  // Material(s) â€?handle both single and array
  const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
  mats.forEach(mat => {
    const texProps = [
      'map', 'normalMap', 'roughnessMap', 'metalnessMap', 'emissiveMap',
      'aoMap', 'displacementMap', 'alphaMap', 'lightMap', 'envMap',
      'clearcoatMap', 'clearcoatRoughnessMap', 'transmissionMap',
      'thicknessMap', 'sheenColorMap',
    ];
    texProps.forEach(prop => {
      if (mat[prop]) { mat[prop].dispose(); mat[prop] = null; }
    });
    mat.dispose();
  });

  if (mesh.parent) mesh.parent.remove(mesh);
}

// Dispose entire scene
function disposeScene(scene) {
  scene.traverse((obj) => {
    if (obj.isMesh) disposeMesh(obj);
  });
}

// Full renderer cleanup
function fullCleanup(renderer, scene) {
  disposeScene(scene);
  renderer.renderLists.dispose();
  renderer.dispose();
  const gl = renderer.getContext();
  const ext = gl.getExtension('WEBGL_lose_context');
  if (ext) ext.loseContext();
}

// R3F component cleanup
import { useEffect } from 'react';
function MeshWithCleanup() {
  const ref = useRef();
  useEffect(() => {
    return () => {
      if (ref.current) disposeMesh(ref.current);
    };
  }, []);
  return <mesh ref={ref}>...</mesh>;
}

// R3F useLoader cache management
import { useLoader } from '@react-three/fiber';
// Clear specific asset from cache
useLoader.clear(GLTFLoader, '/models/scene.glb');
// Clear all cached assets
useLoader.resetLoaders();
```
