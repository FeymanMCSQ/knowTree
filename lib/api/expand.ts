import type { ExpandResponse } from '@/types';

export async function expandTopic(topic: string): Promise<ExpandResponse> {
  const res = await fetch('/api/expand', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic }),
  });
  if (!res.ok) throw new Error(`expand failed: ${res.status}`);
  return res.json();
}
