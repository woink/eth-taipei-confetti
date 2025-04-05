import fs from 'fs';
import path from 'path';

interface TokenData {
  chainId: number;
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  logoURI: string;
  providers: string[];
  eip2612: boolean;
  isFoT: boolean;
  tags: string[];
}

async function getArbitrumTokens() {
  const axios = require('axios');

  const url = 'https://api.1inch.dev/token/v1.2/42161';

  const config = {
    headers: {
      Authorization: 'Bearer joeq6vdQYVy2tFU3d6mndItwBITuuvRM',
    },
    params: {},
    paramsSerializer: {
      indexes: null,
    },
  };

  try {
    const response = await axios.get(url, config);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

async function getOptimismTokens() {
  const axios = require('axios');

  const url = 'https://api.1inch.dev/token/v1.2/10';

  const config = {
    headers: {
      Authorization: 'Bearer joeq6vdQYVy2tFU3d6mndItwBITuuvRM',
    },
    params: {},
    paramsSerializer: {
      indexes: null,
    },
  };

  try {
    const response = await axios.get(url, config);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

async function getTokens() {
  const optimismTokens = await getOptimismTokens();
  const arbitrumTokens = await getArbitrumTokens();

  const tokens = Object.assign(optimismTokens, arbitrumTokens);

  const tokenList = [];
  for (const [address, tokenData] of Object.entries(tokens)) {
    tokenList.push({
      address: address,
      symbol: (tokenData as TokenData).symbol,
      name: (tokenData as TokenData).name,
      logoURI: (tokenData as TokenData).logoURI,
      chain:
        (tokenData as TokenData).chainId === 10
          ? 'Optimism'
          : (tokenData as TokenData).chainId === 42161
            ? 'Arbitrum'
            : 'Unknown',
    });
  }

  // Write to tokenList.json
  const outputPath = path.join(__dirname, '../tokenList.json');
  fs.writeFileSync(outputPath, JSON.stringify(tokenList, null, 2));

  console.log('Token list has been written to tokenList.json');
  return tokenList;
}

getTokens();
