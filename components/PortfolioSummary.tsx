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
        
        // Update balance with hardcoded number
        // Import ethers at the top of your file

        // Define token addresses and ABI
        const tokenList = [
          { address: '0x4200000000000000000000000000000000000042', symbol: 'OP' },  // DAI
          { address: '0x6B175474E89094C44Da98b954EedeAC495271d0F', symbol: 'USDC' }, // USDC
        ];

        const tokenAbi = [
          'function balanceOf(address owner) view returns (uint256)',
          'function decimals() view returns (uint8)'
        ];

        // Use a provider
        console.log("process.env.NEXT_PUBLIC_RPC_URL_OP", process.env.NEXT_PUBLIC_RPC_URL_OP)
        const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL_OP);

        // Get wallet address from portfolio or use a default
        const walletAddress = WALLET; // Fallback address
        
        if (!walletAddress) {
          throw new Error("Wallet address is not defined in environment variables");
        }

        // Fetch balance for all tokens
        const balancePromises = tokenList.map(async (token) => {
          const contract = new ethers.Contract(token.address, tokenAbi, provider);

          // Validate if the contract implements the balanceOf method
          try {
            const code = await provider.getCode(token.address);
            if (code === "0x") {
              console.warn(`Contract at address ${token.address} does not exist or is not deployed.`);
              return 0; // Skip this token
            }

            const balance = await contract.balanceOf(walletAddress);
            // const adjustedBalance = balance; // BigInt
            console.log("token.symbol", token.symbol)
            const decimals = await contract.decimals();
            console.log("decimals", decimals)
            const adjustedBalance = BigInt(parseFloat(ethers.formatUnits(balance, decimals)));

            // Fetch token price from an API (placeholder)
            const price = price_hardcode[token.symbol]; // Convert price to BigInt for multiplication

            return Number(adjustedBalance) * price; // Convert result back to a number if needed
          } catch (error) {
            console.error(`Error fetching balance for token ${token.address}:`, error);
            return 0; // Skip this token
          }
        });

        // Wait for all balance promises to resolve
        const tokenBalances = await Promise.all(balancePromises);
        const hardcodedBalance = tokenBalances.reduce((sum, value) => sum + value, 0);

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
