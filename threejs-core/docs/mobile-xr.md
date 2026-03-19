# Mobile Performance & WebXR Reference

## Mobile Performance Checklist

```javascript
// ① Detect device tier and configure accordingly
const isMobile = /Mobi|Android/i.test(navigator.userAgent);
const dpr = Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2);
renderer.setPixelRatio(dpr);

// ② Conditional features based on capability
if (isMobile) {
  renderer.shadowMap.enabled = false;   // No shadows on mobile
  // Use ContactShadows (baked) instead
} else {
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
}

// ③ GPU Tier detection
import { getGPUTier } from 'detect-gpu';
const { tier } = await getGPUTier();
// tier 0: potato, tier 1: low, tier 2: mid, tier 3: high
const quality = ['low', 'low', 'mid', 'high'][tier] || 'mid';
```

## R3F Performance Mode

```jsx
<Canvas
  performance={{ min: 0.5 }}  // Allow dropping to 50% quality to maintain FPS
  dpr={[1, 2]}                // Adaptive DPR between 1× and 2×
  frameloop="demand"          // Only re-render when state changes (great for static scenes)
>
```

## WebXR (AR/VR)

```jsx
import { XR, createXRStore, useXRStore } from '@react-three/xr';

const store = createXRStore();

function App() {
  return (
    <>
      <button onClick={() => store.enterAR()}>Enter AR</button>
      <Canvas>
        <XR store={store}>
          {/* AR content here — placed in real world */}
          <mesh>
            <boxGeometry args={[0.1, 0.1, 0.1]} />
            <meshStandardMaterial color="hotpink" />
          </mesh>
        </XR>
      </Canvas>
    </>
  );
}
```

## Touch / Gesture on Mobile

```javascript
// Pinch-to-zoom
let lastDistance = 0;

renderer.domElement.addEventListener('touchstart', (e) => {
  if (e.touches.length === 2) {
    lastDistance = Math.hypot(
      e.touches[0].clientX - e.touches[1].clientX,
      e.touches[0].clientY - e.touches[1].clientY,
    );
  }
});

renderer.domElement.addEventListener('touchmove', (e) => {
  if (e.touches.length === 2) {
    const dist = Math.hypot(
      e.touches[0].clientX - e.touches[1].clientX,
      e.touches[0].clientY - e.touches[1].clientY,
    );
    const scale = dist / lastDistance;
    camera.position.z = THREE.MathUtils.clamp(camera.position.z / scale, 2, 20);
    lastDistance = dist;
  }
});
```
