'use client';

import { useEffect, useRef } from 'react';

export type KeyState = {
  w: boolean;
  a: boolean;
  s: boolean;
  d: boolean;
  q: boolean;
  e: boolean;
};

/** Tracks WASD+QE key state for free-fly camera movement.
 *  Keys are held in a ref (not React state) to avoid re-renders
 *  inside the rAF loop. */
export function useWASDKeys() {
  const keysRef = useRef<KeyState>({ w: false, a: false, s: false, d: false, q: false, e: false });

  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k in keysRef.current) (keysRef.current as Record<string, boolean>)[k] = true;
    };
    const onUp = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k in keysRef.current) (keysRef.current as Record<string, boolean>)[k] = false;
    };
    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    return () => {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
    };
  }, []);

  return keysRef;
}
