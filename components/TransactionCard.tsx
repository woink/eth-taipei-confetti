import { Card } from '@/components/ui/card';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface TransactionCardProps {
  id: string;
  type: 'buy' | 'sell';
  amount: number;
  tokenSymbol: string;
  timestamp: Date;
  price: number;
}

export default function TransactionCard({
  id,
  type,
  amount,
  tokenSymbol,
  timestamp,
  price,
}: TransactionCardProps) {
  return (
    <Card key={id} className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {type === 'buy' ? (
            <ArrowUpRight className="text-green-500" />
          ) : (
            <ArrowDownRight className="text-red-500" />
          )}
          <div>
            <p className="font-medium">
              {type === 'buy' ? 'Bought' : 'Sold'} {amount} {tokenSymbol}
            </p>
            <p className="text-sm text-muted-foreground">{timestamp.toLocaleDateString()}</p>
          </div>
        </div>
        <p className="font-medium">${price.toLocaleString()}</p>
      </div>
    </Card>
  );
}
