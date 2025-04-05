import { tokens } from '@/data/tokens';
import TokenDetails from '@/components/TokenDetails';

// Generate static pages for all tokens in our mock data
export async function generateStaticParams() {
  return tokens.map((token) => ({
    id: token.id,
  }));
}

export default async function TokenPage({ params }: { params: { id: string } }) {
  // Find token by ID or by symbol (for backward compatibility)
  const token = tokens.find((t) => t.id === params.id || t.symbol === params.id);

  if (!token) {
    return (
      <main className="container mx-auto max-w-4xl px-4 py-8">
        <div>Token not found</div>
      </main>
    );
  }

  return (
    <main className="container mx-auto max-w-4xl px-4 py-8">
      <TokenDetails id={token.id} />
    </main>
  );
}
