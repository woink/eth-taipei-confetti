import { NextResponse, NextRequest } from 'next/server';
import axios from 'axios';
import fromWei from '@/lib/fromWei';
import { OPTransaction } from '@/types';

export async function GET(request: NextRequest) {
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
                  value: `${process.env.WALLET}`,
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
    const transactions: OPTransaction[] = rows.map((row: any) => ({
      to: row.to,
      tokens: fromWei(row.tokens),
      timestamp: row.timestamp,
      tx_hash: row.tx_hash,
    }));

    return NextResponse.json(transactions, { status: 200 });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
