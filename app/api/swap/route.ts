import { NextRequest, NextResponse } from 'next/server';
import { SDK, HashLock, PrivateKeyProviderConnector, NetworkEnum, QuoteParams, Quote } from "@1inch/cross-chain-sdk";

import {uint8ArrayToHex} from '@1inch/byte-utils'
import {randomBytes, solidityPackedKeccak256} from 'ethers'
import Web3 from 'web3';


export function getRandomBytes32(): string {
    return uint8ArrayToHex(randomBytes(32))
}


export const dynamic = 'force-dynamic';
export const revalidate = 0; // 0 = always dynamic


export async function GET(
  request: NextRequest
): Promise<NextResponse> {

// this is a test account, no funds there
// @ts-ignore:next-line
const makerAddress:string = process.env.WALLET;
// @ts-ignore:next-line
const makerPrivateKey:string = process.env.PRIVATE_KEY;

console.log("makerPrivateKey", makerPrivateKey);
console.log("makerAddress", makerAddress)
// receiver address?


// what chain is this, I'd assume the source?
const nodeUrl = "https://mainnet.optimism.io";


const blockchainProvider = new PrivateKeyProviderConnector(makerPrivateKey, new Web3(nodeUrl));

  const sdk = new SDK({
    url: "https://api.1inch.dev/fusion-plus",
    authKey: process.env.ONE_INCH_API_KEY,
    blockchainProvider
  });





const params: QuoteParams = {
  srcChainId: NetworkEnum.OPTIMISM,
  dstChainId: NetworkEnum.ARBITRUM,
  // TODO swich this
  srcTokenAddress: "0x4200000000000000000000000000000000000042", // OP token
  dstTokenAddress: "0x912CE59144191C1204E64559FE8253a0e49E6548", // ARB token
  amount: "100000000000000000",
  enableEstimate: true
};

const quote:Quote = await sdk.getQuote(params);

const secretsCount = quote.getPreset().secretsCount;

const secrets = Array.from({ length: secretsCount }).map(() => getRandomBytes32());
const secretHashes = secrets.map((x) => HashLock.hashSecret(x));

const hashLock =
  secretsCount === 1
    ? HashLock.forSingleFill(secrets[0])
    : HashLock.forMultipleFills(
        secretHashes.map((secretHash, i) =>
          solidityPackedKeccak256(["uint64", "bytes32"], [i, secretHash.toString()])
        ) as (string & {
          _tag: "MerkleLeaf";
        })[]
      );

// console.log("quote", quote);

// TODO, is this supposed to be there?
// patch quote
// quote.quoteId = "12345"

let response:any
try{
  response = await sdk
    .placeOrder(quote, {
      walletAddress: makerAddress,
      hashLock,
      secretHashes
      // fee is an optional field
      // fee: {
      //   takingFeeBps: 100, // 1% as we use bps format, 1% is equal to 100bps
      // TODO what is this?
      //   takingFeeReceiver: "0x0000000000000000000000000000000000000000" //  fee receiver address
      // }
    })
} catch(e){
  console.error("Error placing order", e.response);
  return NextResponse.json({ message: "error" });
}
console.log("response", response);
  // .catch(console.error)
  // .then(console.log);

  return NextResponse.json({ message: "empty" });
}

export async function POST(
  request: NextRequest
): Promise<NextResponse> {
  const body = await request.json();
  // Process the data...
  return NextResponse.json({ status: 'success' });
}