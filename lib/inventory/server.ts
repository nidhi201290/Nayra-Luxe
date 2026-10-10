import { getSupabaseAdmin } from '@/lib/supabase/server';
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

// Server-only data access for the inventory/invoice tool — every function
// here uses the service-role client, which is the only way in since
// inventory_* tables have RLS enabled with no policies (see
// supabase/inventory_schema.sql). Called exclusively from app/api/inventory/*
// route handlers, never from client components.

// ── Inventory ──────────────────────────────────────────────────

export async function fetchProductsWithStock(): Promise<ProductWithStock[]> {
  const supabase = getSupabaseAdmin();

  const { data: products, error: pErr } = await supabase
    .from('inventory_products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });
  if (pErr) throw pErr;

  const { data: batches, error: bErr } = await supabase
    .from('inventory_batches')
    .select('*')
    .eq('is_active', true)
    .order('purchase_date', { ascending: true });
  if (bErr) throw bErr;

  return (products as Product[]).map((product) => {
    const productBatches = (batches as Batch[]).filter((b) => b.product_id === product.id);
    const total_remaining = productBatches.reduce((sum, b) => sum + b.quantity_remaining, 0);
    return {
      ...product,
      batches: productBatches,
      total_remaining,
      is_low_stock: total_remaining <= product.low_stock_threshold,
    };
  });
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
  const supabase = getSupabaseAdmin();

  // Reuse an existing active product (same name + category) if one exists,
  // otherwise create it — either way, a fresh batch is always added.
  const { data: existing, error: findErr } = await supabase
    .from('inventory_products')
    .select('*')
    .eq('name', input.name)
    .eq('category', input.category)
    .eq('is_active', true)
    .maybeSingle();
  if (findErr) throw findErr;

  let productId = existing?.id as string | undefined;

  if (!productId) {
    const { data: created, error: createErr } = await supabase
      .from('inventory_products')
      .insert({
        name: input.name,
        category: input.category,
        image_url: input.imageUrl,
        low_stock_threshold: input.lowStockThreshold,
      })
      .select()
      .single();
    if (createErr) throw createErr;
    productId = created.id;
  } else if (input.imageUrl) {
    // Keep the image current if a new one was uploaded on a repeat batch.
    await supabase.from('inventory_products').update({ image_url: input.imageUrl }).eq('id', productId);
  }

  const { error: batchErr } = await supabase.from('inventory_batches').insert({
    product_id: productId,
    purchase_date: input.purchaseDate,
    original_price: input.originalPrice,
    selling_price: input.sellingPrice,
    quantity_bought: input.quantityBought,
    quantity_remaining: input.quantityBought,
  });
  if (batchErr) throw batchErr;

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
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from('inventory_batches').insert({
    product_id: input.productId,
    purchase_date: input.purchaseDate,
    original_price: input.originalPrice,
    selling_price: input.sellingPrice,
    quantity_bought: input.quantityBought,
    quantity_remaining: input.quantityBought,
  });
  if (error) throw error;
}

export async function updateProduct(
  productId: string,
  updates: Partial<Pick<Product, 'name' | 'category' | 'low_stock_threshold' | 'image_url'>>
) {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from('inventory_products').update(updates).eq('id', productId);
  if (error) throw error;
}

export async function updateBatch(
  batchId: string,
  updates: Partial<Pick<Batch, 'original_price' | 'selling_price' | 'quantity_remaining'>>
) {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from('inventory_batches').update(updates).eq('id', batchId);
  if (error) throw error;
}

export async function deleteProduct(productId: string) {
  // Soft delete — keeps historical invoice references intact.
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from('inventory_products').update({ is_active: false }).eq('id', productId);
  if (error) throw error;
}

export async function deleteBatch(batchId: string) {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from('inventory_batches').update({ is_active: false }).eq('id', batchId);
  if (error) throw error;
}

// ── Invoices ───────────────────────────────────────────────────

export async function createInvoice(input: {
  customerName: string;
  paymentMode: PaymentMode;
  paymentStatus: 'Paid' | 'Pending';
  lineItems: DraftLineItem[];
}): Promise<Invoice> {
  const supabase = getSupabaseAdmin();

  const lineItemsPayload = input.lineItems.map((item) => ({
    product: item.product,
    quantity: item.quantity,
    unitPrice: item.isDiscounted ? (item.discountedPrice as number) : currentSellingPrice(item.product),
    isDiscounted: item.isDiscounted,
  }));

  const subtotal = lineItemsPayload.reduce((sum, li) => sum + li.unitPrice * li.quantity, 0);

  // 1. Create the invoice header (invoice_number is generated by the DB).
  const { data: invoice, error: invErr } = await supabase
    .from('inventory_invoices')
    .insert({
      customer_name: input.customerName,
      payment_mode: input.paymentMode,
      payment_status: input.paymentStatus,
      subtotal,
      grand_total: subtotal,
    })
    .select()
    .single();
  if (invErr) throw invErr;

  // 2. For each line item: deduct stock FIFO across batches, then write
  //    one invoice_line_items row per batch actually touched (a sale can
  //    span more than one batch if the oldest batch runs out mid-sale).
  for (const item of lineItemsPayload) {
    const { data: deductions, error: deductErr } = await supabase.rpc('deduct_inventory_stock_fifo', {
      p_product_id: item.product.id,
      p_quantity: item.quantity,
    });
    if (deductErr) throw deductErr;

    for (const d of deductions as { batch_id: string; deducted: number }[]) {
      const { error: lineErr } = await supabase.from('inventory_invoice_line_items').insert({
        invoice_id: invoice.id,
        product_id: item.product.id,
        product_name_snapshot: item.product.name,
        category_snapshot: item.product.category,
        batch_id: d.batch_id,
        quantity: d.deducted,
        unit_price: item.unitPrice,
        is_discounted: item.isDiscounted,
        line_total: item.unitPrice * d.deducted,
      });
      if (lineErr) throw lineErr;
    }
  }

  return invoice as Invoice;
}

export async function fetchInvoices(): Promise<Invoice[]> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('inventory_invoices')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data as Invoice[];
}

