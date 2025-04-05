import { tokens } from '@/data/tokens';
import { BuyTokenForm } from '@/components/BuyTokenForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface PageProps {
  params: {
    tokenId: string;
  };
}

export function generateStaticParams() {
  return tokens.map((token) => ({
    tokenId: token.id,
  }));
}

export default function BuyTokenPage({ params }: PageProps) {
  const token = tokens.find((t) => t.id === params.tokenId);

  if (!token) {
    return (
      <main className="container mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8">
          <Button variant="ghost" asChild>
            <Link href="/buy">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Tokens
            </Link>
          </Button>
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold">Token not found</h1>
          <p className="text-muted-foreground">The token you are looking for does not exist.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <Button variant="ghost" asChild>
          <Link href="/buy">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Tokens
          </Link>
        </Button>
      </div>
      <BuyTokenForm token={token} />
    </main>
  );
}
