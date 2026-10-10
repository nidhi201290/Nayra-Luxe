import { uploadImage } from '@/lib/upload';
import { currentSellingPrice } from './batches';
import {
  Batch,
  Category,
  DraftLineItem,
  Invoice,
  InvoiceWithLineItems,
  PaymentMode,
  Product,
  ProductWithStock,
} from './types';

// Thin fetch wrappers over app/api/inventory/* — all actual Supabase access
// happens server-side (see lib/inventory/server.ts) since the anon key has
// no access to inventory_* tables.

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || 'Request failed');
  return body as T;
}

// ── Inventory ──────────────────────────────────────────────────

export async function fetchProductsWithStock(): Promise<ProductWithStock[]> {
  const { products } = await request<{ products: ProductWithStock[] }>('/api/inventory/products');
  return products;
}

export async function createProductWithBatch(input: {
  name: string;
  category: Category;
  imageUrl: string | null;
  lowStockThreshold: number;
  originalPrice: number;
  sellingPrice: number;
  quantityBought: number;
  purchaseDate: string;
}) {
  const { productId } = await request<{ productId: string }>('/api/inventory/products', {
    method: 'POST',
    body: JSON.stringify(input),
  });
  return productId;
}

// Restock: add a new purchase batch to an existing product.
export async function addBatch(input: {
  productId: string;
  purchaseDate: string;
  originalPrice: number;
  sellingPrice: number;
  quantityBought: number;
}) {
  await request('/api/inventory/batches', { method: 'POST', body: JSON.stringify(input) });
}

export async function updateProduct(
  productId: string,
  updates: Partial<Pick<Product, 'name' | 'category' | 'low_stock_threshold' | 'image_url'>>
) {
  await request(`/api/inventory/products/${productId}`, { method: 'PATCH', body: JSON.stringify(updates) });
}

export async function updateBatch(
  batchId: string,
  updates: Partial<Pick<Batch, 'original_price' | 'selling_price' | 'quantity_remaining'>>
) {
  await request(`/api/inventory/batches/${batchId}`, { method: 'PATCH', body: JSON.stringify(updates) });
}

export async function deleteProduct(productId: string) {
  await request(`/api/inventory/products/${productId}`, { method: 'DELETE' });
}

export async function deleteBatch(batchId: string) {
  await request(`/api/inventory/batches/${batchId}`, { method: 'DELETE' });
}

export async function uploadProductImage(file: File): Promise<string> {
  return uploadImage(file, 'inventory');
}

// ── Invoices ───────────────────────────────────────────────────

export async function createInvoice(input: {
  customerName: string;
  paymentMode: PaymentMode;
  paymentStatus: 'Paid' | 'Pending';
  lineItems: DraftLineItem[];
}): Promise<Invoice> {
  const { invoice } = await request<{ invoice: Invoice }>('/api/inventory/invoices', {
    method: 'POST',
    body: JSON.stringify(input),
  });
  return invoice;
}

export async function fetchInvoices(): Promise<Invoice[]> {
  const { invoices } = await request<{ invoices: Invoice[] }>('/api/inventory/invoices');
  return invoices;
}

export async function fetchInvoiceWithLineItems(invoiceId: string): Promise<InvoiceWithLineItems> {
  const { invoice } = await request<{ invoice: InvoiceWithLineItems }>(`/api/inventory/invoices/${invoiceId}`);
  return invoice;
}

// Restores the sold units to their original batches before removing the
// invoice — see delete_inventory_invoice in supabase/inventory_schema.sql.
export async function deleteInvoice(invoiceId: string) {
  await request(`/api/inventory/invoices/${invoiceId}`, { method: 'DELETE' });
}

export async function updatePaymentStatus(invoiceId: string, status: 'Paid' | 'Pending') {
  await request(`/api/inventory/invoices/${invoiceId}`, {
    method: 'PATCH',
    body: JSON.stringify({ payment_status: status }),
  });
}

// ── Dashboard ──────────────────────────────────────────────────

export async function fetchDashboardStats() {
  return request<{
    stockValueAtCost: number;
    stockValueAtSelling: number;
    totalRevenue: number;
    invoiceCount: number;
    pendingInvoices: Invoice[];
    pendingAmount: number;
    lowStockProducts: ProductWithStock[];
  }>('/api/inventory/dashboard');
}

export { currentSellingPrice };
