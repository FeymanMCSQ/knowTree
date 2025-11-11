// lib/api/expand.ts
import type { ExpandResponse } from '@/types';

export type Relation = 'root' | 'prereq' | 'subtopic';

export interface ExpandOptions {
  /** Context topic to bias expansion toward (not appended to titles). */
  context?: string;
  /** Relationship of the clicked node to the current root. */
  relation?: Relation;
  /** Optional AbortSignal for cancellation. */
  signal?: AbortSignal;
}

export async function expandTopic(
  topic: string,
  opts: ExpandOptions = {}
): Promise<ExpandResponse> {
  const payload: Record<string, unknown> = { topic };
  if (opts.context) payload.context = opts.context;
  if (opts.relation) payload.relation = opts.relation;

  const res = await fetch('/api/expand', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal: opts.signal,
  });

  if (!res.ok) {
    const msg = await res.text().catch(() => '');
    throw new Error(`expand failed: ${res.status} ${msg}`);
  }

  const json = (await res.json()) as ExpandResponse;
  return json;
}
