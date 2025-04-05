'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { tokens } from '@/data/tokens';
import { mockTransactions } from '@/data/mockData';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import PortfolioChart from './PortfolioChart';
import TransactionCard from './TransactionCard';
import { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';

export default function TokenDetails({ id }: { id: string }) {
  const router = useRouter();
  const token = useMemo(() => tokens.find((t) => t.id === id), [id]);
  const [transactions, setTransactions] = useState(mockTransactions);
  const isOP = token?.symbol === 'OP';

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!isOP) return;

      try {
        const response = await fetch('/api/transactions/');
        const data = await response.json();
        // Transform the API data to match our Transaction type

        const formattedTransactions = () =>
          data.map((tx: any) => ({
            id: tx.tx_hash,
            type: 'buy' as const,
            amount: Number(tx.tokens).toFixed(6),
            price: Number(tx.tokens) * 1787.71,
            timestamp: new Date(tx.timestamp),
            token: token!,
            chain: token?.chain || '',
          }));

        if (formattedTransactions.length > 0) {
          setTransactions(formattedTransactions);
        }
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };
    fetchTransactions();
  }, [isOP, token]);

  if (!token) return <div>Token not found</div>;

  return (
    <div className="grid gap-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push('/')} className="mr-2">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Image src={token.logo} alt={token.name} width={64} height={64} className="h-16 w-16" />
        <div>
          <h1 className="text-3xl font-bold">{token.name}</h1>
          <p className="text-xl text-muted-foreground">${token.price}</p>
        </div>
        <div className="ml-auto">
          <Link
            href={`/buy/${token.id}`}
            type="button"
            className="mr-2 inline-flex h-10 items-center justify-center whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          >
            Buy
          </Link>
        </div>
      </div>

      <Card className="p-6">
        <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          <div>
            <p className="text-muted-foreground">24h Change</p>
            <p className={token.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500'}>
              {token.priceChange24h >= 0 ? '+' : ''}
              {token.priceChange24h}%
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Market Cap</p>
            <p>${token.marketCap.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-muted-foreground">24h Volume</p>
            <p>${token.volume24h.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Chain</p>
            <p>{token.chain}</p>
          </div>
        </div>

        <div className="h-[300px]">
          <PortfolioChart data={token.historicalData} />
        </div>
      </Card>

      <div>
        <h2 className="mb-4 text-2xl font-bold">Transaction History</h2>
        <div className="space-y-4">
          {transactions.map((tx) => (
            <TransactionCard
              key={tx.id}
              id={tx.id}
              type={tx.type}
              amount={tx.amount}
              tokenSymbol={tx.token.symbol}
              timestamp={tx.timestamp}
              price={tx.price}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
