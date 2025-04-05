import axios from 'axios';

interface TokenAction {
  chainId: string;
  address: string;
  standard: string;
  fromAddress: string;
  toAddress: string;
  tokenId?: string;
  amount?: string;
  direction: string;
  priceToUsd?: number;
}

interface TransactionDetails {
  txHash: string;
  chainId: number;
  blockNumber: number;
  blockTimeSec: number;
  status: string;
  type: string;
  tokenActions: TokenAction[];
  fromAddress: string;
  toAddress: string;
  nonce: number;
  orderInBlock: number;
  feeInSmallestNative: string;
  nativeTokenPriceToUsd: number;
}

interface Transaction {
  timeMs: number;
  address: string;
  type: number;
  rating: string;
  direction: string;
  details: TransactionDetails;
  id: string;
  eventOrderInTransaction: number;
}

interface TransactionResponse {
  items: Transaction[];
  cache_counter: number;
}

const ADDRESS = '0x71F50B419da51147760D24305e3bd1c75FF6A8f7';

async function getAllTransactions() {
  const url = `https://api.1inch.dev/history/v2.0/history/${ADDRESS}/events`;

  const config = {
    headers: {
      Authorization: 'Bearer joeq6vdQYVy2tFU3d6mndItwBITuuvRM',
    },
    params: {
      chainId: '1',
    },
    paramsSerializer: {
      indexes: null,
    },
  };

  try {
    const response = await axios.get<TransactionResponse>(url, config);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
    throw error;
  }
}

function parseTransactions(transactions: Transaction[]): {
  direction: string;
  txHash: string;
  fromAddress: string;
  toAddress: string;
  timestamp: Date;
  status: string;
  type: string;
  amount: string[];
  nativeTokenPrice: number;
  feeInSmallestNative: string;
}[] {
  return transactions
    .filter((transaction) =>
      ['SwapExactInput', 'SwapExactOutput'].includes(transaction.details.type)
    )
    .map((transaction) => {
      const date = new Date(transaction.timeMs);
      // Convert to CST (UTC+8)
      const cstDate = new Date(date.getTime() + 8 * 60 * 60 * 1000);

      return {
        direction: transaction.direction,
        type: transaction.details.type,
        amount: transaction.details.tokenActions
          .map((tokenAction) => tokenAction.amount)
          .filter((amount): amount is string => amount !== undefined),
        nativeTokenPrice: transaction.details.nativeTokenPriceToUsd,
        feeInSmallestNative: transaction.details.feeInSmallestNative,
        txHash: transaction.details.txHash,
        fromAddress: transaction.details.fromAddress,
        toAddress: transaction.details.toAddress,
        timestamp: cstDate,
        status: transaction.details.status,
      };
    });
}

async function initTransactions() {
  const response = await getAllTransactions();
  return parseTransactions(response?.items || []);
}

export const transactions = initTransactions();

transactions.then((transactions) => {
  console.log(transactions);
});
