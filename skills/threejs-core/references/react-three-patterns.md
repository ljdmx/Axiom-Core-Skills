# React Three Fiber (R3F) Patterns

## Canvas Boilerplate
```jsx
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Stats } from '@react-three/drei';
import { Suspense } from 'react';
import * as THREE from 'three';

export default function App() {
  return (
    <Canvas
      camera={{ fov: 60, near: 0.1, far: 100, position: [0, 2, 8] }}
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, outputColorSpace: THREE.SRGBColorSpace }}
      shadows="soft"
    >
      <Suspense fallback={null}>
        <Environment preset="studio" />
        <OrbitControls enableDamping dampingFactor={0.06} />
      </Suspense>
    </Canvas>
  );
}
```

## Zustand State Management (Zero Re-render)
```jsx
import { create } from 'zustand';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';

const useSceneStore = create((set) => ({
  isAnimating: true,
}));

function AnimatedMesh() {
  const meshRef = useRef();
  useFrame((state, delta) => {
    if (!useSceneStore.getState().isAnimating) return;
    meshRef.current.rotation.y += delta * 0.5;
  });
  return <mesh ref={meshRef}><boxGeometry /><meshStandardMaterial /></mesh>;
}
```

## Fallback Mandate
WebGPU/WebGL fails on old mobile devices. Ensure a fallback UI (like an MP4 video or image poster). Include `xr-degradation.tsx` where needed.
