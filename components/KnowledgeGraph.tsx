import dynamic from 'next/dynamic';
import type { ForceGraphProps, NodeObject } from 'react-force-graph-2d';
import type { Node, Link } from '@/types';

type FGComp = React.ComponentType<ForceGraphProps<Node, Link>>;
const ForceGraph2D = dynamic(
  () =>
    import('react-force-graph-2d').then((m) => m.default as unknown as FGComp),
  { ssr: false }
) as FGComp;

// Define the canvas renderer type the lib expects
type CanvasRenderer = (
  node: NodeObject<Node>,
  ctx: CanvasRenderingContext2D,
  globalScale: number
) => void;

// ✅ Fully typed canvas renderer (no `any`, no missing export)
const renderNode: CanvasRenderer = (node, ctx, _globalScale) => {
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
};

export default function KnowledgeGraph({
  graphData,
  onNodeClick,
}: {
  graphData: { nodes: Node[]; links: Link[] };
  onNodeClick?: (node: NodeObject<Node>) => void;
}) {
  return (
    <ForceGraph2D
      graphData={graphData}
      linkDirectionalParticles={2}
      linkDirectionalParticleSpeed={0.004}
      linkColor={() => '#334155'}
      nodeRelSize={6}
      onNodeClick={(n) => onNodeClick?.(n as NodeObject<Node>)}
      nodeCanvasObject={renderNode}
      cooldownTicks={60}
    />
  );
}
