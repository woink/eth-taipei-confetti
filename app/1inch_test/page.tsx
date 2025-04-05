'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

async function OneInchBackend() {
  const response = await fetch('/api/oneinch-backend');
  if (!response.ok) {
    throw new Error('Failed to fetch orders');
  }
  const orders = await response.json();
  return orders;
}

export default function BuyPage() {
  const router = useRouter();
  const [orders, setOrders] = useState(null);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const fetchedOrders = await OneInchBackend();
        setOrders(fetchedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    }
    fetchOrders();
  }, []);

  return (
    <main className="container mx-auto max-w-4xl px-4 py-8">
      <p>hola</p>
      {/* Optionally render orders */}
      {orders && <pre>{JSON.stringify(orders, null, 2)}</pre>}
    </main>
  );
}