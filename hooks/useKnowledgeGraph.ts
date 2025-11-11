// /hooks/useKnowledgeGraph.ts
'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import { expandTopic } from '@/lib/api/expand';
import { appendLinksUniq } from '@/utils/graph';
import { childId } from '@/utils/ids';
import type { Node, Link, ExpandResponse, Kind } from '@/types';
import type { NodeObject } from 'react-force-graph-2d';

/** Build a vertical stack of child positions around the parent (no randomness). */
function mkStackPos(
  parent: NodeObject<Node>,
  side: 'left' | 'right',
  count: number,
  gap = 36, // vertical spacing between siblings
  xOffset = 260 // horizontal distance from parent
) {
  const px = typeof parent.x === 'number' ? parent.x : 0;
  const py = typeof parent.y === 'number' ? parent.y : 0;
  const baseX = px + (side === 'left' ? -xOffset : xOffset);
  const mid = (count - 1) / 2; // center the stack vertically on parent
  return (i: number) => ({ fx: baseX, fy: py + (i - mid) * gap });
}

export function useKnowledgeGraph(initialRoot = 'Complex Analysis') {
  const [nodes, setNodes] = useState<Node[]>([
    { id: initialRoot, title: initialRoot, kind: 'root', fx: 0 },
  ]);
  const [links, setLinks] = useState<Link[]>([]);
  const expanded = useRef<Set<string>>(new Set());

  const graphData = useMemo(() => ({ nodes, links }), [nodes, links]);

  // Reset the graph to a new root topic
  const reset = useCallback((root: string) => {
    setNodes([{ id: root, title: root, kind: 'root', fx: 0 }]);
    setLinks([]);
    expanded.current.clear();
  }, []);

  const expand = useCallback(async (parent: NodeObject<Node>) => {
    const parentId = (parent.id as string) ?? parent.title;
    if (!parentId || !parent.title) return;
    if (expanded.current.has(parentId)) return;
    expanded.current.add(parentId);

    const data: ExpandResponse = await expandTopic(parent.title);

    // Precompute positioners so siblings are neatly stacked
    const posLeft = mkStackPos(parent, 'left', data.prerequisites.length);
    const posRight = mkStackPos(parent, 'right', data.subtopics.length);

    const prereqs: Node[] = data.prerequisites.map((p, i) => ({
      id: childId(parentId, 'prereq', p.title),
      title: p.title,
      kind: 'prereq' as Kind,
      ...posLeft(i),
    }));

    const subs: Node[] = data.subtopics.map((s, i) => ({
      id: childId(parentId, 'sub', s.title),
      title: s.title,
      kind: 'subtopic' as Kind,
      ...posRight(i),
    }));

    setNodes((prev) => {
      const seen = new Set(prev.map((n) => n.id));
      const add = [...prereqs, ...subs].filter((n) => !seen.has(n.id));
      return add.length ? [...prev, ...add] : prev;
    });

    const newLinks: Link[] = [
      ...prereqs.map((n) => ({ source: parentId, target: n.id })),
      ...subs.map((n) => ({ source: parentId, target: n.id })),
    ];
    setLinks((prev) => appendLinksUniq(prev, newLinks));
  }, []);

  return { graphData, expand, reset, nodes, links, setNodes, setLinks };
}
