import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from './route';
import axios from 'axios';
import { NextResponse } from 'next/server';

// Mock axios
vi.mock('axios');

describe('GET /api/transactions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return formatted transactions on success', async () => {
    // Mock successful axios response
    const mockResponse = {
      status: 200,
      data: {
        result: {
          rows: [
            {
              to: '0x123',
              tokens: '1000000000000000000', // 1 ETH in wei
              timestamp: '2024-04-05T12:00:00Z',
              tx_hash: '0xabc123',
            },
          ],
        },
      },
    };

    (axios.post as any).mockResolvedValue(mockResponse);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual([
      {
        to: '0x123',
        tokens: 1, // Converted from wei
        timestamp: '2024-04-05T12:00:00Z',
        tx_hash: '0xabc123',
      },
    ]);
  });

  it('should handle API error response', async () => {
    // Mock failed axios response
    (axios.post as any).mockResolvedValue({
      status: 500,
      data: { error: 'Internal server error' },
    });

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({ error: 'Failed to fetch transactions' });
  });

  it('should handle network errors', async () => {
    // Mock network error
    (axios.post as any).mockRejectedValue(new Error('Network error'));

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({ error: 'Internal server error' });
  });
});
