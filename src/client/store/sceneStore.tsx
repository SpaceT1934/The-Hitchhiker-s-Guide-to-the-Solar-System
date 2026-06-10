'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
  type ReactNode
} from 'react';
import type * as THREE from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

import type { Journey, SpacecraftId } from '@/shared/journey';

export type PlanetId =
  | 'mercury'
  | 'venus'
  | 'earth'
  | 'moon'
  | 'mars'
  | 'jupiter'
  | 'saturn'
  | 'uranus'
  | 'neptune';

export type PlanetInfo = {
  id: PlanetId;
  name: string;
  ref: MutableRefObject<THREE.Group | null>;
  approachDistance: number;
  /** Surface radius of the planet body, used to clamp the minimum
   *  zoom distance in focus mode so the camera can graze the surface
   *  without entering the atmosphere shell. */
  radius: number;
};

export type ArtifactInfo = {
  id: SpacecraftId;
  /** Live ref into the world — used to read the artifact's world position
   *  each frame (it orbits or sits on a spinning planet). */
  ref: MutableRefObject<THREE.Object3D | null>;
  /** Distance from the artifact's world position to park the camera. */
  approachDistance: number;
};

export const PLANET_LABELS: Record<PlanetId, string> = {
  mercury: 'Mercury',
  venus: 'Venus',
  earth: 'Earth',
  moon: 'Luna',
  mars: 'Mars',
  jupiter: 'Jupiter',
  saturn: 'Saturn',
  uranus: 'Uranus',
  neptune: 'Neptune'
};

export type SceneStatus = 'overview' | 'voyaging';

/** Top-level navigator state machine. The Journey lifecycle:
 *    closed → prompting → loading → previewing → running → summary → closed
 *  (any state can be jumped back to closed by Esc or the close control). */
export type NavigatorPhase =
  | 'closed'
  | 'prompting'
  | 'loading'
  | 'previewing'
  | 'running'
  | 'summary';

type SceneStore = {
  focused: PlanetId | null;
  focusedArtifact: SpacecraftId | null;
  status: SceneStatus;
  voyageFrom: PlanetId | null;
  voyageTo: PlanetId | null;
  selectedPoster: string | null;
  introDone: boolean;
  navigatorPhase: NavigatorPhase;
  journey: Journey | null;
  journeyStopIndex: number;
  libraryOpen: boolean;
  libraryFilter: PlanetId | 'all';
  /** Has the user picked a mode (Explore Freely / Navigator) at least
   *  once? Drives the VoyagePlot layout: false → big centered hero with
   *  recommendation; true → compact bottom-right pills. */
  hasUsedChoice: boolean;
  /** Mute the TTS narration during journey playback. Persisted in
   *  localStorage so the user's preference survives page reload. */
  audioMuted: boolean;
  setFocused: (id: PlanetId | null) => void;
  setFocusedArtifact: (id: SpacecraftId | null) => void;
  setVoyageFrom: (id: PlanetId | null) => void;
  setVoyageTo: (id: PlanetId | null) => void;
  setSelectedPoster: (path: string | null) => void;
  setIntroDone: (done: boolean) => void;
  setNavigatorPhase: (phase: NavigatorPhase) => void;
  setJourney: (journey: Journey | null) => void;
  setJourneyStopIndex: (i: number) => void;
  setLibraryOpen: (open: boolean) => void;
  setLibraryFilter: (filter: PlanetId | 'all') => void;
  setHasUsedChoice: (v: boolean) => void;
  setAudioMuted: (v: boolean) => void;
  startVoyage: () => void;
  completeVoyage: () => void;
  cancelVoyage: () => void;
  planets: Map<PlanetId, PlanetInfo>;
  artifacts: Map<SpacecraftId, ArtifactInfo>;
  controlsRef: MutableRefObject<OrbitControlsImpl | null>;
};

const Ctx = createContext<SceneStore | null>(null);

