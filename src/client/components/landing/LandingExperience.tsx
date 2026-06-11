'use client';

import { useCallback } from 'react';

import { useSceneStore } from '@/client/store/sceneStore';

// LandingExperience — refined entry screen for the Solar System Guide.
// Clean, structured layout with orbital motif, keeping the dark cosmic aesthetic.

const EXIT_FADE_MS = 1200;

export function LandingExperience() {
  const { introDone, setIntroDone } = useSceneStore();
  const onEnter = useCallback(() => setIntroDone(true), [setIntroDone]);

  if (introDone) return null;

  return (
    <div
      className="fixed inset-0 z-20 bg-deep overflow-hidden"
      style={{
        opacity: introDone ? 0 : 1,
        transition: `opacity ${EXIT_FADE_MS}ms ease-out`
      }}
    >
      {/* Ambient background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(155,216,255,0.03) 0%, transparent 70%)' }}
      />

      {/* Top hairline */}
      <div className="absolute top-0 left-0 right-0 h-px bg-stardust/8" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-stardust/8" />

      {/* Skip */}
      <button
        type="button"
        onClick={onEnter}
        className="absolute top-7 right-10 z-10 text-stardust/25 hover:text-stardust/70 text-[10px] tracking-cosmic uppercase transition-colors duration-700"
      >
        跳过 · Skip →
      </button>

      {/* Main content */}
      <div className="relative h-full flex flex-col items-center justify-center px-10">

        {/* Orbital ring decoration */}
        <div className="absolute pointer-events-none" style={{ width: 320, height: 320 }}>
          <svg viewBox="0 0 320 320" className="w-full h-full opacity-[0.06]">
            <ellipse cx="160" cy="160" rx="150" ry="60" fill="none" stroke="#7aa2ff" strokeWidth="0.5" strokeDasharray="3 6" />
            <ellipse cx="160" cy="160" rx="120" ry="90" fill="none" stroke="#7aa2ff" strokeWidth="0.5" strokeDasharray="2 8" transform="rotate(-25 160 160)" />
            <circle cx="230" cy="120" r="2" fill="#7aa2ff" opacity="0.4" />
          </svg>
        </div>

        {/* Title block */}
        <div className="text-center max-w-[680px] relative z-10">
          {/* Main title */}
          <h1
            className="text-stardust/95 font-light text-[36px] md:text-[42px] leading-[1.2] tracking-wider2"
            style={{ textShadow: '0 0 60px rgba(155,216,255,0.15)' }}
          >
            太阳系漫游指南
          </h1>

          {/* English subtitle */}
          <p className="mt-4 text-stardust/35 text-[13px] tracking-cosmic uppercase">
            The Hitchhiker&apos;s Guide to the Solar System
          </p>

          {/* Divider */}
          <div className="mt-10 flex items-center justify-center gap-4">
            <span className="block w-12 h-px bg-stardust/15" />
            <span className="block w-1 h-1 rounded-full bg-stardust/30" />
            <span className="block w-12 h-px bg-stardust/15" />
          </div>

          {/* Tagline */}
          <p className="mt-10 text-stardust/55 font-light text-[17px] md:text-[19px] leading-relaxed tracking-wider2">
            科学从提问开始，想象力带我们抵达星辰
          </p>
          <p className="mt-3 text-stardust/30 font-light text-[13px] leading-relaxed tracking-wider2">
            每一颗行星都有两个故事 —— 一个属于科学，一个属于想象
          </p>

          {/* CTA */}
          <div className="mt-16">
            <button
              type="button"
              onClick={onEnter}
              className="group relative px-20 py-5 bg-transparent border border-stardust/30 hover:border-stardust/60 text-stardust/90 hover:text-stardust text-[15px] tracking-cosmic uppercase font-light transition-all duration-1000 ease-out"
              style={{ boxShadow: '0 0 100px rgba(155,216,255,0.08)' }}
            >
              <span className="relative z-10">进入太阳系 · Enter</span>
              <span className="absolute inset-0 bg-stardust/[0.02] group-hover:bg-stardust/[0.04] transition-colors duration-1000" />
            </button>
          </div>

          {/* Footer hint */}
          <p className="mt-10 text-stardust/20 text-[10px] tracking-wider2">
            按 ⌘K 可随时向 AI 提问，探索你好奇的一切
          </p>
        </div>
      </div>
    </div>
  );
}
