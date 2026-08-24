'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';
import { useOrderStore } from '@/lib/store';
import { formatINR } from '@/lib/utils';

export default function OrderConfirmationPage() {
  return (
    <Suspense>
      <OrderConfirmationContent />
    </Suspense>
  );
}

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') ?? '';
  const order = useOrderStore((s) => s.getOrder(orderId));

  if (!order) {
    return (
      <div className="section section-y py-24 text-center">
        <h1 className="text-h2">Order not found</h1>
        <p className="mt-2 text-body text-charcoal-muted">This order may have already been viewed in another session.</p>
        <Link href="/shop" className="btn-primary mt-6 inline-flex">Continue Shopping</Link>
      </div>
    );
  }

  const estimatedDate = new Date(order.createdAt);
  estimatedDate.setDate(estimatedDate.getDate() + 5);

  return (
    <div className="section section-y max-w-2xl">
      <div className="flex flex-col items-center text-center">
        <CheckCircle2 className="h-16 w-16 text-success" />
        <h1 className="mt-4 text-h1">Order Confirmed!</h1>
        <p className="mt-2 text-body-lg text-charcoal-muted">
          Order #{order.orderNumber} · Estimated delivery by{' '}
          {estimatedDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
        </p>
        <p className="mt-2 text-caption text-charcoal-muted">You&apos;ll receive updates on WhatsApp/Email.</p>
      </div>

      <div className="mt-10 rounded-md border border-border p-6">
        <h2 className="mb-4 font-body text-h4">Order Summary</h2>
        <ul className="space-y-3 border-b border-border pb-4">
          {order.items.map((item, i) => (
            <li key={i} className="flex justify-between text-body text-charcoal">
              <span>
                {item.productName} {item.variantLabel && `(${item.variantLabel})`} × {item.quantity}
              </span>
              <span>{formatINR(item.price * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="space-y-1 pt-4 text-body">
          <div className="flex justify-between text-charcoal-muted"><span>Subtotal</span><span>{formatINR(order.subtotal)}</span></div>
          {order.discount > 0 && (
            <div className="flex justify-between text-success"><span>Discount</span><span>-{formatINR(order.discount)}</span></div>
          )}
          <div className="flex justify-between text-charcoal-muted"><span>Shipping</span><span>{order.shippingFee === 0 ? 'Free' : formatINR(order.shippingFee)}</span></div>
          <div className="flex justify-between border-t border-border pt-2 text-h4 text-charcoal"><span>Total Paid</span><span>{formatINR(order.total)}</span></div>
        </div>
      </div>

      <div className="mt-6 rounded-md border border-border p-6">
        <h2 className="mb-2 font-body text-h4">Shipping Address</h2>
        <p className="text-body text-charcoal-muted">
          {order.address.fullName}<br />
          {order.address.line1}{order.address.line2 ? `, ${order.address.line2}` : ''}<br />
          {order.address.city}, {order.address.state} - {order.address.pincode}<br />
          Phone: {order.address.phone}
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-3 md:flex-row">
        <Link href="/account/orders" className="btn-secondary flex-1 text-center">Track Order</Link>
        <Link href="/shop" className="btn-primary flex-1 text-center">Continue Shopping</Link>
      </div>
    </div>
  );
}
