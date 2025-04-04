import { mockPortfolio } from './data/mockData';
import TokenList from './components/TokenList';
import PortfolioSummary from './components/PortfolioSummary';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus } from 'lucide-react';

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Portfolio</h1>
        <Link href="/buy">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Buy Tokens
          </Button>
        </Link>
      </div>
      
      <div className="space-y-8">
        <PortfolioSummary portfolio={mockPortfolio} />
        <TokenList portfolio={mockPortfolio} />
      </div>
    </main>
  );
}