import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import BuyTokenPage from '../page';
import { tokens } from '@/data/tokens';

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
  }),
}));

// Mock the async component behavior
vi.mock('../page', async (importOriginal) => {
  const actual = await importOriginal() as typeof import('../page');
  return {
    ...actual,
    default: (props: {params: {tokenId: string}}) => {
      const Comp = actual.default;
      // Wrap the async component and immediately render its result
      const result = Comp(props);
      return result;
    }
  };
});

describe('BuyTokenPage', () => {
  it('renders token not found when token does not exist', () => {
    render(<BuyTokenPage params={{ tokenId: 'non-existent-token' }} />);

    expect(screen.getByText('Token not found')).toBeInTheDocument();
    expect(screen.getByText('Back to Tokens')).toBeInTheDocument();
  });

  it('renders token details when token exists', () => {
    const token = tokens[0];
    render(<BuyTokenPage params={{ tokenId: token.id }} />);

    expect(screen.getByText(token.symbol)).toBeInTheDocument();
    expect(screen.getByText(`$${token.price.toFixed(2)}`)).toBeInTheDocument();
    expect(
      screen.getByText(`${token.priceChange24h >= 0 ? '+' : ''}${token.priceChange24h.toFixed(2)}%`)
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText('0.00')).toBeInTheDocument();
    expect(screen.getByText(`Buy ${token.symbol}`)).toBeInTheDocument();
  });
});
