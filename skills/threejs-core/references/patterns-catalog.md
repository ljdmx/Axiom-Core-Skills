# Scene Patterns Catalog

20 production-ready scene patterns with complete code.

## Index

1. [Floating Product Visualizer](#1-floating-product-visualizer)
2. [Interactive Data Globe](#2-interactive-data-globe)
3. [Glass Morphism Cards](#3-glass-morphism-cards)
4. [Neon Grid Floor](#4-neon-grid-floor)
5. [Scroll-Driven Hero](#5-scroll-driven-hero)
6. [Liquid Metal Sphere](#6-liquid-metal-sphere)
7. [Particle Galaxy Spiral](#7-particle-galaxy-spiral)
8. [3D Text with Environment](#8-3d-text-with-environment)

---

## 1. Floating Product Visualizer

Classic e-commerce / landing page product display.

```jsx
import { Canvas } from '@react-three/fiber';
import { useGLTF, Environment, ContactShadows, Float, PresentationControls } from '@react-three/drei';

function ProductScene() {
  const { scene } = useGLTF('/models/product.glb');

  return (
    <Canvas
      camera={{ fov: 45, position: [0, 0, 5] }}
      gl={{ toneMapping: THREE.ACESFilmicToneMapping }}
    >
      {/* Soft white environment */}
      <Environment preset="warehouse" />

      {/* Gentle float animation */}
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
        {/* Drag-to-rotate without full orbit */}
        <PresentationControls
          global
          snap={{ mass: 4, tension: 400 }}
          rotation={[0, 0, 0]}
          polar={[-Math.PI / 4, Math.PI / 4]}
          azimuth={[-Math.PI / 2, Math.PI / 2]}
        >
          <primitive object={scene} />
        </PresentationControls>
      </Float>

      {/* Fake soft floor shadow */}
      <ContactShadows
        position={[0, -1.5, 0]}
        opacity={0.6}
        scale={10}
        blur={2.5}
        far={4}
      />
    </Canvas>
  );
}
```

---

## 2. Interactive Data Globe

Geospatial data visualization on a sphere.

```jsx
import { useRef, useMemo } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';

function DataGlobe({ points = [] }) {
  const sphereRef = useRef();
  const earthTexture = useLoader(TextureLoader, '/textures/earth-blue.jpg');
  const earthNight   = useLoader(TextureLoader, '/textures/earth-night.jpg');

  // Convert lat/lon to 3D coords
  const arcPositions = useMemo(() => {
    return points.map(({ lat, lon }) => {
      const phi   = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);
      return new THREE.Vector3(
        -2 * Math.sin(phi) * Math.cos(theta),
         2 * Math.cos(phi),
         2 * Math.sin(phi) * Math.sin(theta),
      );
    });
  }, [points]);

  useFrame((state, delta) => {
    sphereRef.current.rotation.y += delta * 0.05;
  });

  return (
    <group>
      {/* Earth sphere */}
      <mesh ref={sphereRef}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial map={earthTexture} roughness={0.8} metalness={0.1} />
      </mesh>

      {/* Atmosphere glow */}
      <mesh>
        <sphereGeometry args={[2.05, 32, 32]} />
        <meshBasicMaterial
          color={0x4488ff}
          transparent
          opacity={0.06}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Data points */}
      {arcPositions.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshBasicMaterial color={0x00ffcc} />
        </mesh>
      ))}
    </group>
  );
}
```

---

## 3. Glass Morphism Cards

Frosted glass 3D cards floating in space.

```jsx
import { MeshTransmissionMaterial, RoundedBox } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';

function GlassCard({ position, children }) {
  return (
    <group position={position}>
      {/* Glass panel */}
      <RoundedBox args={[2, 1.2, 0.05]} radius={0.08} smoothness={4}>
        <MeshTransmissionMaterial
          backside
          backsideThickness={0.05}
          thickness={0.1}
          roughness={0.05}
          transmission={1}
          ior={1.4}
          chromaticAberration={0.03}
          anisotropy={0.1}
          distortion={0.1}
          distortionScale={0.1}
          temporalDistortion={0.2}
          color="#c8e0ff"
        />
      </RoundedBox>

      {/* Emissive border frame */}
      <RoundedBox args={[2.02, 1.22, 0.04]} radius={0.085} smoothness={4}>
        <meshStandardMaterial
          color={0x4488ff}
          emissive={0x2244ff}
          emissiveIntensity={0.5}
          transparent
          opacity={0.3}
          side={THREE.BackSide}
        />
      </RoundedBox>

      {children}
    </group>
  );
}

function Scene() {
  return (
    <>
      <GlassCard position={[-2.5, 0, 0]} />
      <GlassCard position={[0, 0, 0]} />
      <GlassCard position={[2.5, 0, 0]} />

      <EffectComposer>
        <Bloom intensity={0.5} luminanceThreshold={0.7} mipmapBlur />
      </EffectComposer>
    </>
  );
}
```

---

## 4. Neon Grid Floor

Retrofuturistic infinite grid floor.

```javascript
// Vanilla Three.js â€?custom shader grid
const gridMaterial = new THREE.ShaderMaterial({
  uniforms: {
    uTime:      { value: 0 },
    uColor1:    { value: new THREE.Color(0x00ffcc) },
    uColor2:    { value: new THREE.Color(0xff0088) },
    uGridScale: { value: 20.0 },
    uLineWidth: { value: 0.03 },
    uFogColor:  { value: new THREE.Color(0x000010) },
    uFogDist:   { value: 40.0 },
  },
  vertexShader: /* glsl */`
    varying vec2 vWorldXZ;
    void main() {
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vWorldXZ = worldPos.xz;
      gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
  `,
  fragmentShader: /* glsl */`
    uniform float uTime;
    uniform vec3 uColor1, uColor2, uFogColor;
    uniform float uGridScale, uLineWidth, uFogDist;
    varying vec2 vWorldXZ;

    void main() {
      vec2 grid = fract(vWorldXZ / uGridScale);
      float lineX = step(1.0 - uLineWidth, grid.x) + step(grid.x, uLineWidth);
      float lineZ = step(1.0 - uLineWidth, grid.y) + step(grid.y, uLineWidth);
      float lines = clamp(lineX + lineZ, 0.0, 1.0);

      // Pulse along Z axis (scroll effect)
      float pulse = sin(vWorldXZ.y * 0.5 - uTime * 2.0) * 0.3 + 0.7;
      vec3 color = mix(uColor1, uColor2, fract(vWorldXZ.y / (uGridScale * 5.0) + uTime * 0.05));

      // Fog
      float dist = length(vWorldXZ);
      float fog = exp(-dist / uFogDist);

      vec3 final = mix(uFogColor, color * pulse, lines * fog);
      gl_FragColor = vec4(final, lines * fog);
    }
  `,
  transparent: true,
  side: THREE.DoubleSide,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
});

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(200, 200),
  gridMaterial,
);
floor.rotation.x = -Math.PI / 2;
scene.add(floor);
```

---

## 5. Scroll-Driven Hero

GSAP ScrollTrigger + camera animation.

```jsx
import { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function ScrollCamera() {
  const { camera } = useThree();

  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#container',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.5,  // Smooth lag
      },
    });

    tl.to(camera.position, { z: 3, y: 5, duration: 1 })
      .to(camera.position, { x: -4, z: 6, duration: 1 }, '+=0')
      .to(camera.rotation, { y: Math.PI * 0.3, duration: 1 }, '<');

    return () => tl.kill();
  }, [camera]);

  return null;
}
```

---

## 6. Liquid Metal Sphere

Animated metallic orb with displacement.

```javascript
const geometry = new THREE.SphereGeometry(1.5, 128, 128); // High poly for displacement

const material = new THREE.ShaderMaterial({
  uniforms: {
    uTime:       { value: 0 },
    uEnvMap:     { value: envMap },
    uMetalness:  { value: 0.95 },
    uRoughness:  { value: 0.05 },
    uDisplacement: { value: 0.3 },
  },
  vertexShader: /* glsl */`
    uniform float uTime;
    uniform float uDisplacement;
    varying vec3 vNormal;
    varying vec3 vPosition;

    // FBM noise for displacement
    float fbm(vec3 p) {
      float v = 0.0, a = 0.5;
      for (int i = 0; i < 5; i++) {
        v += a * sin(p.x + p.y * 1.3 + p.z * 0.7);
        p *= 2.0; a *= 0.5;
      }
      return v;
    }

    void main() {
      vNormal = normal;
      float disp = fbm(position * 2.0 + uTime * 0.3) * uDisplacement;
      vec3 displaced = position + normal * disp;
      vPosition = displaced;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
    }
  `,
  // Fragment: standard PBR approximation with env map
});
```

---

## 7. Particle Galaxy Spiral

```javascript
function createGalaxy(params = {}) {
  const {
    count     = 80_000,
    size      = 0.01,
    radius    = 8,
    branches  = 3,
    spin      = 1.2,
    randomness = 0.3,
    innerColor = '#ff6030',
    outerColor = '#1b3984',
  } = params;

  const positions  = new Float32Array(count * 3);
  const colors     = new Float32Array(count * 3);
  const colorInner = new THREE.Color(innerColor);
  const colorOuter = new THREE.Color(outerColor);
  const mixColor   = new THREE.Color();

  for (let i = 0; i < count; i++) {
    const r      = Math.random() * radius;
    const branch = (i % branches) / branches * Math.PI * 2;
    const spinAngle = r * spin;
    const rand   = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1);

    positions[i*3]   = Math.cos(branch + spinAngle) * r + rand * randomness;
    positions[i*3+1] = rand * 0.3;
    positions[i*3+2] = Math.sin(branch + spinAngle) * r + rand * randomness;

    mixColor.lerpColors(colorInner, colorOuter, r / radius);
    colors[i*3]   = mixColor.r;
    colors[i*3+1] = mixColor.g;
    colors[i*3+2] = mixColor.b;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color',    new THREE.BufferAttribute(colors, 3));

  const mat = new THREE.PointsMaterial({
    size,
    sizeAttenuation: true,
    vertexColors: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  return new THREE.Points(geo, mat);
}
```

---

## 8. 3D Text with Environment

```jsx
import { Text3D, Center, Float, MeshTransmissionMaterial } from '@react-three/drei';

function Hero3DText() {
  return (
    <Float speed={1} rotationIntensity={0.2}>
      <Center>
        <Text3D
          font="/fonts/helvetiker_bold.typeface.json"
          size={1}
          height={0.2}
          curveSegments={32}
          bevelEnabled
          bevelThickness={0.02}
          bevelSize={0.02}
          bevelOffset={0}
          bevelSegments={8}
        >
          HELLO
          <MeshTransmissionMaterial
            backside
            thickness={0.2}
            roughness={0}
            transmission={0.95}
            ior={1.5}
            chromaticAberration={0.05}
            color="#ccddff"
          />
        </Text3D>
      </Center>
    </Float>
  );
}
```
