'use client';

import { Portfolio } from '../types';
import { Card } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

export default function TokenList({ portfolio }: { portfolio: Portfolio }) {
  const router = useRouter();

  return (
    <div className="space-y-4">
      {portfolio.tokens.map(({ token, amount, value, pnl, pnlPercentage }) => (
        <Card
          key={token.id}
          className="p-4 hover:bg-accent/50 cursor-pointer transition-colors"
          onClick={() => router.push(`/token/${token.id}`)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src={token.logo} alt={token.name} className="w-10 h-10" />
              <div>
                <h3 className="font-semibold">{token.name}</h3>
                <p className="text-sm text-muted-foreground">{token.symbol}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium">${value.toLocaleString()}</p>
              <p className={pnl >= 0 ? 'text-green-500' : 'text-red-500'}>
                {pnl >= 0 ? '+' : ''}{pnlPercentage.toFixed(2)}%
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}