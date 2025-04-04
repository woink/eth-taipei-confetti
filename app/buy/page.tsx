'use client';

import { tokens } from '../data/mockData';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function BuyPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const filteredTokens = tokens.filter(
    (token) =>
      token.name.toLowerCase().includes(search.toLowerCase()) ||
      token.symbol.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push('/')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">Buy Tokens</h1>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search tokens..."
          className="pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        {filteredTokens.map((token) => (
          <Card key={token.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Image src={token.logo} alt={token.name} className="h-10 w-10" />
                <div>
                  <h3 className="font-semibold">{token.name}</h3>
                  <p className="text-sm text-muted-foreground">{token.symbol}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-medium">${token.price.toLocaleString()}</p>
                  <p className={token.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500'}>
                    {token.priceChange24h >= 0 ? '+' : ''}
                    {token.priceChange24h}%
                  </p>
                </div>
                <Button>Buy</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </main>
  );
}
