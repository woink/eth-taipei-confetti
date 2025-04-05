'use client';

import { Token } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';

interface BuyTokenFormProps {
  token: Token;
}

export function BuyTokenForm({ token }: BuyTokenFormProps) {
  return (
    <div className="rounded-lg border p-6">
      <div className="mb-6 flex items-center gap-4">
        <div className="relative h-12 w-12">
          <Image
            src={token.logo}
            alt={`${token.name} logo`}
            height={48}
            width={48}
            className="rounded-full object-cover"
          />
        </div>
        <div>
          <h2 className="text-2xl font-bold">{token.name}</h2>
          <p className="text-muted-foreground">{token.symbol}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium">Amount</label>
          <Input
            type="number"
            placeholder="0.00"
            className="text-right"
            min="0"
            step="0.000000000000000001"
          />
        </div>

        <div className="rounded-lg bg-muted p-4">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Price</span>
            <span>${token.price.toFixed(2)}</span>
          </div>
          <div className="mt-2 flex justify-between">
            <span className="text-muted-foreground">24h Change</span>
            <span className={token.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500'}>
              {token.priceChange24h >= 0 ? '+' : ''}
              {token.priceChange24h.toFixed(2)}%
            </span>
          </div>
        </div>

        <Button className="w-full">Buy {token.symbol}</Button>
      </div>
    </div>
  );
}
