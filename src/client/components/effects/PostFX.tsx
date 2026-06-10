'use client';

import {
  EffectComposer,
  Bloom,
  Vignette
} from '@react-three/postprocessing';

// Cinematic postprocessing — kept lean on purpose:
//   - Bloom — sun and star glow via luminance threshold pass
//   - Vignette — darkens edges, focuses the eye on center
// Removed ChromaticAberration: minimal visual gain for ~15% GPU cost.

export function PostFX() {
  return (
    <EffectComposer multisampling={0}>
      <Bloom
        intensity={1.0}
        luminanceThreshold={0.25}
        luminanceSmoothing={0.5}
        mipmapBlur
        radius={0.7}
      />
      <Vignette eskil={false} offset={0.18} darkness={0.88} />
    </EffectComposer>
  );
}
