export type Kind = 'root' | 'prereq' | 'subtopic';

export type Node = {
  id: string;
  title: string;
  kind: Kind;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number;
  fy?: number;
  [others: string]: unknown;
};

// Allow ids or node objects, matching react-force-graph
export type Link = {
  source: string | number | Node;
  target: string | number | Node;
  [others: string]: unknown;
};

export type ExpandResponse = {
  prerequisites: { title: string; desc: string }[];
  subtopics: { title: string; desc: string }[];
};

// Type guard: is this a Node (has an id)?
export function isNodeRef(v: unknown): v is Node {
  return (
    typeof v === 'object' &&
    v !== null &&
    'id' in (v as Record<string, unknown>)
  );
}

// Normalize a link endpoint (string | number | Node) → string | number
export function toId(v: string | number | Node): string | number {
  return isNodeRef(v) ? v.id : v;
}
