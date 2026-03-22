# Particle Systems Reference

## Table of Contents
1. [THREE.Points —Simple Particle Field](#1-threepoints--simple-particle-field)
2. [InstancedMesh Particles](#2-instancedmesh-particles)
3. [GPU Particles via ShaderMaterial](#3-gpu-particles-via-shadermaterial)
4. [@react-three/drei Sparkles & Stars](#4-react-threedrei-sparkles--stars)
5. [Particle Attractors & Force Fields](#5-particle-attractors--force-fields)

---

## 1. THREE.Points —Simple Particle Field

```javascript
// ── 10,000 floating particles ──────────────────────────────
const COUNT = 10_000;
const positions = new Float32Array(COUNT * 3);
const colors    = new Float32Array(COUNT * 3);
const sizes     = new Float32Array(COUNT);

const color = new THREE.Color();
for (let i = 0; i < COUNT; i++) {
  // Random sphere distribution
  const radius = Math.random() * 20;
  const theta  = Math.random() * Math.PI * 2;
  const phi    = Math.acos(2 * Math.random() - 1);

  positions[i * 3]     = radius * Math.sin(phi) * Math.cos(theta);
  positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
  positions[i * 3 + 2] = radius * Math.cos(phi);

  // Gradient coloring by height
  color.setHSL(0.6 + positions[i * 3 + 1] / 40, 0.8, 0.6);
  colors[i * 3]     = color.r;
  colors[i * 3 + 1] = color.g;
  colors[i * 3 + 2] = color.b;

  sizes[i] = Math.random() * 3 + 1;
}

const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
geometry.setAttribute('color',    new THREE.BufferAttribute(colors, 3));
geometry.setAttribute('size',     new THREE.BufferAttribute(sizes, 1));

const material = new THREE.PointsMaterial({
  size: 0.05,
  vertexColors: true,
  sizeAttenuation: true,   // ★ Perspective size falloff
  transparent: true,
  alphaMap: circleTexture, // Round particles
  depthWrite: false,       // ★ Fixes transparency sorting
  blending: THREE.AdditiveBlending, // Glow effect
});

const particles = new THREE.Points(geometry, material);
scene.add(particles);

// Animate: gentle rotation
function animate() {
  particles.rotation.y += delta * 0.05;
  particles.rotation.x = Math.sin(elapsed * 0.1) * 0.1;
}
```

---

## 2. InstancedMesh Particles

For particles that need 3D meshes (cubes, spheres —not just dots):

```javascript
const COUNT = 500;
const geometry = new THREE.OctahedronGeometry(0.1);
const material = new THREE.MeshStandardMaterial({
  color: 0x88aaff,
  metalness: 0.5,
  roughness: 0.2,
});

const mesh = new THREE.InstancedMesh(geometry, material, COUNT);
mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage); // ★ For animated instances

const dummy    = new THREE.Object3D();
const initials = []; // Store initial state

for (let i = 0; i < COUNT; i++) {
  initials.push({
    position: new THREE.Vector3(
      (Math.random() - 0.5) * 30,
      (Math.random() - 0.5) * 30,
      (Math.random() - 0.5) * 30,
    ),
    speed:  Math.random() * 0.5 + 0.2,
    phase:  Math.random() * Math.PI * 2,
    scale:  Math.random() * 0.5 + 0.5,
  });
}

// Per-instance color
const color = new THREE.Color();
for (let i = 0; i < COUNT; i++) {
  color.setHSL(i / COUNT, 0.7, 0.5);
  mesh.setColorAt(i, color);
}
mesh.instanceColor.needsUpdate = true;

// Animate instances
function update(elapsed) {
  for (let i = 0; i < COUNT; i++) {
    const { position, speed, phase, scale } = initials[i];
    dummy.position.copy(position);
    dummy.position.y += Math.sin(elapsed * speed + phase) * 2;
    dummy.rotation.set(elapsed * speed, elapsed * speed * 0.7, 0);
    dummy.scale.setScalar(scale);
    dummy.updateMatrix();
    mesh.setMatrixAt(i, dummy.matrix);
  }
  mesh.instanceMatrix.needsUpdate = true;
}
```

---

## 3. GPU Particles via ShaderMaterial

For 100K+ particles requiring zero CPU overhead:

```javascript
// ── Encode initial positions as a data texture ─────────────
const COUNT = 100_000;
const data = new Float32Array(COUNT * 4); // RGBA = X, Y, Z, W(life)

for (let i = 0; i < COUNT; i++) {
  data[i * 4 + 0] = (Math.random() - 0.5) * 20; // X
  data[i * 4 + 1] = Math.random() * 10;           // Y (spawn above)
  data[i * 4 + 2] = (Math.random() - 0.5) * 20; // Z
  data[i * 4 + 3] = Math.random();                // Life phase
}

const positionTexture = new THREE.DataTexture(
  data,
  Math.sqrt(COUNT), Math.sqrt(COUNT),
  THREE.RGBAFormat, THREE.FloatType,
);
positionTexture.needsUpdate = true;

// ── Points with custom shader ─────────────────────────────
const indices = new Float32Array(COUNT);
for (let i = 0; i < COUNT; i++) indices[i] = i;

const geometry = new THREE.BufferGeometry();
geometry.setAttribute('aIndex', new THREE.BufferAttribute(indices, 1));

const material = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
    uPositions: { value: positionTexture },
    uTextureSize: { value: Math.sqrt(COUNT) },
  },
  vertexShader: /* glsl */`
    uniform sampler2D uPositions;
    uniform float uTextureSize;
    uniform float uTime;
    attribute float aIndex;

    void main() {
      vec2 uv = vec2(
        mod(aIndex, uTextureSize) / uTextureSize,
        floor(aIndex / uTextureSize) / uTextureSize
      );
      vec4 pos = texture2D(uPositions, uv);

      // Animate: falling with wrap
      pos.y -= mod(uTime * (0.5 + pos.w) + pos.w * 10.0, 12.0);

      vec4 mvPos = modelViewMatrix * vec4(pos.xyz, 1.0);
      gl_PointSize = 2.0 * (300.0 / -mvPos.z);
      gl_Position = projectionMatrix * mvPos;
    }
  `,
  fragmentShader: /* glsl */`
    void main() {
      // Circular particle
      float d = length(gl_PointCoord - 0.5);
      if (d > 0.5) discard;
      gl_FragColor = vec4(0.4, 0.7, 1.0, 1.0 - d * 2.0);
    }
  `,
  transparent: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
});

scene.add(new THREE.Points(geometry, material));
```

---

## 4. @react-three/drei Sparkles & Stars

```jsx
import { Stars, Sparkles } from '@react-three/drei';

// Stars: Deep space background
<Stars
  radius={100}
  depth={50}
  count={5000}
  factor={4}
  saturation={0.3}
  fade
  speed={0.5}
/>

// Sparkles: Magical floating particles
<Sparkles
  count={100}
  scale={[5, 5, 5]}
  size={2}
  speed={0.4}
  color="#88aaff"
  opacity={0.8}
  noise={0.5}
/>
```

---

## 5. Particle Attractors & Force Fields

```javascript
// Simple CPU-based attractor (works for < 5000 particles)
const particles = [];
const attractor = new THREE.Vector3(0, 0, 0);

// Initialize
for (let i = 0; i < 2000; i++) {
  particles.push({
    position: new THREE.Vector3().randomDirection().multiplyScalar(5),
    velocity: new THREE.Vector3().randomDirection().multiplyScalar(0.02),
  });
}

// Update per frame
const force = new THREE.Vector3();
function updateParticles(delta) {
  for (const p of particles) {
    // Attractor gravity
    force.subVectors(attractor, p.position).normalize().multiplyScalar(0.001);
    p.velocity.add(force);
    p.velocity.multiplyScalar(0.99); // Drag
    p.position.add(p.velocity);

    // Orbit perturbation
    p.velocity.x += Math.sin(p.position.y * 2) * 0.0005;
    p.velocity.z += Math.cos(p.position.x * 2) * 0.0005;
  }

  // Update geometry attribute
  for (let i = 0; i < particles.length; i++) {
    positions[i * 3]     = particles[i].position.x;
    positions[i * 3 + 1] = particles[i].position.y;
    positions[i * 3 + 2] = particles[i].position.z;
  }
  geometry.attributes.position.needsUpdate = true;
}
```
