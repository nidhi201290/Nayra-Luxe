"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Pencil, PackagePlus, Layers, Trash2, Search, Check, X } from "lucide-react";
import { fetchProductsWithStock, deleteProduct, deleteBatch, updateBatch } from "@/lib/inventory/api";
import { currentBatch } from "@/lib/inventory/batches";
import { Batch, Category, ProductWithStock } from "@/lib/inventory/types";
import { Badge } from "@/components/inventory/Badge";
import RestockForm from "@/components/inventory/RestockForm";
import EditProductForm from "@/components/inventory/EditProductForm";
import ProductModal from "@/components/inventory/ProductModal";
import { cn } from "@/lib/utils";

const currency = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(n);

const CATEGORIES: Category[] = ["Necklace", "Bracelet", "Earring", "Ring"];

// The batch a product's card prices itself from: whichever batch is
// currently being sold (matches invoice pricing), or the most recent batch
// for a sold-out product so its last known prices still show.
function displayPriceBatch(p: ProductWithStock) {
  return currentBatch(p) ?? p.batches[p.batches.length - 1] ?? null;
}

export default function InventoryPage() {
  const [products, setProducts] = useState<ProductWithStock[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<"all" | Category>("all");
  const [priceFilter, setPriceFilter] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [restocking, setRestocking] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editingBatch, setEditingBatch] = useState<string | null>(null);
  const [batchDraft, setBatchDraft] = useState({
    original_price: "",
    selling_price: "",
    quantity_remaining: "",
  });
  const [savingBatch, setSavingBatch] = useState(false);
  const [batchError, setBatchError] = useState<string | null>(null);
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [priceDraft, setPriceDraft] = useState("");
  const [savingPrice, setSavingPrice] = useState(false);
  const [priceError, setPriceError] = useState<string | null>(null);
  const selected = products.find((x) => x.id === selectedId) ?? null;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const exactPrice = priceFilter.trim() === "" ? null : parseFloat(priceFilter);
    return products.filter((p) => {
      if (categoryFilter !== "all" && p.category !== categoryFilter) return false;
      if (q !== "" && !p.name.toLowerCase().includes(q)) return false;
      if (exactPrice !== null) {
        const price = displayPriceBatch(p)?.selling_price;
        // Round to paise before comparing so e.g. 599 matches a stored 599.00.
        if (price === undefined || Math.round(price * 100) !== Math.round(exactPrice * 100)) return false;
      }
      return true;
    });
  }, [products, search, categoryFilter, priceFilter]);

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

  function startEditBatch(b: Batch) {
    setEditingBatch(b.id);
    setBatchError(null);
    setBatchDraft({
      original_price: String(b.original_price),
      selling_price: String(b.selling_price),
      quantity_remaining: String(b.quantity_remaining),
    });
  }

  async function saveBatch(b: Batch) {
    const remaining = parseInt(batchDraft.quantity_remaining || "0", 10);
    // The DB only guards against negatives; remaining above what was bought
    // would make stock figures nonsense, so catch it here.
    if (remaining > b.quantity_bought) {
      setBatchError(`Remaining can't exceed the ${b.quantity_bought} originally bought.`);
      return;
    }
    setSavingBatch(true);
    setBatchError(null);
    try {
      await updateBatch(b.id, {
        original_price: parseFloat(batchDraft.original_price),
        selling_price: parseFloat(batchDraft.selling_price),
        quantity_remaining: remaining,
      });
      setEditingBatch(null);
      load();
    } catch (err) {
      setBatchError(err instanceof Error ? err.message : "Couldn't save the batch.");
    } finally {
      setSavingBatch(false);
    }
  }

  function startEditPrice(p: ProductWithStock) {
    const batch = displayPriceBatch(p);
    if (!batch) return;
    setEditingPriceId(p.id);
    setPriceDraft(String(batch.selling_price));
    setPriceError(null);
  }

  // Quick-edit for just the selling price, writing straight to the batch
  // the card is currently pricing itself from (same one "View batches"
  // editing would touch) — a shortcut for the common case of a price
  // change without needing to open the full batch table.
  async function saveSellingPrice(p: ProductWithStock) {
    const batch = displayPriceBatch(p);
    if (!batch) return;
    const value = parseFloat(priceDraft);
    if (!Number.isFinite(value) || value < 0) {
      setPriceError("Enter a valid price.");
      return;
    }
    setSavingPrice(true);
    setPriceError(null);
    try {
      await updateBatch(batch.id, { selling_price: value });
      setEditingPriceId(null);
      load();
    } catch (err) {
      setPriceError(err instanceof Error ? err.message : "Couldn't save the price.");
    } finally {
      setSavingPrice(false);
    }
  }

  // Shared action-icon row for both the big-picture card and the compact
  // header shown once a card is expanded (editing / restocking / batches).
  function renderActions(p: ProductWithStock) {
    return (
      <div className="flex items-center gap-1.5">
        <ActionButton
          label="Restock"
          active={restocking === p.id}
          onClick={() => {
            setRestocking(restocking === p.id ? null : p.id);
            setEditing(null);
          }}
        >
          <PackagePlus className="h-4 w-4" />
        </ActionButton>
        <ActionButton
          label={editing === p.id ? "Cancel edit" : "Edit"}
          active={editing === p.id}
          onClick={() => {
            setEditing(editing === p.id ? null : p.id);
            setRestocking(null);
          }}
        >
          <Pencil className="h-4 w-4" />
        </ActionButton>
        <ActionButton
          label={expanded === p.id ? "Hide batches" : "View batches"}
          active={expanded === p.id}
          onClick={() => setExpanded(expanded === p.id ? null : p.id)}
        >
          <Layers className="h-4 w-4" />
        </ActionButton>
        <ActionButton label="Delete" tone="error" onClick={() => handleDeleteProduct(p.id)}>
          <Trash2 className="h-4 w-4" />
        </ActionButton>
      </div>
    );
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

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[200px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product name…"
            className="input-field w-full pl-9"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value as "all" | Category)}
          className="input-field w-full sm:w-56"
        >
          <option value="all">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <input
          type="number"
          inputMode="decimal"
          min="0"
          value={priceFilter}
          onChange={(e) => setPriceFilter(e.target.value)}
          placeholder="Price ₹"
          aria-label="Selling price"
          className="input-field w-28 sm:w-32"
        />
      </div>

      {loading ? (
        <p className="text-charcoal-muted">Loading…</p>
      ) : products.length === 0 ? (
        <div className="card p-10 text-center text-charcoal-muted">
          No products yet. Add your first one to get started.
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-10 text-center text-charcoal-muted">
          No products match your search or filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => {
            const isOpen = editing === p.id || restocking === p.id || expanded === p.id;
            // Prefer the batch currently being sold from (matches invoice
            // pricing); fall back to the most recent batch for a sold-out
            // product so its last known prices still show instead of a dash.
            const priceBatch = displayPriceBatch(p);

            return (
              <div
                key={p.id}
                className={cn(
                  "card flex flex-col overflow-hidden",
                  isOpen && "sm:col-span-2 lg:col-span-3"
                )}
              >
                {isOpen ? (
                  <div className="flex flex-wrap items-center gap-4 p-4">
                    <button
                      type="button"
                      onClick={() => setSelectedId(p.id)}
                      aria-label={`View details for ${p.name}`}
                      className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-blush focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-light"
                    >
                      {p.image_url && <Image src={p.image_url} alt={p.name} fill className="object-cover" />}
                    </button>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="truncate font-medium text-ink">{p.name}</h3>
                        <Badge>{p.category}</Badge>
                      </div>
                      <p className="mt-0.5 text-sm text-charcoal-muted">
                        {p.total_remaining} unit{p.total_remaining !== 1 ? "s" : ""} across {p.batches.length} batch
                        {p.batches.length !== 1 ? "es" : ""}
                      </p>
                    </div>
                    {renderActions(p)}
                  </div>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => setSelectedId(p.id)}
                      aria-label={`View details for ${p.name}`}
                      className="block text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gold-light"
                    >
                      <div className="relative aspect-square w-full bg-blush">
                        {p.image_url ? (
                          <Image src={p.image_url} alt={p.name} fill className="object-cover" />
                        ) : (
                          <div className="flex h-full items-center justify-center text-sm text-charcoal-muted">
                            No image
                          </div>
                        )}
                        <div className="absolute left-2 top-2 flex flex-wrap gap-1">
                          {p.total_remaining === 0 ? (
                            <Badge tone="error">Out of stock</Badge>
                          ) : (
                            p.is_low_stock && <Badge tone="warning">Low stock</Badge>
                          )}
                        </div>
                      </div>
                      <div className="px-4 pt-3">
                        <Badge>{p.category}</Badge>
                        <h3 className="mt-1 line-clamp-2 font-medium text-ink">{p.name}</h3>
                      </div>
                    </button>

                    <div className="flex flex-1 flex-col gap-3 px-4 pb-4 pt-2">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-xs text-charcoal-muted">Original Price</p>
                          <p className="font-medium text-ink">
                            {priceBatch ? currency(priceBatch.original_price) : "—"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-charcoal-muted">Selling Price</p>
                          {editingPriceId === p.id ? (
                            <div className="flex items-center gap-1">
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                autoFocus
                                value={priceDraft}
                                onChange={(e) => setPriceDraft(e.target.value)}
                                className="input-field w-20 py-1 text-sm"
                              />
                              <button
                                type="button"
                                onClick={() => saveSellingPrice(p)}
                                disabled={savingPrice}
                                aria-label="Save selling price"
                                className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md border border-gold text-gold hover:bg-blush disabled:opacity-50"
                              >
                                <Check className="h-3.5 w-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingPriceId(null)}
                                aria-label="Cancel"
                                className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md border border-border text-charcoal-muted hover:text-ink"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5">
                              <p className="font-medium text-ink">
                                {priceBatch ? currency(priceBatch.selling_price) : "—"}
                              </p>
                              {priceBatch && (
                                <button
                                  type="button"
                                  onClick={() => startEditPrice(p)}
                                  aria-label="Edit selling price"
                                  className="text-charcoal-muted hover:text-gold"
                                >
                                  <Pencil className="h-3 w-3" />
                                </button>
                              )}
                            </div>
                          )}
                          {editingPriceId === p.id && priceError && (
                            <p className="mt-1 text-xs text-error">{priceError}</p>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-charcoal-muted">
                        <span className="font-medium text-ink">{p.total_remaining}</span> unit
                        {p.total_remaining !== 1 ? "s" : ""} remaining
                      </p>
                      <div className="mt-auto flex items-center justify-between border-t border-border pt-3">
                        {renderActions(p)}
                      </div>
                    </div>
                  </>
                )}

                {editing === p.id && (
                  <EditProductForm
                    product={p}
                    onCancel={() => setEditing(null)}
                    onDone={() => {
                      setEditing(null);
                      load();
                    }}
                  />
                )}

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
                    <div className="space-y-3 sm:hidden">
                      {p.batches.map((b) => (
                        <div key={b.id} className="rounded-md border border-border bg-white p-3 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-ink">{b.purchase_date}</span>
                            <div className="flex items-center gap-1">
                              {editingBatch === b.id ? (
                                <>
                                  <button
                                    onClick={() => saveBatch(b)}
                                    disabled={savingBatch}
                                    className="px-2 py-1 text-gold hover:underline disabled:opacity-50"
                                  >
                                    {savingBatch ? "Saving…" : "Save"}
                                  </button>
                                  <button
                                    onClick={() => setEditingBatch(null)}
                                    className="px-2 py-1 text-charcoal-muted hover:underline"
                                  >
                                    Cancel
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    onClick={() => startEditBatch(b)}
                                    className="px-2 py-1 text-ink hover:underline"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleDeleteBatch(b.id)}
                                    className="px-2 py-1 text-error hover:underline"
                                  >
                                    Remove
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="mt-2 grid grid-cols-2 items-center gap-x-4 gap-y-1 text-charcoal-muted">
                            <span>Cost</span>
                            {editingBatch === b.id ? (
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={batchDraft.original_price}
                                onChange={(e) =>
                                  setBatchDraft({ ...batchDraft, original_price: e.target.value })
                                }
                                className="input-field py-1 text-right"
                              />
                            ) : (
                              <span className="text-right text-ink">{currency(b.original_price)}</span>
                            )}
                            <span>Selling</span>
                            {editingBatch === b.id ? (
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={batchDraft.selling_price}
                                onChange={(e) =>
                                  setBatchDraft({ ...batchDraft, selling_price: e.target.value })
                                }
                                className="input-field py-1 text-right"
                              />
                            ) : (
                              <span className="text-right text-ink">{currency(b.selling_price)}</span>
                            )}
                            <span>Bought</span>
                            <span className="text-right text-ink">{b.quantity_bought}</span>
                            <span>Remaining</span>
                            {editingBatch === b.id ? (
                              <input
                                type="number"
                                min="0"
                                max={b.quantity_bought}
                                value={batchDraft.quantity_remaining}
                                onChange={(e) =>
                                  setBatchDraft({ ...batchDraft, quantity_remaining: e.target.value })
                                }
                                className="input-field py-1 text-right"
                              />
                            ) : (
                              <span className="text-right text-ink">
                                {b.quantity_remaining === 0 ? "Sold out" : b.quantity_remaining}
                              </span>
                            )}
                          </div>
                          {editingBatch === b.id && batchError && (
                            <p className="mt-2 text-xs text-error">{batchError}</p>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="hidden overflow-x-auto sm:block">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-left text-charcoal-muted">
                            <th className="pb-2 font-normal">Purchased</th>
                            <th className="pb-2 font-normal">Cost</th>
                            <th className="pb-2 font-normal">Selling</th>
                            <th className="pb-2 font-normal">Bought</th>
                            <th className="pb-2 font-normal">Remaining</th>
                            <th className="pb-2 font-normal"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {p.batches.map((b) =>
                            editingBatch === b.id ? (
                              <tr key={b.id} className="border-t border-border bg-white">
                                <td className="py-2">{b.purchase_date}</td>
                                <td className="py-2 pr-2">
                                  <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={batchDraft.original_price}
                                    onChange={(e) =>
                                      setBatchDraft({ ...batchDraft, original_price: e.target.value })
                                    }
                                    className="input-field w-24 py-1"
                                  />
                                </td>
                                <td className="py-2 pr-2">
                                  <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={batchDraft.selling_price}
                                    onChange={(e) =>
                                      setBatchDraft({ ...batchDraft, selling_price: e.target.value })
                                    }
                                    className="input-field w-24 py-1"
                                  />
                                </td>
                                <td className="py-2">{b.quantity_bought}</td>
                                <td className="py-2 pr-2">
                                  <input
                                    type="number"
                                    min="0"
                                    max={b.quantity_bought}
                                    value={batchDraft.quantity_remaining}
                                    onChange={(e) =>
                                      setBatchDraft({ ...batchDraft, quantity_remaining: e.target.value })
                                    }
                                    className="input-field w-20 py-1"
                                  />
                                </td>
                                <td className="whitespace-nowrap py-2 text-right">
                                  <button
                                    onClick={() => saveBatch(b)}
                                    disabled={savingBatch}
                                    className="text-gold hover:underline disabled:opacity-50"
                                  >
                                    {savingBatch ? "Saving…" : "Save"}
                                  </button>
                                  <button
                                    onClick={() => setEditingBatch(null)}
                                    className="ml-3 text-charcoal-muted hover:underline"
                                  >
                                    Cancel
                                  </button>
                                  {batchError && <p className="mt-1 text-xs text-error">{batchError}</p>}
                                </td>
                              </tr>
                            ) : (
                              <tr key={b.id} className="border-t border-border">
                                <td className="py-2">{b.purchase_date}</td>
                                <td className="py-2">{currency(b.original_price)}</td>
                                <td className="py-2">{currency(b.selling_price)}</td>
                                <td className="py-2">{b.quantity_bought}</td>
                                <td className="py-2">{b.quantity_remaining}</td>
                                <td className="whitespace-nowrap py-2 text-right">
                                  <button onClick={() => startEditBatch(b)} className="text-ink hover:underline">
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleDeleteBatch(b.id)}
                                    className="ml-3 text-error hover:underline"
                                  >
                                    Remove
                                  </button>
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
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

function ActionButton({
  label,
  onClick,
  active,
  tone = "default",
  children,
}: {
  label: string;
  onClick: () => void;
  active?: boolean;
  tone?: "default" | "error";
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-md border transition-colors",
        tone === "error"
          ? "border-error/30 text-error hover:bg-error/10"
          : active
            ? "border-gold bg-blush text-gold"
            : "border-border text-charcoal hover:border-gold hover:text-gold"
      )}
    >
      {children}
    </button>
  );
}
