import { NextRequest, NextResponse } from 'next/server';
import { SDK, HashLock, PrivateKeyProviderConnector, NetworkEnum, QuoteParams, Quote } from "@1inch/cross-chain-sdk";

import {uint8ArrayToHex} from '@1inch/byte-utils'
import {randomBytes, solidityPackedKeccak256} from 'ethers'
import Web3 from 'web3';

export const maxDuration = 300;

export function getRandomBytes32(): string {
    return uint8ArrayToHex(randomBytes(32))
}


export const dynamic = 'force-dynamic';
export const revalidate = 0; // 0 = always dynamic

const approveABI = [{
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
}];


export async function GET(
  request: NextRequest
): Promise<NextResponse> {

  return NextResponse.json({ message: "empty" });
}

export async function POST(
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
  walletAddress: makerAddress,
  enableEstimate: true
};

const quote:Quote = await sdk.getQuote(params);

const secretsCount = quote.getPreset().secretsCount;

        const secrets = Array.from({ length: secretsCount }).map(() => getRandomBytes32());
        const secretHashes = secrets.map(x => HashLock.hashSecret(x));

        const hashLock = secretsCount === 1
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
    secretHashes
  })

  const orderHash = quoteResponse.orderHash;

    console.log(`Order successfully placed`);

    let returnLoop = false;


      
      while(true){
        console.log(`Polling for fills until order status is set to "executed"...`);

        try {
        const order = await sdk.getOrderStatus(orderHash)
                if (order.status === 'executed') {
                    console.log(`Order is complete. Exiting.`);
                    // clearInterval(intervalId);
                    return NextResponse.json({ message: "worked" });
                }

              } catch (error) {

                console.error(`Error: ${JSON.stringify(error, null, 2)}`)
              }


        try {
        const fillsObject = await sdk.getReadyToAcceptSecretFills(orderHash)
        if (fillsObject.fills.length > 0) {
          fillsObject.fills.forEach(fill => {
              sdk.submitSecret(orderHash, secrets[fill.idx])
                  .then(() => {
                      console.log(`Fill order found! Secret submitted: ${JSON.stringify(secretHashes[fill.idx], null, 2)}`);
                  })
                  .catch((error) => {
                      console.error(`Error submitting secret: ${JSON.stringify(error, null, 2)}`);
                  });
          });
      }
        } catch(error:any) {
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error('Error getting ready to accept secret fills:', {
                status: error.response.status,
                statusText: error.response.statusText,
                data: error.response.data
            });
        } else if (error.request) {
            // The request was made but no response was received
            console.error('No response received:', error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Error', error.message);
        }
        }

    }

  } catch (error) {
    console.dir(error, { depth: null });
  }


    

    // 


  return NextResponse.json({ message: "worked" });
}