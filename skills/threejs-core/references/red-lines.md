# Soul Quality Red Lines

## 8.1 The "Rams" 10 Principles for Web3D
*Derived from Dieter Rams, adapted for spatial computing:*

1. **Good 3D is innovative** (not just a spinning sphere)
2. **Good 3D makes the visual useful** (data over decoration)
3. **Good 3D is aesthetic** (respects lighting and composition)
4. **Good 3D makes the system understandable** (physics makes sense)
5. **Good 3D is unobtrusive** (tools, not toys)
6. **Good 3D is honest** (materials look like what they simulate)
7. **Good 3D is long-lasting** (doesn't chase fleeting shader trends)
8. **Good 3D is thorough down to the last pixel** (AA, math, mipmaps)
9. **Good 3D is eco-friendly** (optimized for GPU power draw)
10. **Good 3D is as little UI as possible** (the scene *is* the UI)

## 8.2 Pre-Ship Soul Audit

Before declaring a task "done", verify:

```
TECHNICAL:
✅Renderer respects devicePixelRatio (capped at 2)
✅Use Frame loop is unblocked (<16ms compute)
✅No geometries/materials recreated in loops
✅ACESFilmicToneMapping                          —cinematic tone
✅SRGBColorSpace output (r152+)                  —correct colors
✅Color textures: colorSpace = SRGBColorSpace
✅Normal/roughness textures: colorSpace = LinearSRGBColorSpace

LIGHTING:
✅Single dominant key light (intensity > 3.0)
✅Fill light ≥ 10% of key intensity
✅envMap set on scene for all PBR materials
✅shadow.bias tuned per scene (-0.0005 start)

ANIMATION:
✅All animations use delta-time
✅Breathing float: ~0.25Hz, ≥ 8% amplitude
✅prefers-reduced-motion respected
✅Auto-rotate stops on pointer enter

ASSETS:
✅KTX2 textures (mobile production)
✅DRACO/Meshopt for models > 500KB
✅Geometry/material/texture disposed on unmount
✅Loading complete before scene reveal
```

### ❌Never
```
TECHNICAL:
✅setPixelRatio(window.devicePixelRatio)   —crashes 3× screens
✅mesh.rotation.y += 0.01                  —framerate-dependent
✅new THREE.Vector3() inside animate()     —GC spikes
✅raycaster.intersectObjects() every frame —throttle to 50ms
✅LinearToneMapping                        —flat, lifeless

VISUAL:
✅Equal intensity tri-light                —cancels all drama
✅AmbientLight(0xffffff, 1.0)             —kills all depth
✅Bloom threshold = 0 (everything glows)  —cheap phone filter
✅Pure black/white backgrounds             —no atmosphere
✅Missing outputColorSpace                 —washed-out or oversaturated

SOUL (triggers immediate rewrite):
✅Blue-purple spinning orb               —AI demo cliché
✅Perfectly symmetric geometric grids    —no organic tension
✅Equal-size/speed/color particles       —pixel grid, not particles
✅OrbitControls without damping shipped  —cheap feel
✅Objects appearing instantly on load    —missing entry ritual
✅Auto-rotate never pauses               —disrespectful to user intent
✅helvetiker font (Three.js default)     —1990s feel
```
