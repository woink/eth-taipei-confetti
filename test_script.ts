import { SDK, NetworkEnum } from "@1inch/cross-chain-sdk";

async function main() {
  const sdk = new SDK({
    url: "https://api.1inch.dev/fusion-plus",
    authKey: "your-auth-key"
  });

  const orders = await sdk.getActiveOrders({ page: 1, limit: 2 });
}

main();