import { tokens } from '@/app/data/mockData';
import TokenDetails from '@/app/components/TokenDetails';

// Generate static pages for all tokens in our mock data
export async function generateStaticParams() {
  return tokens.map((token) => ({
    id: token.id,
  }));
}

export default function TokenPage({ params }: { params: { id: string } }) {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <TokenDetails id={params.id} />
    </main>
  );
}