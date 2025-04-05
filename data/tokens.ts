import tokenList from './tokenList.json';
import { Token } from '@/types';

// Generate mock historical data for charts
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

// Transform token list data into our application's token format
export const tokens: Token[] = tokenList.map((token, index) => {
  // Generate a random price between $0.1 and $5000
  const price = Math.random() * 5000 + 0.1;
  // Generate a random 24h price change between -20% and +20%
  const priceChange24h = Math.random();

  return {
    id: `${token.symbol}-${token.chain}`,
    name: token.name,
    symbol: token.symbol,
    price: price,
    priceChange24h: Number(priceChange24h.toFixed(2)),
    marketCap: price * (Math.random() * 1000000), // Random market cap
    volume24h: price * (Math.random() * 100000), // Random 24h volume
    chain: token.chain,
    logo: token.logoURI,
    historicalData: generateHistoricalData(30, price),
  };
});
