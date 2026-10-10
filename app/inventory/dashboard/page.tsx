"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchDashboardStats } from "@/lib/inventory/api";
import { Badge } from "@/components/inventory/Badge";
import { ProductWithStock, Invoice } from "@/lib/inventory/types";

const currency = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

export default function DashboardPage() {
  const [stats, setStats] = useState<Awaited<ReturnType<typeof fetchDashboardStats>> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardStats().then(setStats).catch((e) => setError(e.message));
  }, []);

  if (error) {
    return (
      <div className="card p-6 text-error">
        Couldn&apos;t load the dashboard: {error}.
      </div>
    );
  }

  if (!stats) {
    return <p className="text-charcoal-muted">Loading dashboard…</p>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl text-ink">Dashboard</h1>
        <p className="text-charcoal-muted mt-1">
          An overview of stock, sales, and what needs your attention.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Stock value (cost)" value={currency(stats.stockValueAtCost)} />
        <StatCard label="Stock value (selling)" value={currency(stats.stockValueAtSelling)} />
        <StatCard label="Total revenue" value={currency(stats.totalRevenue)} />
        <StatCard label="Invoices generated" value={String(stats.invoiceCount)} />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <section className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl text-ink">Low stock</h2>
            <Link href="/inventory" className="text-sm text-gold hover:underline">
              View inventory
            </Link>
          </div>
          {stats.lowStockProducts.length === 0 ? (
            <p className="text-charcoal-muted text-sm">Everything is comfortably stocked.</p>
          ) : (
            <ul className="space-y-3">
              {stats.lowStockProducts.map((p: ProductWithStock) => (
                <li key={p.id} className="flex items-center justify-between gap-3 text-sm">
                  <span>
                    {p.name} <span className="text-charcoal-muted">· {p.category}</span>
                  </span>
                  <Badge tone="warning">{p.total_remaining} left</Badge>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl text-ink">Pending payments</h2>
            <span className="text-sm text-charcoal-muted">{currency(stats.pendingAmount)} total</span>
          </div>
          {stats.pendingInvoices.length === 0 ? (
            <p className="text-charcoal-muted text-sm">No pending payments.</p>
          ) : (
            <ul className="space-y-3">
              {stats.pendingInvoices.map((inv: Invoice) => (
                <li key={inv.id} className="flex items-center justify-between gap-3 text-sm">
                  <span>
                    {inv.invoice_number} <span className="text-charcoal-muted">· {inv.customer_name}</span>
                  </span>
                  <span className="font-medium">{currency(Number(inv.grand_total))}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="card p-4">
      <p className="text-xs text-charcoal-muted">{label}</p>
      <p className="font-display text-2xl text-ink mt-1">{value}</p>
    </div>
  );
}
