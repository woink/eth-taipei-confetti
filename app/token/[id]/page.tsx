import { tokens } from '@/data/tokens';
import TokenDetails from '@/components/TokenDetails';
import { Suspense } from 'react';

// Generate static pages for all tokens in our mock data
export async function generateStaticParams() {
  return tokens.map((token) => ({
    id: token.id,
  }));
}

// This is a Server Component that handles the async data fetching
async function TokenData({ id }: { id: string }) {
  const token = tokens.find((t) => t.id === id || t.symbol === id);
  return token ? <TokenDetails id={token.id} /> : <div>Token not found</div>;
}

export default async function TokenPage({ params }: { params: Promise<{ id: string }> }) {
  // Await the params before using them
  const { id } = await params;

  return (
    <main className="container mx-auto max-w-4xl px-4 py-8">
      <Suspense fallback={<div>Loading token details...</div>}>
        <TokenData id={id} />
      </Suspense>
    </main>
  );
}
