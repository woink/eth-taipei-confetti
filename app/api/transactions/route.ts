import { NextResponse } from 'next/server';
import axios from 'axios';
import fromWei from '@/lib/fromWei';

export async function GET() {
  try {
    const response = await axios.post(
      'https://kwcrzwwq3bcmph7uoi6dbp3ib4.multibaas.com/api/v0/queries',
      {
        events: [
          {
            filter: {
              rule: 'and',
              children: [
                {
                  value: '0x9ad296659d9ad687d3eca1b7c017ed7ed26fdff8',
                  operator: 'Equal',
                  fieldType: 'input',
                  inputIndex: 1,
                },
              ],
            },
            select: [
              {
                name: 'to',
                type: 'input',
                alias: '',
                inputIndex: 1,
              },
              {
                name: 'tokens',
                type: 'input',
                alias: '',
                inputIndex: 2,
              },
              {
                name: 'triggered_at',
                type: 'triggered_at',
                alias: 'timestamp',
              },
              {
                name: 'tx_hash',
                type: 'tx_hash',
                alias: '',
              },
            ],
            eventName: 'Transfer(address,address,uint256)',
          },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.CURVEGRID_ARBITRUM_API_KEY}`,
        },
      }
    );

    if (response.status !== 200) {
      return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
    }

    const rows = response.data.result.rows;
    const transactions = rows.map((row: any) => ({
      to: row.to,
      tokens: fromWei(row.tokens),
      timestamp: row.timestamp,
      tx_hash: row.tx_hash,
    }));

    return NextResponse.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
