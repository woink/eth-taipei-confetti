'use client'

import { Portfolio } from '@/types';
import { Card } from '@/components/ui/card';
import PortfolioChart from './PortfolioChart';
import { useEffect, useState } from 'react';

export default function PortfolioSummary({ 
  portfolio, 
  onRefresh 
}: { 
  portfolio: Portfolio;
  onRefresh?: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const fetchBalances = async () => {
      try {
        setIsLoading(true);
        
        // Update balance with hardcoded number
        const hardcodedBalance = 12345.67;
        setBalance(hardcodedBalance);
        
        if (onRefresh) {
          await onRefresh();
        }
      } catch (error) {
        console.error("Error fetching portfolio balances:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBalances();
  }, [onRefresh]);

  return (
    <Card className="p-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h2 className="text-2xl font-bold">
              {isLoading ? 'Loading...' : `$${balance.toLocaleString()}`}
            </h2>
            <p className="text-muted-foreground">Portfolio Value</p>
          </div>
          <div className="text-right">
            <h2
              className={`text-2xl font-bold ${portfolio.totalPnl >= 0 ? 'text-green-500' : 'text-red-500'}`}
            >
              {isLoading ? 'Loading...' : `${portfolio.totalPnl >= 0 ? '+' : ''}${portfolio.totalPnlPercentage.toFixed(2)}%`}
            </h2>
            <p className="text-muted-foreground">24h Change</p>
          </div>
        </div>
        <PortfolioChart data={portfolio.historicalData} />
      </div>
    </Card>
  );
}
