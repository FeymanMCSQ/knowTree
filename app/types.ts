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
