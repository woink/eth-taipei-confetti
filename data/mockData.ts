import { Portfolio, Token, Transaction } from '@/types';

// Generate mock historical data for charts
// Mocked, because it's a hackathon (if you read this, dm on twitter me @martinvol)
const generateHistoricalData = (days: number, startValue: number, volatility: number = 0.02) => {
  const data = [];
  let currentValue = startValue;

  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    // Add some random price movement
    const change = currentValue * (Math.random() * volatility * 2 - volatility);
    currentValue += change;

    data.push({
      date: date.toISOString().split('T')[0],
      value: currentValue,
    });
  }

  return data;
};

export const tokens: Token[] = [
  {
    id: 'ARB-Arbitrum',
    name: 'Arbitrum',
    symbol: 'ARB',
    price: 3450.75,
    priceChange24h: 5.2,
    marketCap: 415000000000,
    volume24h: 15000000000,
    chain: 'Arbitrum',
    logo: 'https://tokens.1inch.io/0x912ce59144191c1204e64559fe8253a0e49e6548.png',
    historicalData: generateHistoricalData(30, 3450.75),
  },
  {
    id: 'OP-Optimism',
    name: 'Optimism',
    symbol: 'OP',
    price: 125.3,
    priceChange24h: 8.7,
    marketCap: 52000000000,
    volume24h: 3000000000,
    chain: 'Optimism',
    logo: 'https://tokens.1inch.io/0x4200000000000000000000000000000000000042.png',
    historicalData: generateHistoricalData(30, 125.3),
  },
];

export const mockPortfolio: Portfolio = {

  tokens: tokens.map((token) => ({
    token,
    amount: Math.random() * 10,
    value: Math.random() * 50000,
    pnl: Math.random() * 5000 - 2500,
    pnlPercentage: Math.random() * 20 - 10,
  })),
  totalValue: 123500,
  totalPnl: 0.11,
  totalPnlPercentage: 1.2,
  historicalData: generateHistoricalData(30, 9.4),
};

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'buy',
    amount: 1.5,
    price: 3200,
    timestamp: new Date('2024-03-20T10:30:00'),
    token: tokens[0],
    chain: 'Ethereum',
  },
  {
    id: '2',
    type: 'sell',
    amount: 0.5,
    price: 3400,
    timestamp: new Date('2024-03-19T15:45:00'),
    token: tokens[0],
    chain: 'Ethereum',
  },
  {
    id: '3',
    type: 'buy',
    amount: 10,
    price: 110,
    timestamp: new Date('2024-03-18T09:15:00'),
    token: tokens[1],
    chain: 'Solana',
  },
];
