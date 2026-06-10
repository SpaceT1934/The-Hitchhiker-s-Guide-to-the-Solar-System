// /api/tts — server-side proxy for OpenAI-compatible /v1/audio/speech.
// Thin HTTP layer. Business logic lives in src/server/tts/.
//
// Same key-hiding model as /api/journey: the upstream API key never
// reaches the client.

import { NextResponse } from 'next/server';
import { synthesizeSpeech } from '@/server/tts';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  const baseUrl = process.env.OPENAI_BASE_URL ?? 'https://api.openai.com/v1';

  if (!apiKey) {
    return NextResponse.json({ error: 'API key missing on server' }, { status: 500 });
  }

  let body: { text?: string; voice?: string; model?: string; speed?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const result = await synthesizeSpeech(
    {
      text: body.text ?? '',
      voice: body.voice,
      model: body.model,
      speed: body.speed
    },
    apiKey,
    baseUrl
  );

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return new NextResponse(result.audio, {
    headers: {
      'Content-Type': 'audio/mpeg',
      'Cache-Control': 'public, max-age=86400',
      'X-Cache': result.cached ? 'HIT' : 'MISS'
    }
  });
}
