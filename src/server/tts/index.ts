// TTS proxy — server-side caching + upstream fetch for OpenAI-compatible
// /v1/audio/speech. Capped FIFO cache avoids re-billing the same narration.

const ttsCache = new Map<string, ArrayBuffer>();
const CACHE_LIMIT = 100;

export type TTSRequest = { text: string; voice?: string; model?: string; speed?: number };
export type TTSResult =
  | { ok: true; audio: ArrayBuffer; cached: boolean }
  | { ok: false; error: string; status: number };

export async function synthesizeSpeech(
  req: TTSRequest,
  apiKey: string,
  baseUrl: string
): Promise<TTSResult> {
  const text = req.text.trim();
  const voice = req.voice ?? 'nova';
  const model = req.model ?? 'tts-1';
  const speed = typeof req.speed === 'number' ? req.speed : 0.93;

  if (!text) return { ok: false, error: 'text required', status: 400 };
  if (text.length > 500) return { ok: false, error: 'text > 500 chars', status: 400 };

  const cacheKey = `${model}::${voice}::${speed}::${text}`;
  const cached = ttsCache.get(cacheKey);
  if (cached) return { ok: true, audio: cached, cached: true };

  let upstreamRes: Response;
  try {
    upstreamRes = await fetch(`${baseUrl}/audio/speech`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({ model, voice, input: text, response_format: 'mp3', speed })
    });
  } catch (e) {
    return { ok: false, error: `Upstream fetch failed: ${(e as Error).message}`, status: 502 };
  }

  if (!upstreamRes.ok) {
    const errText = await upstreamRes.text().catch(() => '');
    return {
      ok: false,
      error: `TTS ${upstreamRes.status}: ${errText.slice(0, 200) || 'no body'}`,
      status: 502
    };
  }

  const buf = await upstreamRes.arrayBuffer();

  if (ttsCache.size >= CACHE_LIMIT) {
    const firstKey = ttsCache.keys().next().value;
    if (firstKey) ttsCache.delete(firstKey);
  }
  ttsCache.set(cacheKey, buf);

  return { ok: true, audio: buf, cached: false };
}
