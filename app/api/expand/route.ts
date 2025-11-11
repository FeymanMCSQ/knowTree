// /app/api/expand/route.ts
import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import type { ExpandResponse } from '@/types';

// Force Node runtime for server-side fetch
export const runtime = 'nodejs';

// --- OpenRouter config via OpenAI SDK ------------------------------
// Docs: baseURL + attribution headers are recommended.
const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY, // <-- use OpenRouter key
  baseURL: 'https://openrouter.ai/api/v1', // <-- point SDK at OpenRouter
  defaultHeaders: {
    'HTTP-Referer': process.env.APP_URL ?? 'http://localhost:3000', // your app URL
    'X-Title': process.env.APP_NAME ?? 'Knowledge Tree', // display name
  },
});
// ------------------------------------------------------------------

// Minimal expected shape for parsing
type RawExpand = { prerequisites?: unknown; subtopics?: unknown };
type TopicItem = { title?: unknown; desc?: unknown };

// tiny sanitizer (no deps)
function normArray(v: unknown, max = 8): { title: string; desc: string }[] {
  if (!Array.isArray(v)) return [];
  return v
    .slice(0, max)
    .map((x): { title: string; desc: string } => {
      const item = x as TopicItem;
      const title =
        typeof item.title === 'string' ? item.title.slice(0, 80) : '';
      const desc = typeof item.desc === 'string' ? item.desc.slice(0, 140) : '';
      return { title, desc };
    })
    .filter((x) => x.title.length > 0);
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({} as { topic?: unknown }));
    const topic = typeof body?.topic === 'string' ? body.topic.trim() : '';
    if (!topic) {
      return NextResponse.json({ error: 'Missing "topic"' }, { status: 400 });
    }

    const completion = await openai.chat.completions.create({
      // OpenRouter model slug:
      model: 'x-ai/grok-4-fast',
      response_format: { type: 'json_object' }, // JSON mode
      temperature: 0.2,
      max_tokens: 1000,
      messages: [
        {
          role: 'system',
          content: [
            'You are a comprehensive curriculum mapper.',
            'Return ONLY JSON with two arrays: "prerequisites" and "subtopics".',
            'Each item: { "title": string, "desc": string }. No extra keys.',
            'Keep titles short (≤ 6 words). Keep desc ≤ 140 chars.',
            'Prefer foundational math prereqs; choose canonical subtopics.',
            'Ensure an extremely comprehensive coverage of the prereqs and subtopics',
            'Every possible topic must be covered',
            'Limit total items to ≤ 15 each (small is fine).',
          ].join(' '),
        },
        {
          role: 'user',
          content: `Given topic "${topic}", output prerequisites and subtopics in JSON.`,
        },
      ],
    });

    const raw = completion.choices[0]?.message?.content ?? '{}';

    // Parse & validate
    let parsed: RawExpand = {};
    try {
      const candidate = JSON.parse(raw) as unknown;
      if (typeof candidate === 'object' && candidate !== null) {
        parsed = candidate as RawExpand;
      }
    } catch {
      parsed = {};
    }

    const payload: ExpandResponse = {
      prerequisites: normArray(parsed.prerequisites, 8),
      subtopics: normArray(parsed.subtopics, 8),
    };

    return NextResponse.json(payload, { status: 200 });
  } catch (err) {
    console.error('expand error:', err);
    // Fail-soft → keep UI usable
    const fallback: ExpandResponse = { prerequisites: [], subtopics: [] };
    return NextResponse.json(fallback, { status: 500 });
  }
}
