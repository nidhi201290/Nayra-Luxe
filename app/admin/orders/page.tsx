'use client';

import { useState } from 'react';
import { useOrderStore } from '@/lib/store';
import { OrderStatus } from '@/lib/types';
import { formatINR } from '@/lib/utils';

const STATUSES: OrderStatus[] = ['Placed', 'Confirmed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled', 'Returned'];

export default function AdminOrdersPage() {
  const orders = useOrderStore((s) => s.orders);
  const updateOrder = useOrderStore((s) => s.updateOrder);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = statusFilter === 'all' ? orders : orders.filter((o) => o.status === statusFilter);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-h1">Orders</h1>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input-field w-auto py-2">
          <option value="all">All Statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="text-body text-charcoal-muted">No orders found.</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => (
            <div key={order.id} className="rounded-md border border-border bg-white">
              <button
                className="flex w-full flex-wrap items-center justify-between gap-3 p-4 text-left"
                onClick={() => setExpanded(expanded === order.id ? null : order.id)}
              >
                <div>
                  <p className="font-medium text-charcoal">#{order.orderNumber}</p>
                  <p className="text-caption text-charcoal-muted">
                    {order.address.fullName} · {new Date(order.createdAt).toLocaleDateString('en-IN')}
                  </p>
                </div>
                <p className="text-body font-medium text-charcoal">{formatINR(order.total)}</p>
                <select
                  value={order.status}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => updateOrder(order.id, { status: e.target.value as OrderStatus })}
                  className="rounded-sm border border-border bg-white px-2 py-1 text-caption"
                >
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </button>

              {expanded === order.id && (
                <div className="border-t border-border p-4">
                  <ul className="mb-4 space-y-1">
                    {order.items.map((item, i) => (
                      <li key={i} className="flex justify-between text-body text-charcoal-muted">
                        <span>{item.productName} {item.variantLabel && `(${item.variantLabel})`} × {item.quantity}</span>
                        <span>{formatINR(item.price * item.quantity)}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mb-4 text-caption text-charcoal-muted">
                    Shipping to: {order.address.line1}, {order.address.city}, {order.address.state} - {order.address.pincode} · Phone: {order.address.phone}
                  </p>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <input
                      placeholder="Courier (e.g. Delhivery)"
                      defaultValue={order.courier}
                      onBlur={(e) => updateOrder(order.id, { courier: e.target.value })}
                      className="input-field"
                    />
                    <input
                      placeholder="Tracking number"
                      defaultValue={order.trackingNumber}
                      onBlur={(e) => updateOrder(order.id, { trackingNumber: e.target.value })}
                      className="input-field"
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
