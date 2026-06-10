'use client';

import { useCallback, useEffect, type MutableRefObject } from 'react';
import type { ThreeEvent } from '@react-three/fiber';
import type * as THREE from 'three';

import { PLANET_LABELS, useSceneStore, type PlanetId } from '@/client/store/sceneStore';

/** Registers a planet in the global registry and returns focus / interaction
 *  handlers for click-to-focus, pointer cursor feedback, etc. */
export function usePlanetInteraction(
  id: PlanetId,
  groupRef: MutableRefObject<THREE.Group | null>,
  approachDistance: number,
  radius: number
) {
  const { focused, status, setFocused, planets } = useSceneStore();
  const isFocused = focused === id;
  const isPaused = isFocused || status === 'voyaging';

  useEffect(() => {
    planets.set(id, {
      id,
      name: PLANET_LABELS[id],
      ref: groupRef,
      approachDistance,
      radius
    });
    return () => {
      planets.delete(id);
    };
  }, [id, groupRef, approachDistance, radius, planets]);

  const onClick = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();
      if (status !== 'overview') return;
      if (focused !== id) setFocused(id);
    },
    [id, focused, setFocused, status]
  );

  const onPointerOver = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      if (status !== 'overview') return;
      if (typeof document !== 'undefined') document.body.style.cursor = 'pointer';
    },
    [status]
  );

  const onPointerOut = useCallback(() => {
    if (typeof document !== 'undefined') document.body.style.cursor = 'auto';
  }, []);

  return {
    isFocused,
    isPaused,
    handlers: { onClick, onPointerOver, onPointerOut }
  };
}
