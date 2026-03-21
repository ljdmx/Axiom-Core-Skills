# React Three Fiber (R3F) Anti-Patterns

This document guards the performance budget and soul integrity of R3F applications by prohibiting severe anti-patterns.

## 1. Avoid State Mutation in `useFrame`
**Anti-Pattern:** Modifying React state (`setState`) inside the `useFrame` loop triggers 60 re-renders per second, destroying performance.
**Solution:** Mutate `ref.current` values directly or use a state manager like Zustand with `.getState()` polling.

## 2. Do Not Mix Vanilla DOM Traversal
**Anti-Pattern:** Using `document.getElementById` inside R3F components.
**Solution:** Always use React Refs and declarative abstractions.

## 3. Avoid Re-Instantiating Materials
**Anti-Pattern:** `new THREE.MeshStandardMaterial()` inside a functional component body.
**Solution:** Use declarative `<meshStandardMaterial />` or memoize with `useMemo`.
