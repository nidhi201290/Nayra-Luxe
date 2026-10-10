import { ProductWithStock } from "./types";

// The batch stock is currently being sold from: the oldest batch that still
// has units left (matches the FIFO deduction in the database). Sold-out
// batches are skipped so a restock at a new price is picked up correctly.
export function currentBatch(product: ProductWithStock) {
  return product.batches.find((b) => b.quantity_remaining > 0) ?? null;
}

export function currentSellingPrice(product: ProductWithStock): number {
  return currentBatch(product)?.selling_price ?? 0;
}
