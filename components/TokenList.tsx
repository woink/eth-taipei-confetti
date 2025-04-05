'use client';

import { Portfolio } from '@/types';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function TokenList({ portfolio }: { portfolio: Portfolio }) {
  const router = useRouter();

  return (
    <div className="space-y-4">
      {portfolio.tokens.map(({ token, value, pnl, pnlPercentage }) => (
        <Card
          key={token.id}
          className="cursor-pointer p-4 transition-colors hover:bg-accent/50"
          onClick={() => router.push(`/token/${token.id}`)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Image
                src={token.logo}
                alt={token.name}
                width={64}
                height={64}
                className="h-10 w-10"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{token.name}</h3>
                  <p className="text-sm text-muted-foreground">{token.symbol}</p>
                </div>
                <p className="text-xs text-muted-foreground">{token.chain}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium">${value.toLocaleString()}</p>
              <p className={pnl >= 0 ? 'text-green-500' : 'text-red-500'}>
                {pnl >= 0 ? '+' : ''}
                {pnlPercentage.toFixed(2)}%
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
