import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Token } from '@/types/token';

interface TokenCardProps {
  token: Token;
}

export function TokenCard({ token }: TokenCardProps) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Image src={token.logo} alt={token.name} width={40} height={40} className="h-10 w-10" />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">{token.name}</h3>
              <p className="text-sm text-muted-foreground">{token.symbol}</p>
            </div>
            <p className="text-xs text-muted-foreground">{token.chain}</p>
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
  );
}
