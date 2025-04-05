import { Token } from '@/types';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface TokenCardProps {
  token: Token;
}

export function TokenCard({ token }: TokenCardProps) {
  const router = useRouter();

  const handleBuy = () => {
    router.push(`/buy/${token.id}`);
  };

  return (
    <div
      data-testid="token-card"
      className="flex items-center justify-between rounded-lg border p-4 shadow-sm"
    >
      <div className="flex items-center gap-4">
        <div className="relative h-10 w-10">
          <Image
            src={token.logo}
            alt={`${token.name} logo`}
            fill
            className="rounded-full object-cover"
          />
        </div>
        <div>
          <h3 className="font-semibold">{token.name}</h3>
          <p className="text-sm text-muted-foreground">{token.symbol}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="font-semibold">{token.price.toFixed(2)}</p>
          <p className={`text-sm ${token.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {token.priceChange24h >= 0 ? '+' : ''}
            {token.priceChange24h.toFixed(2)}%
          </p>
        </div>
        <Button onClick={handleBuy}>Buy</Button>
      </div>
    </div>
  );
}
