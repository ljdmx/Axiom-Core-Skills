# Three.js Core Boilerplates

This document contains standardized boilerplates previously located in `SKILL.md`. Load these on-demand to save context tokens.

## 1. Scene Setup & Hierarchy

### 1.1 Vanilla Three.js — Production Boilerplate
```javascript
import * as THREE from 'three';

// ── Renderer ──────────────────────────────────────────────────────
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
  powerPreference: 'high-performance',
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // ★ Cap at 2× — never raw DPR
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping; // ★ Always ACES — LinearToneMapping is flat
renderer.toneMappingExposure = 1.0;
renderer.outputColorSpace = THREE.SRGBColorSpace;   // ★ Mandatory r152+
document.body.appendChild(renderer.domElement);

// ── Scene ─────────────────────────────────────────────────────────
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a0f); // Near-black with subtle hue bias — never pure black
scene.fog = new THREE.FogExp2(0x0a0a0f, 0.025); // Fog adds depth and atmosphere

// ── Camera ────────────────────────────────────────────────────────
const camera = new THREE.PerspectiveCamera(
  60,                                       // 45–75 range; 60 is natural; see visual-language.md §4
  window.innerWidth / window.innerHeight,
  0.1,                                      // Near: as large as workable
  100,                                      // Far: as small as workable (depth precision)
);
camera.position.set(0, 2, 8);

// ── Resize ────────────────────────────────────────────────────────
const onResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
};
window.addEventListener('resize', onResize);

// ── Render Loop ───────────────────────────────────────────────────
const clock = new THREE.Clock();
// Pre-allocate reusable objects — NEVER new inside animate()
const _tmpVec = new THREE.Vector3();
const _tmpColor = new THREE.Color();

const animate = () => {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();       // ★ Always delta-time — never fixed increment
  const elapsed = clock.getElapsedTime();
  controls.update();                    // Required if damping enabled
  // scene updates here...
  renderer.render(scene, camera);
};
animate();
```

### 1.2 Scene Hierarchy
```
Scene
├── Lights (single dominant key + minimal fill/rim)
├── Environment (HDR env map — mandatory for PBR)
├── Atmosphere (fog volume, background gradient)
├── Objects Group
│   ├── Hero (main subject — highest material fidelity)
│   ├── Supporting Cast (mid fidelity)
│   └── Atmospheric Elements (particles, ground, skybox)
└── PostProcessing (EffectComposer — always last)
```

## 2. Geometry & PBR Materials

### 2.1 MeshStandardMaterial — Defaults
```javascript
const heroMat = new THREE.MeshPhysicalMaterial({
  metalness: 0.9, roughness: 0.05,
  clearcoat: 1.0, clearcoatRoughness: 0.1,
  envMapIntensity: 2.0,
});
const supportMat = new THREE.MeshStandardMaterial({
  metalness: 0.3, roughness: 0.4,
  envMapIntensity: 0.8,
});
const glassMat = new THREE.MeshPhysicalMaterial({
  transmission: 1.0, thickness: 0.5, ior: 1.5,
  roughness: 0.0, metalness: 0,
  transparent: true,
});
```

### 2.2 Geometry — Segment Budget
```javascript
const sphere = new THREE.SphereGeometry(1, 32, 32);
const cylinder = new THREE.CylinderGeometry(0.5, 0.5, 2, 32);
const torus = new THREE.TorusGeometry(1, 0.3, 16, 64);

// Custom BufferGeometry
const geo = new THREE.BufferGeometry();
const positions = new Float32Array([0,0,0, 1,0,0, 0.5,1,0]);
geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
geo.computeVertexNormals();

// Cleanup
geo.dispose();
material.dispose();
```

## 3. Lighting System

### 3.1 Dominant Key Light Setup
```javascript
const keyLight = new THREE.DirectionalLight(0xfff4e0, 4.0);
keyLight.position.set(-5, 8, 3);
keyLight.castShadow = true;
keyLight.shadow.mapSize.set(2048, 2048);
keyLight.shadow.camera.near = 0.1;
keyLight.shadow.camera.far  = 50;
keyLight.shadow.bias = -0.0005;
keyLight.shadow.normalBias = 0.02;
scene.add(keyLight);

const fillLight = new THREE.DirectionalLight(0xb0c8ff, 0.3);
fillLight.position.set(5, 2, -3);
scene.add(fillLight);

const rimLight = new THREE.DirectionalLight(0xffffff, 0.8);
rimLight.position.set(0, 4, -8);
scene.add(rimLight);

const ambient = new THREE.AmbientLight(0xffffff, 0.05);
scene.add(ambient);
```

### 3.2 Environment Map
```javascript
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
new RGBELoader().load('/hdri/studio.hdr', (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = texture;
});
```

## 4. Animation & Soul Microinteractions

### 4.1 Delta-Time & Soul Easing
```javascript
const clock = new THREE.Clock();
function animate() {
  const delta = clock.getDelta();
  const elapsed = clock.getElapsedTime();
  mesh.rotation.y += delta * Math.PI * 0.5;
  mesh.position.y = Math.sin(elapsed * Math.PI * 0.5) * 0.08;
  renderer.render(scene, camera);
}

// GSAP Soul Sequence
const entryTl = gsap.timeline({ delay: 0.3 });
entryTl
  .to(scene.fog, { density: 0.015, duration: 1.5, ease: 'power2.out' }, 0)
  .from(keyLight, { intensity: 0, duration: 2.0, ease: 'power2.inOut' }, 0.2)
  .from(heroMesh.position, { y: -3, duration: 1.8, ease: 'power3.out' }, 0.4)
  .from(camera.position, { z: camera.position.z + 2, duration: 2.5,
    ease: 'power2.inOut', onUpdate: () => camera.lookAt(0, 0, 0) }, 0);
```

## 5. Camera & Search Controls

### 5.1 OrbitControls
```javascript
controls.enableDamping = true;
controls.dampingFactor = 0.06;
controls.minDistance = 2;
controls.maxDistance = 20;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.4;
```

### 5.2 Scroll-Driven Path
```javascript
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: '#container',
    start: 'top top',
    end: 'bottom bottom',
    scrub: 1.5,
  }
});
cameraPath.forEach((kf, i) => {
  if (i === 0) return;
  tl.to(camera.position, { ...kf.pos, duration: 1,
    onUpdate: () => camera.lookAt(kf.lookAt) });
});
```

## 6. Postprocessing Stacks

### 6.1 EffectComposer (Vanilla)
```javascript
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
composer.addPass(new UnrealBloomPass(new THREE.Vector2(w, h), 0.6, 0.4, 0.85));
composer.addPass(new OutputPass());
```

### 6.2 @react-three/postprocessing (R3F)
```jsx
<EffectComposer>
  <Bloom intensity={0.8} luminanceThreshold={0.85} mipmapBlur />
  <DepthOfField focusDistance={0.01} focalLength={0.02} bokehScale={3} />
  <Vignette darkness={0.3} offset={0.35} />
</EffectComposer>
```

## 9. Asset Loading - KTX2/GLTF
```javascript
const ktx2Loader = new KTX2Loader().setTranscoderPath('/basis/').detectSupport(renderer);
const gltfLoader = new GLTFLoader().setKTX2Loader(ktx2Loader);
gltfLoader.load('/models/scene.glb', (gltf) => {
  scene.add(gltf.scene);
});
```
