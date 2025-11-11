'use client';

import { useState } from 'react';

export default function TopicInput({
  onSubmit,
  placeholder = 'Enter a topic (e.g., Quantum Mechanics)',
}: {
  onSubmit: (topic: string) => void;
  placeholder?: string;
}) {
  const [value, setValue] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const topic = value.trim();
      if (topic) {
        onSubmit(topic);
        setValue(''); // clear after submit
      }
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: 16,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 20,
        width: 'min(90%, 400px)',
      }}
    >
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '10px 14px',
          borderRadius: 8,
          border: '1px solid #334155',
          background: '#0f172a',
          color: '#f8fafc',
          fontSize: 14,
          outline: 'none',
        }}
      />
    </div>
  );
}
