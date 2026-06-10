// Journey validation — ensures the LLM's response maps to real inventory.
// Server-only.

import { isValidFilmPath, isValidPlanetId, isValidSpacecraftId } from '@/client/data/journeyInventory';
import type { Journey, JourneyStop } from '@/shared/journey';

export type LLMStop = {
  target?: { kind?: string; id?: string };
  narration?: string;
  filmPath?: string | null;
};

export type LLMResponse = {
  mood?: string;
  stops?: LLMStop[];
  closing?: string;
};

const NEAR_EARTH: Array<string> = [
  'earth', 'moon', 'iss', 'hubble', 'apollo_lm', 'lro'
];

export function validateJourney(
  raw: LLMResponse
): { ok: true; journey: Journey } | { ok: false; error: string } {
  if (!raw || typeof raw !== 'object') {
    return { ok: false, error: 'Journey is not an object' };
  }
  const mood = typeof raw.mood === 'string' ? raw.mood.trim() : '';
  if (!mood) return { ok: false, error: 'Missing mood' };

  const closing = typeof raw.closing === 'string' ? raw.closing.trim() : '';
  if (!closing) return { ok: false, error: 'Missing closing' };

  if (!Array.isArray(raw.stops) || raw.stops.length < 3 || raw.stops.length > 6) {
    return { ok: false, error: 'stops must be a 3-6 entry array' };
  }

  const seenFilms = new Set<string>();
  const stops: JourneyStop[] = [];

  for (const s of raw.stops) {
    const narration = typeof s.narration === 'string' ? s.narration.trim() : '';
    const rawFilm = s.filmPath;
    const filmPath =
      typeof rawFilm === 'string' && rawFilm.trim() ? rawFilm.trim() : null;
    const targetKind = s.target?.kind;
    const targetId = s.target?.id;

    if (!narration) return { ok: false, error: 'Stop missing narration' };

    if (filmPath !== null) {
      if (!isValidFilmPath(filmPath)) {
        return { ok: false, error: `Unknown filmPath: ${filmPath}` };
      }
      if (seenFilms.has(filmPath)) {
        return { ok: false, error: `Duplicate film: ${filmPath}` };
      }
      seenFilms.add(filmPath);
    }

    if (targetKind === 'planet') {
      if (!isValidPlanetId(targetId)) {
        return { ok: false, error: `Unknown planet id: ${targetId}` };
      }
      stops.push({ target: { kind: 'planet', id: targetId }, narration, filmPath });
    } else if (targetKind === 'spacecraft') {
      if (!isValidSpacecraftId(targetId)) {
        return { ok: false, error: `Unknown spacecraft id: ${targetId}` };
      }
      stops.push({ target: { kind: 'spacecraft', id: targetId }, narration, filmPath });
    } else {
      return { ok: false, error: `Unknown target kind: ${targetKind}` };
    }
  }

  const first = stops[0];
  if (!NEAR_EARTH.includes(first.target.id)) {
    return { ok: false, error: `First stop must be near Earth, got ${first.target.id}` };
  }

  return { ok: true, journey: { mood, stops, closing } };
}
