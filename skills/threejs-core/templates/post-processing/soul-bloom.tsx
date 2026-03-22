import React from 'react';
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

/**
 * SoulBloomPostProcessing
 * 
 * Replaces standard, cheap "AI glow" blooming with a physically-based, cinematic HDR bloom.
 * Integrates subtle grain and vignette to ground the 3D scene in a photographic reality.
 */

interface SoulBloomProps {
  intensity?: number;
  luminanceThreshold?: number;
  luminanceSmoothing?: number;
  noiseOpacity?: number;
}

export const SoulBloomPostProcessing: React.FC<SoulBloomProps> = ({
  intensity = 0.8,
  luminanceThreshold = 0.85, // High threshold ensures only true emissives glow
  luminanceSmoothing = 0.15,
  noiseOpacity = 0.025
}) => {
  return (
    <EffectComposer disableNormalPass multisampling={4}>
      {/* 
        The bloom should be elegant and diffused, mimicking wide-aperture lens flares,
        not flat glowing shapes.
      */}
      <Bloom 
        intensity={intensity} 
        luminanceThreshold={luminanceThreshold} 
        luminanceSmoothing={luminanceSmoothing}
        mipmapBlur // Enables a beautiful, multi-pass physical blur
      />

      {/* 
        Aesthetic Sovereign Mandate: Add structural noise to tie the composite together. 
        It prevents color banding and flat pixel gradients.
      */}
      <Noise 
        premultiply 
        blendFunction={BlendFunction.OVERLAY} 
        opacity={noiseOpacity} 
      />

      {/* 
        Cinematic vignette to draw the eye toward the center key subject.
      */}
      <Vignette 
        eskil={false} 
        offset={0.1} 
        darkness={0.8} 
        blendFunction={BlendFunction.NORMAL} 
      />
    </EffectComposer>
  );
};

export default SoulBloomPostProcessing;
