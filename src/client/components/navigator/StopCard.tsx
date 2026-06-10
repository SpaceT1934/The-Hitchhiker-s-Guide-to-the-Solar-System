'use client';

import { useEffect, useRef, useState } from 'react';

import { MOVIES_BY_PATH } from '@/client/data/movieInfo';
import type { JourneyStop } from '@/shared/journey';

// StopCard — per-stop film recommendation, bottom-left during the journey.
//
// Science data (planet facts, spacecraft details) is shown in the top-left
// HUD cards (PlanetCard / ArtifactCard) which automatically switch because
// JourneyController sets the global focused/focusedArtifact state.
// This component only shows the film match — no duplicate science info.

const FADE_DURATION_MS = 1200;

type Props = {
  stop: JourneyStop | null;
  index: number;
  total: number;
};

export function StopCard({ stop, index, total }: Props) {
  const [renderedStop, setRenderedStop] = useState<JourneyStop | null>(stop);
  const [visible, setVisible] = useState<boolean>(stop !== null);
  const prevRef = useRef<JourneyStop | null>(stop);

  useEffect(() => {
    const prev = prevRef.current;
    prevRef.current = stop;

    if (stop === prev) return;

    if (stop === null) {
      setVisible(false);
      return;
    }

    if (prev === null) {
      setRenderedStop(stop);
      const id = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(id);
    }

    setVisible(false);
    const id = setTimeout(() => {
      setRenderedStop(stop);
      requestAnimationFrame(() => setVisible(true));
    }, FADE_DURATION_MS);
    return () => clearTimeout(id);
  }, [stop]);

  if (!renderedStop || !renderedStop.filmPath) return null;

  const film = MOVIES_BY_PATH[renderedStop.filmPath];
  if (!film) return null;

  return (
    <div className="absolute bottom-10 left-10 z-30 pointer-events-none">
      <div
        className={`transition-all ease-out ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}
        style={{ transitionDuration: `${FADE_DURATION_MS}ms` }}
      >
        <div
          className="flex gap-4 px-5 py-3.5 border border-stardust/12 bg-deep/55 backdrop-blur-md w-[360px]"
          style={{ boxShadow: '0 0 30px rgba(200,180,120,0.06)' }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={film.poster}
            alt={film.titleZh}
            className="h-20 w-auto object-contain rounded-sm shadow-[0_0_15px_rgba(200,180,120,0.15)]"
          />
          <div className="flex-1 min-w-0">
            <div className="text-stardust/25 text-[8px] tracking-cosmic uppercase">
              🎬 相关电影
            </div>
            <div className="mt-1 text-stardust/90 text-[14px] tracking-wider2 font-light leading-tight">
              {film.titleZh}
            </div>
            <div className="mt-0.5 flex flex-wrap items-baseline gap-x-2 text-[9px] text-stardust/40">
              <span className="tracking-cosmic uppercase truncate">{film.titleEn}</span>
              <span className="text-stardust/20">·</span>
              <span className="tabular-nums">{film.year}</span>
            </div>
            <p className="mt-1.5 text-stardust/45 text-[10px] leading-relaxed line-clamp-2">
              {film.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
