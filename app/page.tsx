'use client';

import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import type { ForceGraphProps } from 'react-force-graph-2d';
import type { NodeObject } from 'react-force-graph-2d';
import type { Node, Link, ExpandResponse, Kind } from './types';

// ---- Option A: cast dynamic component to your generics ----------------------
type FGComp = React.ComponentType<ForceGraphProps<Node, Link>>;

const ForceGraph2D = dynamic(
  () =>
    import('react-force-graph-2d').then((m) => m.default as unknown as FGComp),
  { ssr: false }
) as FGComp;
// -----------------------------------------------------------------------------

export default function Page() {
  const [nodes, setNodes] = useState<Node[]>([
    { id: 'Complex Analysis', title: 'Complex Analysis', kind: 'root', fx: 0 },
  ]);
  const [links, setLinks] = useState<Link[]>([]);
  const graphData = useMemo(() => ({ nodes, links }), [nodes, links]);

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/expand', { method: 'POST' });
      const data: ExpandResponse = await res.json();

      const rootId = 'Complex Analysis';
      const jitterY = () => (Math.random() * 2 - 1) * 120;

      const prereqNodes: Node[] = data.prerequisites.map((p) => ({
        id: `prereq:${p.title}`,
        title: p.title,
        kind: 'prereq' as Kind,
        fx: -220,
        fy: jitterY(),
      }));

      const subNodes: Node[] = data.subtopics.map((s) => ({
        id: `sub:${s.title}`,
        title: s.title,
        kind: 'subtopic' as Kind,
        fx: 220,
        fy: jitterY(),
      }));

      const newLinks: Link[] = [
        ...prereqNodes.map((n) => ({ source: rootId, target: n.id })),
        ...subNodes.map((n) => ({ source: rootId, target: n.id })),
      ];

      setNodes((prev) => {
        const have = new Set(prev.map((n) => n.id));
        const add = [...prereqNodes, ...subNodes].filter(
          (n) => !have.has(n.id)
        );
        return [...prev, ...add];
      });
      setLinks(newLinks);
    })();
  }, []);

  return (
    <main style={{ height: '100vh', background: '#0b0f17' }}>
      <ForceGraph2D
        graphData={graphData}
        linkDirectionalParticles={2}
        linkDirectionalParticleSpeed={0.004}
        linkColor={() => '#334155'}
        nodeRelSize={6}
        nodeCanvasObject={(
          node: NodeObject<Node>,
          ctx: CanvasRenderingContext2D
        ) => {
          if (typeof node.x !== 'number' || typeof node.y !== 'number') return;

          const r = 7;
          const color =
            node.kind === 'root'
              ? '#2563eb'
              : node.kind === 'prereq'
              ? '#9ca3af'
              : '#10b981';

          ctx.beginPath();
          ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.fill();

          const label = node.title;
          const fontSize = 12;
          ctx.font = `${fontSize}px system-ui, -apple-system, Segoe UI, Roboto`;
          const textWidth = ctx.measureText(label).width;
          const padX = 6,
            padY = 4;
          const boxW = textWidth + padX * 2;
          const boxH = fontSize + padY * 2;

          ctx.fillStyle = 'rgba(17,24,39,0.85)';
          ctx.fillRect(node.x + r + 6, node.y - boxH / 2, boxW, boxH);

          ctx.fillStyle = '#e5e7eb';
          ctx.fillText(label, node.x + r + 6 + padX, node.y + fontSize / 2 - 2);
        }}
        cooldownTicks={60}
      />
    </main>
  );
}
