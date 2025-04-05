import { NextRequest, NextResponse } from 'next/server';
import { SDK, NetworkEnum, QuoteParams } from "@1inch/cross-chain-sdk";


export const dynamic = 'force-dynamic';
export const revalidate = 0; // 0 = always dynamic


export async function GET(
  request: NextRequest
): Promise<NextResponse> {


  const sdk = new SDK({
    url: "https://api.1inch.dev/fusion-plus",
    authKey: "ePOggvvA8VHSlr399qahke9fDkyR9zKs"
  });

  const orders = await sdk.getActiveOrders({ page: 1, limit: 2 });
  console.log("orders", orders);
  
  const params: QuoteParams = {
    srcChainId: NetworkEnum.OPTIMISM,
    dstChainId: NetworkEnum.ARBITRUM,
    srcTokenAddress: "0x4200000000000000000000000000000000000042", // OP token
    dstTokenAddress: "0x912CE59144191C1204E64559FE8253a0e49E6548", // ARB token
    amount: "10000000000000000000000"
  };

  const quote = await sdk.getQuote(params);
  console.log("quote", quote);
  return NextResponse.json({ message: JSON.stringify(orders) });
}

export async function POST(
  request: NextRequest
): Promise<NextResponse> {
  const body = await request.json();
  // Process the data...
  return NextResponse.json({ status: 'success' });
}