import { Portfolio } from '@/types';
import { Card } from '@/components/ui/card';
import PortfolioChart from './PortfolioChart';

export default function PortfolioSummary({ portfolio }: { portfolio: Portfolio }) {
  return (
    <Card className="p-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h2 className="text-2xl font-bold">${portfolio.totalValue.toLocaleString()}</h2>
            <p className="text-muted-foreground">Portfolio Value</p>
          </div>
          <div className="text-right">
            <h2
              className={`text-2xl font-bold ${portfolio.totalPnl >= 0 ? 'text-green-500' : 'text-red-500'}`}
            >
              {portfolio.totalPnl >= 0 ? '+' : ''}
              {portfolio.totalPnlPercentage.toFixed(2)}%
            </h2>
            <p className="text-muted-foreground">24h Change</p>
          </div>
        </div>
        <PortfolioChart data={portfolio.historicalData} />
      </div>
    </Card>
  );
}
