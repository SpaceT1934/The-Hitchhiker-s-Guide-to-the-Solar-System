'use client';

import { useEffect, useMemo, useRef } from 'react';

import { PLANET_FACTS } from '@/client/data/planetInfo';
import { useSceneStore, type PlanetId } from '@/client/store/sceneStore';
import { SPACECRAFT, SPACECRAFT_IDS } from '@/client/data/journeyInventory';
import { POSTERS_BY_PLANET } from '@/client/data/postersData';

// PlanetCard — appears in the top-left corner whenever a planet is focused.
// Shows: name, category, 7 data rows, dynamic counts, description,
// and an "vs Earth" comparison block for non-Earth planets.

const SPACECRAFT_COUNT_BY_PLANET = SPACECRAFT_IDS.reduce<Record<string, number>>(
  (acc, id) => {
    const host = SPACECRAFT[id].hostPlanet;
    acc[host] = (acc[host] ?? 0) + 1;
    return acc;
  },
  {}
);

// Compact comparison facts for each planet vs Earth.
const EARTH_RADIUS = 6371;
const EARTH_ORBIT = 365.25;
const EARTH_TEMP = 15;

function compareVsEarth(id: PlanetId): string | null {
  if (id === 'earth') return null;
  const f = PLANET_FACTS[id];
  // Extract radius in km from facts array
  const radiusStr = f.facts.find(([k]) => k === '半径')?.[1] ?? '';
  const radiusKm = parseInt(radiusStr.replace(/[^0-9]/g, ''), 10);
  // Extract orbital period
  const orbitStr = f.facts.find(([k]) => k === '一年')?.[1] ?? '';
  // Temp
  const tempStr = f.facts.find(([k]) => k.includes('温度'))?.[1] ?? '';
  const lines: string[] = [];
  if (radiusKm > 0) {
    const ratio = (radiusKm / EARTH_RADIUS).toFixed(1);
    const larger = radiusKm > EARTH_RADIUS;
    lines.push(`体积约为地球的 ${larger ? ratio + ' 倍' : '1/' + (1 / parseFloat(ratio)).toFixed(0)}`);
  }
  if (orbitStr) {
    const days = parseInt(orbitStr.replace(/[^0-9]/g, ''), 10);
    if (days > 0 && days !== 365) {
      const years = (days / EARTH_ORBIT).toFixed(1);
      days > EARTH_ORBIT
        ? lines.push(`一年约地球的 ${years} 倍长`)
        : lines.push(`一年只有地球的 ${(days / EARTH_ORBIT * 100).toFixed(0)}%`);
    }
  }
  if (tempStr && id === 'venus') {
    lines.push('表面温度约 465°C，是太阳系最热的行星');
  } else if (tempStr && id === 'mercury') {
    lines.push('昼夜温差超 600°C，太阳系温差最大的星球');
  } else if (tempStr && id === 'neptune') {
    lines.push('最远的大行星，最冷的大气层');
  }
  return lines.length > 0 ? lines.join(' · ') : null;
}

export function PlanetCard() {
  const { focused } = useSceneStore();
  const lastFocused = useRef<PlanetId | null>(focused);

  useEffect(() => {
    if (focused !== null) lastFocused.current = focused;
  }, [focused]);

  const planetId = focused ?? lastFocused.current;
  const data = planetId ? PLANET_FACTS[planetId] : null;
  if (!data) return null;

  const dynamicFacts = useMemo<Array<[string, string]>>(() => {
    if (!planetId) return [];
    const rows: Array<[string, string]> = [];
    const sc = SPACECRAFT_COUNT_BY_PLANET[planetId] ?? 0;
    if (sc > 0) rows.push(['🚀 航天器', String(sc)]);
    const films = POSTERS_BY_PLANET[planetId]?.length ?? 0;
    if (films > 0) rows.push(['🎬 科幻', String(films)]);
    return rows;
  }, [planetId]);

  const allFacts = data ? [...data.facts, ...dynamicFacts] : [];
  const vsEarth = planetId ? compareVsEarth(planetId) : null;

  return (
    <div className="max-w-[280px]">
          <div className="text-stardust/95 text-[26px] tracking-wider2 font-light leading-tight">
            {data.nameZh}
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] text-stardust/45">
            <span className="tracking-cosmic uppercase">{data.nameEn}</span>
            <span className="text-stardust/25">·</span>
            <span className="tracking-wider2">{data.category}</span>
          </div>

          <div className="mt-5 h-px w-full bg-stardust/15" />

          <dl className="mt-4 space-y-1.5 text-[11px]">
            {allFacts.map(([label, value]) => (
              <div key={label} className="flex items-baseline justify-between gap-4">
                <dt className="text-stardust/45 tracking-wider2">{label}</dt>
                <dd className="text-stardust/85 tabular-nums">{value}</dd>
              </div>
            ))}
          </dl>

          {vsEarth && (
            <>
              <div className="mt-5 h-px w-full bg-stardust/15" />
              <div className="mt-4">
                <div className="text-stardust/35 text-[9px] tracking-cosmic uppercase mb-2">
                  vs 地球 · Earth Comparison
                </div>
                <p className="text-stardust/60 text-[10px] leading-relaxed">
                  {vsEarth}
                </p>
              </div>
            </>
          )}

          <div className="mt-5 h-px w-full bg-stardust/15" />

          <p className="mt-4 text-stardust/65 text-[11px] leading-relaxed">
            {data.description}
          </p>
    </div>
  );
}
