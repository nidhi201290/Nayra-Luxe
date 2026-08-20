'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { AlertTriangle, IndianRupee, Package, ShoppingCart } from 'lucide-react';
import { useOrderStore } from '@/lib/store';
import { useAdminProductStore } from '@/lib/admin-store';
import { formatINR } from '@/lib/utils';

const LOW_STOCK_THRESHOLD = 3;

export default function AdminDashboard() {
  const orders = useOrderStore((s) => s.orders);
  const products = useAdminProductStore((s) => s.products);

  const todayOrders = useMemo(() => {
    const today = new Date().toDateString();
    return orders.filter((o) => new Date(o.createdAt).toDateString() === today);
  }, [orders]);

  const todayRevenue = todayOrders.reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter((o) => ['Placed', 'Confirmed'].includes(o.status));

  const lowStockVariants = useMemo(() => {
    const list: { product: string; variant: string; stock: number }[] = [];
    products.forEach((p) => {
      p.variants.forEach((v) => {
        if (v.stock <= LOW_STOCK_THRESHOLD) {
          list.push({ product: p.name, variant: v.size ? `Size ${v.size}` : v.color || '', stock: v.stock });
        }
      });
    });
    return list.slice(0, 8);
  }, [products]);

  const metrics = [
    { label: "Today's Orders", value: todayOrders.length, icon: ShoppingCart },
    { label: "Today's Revenue", value: formatINR(todayRevenue), icon: IndianRupee },
    { label: 'Pending Orders', value: pendingOrders.length, icon: Package },
    { label: 'Low-Stock Alerts', value: lowStockVariants.length, icon: AlertTriangle },
  ];

  return (
    <div>
      <h1 className="mb-6 text-h1">Dashboard</h1>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {metrics.map(({ label, value, icon: Icon }) => (
          <div key={label} className="card p-5">
            <Icon className="mb-3 h-5 w-5 text-gold-primary" />
            <p className="text-h2">{value}</p>
            <p className="text-caption text-charcoal-muted">{label}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-body text-h4">Recent Orders</h2>
            <Link href="/admin/orders" className="btn-text text-caption">View All</Link>
          </div>
          {orders.length === 0 ? (
            <p className="text-body text-charcoal-muted">No orders yet.</p>
          ) : (
            <ul className="divide-y divide-border">
              {orders.slice(0, 5).map((o) => (
                <li key={o.id} className="flex items-center justify-between py-3 text-body">
                  <span className="text-charcoal">#{o.orderNumber}</span>
                  <span className="text-charcoal-muted">{formatINR(o.total)}</span>
                  <span className="pill bg-blush text-gold-primary">{o.status}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-body text-h4">Low Stock Alerts</h2>
            <Link href="/admin/products" className="btn-text text-caption">Manage Products</Link>
          </div>
          {lowStockVariants.length === 0 ? (
            <p className="text-body text-charcoal-muted">All variants are well stocked.</p>
          ) : (
            <ul className="divide-y divide-border">
              {lowStockVariants.map((v, i) => (
                <li key={i} className="flex items-center justify-between py-3 text-body">
                  <span className="text-charcoal">{v.product} ({v.variant})</span>
                  <span className="text-warning">{v.stock} left</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
