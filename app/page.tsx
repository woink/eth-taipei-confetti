import { mockPortfolio } from '@/data/mockData';
import TokenList from '@/components/TokenList';
import PortfolioSummary from '@/components/PortfolioSummary';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus } from 'lucide-react';

export default function Home() {
  const portfolio = mockPortfolio;
  return (
    <main className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Portfolio</h1>
        <Link href="/buy">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Buy Tokens
          </Button>
        </Link>
      </div>

      <div className="space-y-8">
        <PortfolioSummary portfolio={portfolio} />
        <TokenList portfolio={portfolio} />
      </div>
    </main>
  );
}
