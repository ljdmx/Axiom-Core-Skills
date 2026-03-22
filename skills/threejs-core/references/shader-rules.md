# Shader & Lightmap Zenith Architecture

- **Mandate**: Do not generate massive, unmaintainable, 500-line custom GLSL shaders for simple effects.
- **Rules**:
  1. **Node Materials (WebGPU)**: Prefer utilizing Three.js `NodeMaterial` (TSL / Three Shader Language) for composable shaders over raw GLSL strings.
  2. **Includes**: If writing raw GLSL, extensively use `#include <common>`, `#include <fog_pars_vertex>` to hook into the Three.js lighting system rather than re-inventing physics.
- **Lightmap Baking**:
  1. **Zero Real-Time GI**: NEVER attempt to run real-time global illumination or heavy shadow cascades in standard web scenes.
  2. **Baking Pipeline**: Utilize Blender/Cinema4D to bake Lightmaps (AO + Shadows), and load them via `material.lightMap` dynamically in Three.js, achieving photorealism at 120fps on mobile.

## World-Class PBR Shading & Ambient Occlusion
- **Mandate**: Generic `MeshStandardMaterial` without maps is unacceptable for hero assets. The AI MUST enforce PBR (Physically Based Rendering) realism.
- **Micro-Facet Roughness Attenuation**: Bare geometry surfaces look plastic. AI MUST apply a texture-based roughness map (`roughnessMap`) or calculate micro-facet disruption in the shader. Roughness cannot be uniform (`0.5`); it must contain imperfections.
- **AO Multi-Layering**: Relying purely on SSAO post-processing is computationally wasteful. AI MUST calculate Ambient Occlusion via UV2 mapping (`aoMap`) with an `aoMapIntensity` of at least `1.0`, darkening the diffuse channel procedurally in crevices to grant immense depth.

### Vanilla GLSL Boilerplate Model
```javascript
const material = new THREE.ShaderMaterial({
  uniforms: {
    uTime:       { value: 0 },
    uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    uColor:      { value: new THREE.Color(0x4488ff) },
  },
  vertexShader: /* glsl */`
    uniform float uTime;
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;

    void main() {
      vUv      = uv;
      vNormal  = normalize(normalMatrix * normal);
      vPosition = (modelMatrix * vec4(position, 1.0)).xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */`
    uniform float uTime;
    uniform vec3 uColor;
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;

    void main() {
      vec3 viewDir = normalize(cameraPosition - vPosition);
      float fresnel = pow(1.0 - dot(vNormal, viewDir), 3.0);
      vec3 color = mix(uColor, vec3(1.0), fresnel * 0.5);
      gl_FragColor = vec4(color, 1.0);
    }
  `,
});
```
