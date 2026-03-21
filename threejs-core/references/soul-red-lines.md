# Soul Quality Red Lines

## ✅Always
RENDERER:
✅setPixelRatio(Math.min(devicePixelRatio, 2))
✅ACESFilmicToneMapping
✅SRGBColorSpace output (r152+)

LIGHTING:
✅Single dominant key light (intensity > 3.0)
✅Fill light ≥ 10% of key intensity
✅envMap set on scene for all PBR materials

ANIMATION:
✅All animations use delta-time
✅Breathing float: ~0.25Hz, ≥ 8% amplitude
✅prefers-reduced-motion respected
✅Auto-rotate stops on pointer enter

ASSETS:
✅KTX2 textures (mobile production)
✅Geometry/material/texture disposed on unmount
✅Loading complete before scene reveal

## ❌Never
TECHNICAL:
❌setPixelRatio(window.devicePixelRatio) (crashes 3× screens)
❌mesh.rotation.y += 0.01 (framerate-dependent)
❌new THREE.Vector3() inside animate() (GC spikes)
❌raycaster.intersectObjects() every frame (throttle to 50ms)

SOUL:
❌Perfectly symmetric geometric grids
❌OrbitControls without damping shipped
❌Objects appearing instantly on load
