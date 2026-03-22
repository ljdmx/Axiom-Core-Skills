# Animation Patterns & Soul Easing

All animations must pass these gates —violation = immediate refusal:
- Duration: 100—300ms
- Easing: ease-out / cubic-bezier
- Amplitude: ≥ 8% of rest value
- Trigger: User action or state change only
- Reduced motion: Always respected

## GSAP Cinematic Sequences
```javascript
import gsap from 'gsap';

const entryTl = gsap.timeline({ delay: 0.3 });
entryTl
  .to(scene.fog, { density: 0.015, duration: 1.5, ease: 'power2.out' }, 0)
  .from(keyLight, { intensity: 0, duration: 2.0, ease: 'power2.inOut' }, 0.2)
```

## Soul Microinteractions
```javascript
// Understanding Axis: Focus pulse
element.addEventListener('focus', () => {
  gsap.fromTo(mesh.material, { emissiveIntensity: 0 },
    { emissiveIntensity: 0.3, duration: 0.6, ease: 'power2.out',
      onComplete: () => gsap.to(mesh.material, { emissiveIntensity: 0, duration: 0.4 }) });
});

// Companionship Axis: Breathing float
mesh.position.y = Math.sin(clock.getElapsedTime() * Math.PI * 0.5) * 0.08;
```
