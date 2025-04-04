import { tokens } from '@/app/data/mockData';
import TokenDetails from '@/app/components/TokenDetails';

// Generate static pages for all tokens in our mock data
export async function generateStaticParams() {
  return tokens.map((token) => ({
    id: token.id,
  }));
}

export default async function TokenPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <TokenDetails id={params.id} />
    </main>
  );
}