export function SceneStoreProvider({ children }: { children: ReactNode }) {
  const [focused, setFocused] = useState<PlanetId | null>(null);
  const [focusedArtifact, setFocusedArtifact] = useState<SpacecraftId | null>(null);
  const [status, setStatus] = useState<SceneStatus>('overview');
  const [voyageFrom, setVoyageFrom] = useState<PlanetId | null>('earth');
  const [voyageTo, setVoyageTo] = useState<PlanetId | null>('mars');
  const [selectedPoster, setSelectedPoster] = useState<string | null>(null);
  const [introDone, setIntroDone] = useState<boolean>(false);
  const [navigatorPhase, setNavigatorPhase] = useState<NavigatorPhase>('closed');
  const [journey, setJourney] = useState<Journey | null>(null);
  const [journeyStopIndex, setJourneyStopIndex] = useState<number>(0);
  const [libraryOpen, setLibraryOpen] = useState<boolean>(false);
  const [libraryFilter, setLibraryFilter] = useState<PlanetId | 'all'>('all');
  const [hasUsedChoice, setHasUsedChoice] = useState<boolean>(false);
  // audioMuted starts unmuted; if user previously muted, the first effect
  // hydrates from localStorage. SSR-safe (typeof window guard).
  const [audioMuted, setAudioMutedState] = useState<boolean>(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem('solar-guide:audioMuted');
    if (stored === '1') setAudioMutedState(true);
  }, []);
  const setAudioMuted = useCallback((v: boolean) => {
    setAudioMutedState(v);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('solar-guide:audioMuted', v ? '1' : '0');
    }
  }, []);

  const planets = useRef<Map<PlanetId, PlanetInfo>>(new Map()).current;
  const artifacts = useRef<Map<SpacecraftId, ArtifactInfo>>(new Map()).current;
  const controlsRef = useRef<OrbitControlsImpl | null>(null);

  const startVoyage = useCallback(() => {
    if (!voyageFrom || !voyageTo || voyageFrom === voyageTo) return;
    setFocused(null);
    setFocusedArtifact(null);
    setStatus('voyaging');
  }, [voyageFrom, voyageTo]);

  const completeVoyage = useCallback(() => {
    setFocused((current) => voyageTo ?? current);
    setStatus('overview');
  }, [voyageTo]);

  const cancelVoyage = useCallback(() => {
    setStatus('overview');
  }, []);

  const value: SceneStore = useMemo(
    () => ({
      focused,
      focusedArtifact,
      status,
      voyageFrom,
      voyageTo,
      selectedPoster,
      introDone,
      navigatorPhase,
      journey,
      journeyStopIndex,
      libraryOpen,
      libraryFilter,
      hasUsedChoice,
      audioMuted,
      planets,
      artifacts,
      controlsRef,
      setFocused,
      setFocusedArtifact,
      setVoyageFrom,
      setVoyageTo,
      setSelectedPoster,
      setIntroDone,
      setNavigatorPhase,
      setJourney,
      setJourneyStopIndex,
      setLibraryOpen,
      setLibraryFilter,
      setHasUsedChoice,
      setAudioMuted,
      startVoyage,
      completeVoyage,
      cancelVoyage
    }),
    [
      focused,
      focusedArtifact,
      status,
      voyageFrom,
      voyageTo,
      selectedPoster,
      introDone,
      navigatorPhase,
      journey,
      journeyStopIndex,
      libraryOpen,
      libraryFilter,
      hasUsedChoice,
      audioMuted,
      planets,
      artifacts,
      controlsRef,
      startVoyage,
      completeVoyage,
      cancelVoyage
    ]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSceneStore(): SceneStore {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useSceneStore must be used inside SceneStoreProvider');
  return ctx;
}

// usePlanetInteraction and useArtifactRegistration moved to lib/hooks/.
// Re-export to keep existing imports working.
export { usePlanetInteraction } from '@/client/hooks/usePlanetInteraction';
export { useArtifactRegistration } from '@/client/hooks/useArtifactRegistration';
