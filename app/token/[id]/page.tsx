import { tokens } from '@/data/tokens';
import TokenDetails from '@/components/TokenDetails';
import { Suspense } from 'react';

// Generate static pages for all tokens in our mock data
export async function generateStaticParams() {
  return tokens.map((token) => ({
    id: token.id,
  }));
}


export default async function TokenPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params; // Resolve the Promise
  const token = tokens.find((t) => t.id === resolvedParams.id || t.symbol === resolvedParams.id);

  // Await the params before using them
  const { id } = await params;

  return (
    <main className="container mx-auto max-w-4xl px-4 py-8">
      <Suspense fallback={<div>Loading token details...</div>}>
        <TokenDetails id={id} />
      </Suspense>
    </main>
  );
}
