'use client';

import { cn } from '@/lib/utils';
import { Token } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

import { Confetti, type ConfettiRef } from '@/components/magicui/confetti';

interface BuyTokenFormProps {
  token: Token;
}

export const LoadingSpinner = ({ className }: { className: string }) => {
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn('animate-spin', className)}
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>;
};

export function BuyTokenForm({ token }: BuyTokenFormProps) {
  const [amount, setAmount] = useState(0);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const confettiRef = useRef<ConfettiRef>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsConfirmOpen(true);
    // await new Promise((resolve) => setTimeout(resolve, 2000));
    try {
      const response = await fetch('/api/swap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          srcTokenAddress: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85',
          dstTokenAddress: '0x912CE59144191C1204E64559FE8253a0e49E6548',
          amount: '100000',
          srcChainId: 10,
          dstChainId: 42161,
        }),
      });
      if (!response.ok) {
        console.error('Purchase failed');
      }
      setIsConfirmOpen(false);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // setTimeout(() => {
      confettiRef.current?.fire();
      // }, 500);
    } catch (error) {
      console.error('Purchase failed:', error);
    }
  };

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
        <form onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm font-medium">Amount</label>
            <Input
              onChange={(e) => {
                setAmount(Number(e.target.value));
              }}
              type="number"
              placeholder="0.00"
              className="mb-2 text-right"
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
          <div>
            <Confetti
              ref={confettiRef}
              manualstart={true}
              className="pointer-events-none absolute left-0 top-0 size-full"
            />
          </div>
          <Button type="submit" className="mt-4 w-full">
            Buy {token.symbol}
          </Button>
        </form>
      </div>

      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center">Your swap is in progress</DialogTitle>
            <DialogDescription className="text-center">Hang tight</DialogDescription>
            <div className="mx-auto flex justify-center py-4">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
