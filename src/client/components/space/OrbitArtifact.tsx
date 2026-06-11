'use client';

import { useGLTF } from '@react-three/drei';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { useCallback, useMemo, useRef } from 'react';
import * as THREE from 'three';

import { useSceneStore, type PlanetId } from '@/client/store/sceneStore';
import { useArtifactRegistration } from '@/client/hooks/useArtifactRegistration';
import type { SpacecraftId } from '@/shared/journey';

// OrbitArtifact — loads a GLTF spacecraft and puts it in orbit around a
// planet. Inclined-circle orbit, configurable speed / radius / tilt /
// phase, optional self-spin. Clicking focuses the camera on it.

type Props = {
  modelUrl: string;
  followPlanet: PlanetId;
  orbitRadius: number;
  orbitSpeed?: number;
  orbitTilt?: number;
  orbitPhase?: number;
  scale?: number;
  spinSpeed?: number;
  yaw?: number;
  artifactId?: SpacecraftId;
  approachDistance?: number;
};

export function OrbitArtifact({
  modelUrl,
  followPlanet,
  orbitRadius,
  orbitSpeed = 0.06,
  orbitTilt = 0,
  orbitPhase = 0,
  scale = 0.04,
  spinSpeed = 0,
  yaw = 0,
  artifactId,
  approachDistance = 0.8
}: Props) {
  const { planets, status, setFocused, setFocusedArtifact } = useSceneStore();
  const wrapperRef = useRef<THREE.Group>(null);
  const orbiterRef = useRef<THREE.Group>(null);
  const modelRef = useRef<THREE.Group>(null);

  const gltf = useGLTF(modelUrl);
  const cloned = useMemo(() => gltf.scene.clone(true), [gltf.scene]);

  useArtifactRegistration(artifactId, orbiterRef, approachDistance);

  const onClick = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();
      if (status !== 'overview' || !artifactId) return;
      setFocused(followPlanet);
      setFocusedArtifact(artifactId);
    },
    [artifactId, followPlanet, status, setFocused, setFocusedArtifact]
  );

  useFrame((state, dt) => {
    const info = planets.get(followPlanet);
    if (info?.ref.current && wrapperRef.current) {
      info.ref.current.getWorldPosition(wrapperRef.current.position);
    }

    const t = state.clock.elapsedTime * orbitSpeed + orbitPhase;
    const sinT = Math.sin(t);
    const cosT = Math.cos(t);
    const tiltS = Math.sin(orbitTilt);
    const tiltC = Math.cos(orbitTilt);
    if (orbiterRef.current) {
      orbiterRef.current.position.set(
        cosT * orbitRadius,
        sinT * tiltS * orbitRadius,
        sinT * tiltC * orbitRadius
      );
    }

    if (modelRef.current && spinSpeed) {
      modelRef.current.rotation.y += dt * spinSpeed;
    }
  });

  return (
    <group ref={wrapperRef} onClick={onClick}>
      <group ref={orbiterRef}>
        <group ref={modelRef} rotation={[0, yaw, 0]}>
          <primitive object={cloned} scale={scale} />
        </group>
      </group>
    </group>
  );
}
