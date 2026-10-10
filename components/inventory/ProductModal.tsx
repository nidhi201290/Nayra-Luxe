"use client";

import { useEffect } from "react";
import { ProductWithStock } from "@/lib/inventory/types";
import { Badge } from "@/components/inventory/Badge";

const currency = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(n);

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

export default function ProductModal({
  product,
  onClose,
  onRestock,
}: {
  product: ProductWithStock;
  onClose: () => void;
  onRestock: () => void;
}) {
  // Close on Escape and lock background scroll while open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const bought = product.batches.reduce((s, b) => s + b.quantity_bought, 0);
  const remaining = product.total_remaining;
  const sold = bought - remaining;
  const stockAtCost = product.batches.reduce((s, b) => s + b.quantity_remaining * b.original_price, 0);
  const stockAtSelling = product.batches.reduce((s, b) => s + b.quantity_remaining * b.selling_price, 0);
  const outOfStock = remaining === 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-ink/50 p-0 sm:p-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${product.name} details`}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-t-lg sm:rounded-lg bg-white shadow-card"
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 h-9 w-9 rounded-full bg-white/90 border border-border text-charcoal hover:text-gold flex items-center justify-center text-xl leading-none"
        >
          ×
        </button>

        <div className="grid md:grid-cols-2">
          <div className="bg-blush md:min-h-[420px] flex items-center justify-center">
            {product.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-72 md:h-full object-cover"
              />
            ) : (
              <p className="text-charcoal-muted text-sm p-10">No image added</p>
            )}
          </div>

          <div className="p-6 space-y-5">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <Badge>{product.category}</Badge>
                {outOfStock ? (
                  <Badge tone="error">Out of stock</Badge>
                ) : (
                  product.is_low_stock && <Badge tone="warning">Low stock</Badge>
                )}
              </div>
              <h2 className="font-display text-2xl text-ink">{product.name}</h2>
              <p className="text-sm text-charcoal-muted mt-1">
                Added {formatDate(product.created_at)} · low stock warning at {product.low_stock_threshold} or fewer
              </p>
            </div>

            <dl className="grid grid-cols-3 gap-3 text-center">
              <Stat label="In stock" value={String(remaining)} />
              <Stat label="Sold" value={String(sold)} />
              <Stat label="Bought" value={String(bought)} />
            </dl>

            <dl className="space-y-2 text-sm">
              <Row label="Stock value (cost)" value={currency(stockAtCost)} />
              <Row label="Stock value (selling)" value={currency(stockAtSelling)} />
              <Row label="Profit if all sold" value={currency(stockAtSelling - stockAtCost)} />
            </dl>

            <button onClick={onRestock} className="btn-primary w-full">
              Restock
            </button>
          </div>
        </div>

        <div className="border-t border-border p-6">
          <h3 className="font-display text-lg text-ink mb-3">Purchase batches</h3>
          {product.batches.length === 0 ? (
            <p className="text-sm text-charcoal-muted">No batches yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-charcoal-muted">
                    <th className="font-normal pb-2 pr-4">Purchased</th>
                    <th className="font-normal pb-2 pr-4">Cost</th>
                    <th className="font-normal pb-2 pr-4">Selling</th>
                    <th className="font-normal pb-2 pr-4">Margin</th>
                    <th className="font-normal pb-2 pr-4">Bought</th>
                    <th className="font-normal pb-2">Left</th>
                  </tr>
                </thead>
                <tbody>
                  {product.batches.map((b) => {
                    const margin = b.selling_price - b.original_price;
                    const pct = b.selling_price > 0 ? (margin / b.selling_price) * 100 : 0;
                    return (
                      <tr key={b.id} className="border-t border-border">
                        <td className="py-2 pr-4 whitespace-nowrap">{formatDate(b.purchase_date)}</td>
                        <td className="py-2 pr-4">{currency(b.original_price)}</td>
                        <td className="py-2 pr-4">{currency(b.selling_price)}</td>
                        <td className="py-2 pr-4 whitespace-nowrap">
                          {currency(margin)} <span className="text-charcoal-muted">({pct.toFixed(0)}%)</span>
                        </td>
                        <td className="py-2 pr-4">{b.quantity_bought}</td>
                        <td className="py-2">
                          {b.quantity_remaining === 0 ? (
                            <span className="text-charcoal-muted">Sold out</span>
                          ) : (
                            b.quantity_remaining
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-ivory border border-border py-3">
      <p className="font-display text-xl text-ink">{value}</p>
      <p className="text-xs text-charcoal-muted">{label}</p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-charcoal-muted">{label}</dt>
      <dd className="text-ink font-medium">{value}</dd>
    </div>
  );
}
