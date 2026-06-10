'use client';

import { PLANET_LABELS, useSceneStore } from '@/client/store/sceneStore';
import { PlanetCard } from './PlanetCard';
import { ArtifactCard } from './ArtifactCard';
import { VoyagePlot } from './VoyagePlot';
import { MoviePanel } from './MoviePanel';
import { LibraryPanel } from './LibraryPanel';
import { KnowledgeTicker } from './KnowledgeTicker';

export function HUD() {
  const {
    status,
    focused,
    focusedArtifact,
    voyageFrom,
    voyageTo,
    setFocused,
    setFocusedArtifact,
    cancelVoyage,
    introDone,
    navigatorPhase,
    journey,
    journeyStopIndex
  } = useSceneStore();

  const inVoyage = status === 'voyaging';
  // "In focus" can mean either a focused planet OR a focused spacecraft.
  // We treat artifact-focus the same as planet-focus for HUD layout (back
  // button shows up, voyage strip hides).
  const inFocus = status === 'overview' && (focused !== null || focusedArtifact !== null);
  const inOverview = status === 'overview' && focused === null && focusedArtifact === null;

  const brandLine = inVoyage
    ? voyageFrom && voyageTo
      ? `${PLANET_LABELS[voyageFrom]} → ${PLANET_LABELS[voyageTo]}`
      : 'In transit'
    : focused || focusedArtifact
      ? '观察中 · Observing'
      : '太阳系漫游指南 · Solar System Guide';

  // Brand line + full HUD hides during Navigator prompt / loading / preview.
  // But the top-left science card stays visible during journey (running) —
  // JourneyController keeps focused/focusedArtifact in sync with the current
  // stop, so PlanetCard/ArtifactCard auto-updates without duplication.
  const navigatorActive = navigatorPhase !== 'closed';
  const hudVisible = introDone && !navigatorActive;
  const inJourney = navigatorPhase === 'running';
  // Top-left card is always visible when we have a target (including during journey)
  const cardVisible = introDone && (navigatorPhase === 'closed' || navigatorPhase === 'running');
  const fadeCls = `transition-opacity duration-1000 ease-out ${
    hudVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
  }`;
  const cardFadeCls = `transition-opacity duration-1000 ease-out ${
    cardVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
  }`;

  // Return clears spacecraft focus first, then planet focus on the second
  // press — so the user backs out of the artifact view to the parent
  // planet view, then to overview, in two readable steps.
  const onReturn = () => {
    if (focusedArtifact) {
      setFocusedArtifact(null);
      return;
    }
    setFocused(null);
  };

  return (
    <>
      {/* Unified top-left panel — brand header + science card in one div */}
      <div
        className={`absolute top-8 left-10 z-10 pointer-events-none select-none ${cardFadeCls}`}
      >
        {/* Brand title — only when HUD is fully visible (overview / focus) */}
        {hudVisible && (
          <>
            <div className="text-stardust/85 text-xs tracking-cosmic uppercase">
              太阳系漫游指南
            </div>
            <div className="mt-3 text-stardust/40 text-[10px] tracking-wider2 uppercase">
              {brandLine}
            </div>
            <div className="mt-4 h-px w-12 bg-stardust/20" />
            <div className="mt-4" />
          </>
        )}

        {/* Journey progress — only during journey running */}
        {inJourney && journey && (
          <div className="mb-3 text-stardust/35 text-[9px] tracking-cosmic uppercase tabular-nums">
            第 {String(journeyStopIndex + 1).padStart(2, '0')} 站 / {String(journey.stops.length).padStart(2, '0')}
          </div>
        )}

        {focusedArtifact ? <ArtifactCard /> : <PlanetCard />}
      </div>

      {inOverview && <VoyagePlot fadeCls={fadeCls} />}

      {inFocus && (
        <div className={`absolute bottom-10 right-10 z-10 worlds-fade-in-delayed ${fadeCls}`}>
          <button
            type="button"
            onClick={onReturn}
            className="group relative flex items-center gap-4 px-6 py-3 border border-stardust/30 hover:border-stardust/60 bg-stardust/[0.02] hover:bg-stardust/[0.06] backdrop-blur-md transition-all duration-700 ease-out"
          >
            <span className="text-stardust/55 group-hover:text-stardust/90 group-hover:-translate-x-1 transition-all duration-500 ease-out">
              ←
            </span>
            <span className="text-stardust/90 text-[11px] tracking-cosmic uppercase">
              {focusedArtifact ? '返回行星 · Back' : '返回系统 · Return'}
            </span>
          </button>
        </div>
      )}

      {inVoyage && (
        <div className={`absolute bottom-10 right-10 z-10 worlds-fade-in ${fadeCls}`}>
          <button
            type="button"
            onClick={cancelVoyage}
            className="px-5 py-2.5 border border-stardust/20 hover:border-stardust/45 text-stardust/55 hover:text-stardust/85 text-[11px] tracking-cosmic uppercase bg-stardust/[0.02] hover:bg-stardust/[0.05] backdrop-blur-md transition-all duration-500"
          >
            中止 · Abort
          </button>
        </div>
      )}

      <div
        className={`absolute bottom-3 left-1/2 -translate-x-1/2 z-10 pointer-events-none select-none text-stardust/25 text-[10px] tracking-cosmic uppercase ${fadeCls}`}
      >
        {inVoyage
          ? '传送中 · 保持稳定 · Engaging transit'
          : inFocus
            ? '拖拽环绕 · 滚轮靠近 · WASD 自由飞行 · ⌘K 唤起领航员'
            : 'WASD 自由飞行 · 拖拽 · 滚轮 · 规划路线 · ⌘K 唤起领航员'}
      </div>

      <MoviePanel />
      <LibraryPanel />
      <KnowledgeTicker />
    </>
  );
}
