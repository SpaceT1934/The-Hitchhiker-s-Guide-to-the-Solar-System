// /api/journey — server-side proxy for the AI Navigator.
// Thin HTTP layer: parsing, error formatting. Business logic lives in src/server/journey/.
//
// Why server-side: the upstream key sits in .env.local and must never
// reach the browser. The client only ever sees the validated Journey JSON.

import { NextResponse } from 'next/server';

import { buildSystemPrompt, validateJourney } from '@/server/journey';
import type { JourneyApiResponse } from '@/shared/journey';

export const runtime = 'nodejs';

export async function POST(req: Request): Promise<NextResponse<JourneyApiResponse>> {
  const apiKey = process.env.OPENAI_API_KEY;
  const baseUrl = process.env.OPENAI_BASE_URL ?? 'https://api.openai.com/v1';
  const model = process.env.NAVIGATOR_MODEL ?? 'gpt-4o';

  if (!apiKey) {
    return NextResponse.json(
      { ok: false, error: 'API key missing on server' },
      { status: 500 }
    );
  }

  let body: { mood?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON body' }, { status: 400 });
  }

  const mood = (body.mood ?? '').trim();
  if (!mood || mood.length > 300) {
    return NextResponse.json(
      { ok: false, error: 'mood must be 1-300 chars' },
      { status: 400 }
    );
  }

  const systemPrompt = buildSystemPrompt();

  let upstreamRes: Response;
  try {
    upstreamRes = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        response_format: { type: 'json_object' },
        temperature: 0.85,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: mood }
        ]
      })
    });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: `Upstream fetch failed: ${(e as Error).message}` },
      { status: 502 }
    );
  }

  if (!upstreamRes.ok) {
    const text = await upstreamRes.text().catch(() => '');
    return NextResponse.json(
      {
        ok: false,
        error: `LLM ${upstreamRes.status}: ${text.slice(0, 200) || 'no body'}`
      },
      { status: 502 }
    );
  }

  let raw: { choices?: Array<{ message?: { content?: string } }> };
  try {
    raw = await upstreamRes.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Upstream returned non-JSON' },
      { status: 502 }
    );
  }

  const content = raw.choices?.[0]?.message?.content;
  if (typeof content !== 'string') {
    return NextResponse.json(
      { ok: false, error: 'Upstream response missing content' },
      { status: 502 }
    );
  }

  // Some providers still wrap JSON in markdown fences even with json_object
  // mode requested. Strip them before parsing.
  const stripped = content
    .trim()
    .replace(/^```(?:json)?\s*/, '')
    .replace(/```\s*$/, '');

  let parsed: unknown;
  try {
    parsed = JSON.parse(stripped);
  } catch {
    return NextResponse.json(
      { ok: false, error: `LLM returned non-JSON: ${stripped.slice(0, 120)}` },
      { status: 502 }
    );
  }

  const validated = validateJourney(parsed as Parameters<typeof validateJourney>[0]);
  if (!validated.ok) {
    return NextResponse.json({ ok: false, error: validated.error }, { status: 502 });
  }

  return NextResponse.json({ ok: true, journey: validated.journey });
}
