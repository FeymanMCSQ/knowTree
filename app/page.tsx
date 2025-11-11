// app/page.tsx
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
