import { tokens } from '@/data/mockData';
import TokenDetails from '@/components/TokenDetails';

// Generate static pages for all tokens in our mock data
export async function generateStaticParams() {
  return tokens.map((token) => ({
    id: token.id,
  }));
}

export default async function TokenPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  return (
    <main className="container mx-auto max-w-4xl px-4 py-8">
      <TokenDetails id={params.id} />
    </main>
  );
}
