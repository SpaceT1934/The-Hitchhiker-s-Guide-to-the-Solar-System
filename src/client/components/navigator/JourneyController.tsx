'use client';

import { useEffect, useRef, useState } from 'react';

import { useSceneStore, PLANET_LABELS } from '@/client/store/sceneStore';
import { SPACECRAFT } from '@/client/data/journeyInventory';

import { Subtitle } from './Subtitle';
import { StopCard } from './StopCard';

// Strip the subject name from narration if the LLM included it.
// The name is already shown in the top-left card.
function cleanNarration(raw: string, stop: { target: { kind: string; id: string } }): string {
  let name = '';
  if (stop.target.kind === 'planet') {
    name = PLANET_LABELS[stop.target.id as keyof typeof PLANET_LABELS] ?? '';
  } else {
    name = SPACECRAFT[stop.target.id as keyof typeof SPACECRAFT]?.name ?? '';
  }
  if (!name) return raw;
  // Remove the name if it appears at the start, optionally followed by Chinese punctuation
  return raw.replace(new RegExp(`^${name}[，。、；：]?\\s*`), '');
}

// JourneyController — drives the running phase of a Journey.
//
// Per stop:
//   1. Aim the camera at the target (planet or spacecraft).
//   2. After CAMERA_SETTLE_MS the subtitle + film card fade in.
//   3. Hold STOP_HOLD_MS, then advance.

const CAMERA_SETTLE_MS = 4000;
const STOP_HOLD_MS = 5800;

export function JourneyController() {
  const {
    navigatorPhase,
    journey,
    journeyStopIndex,
    setJourneyStopIndex,
    setNavigatorPhase,
    setFocused,
    setFocusedArtifact
  } = useSceneStore();

  const [displayActive, setDisplayActive] = useState(false);
  const stopTokenRef = useRef(0);

  // ──── Per-stop scheduler ────
  useEffect(() => {
    if (navigatorPhase !== 'running' || !journey) return;
    const stop = journey.stops[journeyStopIndex];
    if (!stop) return;

    stopTokenRef.current += 1;
    const token = stopTokenRef.current;

    if (stop.target.kind === 'planet') {
      setFocusedArtifact(null);
      setFocused(stop.target.id);
    } else {
      // Don't set focused here — the camera resolves the host planet
      // from SPACECRAFT data directly. Setting focused=host causes
      // PlanetCard to flash before ArtifactCard takes over.
      setFocusedArtifact(stop.target.id);
    }

    setDisplayActive(false);

    const tShow = setTimeout(() => {
      if (token !== stopTokenRef.current) return;
      setDisplayActive(true);
    }, CAMERA_SETTLE_MS);

    const tAdvance = setTimeout(() => {
      if (token !== stopTokenRef.current) return;
      advance();
    }, CAMERA_SETTLE_MS + STOP_HOLD_MS);

    return () => {
      clearTimeout(tShow);
      clearTimeout(tAdvance);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigatorPhase, journey, journeyStopIndex]);

  // Clean up scene focus when the journey ends.
  useEffect(() => {
    if (navigatorPhase === 'summary' || navigatorPhase === 'closed') {
      const id = setTimeout(() => {
        setFocusedArtifact(null);
        if (navigatorPhase === 'closed') setFocused(null);
      }, 300);
      return () => clearTimeout(id);
    }
  }, [navigatorPhase, setFocusedArtifact, setFocused]);

  const advance = () => {
    if (!journey) return;
    stopTokenRef.current += 1;
    setDisplayActive(false);

    const next = journeyStopIndex + 1;
    if (next >= journey.stops.length) {
      setNavigatorPhase('summary');
      return;
    }
    setJourneyStopIndex(next);
  };

  const abort = () => {
    stopTokenRef.current += 1;
    setDisplayActive(false);
    setNavigatorPhase('closed');
  };

  if (navigatorPhase !== 'running' || !journey) return null;
  const stop = journey.stops[journeyStopIndex];
  if (!stop) return null;

  return (
    <>
      <div className="absolute top-6 right-10 z-30 flex items-center gap-6 pointer-events-auto">
        <div className="text-stardust/40 text-[10px] tracking-cosmic uppercase tabular-nums select-none">
          第 {String(journeyStopIndex + 1).padStart(2, '0')} 站 / {String(journey.stops.length).padStart(2, '0')}
        </div>
        <div className="h-3 w-px bg-stardust/15" />
        <button
          type="button"
          onClick={advance}
          className="text-stardust/45 hover:text-stardust/95 text-[10px] tracking-cosmic uppercase transition-colors duration-300"
        >
          下一站 · Next ›
        </button>
        <button
          type="button"
          onClick={abort}
          className="text-stardust/30 hover:text-stardust/75 text-[10px] tracking-cosmic uppercase transition-colors duration-300"
        >
          退出 · Exit
        </button>
      </div>

      <Subtitle text={displayActive ? cleanNarration(stop.narration, stop) : null} />
      <StopCard
        stop={displayActive ? stop : null}
        index={journeyStopIndex}
        total={journey.stops.length}
      />
    </>
  );
}
