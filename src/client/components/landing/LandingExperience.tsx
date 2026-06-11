'use client';

import { useCallback } from 'react';

import { useSceneStore } from '@/client/store/sceneStore';

// LandingExperience — simple static opening overlay.
// Text + button, click to enter the main Solar System scene.

const EXIT_FADE_MS = 1200;

const textGlow = { textShadow: '0 0 36px rgba(155,216,255,0.22)' };

export function LandingExperience() {
  const { introDone, setIntroDone } = useSceneStore();

  const onEnter = useCallback(() => setIntroDone(true), [setIntroDone]);

  if (introDone) return null;

  return (
    <div
      className="fixed inset-0 z-20 flex items-center justify-center bg-deep"
      style={{
        opacity: introDone ? 0 : 1,
        transition: `opacity ${EXIT_FADE_MS}ms ease-out`
      }}
    >
      {/* Top-bottom hairlines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-stardust/8" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-stardust/8" />

      {/* Skip control */}
      <button
        type="button"
        onClick={onEnter}
        className="absolute top-7 right-10 text-stardust/30 hover:text-stardust/80 text-[10px] tracking-cosmic uppercase transition-colors duration-700"
      >
        跳过 · Skip →
      </button>

      {/* Text + button */}
      <div className="text-center max-w-[720px] px-10">
        <p
          className="text-stardust/90 font-thin text-[30px] md:text-[34px] leading-[1.45] tracking-wider2"
          style={textGlow}
        >
          Science begins with a question.
          <br />
          Imagination carries us to the stars.
        </p>
        <p className="mt-8 text-stardust/50 font-thin text-[15px] leading-loose tracking-wider2">
          科学从提问开始，
          <br />
          想象力带我们抵达星辰。
        </p>
        <p className="mt-12 text-stardust/35 font-thin text-[13px] leading-loose tracking-wider2">
          每一颗行星都有两个故事，
          <br />
          一个属于科学，一个属于想象。
        </p>

        <div className="mt-16">
          <button
            type="button"
            onClick={onEnter}
            className="px-14 py-4 bg-white/[0.03] hover:bg-white/[0.07] backdrop-blur-md border border-white/15 hover:border-white/35 text-stardust/85 hover:text-stardust text-[11px] tracking-cosmic uppercase font-thin transition-all duration-700 ease-out"
            style={{ boxShadow: '0 0 60px rgba(155,216,255,0.06)' }}
          >
            Begin Exploration · 开始探索
          </button>
        </div>
      </div>
    </div>
  );
}
