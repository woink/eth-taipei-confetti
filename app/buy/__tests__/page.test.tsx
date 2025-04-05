import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import BuyPage from '../page';
import { tokens } from '@/data/tokens';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
  }),
}));

describe('BuyPage', () => {
  it('renders the page title and search input', () => {
    render(<BuyPage />);

    expect(screen.getByText('Buy Tokens')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search tokens...')).toBeInTheDocument();
  });

  it('filters tokens based on search input', () => {
    render(<BuyPage />);

    const searchInput = screen.getByPlaceholderText('Search tokens...');
    fireEvent.change(searchInput, { target: { value: 'ETH' } });

    const filteredTokens = tokens.filter(
      (token) =>
        token.name.toLowerCase().includes('eth') || token.symbol.toLowerCase().includes('eth')
    );

    expect(screen.getAllByTestId('token-card')).toHaveLength(filteredTokens.length);
  });

  it('displays all tokens when search is empty', () => {
    render(<BuyPage />);

    expect(screen.getAllByTestId('token-card')).toHaveLength(tokens.length);
  });
});
