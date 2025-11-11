// app/page.tsx
'use client';

import KnowledgeGraph from '@/components/KnowledgeGraph';
import TopicInput from '@/components/TopicInput';
import { useKnowledgeGraph } from '@/hooks/useKnowledgeGraph';
import type { Node } from '@/types';
import type { NodeObject } from 'react-force-graph-2d';
import { useState, useEffect, useCallback } from 'react';

export default function Page() {
  const [topic, setTopic] = useState('Quantum Mechanics');
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

  // Click policy:
  // - subtopic => "<title> (<current root>)"
  // - prereq   => "<title>" (canonical, no context suffix)
  // - root     => just expand
  const handleNodeClick = useCallback(
    (node: NodeObject<Node>) => {
      const clicked = node.title?.trim();
      if (!clicked) return;

      if (clicked === topic) {
        void expand(node);
        return;
      }

      if (node.kind === 'subtopic') {
        const contextual = `${clicked} (${topic})`;
        if (contextual !== topic) setTopic(contextual);
      } else if (node.kind === 'prereq') {
        if (clicked !== topic) setTopic(clicked);
      } else {
        // default: treat like root/topic
        if (clicked !== topic) setTopic(clicked);
      }
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
