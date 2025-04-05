// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { SDK, HashLock, PrivateKeyProviderConnector, NetworkEnum, QuoteParams, Quote } from "@1inch/cross-chain-sdk";

import {uint8ArrayToHex} from '@1inch/byte-utils'
import {randomBytes, solidityPackedKeccak256, Contract, Wallet, JsonRpcProvider} from 'ethers'
import Web3 from 'web3';

export const maxDuration = 300;

function getRandomBytes32(): string {
    return uint8ArrayToHex(randomBytes(32))
}


export const dynamic = 'force-dynamic';
export const revalidate = 0; // 0 = always dynamic

const approveABI = [
  {
    "constant": false,
    "inputs": [
      { "name": "spender", "type": "address" },
      { "name": "amount", "type": "uint256" }
    ],
    "name": "approve",
    "outputs": [{ "name": "", "type": "bool" }],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      { "name": "owner", "type": "address" },
      { "name": "spender", "type": "address" }
    ],
    "name": "allowance",
    "outputs": [{ "name": "", "type": "uint256" }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  }
];


// export async function GET(
//   request: NextRequest
// ): Promise<NextResponse> {

export async function POST(
  request: NextRequest
): Promise<NextResponse> {
  // Parse request body
  console.log('post');
  let body;
  try {
    body = await request.json();
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
  }

  const { srcChainId, dstChainId, srcTokenAddress, dstTokenAddress, amount } = body;

  // Validate required parameters
  if (!srcChainId || !dstChainId || !srcTokenAddress || !dstTokenAddress || !amount) {
    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
  }

  // RPC address
  let nodeUrl: string;

  if (srcChainId == NetworkEnum.OPTIMISM) {
    // @ts-ignore:next-line
    nodeUrl = process.env.RPC_URL_OP;
  } else if (srcChainId == NetworkEnum.ARBITRUM) {
    // @ts-ignore:next-line
    nodeUrl = process.env.RPC_URL_ARBITRUM;
  } else {
    throw new Error('Unsupported chain ID');
  }

  // This is a test account, no funds there
  // @ts-ignore:next-line
  const makerAddress: string = process.env.WALLET;
  // @ts-ignore:next-line
  const makerPrivateKey: string = process.env.PRIVATE_KEY;

  console.log('makerPrivateKey', makerPrivateKey);
  console.log('makerAddress', makerAddress);

  // What chain is this, I'd assume the source?

  const blockchainProvider = new PrivateKeyProviderConnector(makerPrivateKey, new Web3(nodeUrl));

  const sdk = new SDK({
    url: 'https://api.1inch.dev/fusion-plus',
    authKey: process.env.ONE_INCH_API_KEY,
    blockchainProvider,
  });

  const params: QuoteParams = {
    srcChainId,
    dstChainId,
    srcTokenAddress,
    dstTokenAddress,
    amount,
    walletAddress: makerAddress,
    enableEstimate: true,
  };

  // TODO !!!!!! CHANGE RPC ADDRESS DEPENDING ON CHAIN ID
  const provider = new JsonRpcProvider(nodeUrl);
  const tkn = new Contract(srcTokenAddress, approveABI, new Wallet(makerPrivateKey, provider));
  const spenderAddress = '0x111111125421ca6dc452d289314280a0f8842a65'; // aggregation router v6
  const allowance = BigInt(await tkn.allowance(makerAddress, spenderAddress)); // Ensure allowance is a BigInt

  if (allowance < 2n ** 256n - 1n) {
    // Check if allowance is less than unlimited
    await tkn.approve(
      spenderAddress,
      2n ** 256n - 1n // unlimited allowance
    );
    console.log('Added more allowance');
  } else {
    console.log('Sufficient allowance already exists');
  }

  const quote: Quote = await sdk.getQuote(params);

  const secretsCount = quote.getPreset().secretsCount;

  const secrets = Array.from({ length: secretsCount }).map(() => getRandomBytes32());
  const secretHashes = secrets.map((x) => HashLock.hashSecret(x));

  const hashLock =
    secretsCount === 1
      ? HashLock.forSingleFill(secrets[0])
      : HashLock.forMultipleFills(
          secretHashes.map((secretHash, i) =>
            solidityPackedKeccak256(['uint64', 'bytes32'], [i, secretHash.toString()])
          )
        );

  try {
    const quoteResponse = await sdk.placeOrder(quote, {
      walletAddress: makerAddress,
      hashLock,
      secretHashes,
    });

    const orderHash = quoteResponse.orderHash;

    console.log(`Order successfully placed`);

    while (true) {
      console.log(`Polling for fills until order status is set to "executed"...`);
      await new Promise((resolve) => setTimeout(resolve, 10000));

      try {
        const order = await sdk.getOrderStatus(orderHash);
        if (order.status === 'executed') {
          console.log(`Order is complete. Exiting.`);
          return NextResponse.json({ message: 'worked', orderHash });
        }
      } catch (error) {
        console.error(`Error: ${JSON.stringify(error, null, 2)}`);
      }

      try {
        const fillsObject = await sdk.getReadyToAcceptSecretFills(orderHash);
        if (fillsObject.fills.length > 0) {
          fillsObject.fills.forEach((fill) => {
            sdk
              .submitSecret(orderHash, secrets[fill.idx])
              .then(() => {
                console.log(
                  `Fill order found! Secret submitted: ${JSON.stringify(secretHashes[fill.idx], null, 2)}`
                );
              })
              .catch((error) => {
                console.error(`Error submitting secret: ${JSON.stringify(error, null, 2)}`);
              });
          });
        }
      } catch (error: any) {
        if (error.response) {
          console.error('Error getting ready to accept secret fills:', {
            status: error.response.status,
            statusText: error.response.statusText,
            data: error.response.data,
          });
        } else if (error.request) {
          console.error('No response received:', error.request);
        } else {
          console.error('Error', error.message);
        }
      }
    }
  } catch (error) {
    console.dir(error, { depth: null });
    return NextResponse.json({ error: 'Failed to process swap' }, { status: 500 });
  }

  return NextResponse.json({ message: 'worked' });
}
