# Physics Integration Reference

## @react-three/rapier (Recommended)

Rapier is the best physics library for R3F — fast (WASM), deterministic, feature-complete.

```bash
npm install @react-three/rapier
```

### Basic Setup

```jsx
import { Physics, RigidBody, CuboidCollider, BallCollider } from '@react-three/rapier';

function PhysicsScene() {
  return (
    <Physics
      gravity={[0, -9.81, 0]}
      debug={process.env.NODE_ENV === 'development'}
    >
      {/* Static ground */}
      <RigidBody type="fixed">
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial color="gray" />
        </mesh>
      </RigidBody>

      {/* Dynamic falling sphere */}
      <RigidBody
        position={[0, 5, 0]}
        restitution={0.8}  // Bounciness
        friction={0.5}
      >
        <mesh castShadow>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial color="hotpink" />
        </mesh>
      </RigidBody>

      {/* Kinematic (animated, collides but not affected by gravity) */}
      <RigidBody type="kinematicPosition" ref={platformRef}>
        <mesh>
          <boxGeometry args={[3, 0.2, 3]} />
          <meshStandardMaterial color="royalblue" />
        </mesh>
      </RigidBody>
    </Physics>
  );
}
```

### useRapier — Impulse & Forces

```jsx
import { RigidBody, useRapier } from '@react-three/rapier';
import { useRef } from 'react';

function PhysicsBall() {
  const body = useRef();

  const throwBall = () => {
    // Apply impulse (one-time force)
    body.current.applyImpulse({ x: 0, y: 5, z: -10 }, true);
    // Apply torque impulse (spin)
    body.current.applyTorqueImpulse({ x: 0, y: 0.5, z: 0 }, true);
  };

  return (
    <RigidBody ref={body} position={[0, 2, 5]}>
      <mesh onClick={throwBall}>
        <sphereGeometry args={[0.3]} />
        <meshStandardMaterial color="orange" />
      </mesh>
    </RigidBody>
  );
}
```

### Collision Events

```jsx
<RigidBody
  onCollisionEnter={({ other }) => {
    console.log('Hit:', other.rigidBodyObject?.name);
    // Trigger sound, particle burst, etc.
  }}
  onCollisionExit={() => { /* ... */ }}
  onSleep={() => { /* Body came to rest */ }}
>
```

### Character Controller (Game-ready)

```jsx
import { useCharacterController } from '@react-three/rapier';

function Player() {
  const characterRef = useRef();
  const { controller } = useCharacterController({
    maxSlopeClimbAngle: (45 * Math.PI) / 180,
    minSlopeSlideAngle: (30 * Math.PI) / 180,
    applyImpulsesToDynamicBodies: true,
    snapToGroundDistance: 0.1,
  });

  useFrame((_, delta) => {
    if (!characterRef.current) return;

    const movement = {
      x: inputLeft ? -3 * delta : inputRight ? 3 * delta : 0,
      y: grounded ? 0 : -9.81 * delta,  // Gravity
      z: inputForward ? -3 * delta : inputBack ? 3 * delta : 0,
    };

    controller.computeColliderMovement(characterRef.current, movement);
    const corrected = controller.computedMovement();
    // Apply corrected movement to RigidBody
  });
}
```
