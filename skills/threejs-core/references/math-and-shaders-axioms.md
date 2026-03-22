# 3D Math & Shaders Axioms

## Mandate
Shaders and advanced 3D math logic MUST be strictly decoupled from standard React/Vue UI components. This isolation prevents context leakage and ensures frontend-core rules do not conflict with WebGL rendering requirements.

## Rules
1. **GLSL Purity**: Write custom shaders in `.glsl`, `.frag`, or `.vert` files (or isolated strictly-typed TypeScript modules). NEVER inline massive raw shader strings within high-level UI component files.
2. **Math Precision**: Always use Three.js native math classes (`Vector3`, `Matrix4`, `Quaternion`) for transformations instead of mutating raw arrays manually, UNLESS explicitly optimizing a high-performance `BufferAttribute` loop.
3. **Memory Management**: All instanced `BufferGeometry` and `ShaderMaterial` instances MUST be disposed of via `.dispose()` during the React `useEffect` cleanup phase or Vue `beforeUnmount` lifecycle to prevent catastrophic VRAM leaks.
