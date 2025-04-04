'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowUpRight, ArrowDownRight, ArrowLeft } from 'lucide-react';
import { tokens, mockTransactions } from '@/data/mockData';
import { useRouter } from 'next/navigation';
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import Image from 'next/image';

export default function TokenDetails({ id }: { id: string }) {
  const router = useRouter();
  const token = tokens.find((t) => t.id === id);

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
          <p className="text-xl text-muted-foreground">${token.price.toLocaleString()}</p>
        </div>
        <div className="ml-auto">
          <Button className="mr-2">Buy</Button>
          <Button variant="outline">Sell</Button>
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
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={token.historicalData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12 }}
                tickFormatter={(value) =>
                  new Date(value).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                  })
                }
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `$${value.toLocaleString()}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Value']}
                labelFormatter={(label) => new Date(label).toLocaleDateString()}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--chart-1))"
                fillOpacity={1}
                fill="url(#colorValue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div>
        <h2 className="mb-4 text-2xl font-bold">Transaction History</h2>
        <div className="space-y-4">
          {mockTransactions.map((tx) => (
            <Card key={tx.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {tx.type === 'buy' ? (
                    <ArrowUpRight className="text-green-500" />
                  ) : (
                    <ArrowDownRight className="text-red-500" />
                  )}
                  <div>
                    <p className="font-medium">
                      {tx.type === 'buy' ? 'Bought' : 'Sold'} {tx.amount} {tx.token.symbol}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(tx.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <p className="font-medium">${tx.price.toLocaleString()}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
