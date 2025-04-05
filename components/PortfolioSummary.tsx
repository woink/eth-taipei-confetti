'use client'

import { Portfolio } from '@/types';
import { Card } from '@/components/ui/card';
import PortfolioChart from './PortfolioChart';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { symbol } from 'zod';

const WALLET = process.env.NEXT_PUBLIC_WALLET;

const price_hardcode = {
  OP: 0.7,
  USDC: 1,
  ARB: 0.3
}

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

        // Define token addresses and ABI for both chains
        const tokenList = [
          { address: '0x4200000000000000000000000000000000000042', symbol: 'OP', chain: 'OP' },  // OP on Optimism
          { address: '0x6B175474E89094C44Da98b954EedeAC495271d0F', symbol: 'USDC', chain: 'OP' }, // USDC on Optimism
          { address: '0x912CE59144191C1204E64559FE8253a0e49E6548', symbol: 'ARB', chain: 'ARB' }, // ARB on Arbitrum
        ];

        const tokenAbi = [
          'function balanceOf(address owner) view returns (uint256)',
          'function decimals() view returns (uint8)'
        ];

        // Define providers for each chain
        const providers = {
          OP: new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL_OP),
          ARB: new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL_ARBITRUM),
        };

        // Get wallet address from environment variables
        const walletAddress = WALLET;

        if (!walletAddress) {
          throw new Error("Wallet address is not defined in environment variables");
        }

        // Fetch balance for all tokens across chains
        const balancePromises = tokenList.map(async (token) => {
          const provider = providers[token.chain];
          const contract = new ethers.Contract(token.address, tokenAbi, provider);

          // Validate if the contract implements the balanceOf method
          try {
            const code = await provider.getCode(token.address);
            if (code === "0x") {
              console.warn(`Contract at address ${token.address} does not exist or is not deployed.`);
              return 0; // Skip this token
            }

            const balance = await contract.balanceOf(walletAddress);
            const decimals = await contract.decimals();
            const adjustedBalance = parseFloat(ethers.formatUnits(balance, decimals));

            // Fetch token price from hardcoded values
            const price = price_hardcode[token.symbol];

            return adjustedBalance * price;
          } catch (error) {
            console.error(`Error fetching balance for token ${token.address} on ${token.chain}:`, error);
            return 0; // Skip this token
          }
        });

        // Wait for all balance promises to resolve
        const tokenBalances = await Promise.all(balancePromises);
        const totalBalance = tokenBalances.reduce((sum, value) => sum + value, 0);

        setBalance(totalBalance);

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