export async function fetchInvoiceWithLineItems(invoiceId: string): Promise<InvoiceWithLineItems> {
  const supabase = getSupabaseAdmin();

  const { data: invoice, error: invErr } = await supabase
    .from('inventory_invoices')
    .select('*')
    .eq('id', invoiceId)
    .single();
  if (invErr) throw invErr;

  const { data: lineItems, error: liErr } = await supabase
    .from('inventory_invoice_line_items')
    .select('*')
    .eq('invoice_id', invoiceId);
  if (liErr) throw liErr;

  return { ...invoice, line_items: lineItems } as InvoiceWithLineItems;
}

// Deleting restores each sold unit to the batch it came from — see
// delete_inventory_invoice in supabase/inventory_schema.sql. Both the restore
// and the delete happen inside that function so they can't half-apply.
export async function deleteInvoice(invoiceId: string) {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.rpc('delete_inventory_invoice', { p_invoice_id: invoiceId });
  if (error) throw error;
}

export async function updatePaymentStatus(invoiceId: string, status: 'Paid' | 'Pending') {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from('inventory_invoices').update({ payment_status: status }).eq('id', invoiceId);
  if (error) throw error;
}

// ── Dashboard ──────────────────────────────────────────────────

export async function fetchDashboardStats() {
  const products = await fetchProductsWithStock();
  const invoices = await fetchInvoices();

  const stockValueAtCost = products.reduce(
    (sum, p) => sum + p.batches.reduce((s, b) => s + b.quantity_remaining * b.original_price, 0),
    0
  );
  const stockValueAtSelling = products.reduce(
    (sum, p) => sum + p.batches.reduce((s, b) => s + b.quantity_remaining * b.selling_price, 0),
    0
  );
  const totalRevenue = invoices.reduce((sum, i) => sum + Number(i.grand_total), 0);
  const pendingInvoices = invoices.filter((i) => i.payment_status === 'Pending');
  const pendingAmount = pendingInvoices.reduce((sum, i) => sum + Number(i.grand_total), 0);
  const lowStockProducts = products.filter((p) => p.is_low_stock);

  return {
    stockValueAtCost,
    stockValueAtSelling,
    totalRevenue,
    invoiceCount: invoices.length,
    pendingInvoices,
    pendingAmount,
    lowStockProducts,
  };
}
