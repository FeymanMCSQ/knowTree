// app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import KnowledgeGraph from '@/components/KnowledgeGraph';
import TopicInput from '@/components/TopicInput';
import { useKnowledgeGraph } from '@/hooks/useKnowledgeGraph';
import type { Node } from '@/types';
import type { NodeObject } from 'react-force-graph-2d';

export default function Page() {
  const [topic, setTopic] = useState('Complex Analysis');
  const { graphData, expand, reset } = useKnowledgeGraph(topic);

  // Expand current root when topic changes
  useEffect(() => {
    reset(topic);
    void expand({
      id: topic,
      title: topic,
      kind: 'root',
    } as unknown as NodeObject<Node>);
  }, [topic, expand, reset]);

  return (
    <main
      style={{
        height: '100vh',
        background: '#0b0f17',
        position: 'relative',
      }}
    >
      <TopicInput onSubmit={setTopic} />
      <KnowledgeGraph graphData={graphData} onNodeClick={expand} />
    </main>
  );
}
