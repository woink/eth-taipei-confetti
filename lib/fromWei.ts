export default function fromWei(value: bigint | string, decimals: number = 18): number {
  const divisor = BigInt(10 ** decimals);
  const bigValue = typeof value === 'string' ? BigInt(value) : value;
  return Number(bigValue) / Number(divisor);
}
