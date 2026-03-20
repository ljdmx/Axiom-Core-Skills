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
‚ñ?Renderer respects devicePixelRatio (capped at 2)
‚ñ?Use Frame loop is unblocked (<16ms compute)
‚ñ?No geometries/materials recreated in loops
‚ñ?ACESFilmicToneMapping                          ‚Ä?cinematic tone
‚ñ?SRGBColorSpace output (r152+)                  ‚Ä?correct colors
‚ñ?Color textures: colorSpace = SRGBColorSpace
‚ñ?Normal/roughness textures: colorSpace = LinearSRGBColorSpace

LIGHTING:
‚ñ?Single dominant key light (intensity > 3.0)
‚ñ?Fill light ‚â?10% of key intensity
‚ñ?envMap set on scene for all PBR materials
‚ñ?shadow.bias tuned per scene (-0.0005 start)

ANIMATION:
‚ñ?All animations use delta-time
‚ñ?Breathing float: ~0.25Hz, ‚â?8% amplitude
‚ñ?prefers-reduced-motion respected
‚ñ?Auto-rotate stops on pointer enter

ASSETS:
‚ñ?KTX2 textures (mobile production)
‚ñ?DRACO/Meshopt for models > 500KB
‚ñ?Geometry/material/texture disposed on unmount
‚ñ?Loading complete before scene reveal
```

### ‚ù?Never
```
TECHNICAL:
‚ñ?setPixelRatio(window.devicePixelRatio)   ‚Ä?crashes 3√ó screens
‚ñ?mesh.rotation.y += 0.01                  ‚Ä?framerate-dependent
‚ñ?new THREE.Vector3() inside animate()     ‚Ä?GC spikes
‚ñ?raycaster.intersectObjects() every frame ‚Ä?throttle to 50ms
‚ñ?LinearToneMapping                        ‚Ä?flat, lifeless

VISUAL:
‚ñ?Equal intensity tri-light                ‚Ä?cancels all drama
‚ñ?AmbientLight(0xffffff, 1.0)             ‚Ä?kills all depth
‚ñ?Bloom threshold = 0 (everything glows)  ‚Ä?cheap phone filter
‚ñ?Pure black/white backgrounds             ‚Ä?no atmosphere
‚ñ?Missing outputColorSpace                 ‚Ä?washed-out or oversaturated

SOUL (triggers immediate rewrite):
‚ñ?Blue-purple spinning orb               ‚Ä?AI demo clich√©
‚ñ?Perfectly symmetric geometric grids    ‚Ä?no organic tension
‚ñ?Equal-size/speed/color particles       ‚Ä?pixel grid, not particles
‚ñ?OrbitControls without damping shipped  ‚Ä?cheap feel
‚ñ?Objects appearing instantly on load    ‚Ä?missing entry ritual
‚ñ?Auto-rotate never pauses               ‚Ä?disrespectful to user intent
‚ñ?helvetiker font (Three.js default)     ‚Ä?1990s feel
```
