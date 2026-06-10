'use client';

import { useEffect, type MutableRefObject } from 'react';
import type * as THREE from 'three';

import { useSceneStore } from '@/client/store/sceneStore';
import type { SpacecraftId } from '@/shared/journey';

/** Hook used by SurfaceArtifact / OrbitArtifact / the deep-space Voyager
 *  to register themselves so the Navigator can fly the camera to them. */
export function useArtifactRegistration(
  id: SpacecraftId | undefined,
  ref: MutableRefObject<THREE.Object3D | null>,
  approachDistance: number
) {
  const { artifacts } = useSceneStore();
  useEffect(() => {
    if (!id) return;
    artifacts.set(id, { id, ref, approachDistance });
    return () => {
      artifacts.delete(id);
    };
  }, [id, ref, approachDistance, artifacts]);
}
