"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProductWithBatch, uploadProductImage } from "@/lib/inventory/api";
import { Category } from "@/lib/inventory/types";

const categories: Category[] = ["Necklace", "Bracelet", "Earring", "Ring"];

export default function NewProductPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [category, setCategory] = useState<Category>("Necklace");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [lowStockThreshold, setLowStockThreshold] = useState(3);
  const [originalPrice, setOriginalPrice] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [quantityBought, setQuantityBought] = useState("");
  const [purchaseDate, setPurchaseDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      let imageUrl: string | null = null;
      if (imageFile) {
        imageUrl = await uploadProductImage(imageFile);
      }
      await createProductWithBatch({
        name: name.trim(),
        category,
        imageUrl,
        lowStockThreshold,
        originalPrice: parseFloat(originalPrice),
        sellingPrice: parseFloat(sellingPrice),
        quantityBought: parseInt(quantityBought, 10),
        purchaseDate,
      });
      router.push("/inventory");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-xl">
      <h1 className="font-display text-3xl text-ink mb-1">Add Product</h1>
      <p className="text-charcoal-muted mb-6">
        Adding a product with an existing name + category creates a new batch instead of a duplicate.
      </p>

      <form onSubmit={handleSubmit} className="card p-6 space-y-5">
        <div>
          <label className="label-text">Product image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
            className="block w-full text-sm text-charcoal-muted file:mr-3 file:rounded-md file:border-0 file:bg-blush file:px-3 file:py-2 file:text-sm file:text-ink"
          />
        </div>

        <div>
          <label className="label-text">Product name</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-field"
            placeholder="e.g. Pearl Drop Earring"
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

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label-text">Original price (₹)</label>
            <input
              required
              type="number"
              step="0.01"
              min="0"
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
              step="0.01"
              min="0"
              value={sellingPrice}
              onChange={(e) => setSellingPrice(e.target.value)}
              className="input-field"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 min-[400px]:grid-cols-2 gap-4">
          <div>
            <label className="label-text">Quantity bought</label>
            <input
              required
              type="number"
              min="1"
              value={quantityBought}
              onChange={(e) => setQuantityBought(e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="label-text">Purchase date</label>
            <input
              type="date"
              value={purchaseDate}
              onChange={(e) => setPurchaseDate(e.target.value)}
              className="input-field"
            />
          </div>
        </div>

        <div>
          <label className="label-text">Low stock warning threshold</label>
          <input
            type="number"
            min="0"
            value={lowStockThreshold}
            onChange={(e) => setLowStockThreshold(parseInt(e.target.value || "0", 10))}
            className="input-field w-32"
          />
        </div>

        {error && <p className="text-error text-sm">{error}</p>}

        <button type="submit" disabled={submitting} className="btn-primary w-full">
          {submitting ? "Saving…" : "Save Product"}
        </button>
      </form>
    </div>
  );
}
