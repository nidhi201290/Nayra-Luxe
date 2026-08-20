'use client';

import { useMemo } from 'react';
import { useOrderStore } from '@/lib/store';
import { formatINR } from '@/lib/utils';

export default function AdminCustomersPage() {
  const orders = useOrderStore((s) => s.orders);

  const customers = useMemo(() => {
    const map = new Map<string, { name: string; phone: string; orders: number; total: number }>();
    orders.forEach((o) => {
      const key = o.address.phone;
      const existing = map.get(key);
      if (existing) {
        existing.orders += 1;
        existing.total += o.total;
      } else {
        map.set(key, { name: o.address.fullName, phone: o.address.phone, orders: 1, total: o.total });
      }
    });
    return Array.from(map.values());
  }, [orders]);

  return (
    <div>
      <h1 className="mb-6 text-h1">Customers</h1>
      {customers.length === 0 ? (
        <p className="text-body text-charcoal-muted">No customers yet — customer records are created automatically as orders come in.</p>
      ) : (
        <div className="overflow-x-auto rounded-md border border-border bg-white">
          <table className="w-full text-left text-body">
            <thead className="border-b border-border bg-ivory text-caption uppercase text-charcoal-muted">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Orders</th>
                <th className="p-3">Total Spend</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.phone} className="border-b border-border last:border-none">
                  <td className="p-3 font-medium text-charcoal">{c.name}</td>
                  <td className="p-3 text-charcoal-muted">{c.phone}</td>
                  <td className="p-3 text-charcoal-muted">{c.orders}</td>
                  <td className="p-3 text-charcoal-muted">{formatINR(c.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
