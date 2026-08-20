'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, ChevronUp, Package } from 'lucide-react';
import { useAuthStore, useOrderStore } from '@/lib/store';
import { formatINR } from '@/lib/utils';
import AccountNav from '@/components/account/AccountNav';
import { OrderStatus } from '@/lib/types';
import { cn } from '@/lib/utils';

const STATUS_STYLES: Record<OrderStatus, string> = {
  Placed: 'bg-blush text-gold-primary',
  Confirmed: 'bg-blush text-gold-primary',
  Shipped: 'bg-blush text-gold-primary',
  'Out for Delivery': 'bg-blush text-gold-primary',
  Delivered: 'bg-success/10 text-success',
  Cancelled: 'bg-error/10 text-error',
  Returned: 'bg-error/10 text-error',
};

export default function OrdersPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const orders = useOrderStore((s) => s.orders);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) router.replace('/login');
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <div className="section section-y flex flex-col gap-8 md:flex-row">
      <AccountNav />
      <div className="flex-1">
        <h1 className="mb-6 text-h2">Order History</h1>
        {orders.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <Package className="h-12 w-12 text-charcoal-muted" />
            <p className="text-body text-charcoal-muted">No orders yet.</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {orders.map((order) => (
              <li key={order.id} className="rounded-md border border-border">
                <button
                  className="flex w-full items-center justify-between p-4 text-left"
                  onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                >
                  <div>
                    <p className="text-body font-medium text-charcoal">Order #{order.orderNumber}</p>
                    <p className="text-caption text-charcoal-muted">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} · {formatINR(order.total)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={cn('pill', STATUS_STYLES[order.status])}>{order.status}</span>
                    {expanded === order.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </div>
                </button>
                {expanded === order.id && (
                  <div className="border-t border-border p-4">
                    <ul className="space-y-2">
                      {order.items.map((item, i) => (
                        <li key={i} className="flex justify-between text-body text-charcoal-muted">
                          <span>{item.productName} {item.variantLabel && `(${item.variantLabel})`} × {item.quantity}</span>
                          <span>{formatINR(item.price * item.quantity)}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-3 text-caption text-charcoal-muted">
                      Shipping to: {order.address.line1}, {order.address.city}, {order.address.state} - {order.address.pincode}
                    </p>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
