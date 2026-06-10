'use client';

import { useEffect, useRef, useState } from 'react';

import { MOVIES_BY_PATH } from '@/client/data/movieInfo';
import { SPACECRAFT } from '@/client/data/journeyInventory';
import { PLANET_FACTS } from '@/client/data/planetInfo';
import { PLANET_LABELS } from '@/client/store/sceneStore';
import type { JourneyStop } from '@/shared/journey';

// StopCard — per-stop science + film card, bottom-left during the journey.
//
// Always renders a "science card" with the planet/spacecraft's key facts.
// If the stop has a filmPath, a smaller film card is stacked below it.
// Owns its own fade-in/fade-out cycle so cards don't overlap between stops.

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

  return (
    <div className="absolute bottom-10 left-10 z-30 pointer-events-none">
      <div
        className={`transition-all ease-out ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}
        style={{ transitionDuration: `${FADE_DURATION_MS}ms` }}
      >
        {renderedStop && (
          <div className="flex flex-col gap-3">
            <ScienceCard stop={renderedStop} index={index} total={total} />
            {renderedStop.filmPath && <FilmCard filmPath={renderedStop.filmPath} />}
          </div>
        )}
      </div>
    </div>
  );
}

// ──── Science Card (always shown) ────

function ScienceCard({ stop, index, total }: { stop: JourneyStop; index: number; total: number }) {
  const stopLabel = `第 ${String(index + 1).padStart(2, '0')} 站 / ${String(total).padStart(2, '0')}`;

  if (stop.target.kind === 'planet') {
    const f = PLANET_FACTS[stop.target.id];
    return (
      <div
        className="px-5 py-4 border border-stardust/15 bg-deep/65 backdrop-blur-md w-[360px]"
        style={{ boxShadow: '0 0 40px rgba(155,216,255,0.06)' }}
      >
        <div className="flex items-baseline justify-between gap-3">
          <div className="text-stardust/30 text-[9px] tracking-cosmic uppercase">{stopLabel}</div>
          <div className="text-stardust/35 text-[9px] tracking-cosmic uppercase">{f.category}</div>
        </div>
        <div className="mt-1.5 text-stardust/95 text-[20px] tracking-wider2 font-light leading-tight">
          {f.nameZh}
        </div>
        <div className="mt-0.5 text-stardust/35 text-[10px] tracking-cosmic uppercase">
          {f.nameEn}
        </div>
        <div className="mt-3 h-px w-full bg-stardust/12" />
        <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-[10px]">
          {f.facts.slice(0, 6).map(([label, value]) => (
            <div key={label} className="flex justify-between gap-2">
              <span className="text-stardust/45 tracking-wider2">{label}</span>
              <span className="text-stardust/80 tabular-nums text-right">{value}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 h-px w-full bg-stardust/12" />
        <p className="mt-3 text-stardust/60 text-[11px] leading-relaxed italic">
          {f.highlight}
        </p>
      </div>
    );
  }

  // Spacecraft
  const s = SPACECRAFT[stop.target.id];
  const hostFacts = PLANET_FACTS[s.hostPlanet];
  return (
    <div
      className="px-5 py-4 border border-stardust/15 bg-deep/65 backdrop-blur-md w-[360px]"
      style={{ boxShadow: '0 0 40px rgba(155,216,255,0.06)' }}
    >
      <div className="flex items-baseline justify-between gap-3">
        <div className="text-stardust/30 text-[9px] tracking-cosmic uppercase">{stopLabel}</div>
        <div className="text-stardust/35 text-[9px] tracking-cosmic uppercase">
          {s.kind === 'surface' ? '表面着陆' : s.kind === 'orbit' ? '轨道飞行' : '深空探测'}
        </div>
      </div>
      <div className="mt-1.5 text-stardust/95 text-[20px] tracking-wider2 font-light leading-tight">
        {s.name}
      </div>
      <div className="mt-0.5 text-stardust/35 text-[10px] tracking-cosmic uppercase">
        {s.id.replace(/_/g, ' ')} · 位于{hostFacts.nameZh}附近
      </div>
      <div className="mt-3 h-px w-full bg-stardust/12" />
      <p className="mt-3 text-stardust/75 text-[12px] leading-relaxed">
        {s.description}
      </p>
    </div>
  );
}

// ──── Film Card (shown below science card when a film is matched) ────

function FilmCard({ filmPath }: { filmPath: string }) {
  const film = MOVIES_BY_PATH[filmPath];
  if (!film) return null;
  return (
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
        <div className="text-stardust/25 text-[8px] tracking-cosmic uppercase">🎬 相关电影</div>
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
  );
}
