import { gsap } from 'gsap';

/**
 * Emotional Camera Script
 * Implements "Intent Decision Tree" logic for cinematic transitions.
 * Focus: Purity, Inclusivity, and Emotional Cognition.
 */
export const emotionalTransit = (camera, targetPosition, targetLookAt, duration = 2.4) => {
  // Use "Soul Easing" (Custom cubic-bezier or Power4)
  gsap.to(camera.position, {
    x: targetPosition.x,
    y: targetPosition.y,
    z: targetPosition.z,
    duration: duration,
    ease: "power4.inOut",
    onUpdate: () => {
      camera.lookAt(targetLookAt);
    }
  });

  // Emotional FOV Shift (Subtle breathing effect)
  gsap.to(camera, {
    fov: 65,
    duration: duration * 0.5,
    repeat: 1,
    yoyo: true,
    ease: "sine.inOut"
  });
};
