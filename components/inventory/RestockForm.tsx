"use client";

import { useState } from "react";
import { addBatch } from "@/lib/inventory/api";
import { ProductWithStock } from "@/lib/inventory/types";

// Prefills prices from the most recent batch so a repeat purchase at the
// same price is just a quantity entry.
export default function RestockForm({
  product,
  onDone,
  onCancel,
}: {
  product: ProductWithStock;
  onDone: () => void;
  onCancel: () => void;
}) {
  const last = product.batches[product.batches.length - 1];
  const [originalPrice, setOriginalPrice] = useState(last ? String(last.original_price) : "");
  const [sellingPrice, setSellingPrice] = useState(last ? String(last.selling_price) : "");
  const [quantity, setQuantity] = useState("");
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().slice(0, 10));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await addBatch({
        productId: product.id,
        purchaseDate,
        originalPrice: parseFloat(originalPrice),
        sellingPrice: parseFloat(sellingPrice),
        quantityBought: parseInt(quantity, 10),
      });
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't save the restock.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border-t border-border bg-ivory/60 p-4 space-y-4">
      <p className="text-sm text-charcoal-muted">
        Adds a new batch for <span className="text-ink font-medium">{product.name}</span>. Prices are
        filled in from the last batch; change them if this purchase cost differently.
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="col-span-2 md:col-span-1">
          <label className="label-text">Quantity bought</label>
          <input
            required
            autoFocus
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="input-field"
          />
        </div>
        <div>
          <label className="label-text">Original price (₹)</label>
          <input
            required
            type="number"
            min="0"
            step="0.01"
            value={originalPrice}
            onChange={(e) => setOriginalPrice(e.target.value)}
            className="input-field"
          />
        </div>
        <div>
          <label className="label-text">Selling price (₹)</label>
          <input
            required
            type="number"
            min="0"
            step="0.01"
            value={sellingPrice}
            onChange={(e) => setSellingPrice(e.target.value)}
            className="input-field"
          />
        </div>
        <div className="col-span-2 md:col-span-1">
          <label className="label-text">Purchase date</label>
          <input
            type="date"
            value={purchaseDate}
            onChange={(e) => setPurchaseDate(e.target.value)}
            className="input-field"
          />
        </div>
      </div>
      {error && <p className="text-error text-sm">{error}</p>}
      <div className="flex gap-3">
        <button type="submit" disabled={submitting} className="btn-primary">
          {submitting ? "Saving…" : "Add stock"}
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
      </div>
    </form>
  );
}
