"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { fetchProductsWithStock, deleteProduct, deleteBatch } from "@/lib/inventory/api";
import { ProductWithStock } from "@/lib/inventory/types";
import { Badge } from "@/components/inventory/Badge";
import RestockForm from "@/components/inventory/RestockForm";
import ProductModal from "@/components/inventory/ProductModal";

const currency = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(n);

export default function InventoryPage() {
  const [products, setProducts] = useState<ProductWithStock[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [restocking, setRestocking] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = products.find((x) => x.id === selectedId) ?? null;

  async function load() {
    setLoading(true);
    setProducts(await fetchProductsWithStock());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDeleteProduct(id: string) {
    if (!confirm("Remove this product from active inventory? Past invoices will keep their record.")) return;
    await deleteProduct(id);
    load();
  }

  async function handleDeleteBatch(id: string) {
    if (!confirm("Remove this batch?")) return;
    await deleteBatch(id);
    load();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl text-ink">Inventory</h1>
          <p className="text-charcoal-muted mt-1">Products and purchase batches on hand.</p>
        </div>
        <Link href="/inventory/new" className="btn-primary whitespace-nowrap">
          + Add Product
        </Link>
      </div>

      {loading ? (
        <p className="text-charcoal-muted">Loading…</p>
      ) : products.length === 0 ? (
        <div className="card p-10 text-center text-charcoal-muted">
          No products yet. Add your first one to get started.
        </div>
      ) : (
        <div className="grid gap-4">
          {products.map((p) => (
            <div key={p.id} className="card overflow-hidden">
              <div className="p-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                <button
                  type="button"
                  onClick={() => setSelectedId(p.id)}
                  aria-label={`View details for ${p.name}`}
                  className="flex w-full sm:w-auto sm:flex-1 min-w-0 items-center gap-4 text-left rounded-md hover:bg-ivory/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-light -m-1 p-1 transition-colors"
                >
                <div className="h-16 w-16 rounded-md bg-blush overflow-hidden flex-shrink-0 relative">
                  {p.image_url ? (
                    <Image src={p.image_url} alt={p.name} fill className="object-cover" />
                  ) : null}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-medium text-ink break-words sm:truncate">{p.name}</h3>
                    <Badge>{p.category}</Badge>
                    {p.total_remaining === 0 ? (
                      <Badge tone="error">Out of stock</Badge>
                    ) : (
                      p.is_low_stock && <Badge tone="warning">Low stock</Badge>
                    )}
                  </div>
                  <p className="text-sm text-charcoal-muted mt-0.5">
                    {p.total_remaining} unit{p.total_remaining !== 1 ? "s" : ""} across {p.batches.length} batch
                    {p.batches.length !== 1 ? "es" : ""}
                  </p>
                </div>
                </button>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <button
                    onClick={() => setRestocking(restocking === p.id ? null : p.id)}
                    className={`flex-1 sm:flex-none whitespace-nowrap text-sm ${
                      p.total_remaining === 0 || p.is_low_stock ? "btn-primary" : "btn-secondary"
                    }`}
                  >
                    Restock
                  </button>
                  <button
                    onClick={() => setExpanded(expanded === p.id ? null : p.id)}
                    className="flex-1 sm:flex-none whitespace-nowrap text-sm btn-secondary"
                  >
                    {expanded === p.id ? "Hide batches" : "View batches"}
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(p.id)}
                    className="shrink-0 px-2 py-2 text-sm text-error hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {restocking === p.id && (
                <RestockForm
                  product={p}
                  onCancel={() => setRestocking(null)}
                  onDone={() => {
                    setRestocking(null);
                    setExpanded(p.id);
                    load();
                  }}
                />
              )}

              {expanded === p.id && (
                <div className="border-t border-border bg-ivory/60 p-4">
                  <div className="sm:hidden space-y-3">
                    {p.batches.map((b) => (
                      <div key={b.id} className="rounded-md border border-border bg-white p-3 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-ink">{b.purchase_date}</span>
                          <button
                            onClick={() => handleDeleteBatch(b.id)}
                            className="px-2 py-1 text-error hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                        <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-charcoal-muted">
                          <span>Cost</span>
                          <span className="text-ink text-right">{currency(b.original_price)}</span>
                          <span>Selling</span>
                          <span className="text-ink text-right">{currency(b.selling_price)}</span>
                          <span>Bought</span>
                          <span className="text-ink text-right">{b.quantity_bought}</span>
                          <span>Remaining</span>
                          <span className="text-ink text-right">
                            {b.quantity_remaining === 0 ? "Sold out" : b.quantity_remaining}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-charcoal-muted">
                        <th className="font-normal pb-2">Purchased</th>
                        <th className="font-normal pb-2">Cost</th>
                        <th className="font-normal pb-2">Selling</th>
                        <th className="font-normal pb-2">Bought</th>
                        <th className="font-normal pb-2">Remaining</th>
                        <th className="font-normal pb-2"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {p.batches.map((b) => (
                        <tr key={b.id} className="border-t border-border">
                          <td className="py-2">{b.purchase_date}</td>
                          <td className="py-2">{currency(b.original_price)}</td>
                          <td className="py-2">{currency(b.selling_price)}</td>
                          <td className="py-2">{b.quantity_bought}</td>
                          <td className="py-2">{b.quantity_remaining}</td>
                          <td className="py-2 text-right">
                            <button
                              onClick={() => handleDeleteBatch(b.id)}
                              className="text-error hover:underline"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {selected && (
        <ProductModal
          product={selected}
          onClose={() => setSelectedId(null)}
          onRestock={() => {
            setRestocking(selected.id);
            setSelectedId(null);
          }}
        />
      )}
    </div>
  );
}
