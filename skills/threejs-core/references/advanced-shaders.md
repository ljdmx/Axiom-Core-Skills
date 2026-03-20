# Advanced GLSL Shaders Reference

## Table of Contents
1. [Noise Functions](#1-noise-functions)
2. [Fresnel & Rim Lighting](#2-fresnel--rim-lighting)
3. [SDF Raymarching](#3-sdf-raymarching)
4. [Infinite Tunnel / UV Scroll](#4-infinite-tunnel--uv-scroll)
5. [Holographic Shader](#5-holographic-shader)
6. [Custom Depth Material](#6-custom-depth-material)

---

## 1. Noise Functions

```glsl
// ── Classic Perlin Noise (2D) ──────────────────────────────
vec2 fade(vec2 t) { return t * t * t * (t * (t * 6.0 - 15.0) + 10.0); }
float grad(int hash, float x, float y) {
  int h = hash & 3;
  float u = h < 2 ? x : y;
  float v = h < 2 ? y : x;
  return ((h & 1) == 0 ? u : -u) + ((h & 2) == 0 ? v : -v);
}
// Use: float n = cnoise(vec2(vUv * 8.0 + uTime * 0.3));

// ── Simplex Noise 3D (faster) ──────────────────────────────
// Include: https://github.com/stegu/webgl-noise (glsl-noise npm)
// Or inline the classic simplex snippet:
float snoise(vec3 v) { /* ... standard simplex implementation */ }

// ── Value Noise (fast procedural) ─────────────────────────
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f); // Smoothstep
  return mix(
    mix(hash(i + vec2(0,0)), hash(i + vec2(1,0)), u.x),
    mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), u.x),
    u.y
  );
}

// ── FBM (Fractal Brownian Motion) ─────────────────────────
float fbm(vec2 p) {
  float value = 0.0, amplitude = 0.5;
  for (int i = 0; i < 6; i++) {
    value += amplitude * noise(p);
    p *= 2.0; amplitude *= 0.5;
  }
  return value;
}
// Use for: clouds, lava, terrain height maps, aurora
```

---

## 2. Fresnel & Rim Lighting

```glsl
// ── Vertex Shader ──────────────────────────────────────────
varying vec3 vNormal;
varying vec3 vViewDir;

void main() {
  vNormal = normalize(normalMatrix * normal);
  vec4 worldPos = modelViewMatrix * vec4(position, 1.0);
  vViewDir = normalize(-worldPos.xyz);
  gl_Position = projectionMatrix * worldPos;
}

// ── Fragment Shader ────────────────────────────────────────
varying vec3 vNormal;
varying vec3 vViewDir;
uniform vec3 uRimColor;
uniform float uRimPower;  // typically 2.0 �?4.0

void main() {
  float fresnel = pow(1.0 - dot(vNormal, vViewDir), uRimPower);
  vec3 color = mix(vec3(0.02), uRimColor, fresnel);
  gl_FragColor = vec4(color, fresnel * 0.8 + 0.1);
}

// ── In JS ─────────────────────────────────────────────────
const hologramMat = new THREE.ShaderMaterial({
  uniforms: {
    uRimColor: { value: new THREE.Color(0x00ffcc) },
    uRimPower: { value: 3.0 },
    uTime: { value: 0 },
  },
  transparent: true,
  side: THREE.FrontSide,
  depthWrite: false,   // Important for transparent rim materials
  blending: THREE.AdditiveBlending, // Glow blending
  vertexShader: `...`,
  fragmentShader: `...`,
});
```

---

## 3. SDF Raymarching

```glsl
// Full-screen quad raymarcher (set as PlaneGeometry covering viewport)
uniform float uTime;
uniform vec2 uResolution;

// ── SDF Primitives ─────────────────────────────────────────
float sdSphere(vec3 p, float r) { return length(p) - r; }
float sdBox(vec3 p, vec3 b) {
  vec3 q = abs(p) - b;
  return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
}
float sdTorus(vec3 p, vec2 t) {
  vec2 q = vec2(length(p.xz) - t.x, p.y);
  return length(q) - t.y;
}

// ── CSG Operations ─────────────────────────────────────────
float opUnion(float a, float b)        { return min(a, b); }
float opSubtraction(float a, float b)  { return max(-a, b); }
float opIntersection(float a, float b) { return max(a, b); }
float opSmoothUnion(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}

// ── Scene ─────────────────────────────────────────────────
float map(vec3 p) {
  float sphere = sdSphere(p - vec3(sin(uTime), 0, 0), 1.0);
  float torus  = sdTorus(p - vec3(0, 0.5, 0), vec2(1.5, 0.3));
  return opSmoothUnion(sphere, torus, 0.5);
}

// ── Raymarcher ────────────────────────────────────────────
void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution) / uResolution.y;
  vec3 ro = vec3(0, 0, 5.0);   // Ray origin
  vec3 rd = normalize(vec3(uv, -1.5)); // Ray direction

  float t = 0.0;
  for (int i = 0; i < 80; i++) {
    vec3 pos = ro + rd * t;
    float d = map(pos);
    t += d;
    if (d < 0.001 || t > 100.0) break;
  }

  vec3 color = vec3(0);
  if (t < 100.0) {
    vec3 pos = ro + rd * t;
    // Compute normal via gradient
    vec2 e = vec2(0.001, 0);
    vec3 n = normalize(vec3(
      map(pos + e.xyy) - map(pos - e.xyy),
      map(pos + e.yxy) - map(pos - e.yxy),
      map(pos + e.yyx) - map(pos - e.yyx)
    ));
    float diff = max(dot(n, normalize(vec3(1, 2, 3))), 0.0);
    color = vec3(diff) * vec3(0.2, 0.8, 1.0);
  }

  gl_FragColor = vec4(color, 1.0);
}
```

---

## 4. Infinite Tunnel / UV Scroll

```glsl
// Vertex shader: standard
// Fragment shader: UV scroll + tunnel distortion

uniform float uTime;
uniform sampler2D uTexture;
varying vec2 vUv;

void main() {
  // Polar coordinates
  vec2 center = vUv - 0.5;
  float angle = atan(center.y, center.x);
  float radius = length(center);

  // Map to tunnel UV
  vec2 tunnelUv = vec2(
    angle / (2.0 * 3.14159) + 0.5,  // Wrap 0�?
    0.2 / radius + uTime * 0.3       // Scroll into tunnel
  );

  vec4 color = texture2D(uTexture, fract(tunnelUv));

  // Vignette edges
  float vignette = smoothstep(0.5, 0.2, radius);
  gl_FragColor = vec4(color.rgb * vignette, 1.0);
}
```

---

## 5. Holographic Shader

```glsl
// ── Fragment ──────────────────────────────────────────────
uniform float uTime;
uniform vec3 uColor;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  // Scanlines
  float scanline = sin(vUv.y * 200.0 + uTime * 5.0) * 0.05 + 0.95;

  // Glitch offset stripes
  float glitch = step(0.99, sin(vUv.y * 50.0 + uTime * 2.0)) * 0.1;
  vec2 uvo = vUv + vec2(glitch, 0);

  // Fresnel
  vec3 viewDir = normalize(cameraPosition - vPosition);
  float fresnel = pow(1.0 - abs(dot(vNormal, viewDir)), 2.0);

  // Flickering
  float flicker = sin(uTime * 30.0) * 0.02 + 0.98;

  vec3 color = uColor * scanline * flicker;
  float alpha = fresnel * 0.8 + 0.1;

  gl_FragColor = vec4(color, alpha);
}
```

---

## 6. Custom Depth Material

For shadows with alpha cutout (vegetation, particles):

```javascript
const material = new THREE.MeshStandardMaterial({
  map: leafTexture,
  alphaMap: leafAlpha,
  alphaTest: 0.5,   // �?Key: discard below threshold
  side: THREE.DoubleSide,
});

// Custom shadow depth material with same alpha
material.customDepthMaterial = new THREE.MeshDepthMaterial({
  depthPacking: THREE.RGBADepthPacking,
  map: leafTexture,
  alphaMap: leafAlpha,
  alphaTest: 0.5,
});
```
