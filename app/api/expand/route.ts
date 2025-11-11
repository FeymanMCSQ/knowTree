import { NextResponse } from 'next/server';

export async function POST() {
  // For now, we’re returning mock data to simulate the AI response.
  const mockData = {
    prerequisites: [
      { title: 'Differentiation', desc: 'Finding instantaneous rates' },
      {
        title: 'Complex Numbers',
        desc: 'Numbers with real and imaginary parts',
      },
    ],
    subtopics: [
      { title: 'Cauchy–Riemann Equations', desc: 'Conditions for analyticity' },
      {
        title: 'Contour Integration',
        desc: 'Integrating complex functions around paths',
      },
    ],
  };

  return NextResponse.json(mockData);
}
