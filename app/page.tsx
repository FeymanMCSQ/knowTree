// 'use client';

// import { useEffect, useMemo, useRef, useState } from 'react';
// import dynamic from 'next/dynamic';
// import type { ForceGraphProps, NodeObject } from 'react-force-graph-2d';
// import type { Node, Link, ExpandResponse, Kind } from '../types';
// import { isNodeRef, toId } from '../types';

// // ---- Option A: cast dynamic component to your generics ----------------------
// type FGComp = React.ComponentType<ForceGraphProps<Node, Link>>;
// const ForceGraph2D = dynamic(
//   () =>
//     import('react-force-graph-2d').then((m) => m.default as unknown as FGComp),
//   { ssr: false }
// ) as FGComp;
// // -----------------------------------------------------------------------------

// export default function Page() {
//   const [nodes, setNodes] = useState<Node[]>([
//     { id: 'Complex Analysis', title: 'Complex Analysis', kind: 'root', fx: 0 },
//   ]);
//   const [links, setLinks] = useState<Link[]>([]);
//   const expandedRef = useRef<Set<string>>(new Set()); // avoid re-expanding same node

//   const graphData = useMemo(() => ({ nodes, links }), [nodes, links]);

//   // Initial load: expand the root once
//   useEffect(() => {
//     void onNodeClick({
//       id: 'Complex Analysis',
//       title: 'Complex Analysis',
//       kind: 'root',
//     } as NodeObject<Node>);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // ---- helpers ---------------------------------------------------------------
//   const hasNode = (id: string) => nodes.some((n) => n.id === id);
//   const hasLink = (s: string | number | Node, t: string | number | Node) =>
//     links.some((l) => {
//       const src = isNodeRef(l.source) ? l.source.id : l.source;
//       const tgt = isNodeRef(l.target) ? l.target.id : l.target;
//       return src === toId(s) && tgt === toId(t);
//     });

//   const jitter = (amp = 120) => (Math.random() * 2 - 1) * amp;

//   // Position children left/right of the clicked node (fallback to 0,0 if sim not settled yet)
//   const childPos = (parent: NodeObject<Node>, side: 'left' | 'right') => {
//     const px = typeof parent.x === 'number' ? parent.x : 0;
//     const py = typeof parent.y === 'number' ? parent.y : 0;
//     return {
//       fx: px + (side === 'left' ? -220 : 220),
//       fy: py + jitter(80),
//     };
//   };

//   // ---- click handler (expands a node) ---------------------------------------
//   async function onNodeClick(nodeObj: NodeObject<Node>) {
//     const parentId = (nodeObj.id as string) ?? nodeObj.title;
//     if (!parentId || !nodeObj.title) return;

//     // prevent duplicate expansion calls
//     if (expandedRef.current.has(parentId)) return;
//     expandedRef.current.add(parentId);

//     const res = await fetch('/api/expand', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ topic: nodeObj.title }),
//     });
//     const data: ExpandResponse = await res.json();

//     const prereqNodes: Node[] = data.prerequisites.map((p) => ({
//       id: `${parentId}::prereq::${p.title}`,
//       title: p.title,
//       kind: 'prereq' as Kind,
//       ...childPos(nodeObj, 'left'),
//     }));

//     const subNodes: Node[] = data.subtopics.map((s) => ({
//       id: `${parentId}::sub::${s.title}`,
//       title: s.title,
//       kind: 'subtopic' as Kind,
//       ...childPos(nodeObj, 'right'),
//     }));

//     const newLinks: Link[] = [
//       ...prereqNodes.map((n) => ({ source: parentId, target: n.id })),
//       ...subNodes.map((n) => ({ source: parentId, target: n.id })),
//     ];

//     // append without duplicates
//     setNodes((prev) => {
//       const existing = new Set(prev.map((n) => n.id));
//       const additions = [...prereqNodes, ...subNodes].filter(
//         (n) => !existing.has(n.id)
//       );
//       return additions.length ? [...prev, ...additions] : prev;
//     });

//     setLinks((prev) => {
//       const next = [...prev];
//       for (const L of newLinks) {
//         if (!hasLink(L.source, L.target)) next.push(L);
//       }
//       return next;
//     });
//   }

//   return (
//     <main style={{ height: '100vh', background: '#0b0f17' }}>
//       <ForceGraph2D
//         graphData={graphData}
//         linkDirectionalParticles={2}
//         linkDirectionalParticleSpeed={0.004}
//         linkColor={() => '#334155'}
//         nodeRelSize={6}
//         onNodeClick={(n) => void onNodeClick(n as NodeObject<Node>)}
//         nodeCanvasObject={(
//           node: NodeObject<Node>,
//           ctx: CanvasRenderingContext2D
//         ) => {
//           if (typeof node.x !== 'number' || typeof node.y !== 'number') return;

//           const r = 7;
//           const color =
//             node.kind === 'root'
//               ? '#2563eb'
//               : node.kind === 'prereq'
//               ? '#9ca3af'
//               : '#10b981';

//           ctx.beginPath();
//           ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
//           ctx.fillStyle = color;
//           ctx.fill();

//           const label = node.title;
//           const fontSize = 12;
//           ctx.font = `${fontSize}px system-ui, -apple-system, Segoe UI, Roboto`;
//           const textWidth = ctx.measureText(label).width;
//           const padX = 6,
//             padY = 4;
//           const boxW = textWidth + padX * 2;
//           const boxH = fontSize + padY * 2;

//           ctx.fillStyle = 'rgba(17,24,39,0.85)';
//           ctx.fillRect(node.x + r + 6, node.y - boxH / 2, boxW, boxH);

//           ctx.fillStyle = '#e5e7eb';
//           ctx.fillText(label, node.x + r + 6 + padX, node.y + fontSize / 2 - 2);
//         }}
//         cooldownTicks={60}
//       />
//     </main>
//   );
// }

'use client';

import { useEffect } from 'react';
import KnowledgeGraph from '@/components/KnowledgeGraph';
import { useKnowledgeGraph } from '@/hooks/useKnowledgeGraph';
import type { Node, Link } from '@/types';
import type { NodeObject } from 'react-force-graph-2d';

export default function Page() {
  const { graphData, expand } = useKnowledgeGraph('Complex Analysis');

  useEffect(() => {
    // expand root once on mount
    void expand({
      id: 'Complex Analysis',
      title: 'Complex Analysis',
      kind: 'root',
    } as unknown as NodeObject<Node>);
  }, [expand]);

  return (
    <main style={{ height: '100vh', background: '#0b0f17' }}>
      <KnowledgeGraph graphData={graphData} onNodeClick={expand} />
    </main>
  );
}
