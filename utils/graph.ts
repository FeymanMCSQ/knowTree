import type { Link, Node } from '@/types';

// Type guard: Node-ish object with id
export function isNodeRef(v: unknown): v is Node {
  return (
    typeof v === 'object' &&
    v !== null &&
    'id' in (v as Record<string, unknown>)
  );
}

export function toId(v: string | number | Node): string | number {
  return isNodeRef(v) ? v.id : v;
}

/** Check if (source,target) already exists (normalizing Node | id) */
export function hasLink(
  links: Link[],
  s: string | number | Node,
  t: string | number | Node
) {
  const sid = toId(s);
  const tid = toId(t);
  return links.some((l) => toId(l.source) === sid && toId(l.target) === tid);
}

/** Add links if missing */
export function appendLinksUniq(prev: Link[], candidates: Link[]): Link[] {
  const next = [...prev];
  for (const L of candidates)
    if (!hasLink(next, L.source, L.target)) next.push(L);
  return next;
}
