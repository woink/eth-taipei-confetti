export interface Token {
  id: string;
  name: string;
  symbol: string;
  price: number;
  priceChange24h: number;
  marketCap: number;
  volume24h: number;
  chain: string;
  logo: string;
  historicalData: {
    date: string;
    value: number;
  }[];
}

export interface Transaction {
  id: string;
  type: 'buy' | 'sell';
  amount: number;
  price: number;
  timestamp: Date;
  token: Token;
  chain: string;
}

export interface Portfolio {
  tokens: {
    token: Token;
    amount: number;
    value: number;
    pnl: number;
    pnlPercentage: number;
  }[];
  totalValue: number;
  totalPnl: number;
  totalPnlPercentage: number;
  historicalData: {
    date: string;
    value: number;
  }[];
}
