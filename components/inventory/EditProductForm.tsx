"use client";

import { useState } from "react";
import Image from "next/image";
import { updateProduct, uploadProductImage } from "@/lib/inventory/api";
import { Category, ProductWithStock } from "@/lib/inventory/types";

const categories: Category[] = ["Necklace", "Bracelet", "Earring", "Ring"];

// Edits the product record itself (name, category, image, low-stock threshold).
// Prices and quantities belong to individual batches, so they're changed via
// Restock or in the batch list rather than here.
export default function EditProductForm({
  product,
  onDone,
  onCancel,
}: {
  product: ProductWithStock;
  onDone: () => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(product.name);
  const [category, setCategory] = useState<Category>(product.category);
  const [lowStockThreshold, setLowStockThreshold] = useState(String(product.low_stock_threshold));
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      // Only send the image when a new one was picked, so saving without
      // touching the file input keeps the existing image.
      const imageUrl = imageFile ? await uploadProductImage(imageFile) : undefined;
      await updateProduct(product.id, {
        name: name.trim(),
        category,
        low_stock_threshold: parseInt(lowStockThreshold || "0", 10),
        ...(imageUrl ? { image_url: imageUrl } : {}),
      });
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't save the changes.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border-t border-border bg-ivory/60 p-4 space-y-4">
      <p className="text-sm text-charcoal-muted">
        Editing <span className="text-ink font-medium">{product.name}</span>. To change prices or
        quantities, use Restock or edit the batch directly.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <label className="label-text">Product name</label>
          <input
            required
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-field"
          />
        </div>
        <div>
          <label className="label-text">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            className="input-field"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="label-text">Low stock threshold</label>
          <input
            type="number"
            min="0"
            value={lowStockThreshold}
            onChange={(e) => setLowStockThreshold(e.target.value)}
            className="input-field"
          />
        </div>
        <div className="md:col-span-2">
          <label className="label-text">Replace image</label>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-md bg-blush relative">
              {product.image_url ? (
                <Image src={product.image_url} alt="" fill className="object-cover" />
              ) : null}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
              className="block w-full text-sm text-charcoal-muted file:mr-3 file:rounded-md file:border-0 file:bg-blush file:px-3 file:py-2 file:text-sm file:text-ink"
            />
          </div>
          {imageFile && (
            <p className="mt-1 text-xs text-charcoal-muted">New image: {imageFile.name}</p>
          )}
        </div>
      </div>

      {error && <p className="text-error text-sm">{error}</p>}

      <div className="flex gap-3">
        <button type="submit" disabled={submitting} className="btn-primary">
          {submitting ? "Saving…" : "Save changes"}
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
      </div>
    </form>
  );
}
