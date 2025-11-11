// app/page.tsx
'use client';

import { useEffect, useState, useCallback } from 'react';
import KnowledgeGraph from '@/components/KnowledgeGraph';
import TopicInput from '@/components/TopicInput';
import { useKnowledgeGraph } from '@/hooks/useKnowledgeGraph';
import type { Node } from '@/types';
import type { NodeObject } from 'react-force-graph-2d';

export default function Page() {
  const [topic, setTopic] = useState('Quantum Mechanics'); // example default
  const { graphData, expand, reset } = useKnowledgeGraph(topic);

  // Rebuild when topic changes
  useEffect(() => {
    reset(topic);
    void expand({
      id: topic,
      title: topic,
      kind: 'root',
    } as unknown as NodeObject<Node>);
  }, [topic, expand, reset]);

  // Clicking a node: make it the new contextual root: "<title> (<current root>)"
  const handleNodeClick = useCallback(
    (node: NodeObject<Node>) => {
      const clicked = node.title?.trim();
      if (!clicked) return;

      // If you click the current root, just expand it normally
      if (clicked === topic) {
        void expand(node);
        return;
      }

      const contextual = `${clicked} (${topic})`;
      // Avoid useless resets if already on that contextual topic
      if (contextual !== topic) setTopic(contextual);
    },
    [topic, expand]
  );

  return (
    <main
      style={{ height: '100vh', background: '#0b0f17', position: 'relative' }}
    >
      <TopicInput onSubmit={setTopic} />
      <KnowledgeGraph graphData={graphData} onNodeClick={handleNodeClick} />
    </main>
  );
}
