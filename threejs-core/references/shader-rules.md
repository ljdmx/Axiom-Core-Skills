# Shader & Lightmap Zenith Architecture

- **Mandate**: Do not generate massive, unmaintainable, 500-line custom GLSL shaders for simple effects.
- **Rules**:
  1. **Node Materials (WebGPU)**: Prefer utilizing Three.js `NodeMaterial` (TSL / Three Shader Language) for composable shaders over raw GLSL strings.
  2. **Includes**: If writing raw GLSL, extensively use `#include <common>`, `#include <fog_pars_vertex>` to hook into the Three.js lighting system rather than re-inventing physics.
- **Lightmap Baking**:
  1. **Zero Real-Time GI**: NEVER attempt to run real-time global illumination or heavy shadow cascades in standard web scenes.
  2. **Baking Pipeline**: Utilize Blender/Cinema4D to bake Lightmaps (AO + Shadows), and load them via `material.lightMap` dynamically in Three.js, achieving photorealism at 120fps on mobile.
