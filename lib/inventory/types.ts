export type Category = "Necklace" | "Bracelet" | "Earring" | "Ring";

export interface Product {
  id: string;
  name: string;
  category: Category;
  image_url: string | null;
  low_stock_threshold: number;
  is_active: boolean;
  created_at: string;
}

export interface Batch {
  id: string;
  product_id: string;
  purchase_date: string;
  original_price: number;
  selling_price: number;
  quantity_bought: number;
  quantity_remaining: number;
  is_active: boolean;
  created_at: string;
}

// Product joined with its batches, plus derived stock figures — the shape
// most inventory screens actually want to render.
export interface ProductWithStock extends Product {
  batches: Batch[];
  total_remaining: number;
  is_low_stock: boolean;
}

export type PaymentMode = "UPI" | "Cash" | "Card" | "Bank Transfer" | "Other";
export type PaymentStatus = "Paid" | "Pending";

export interface Invoice {
  id: string;
  invoice_number: string;
  customer_name: string;
  payment_mode: PaymentMode;
  payment_status: PaymentStatus;
  subtotal: number;
  grand_total: number;
  created_at: string;
}

export interface InvoiceLineItem {
  id: string;
  invoice_id: string;
  product_id: string;
  product_name_snapshot: string;
  category_snapshot: Category;
  batch_id: string;
  quantity: number;
  unit_price: number;
  is_discounted: boolean;
  line_total: number;
}

export interface InvoiceWithLineItems extends Invoice {
  line_items: InvoiceLineItem[];
}

// Cart-building shape used on the "new invoice" screen, before persistence.
export interface DraftLineItem {
  product: ProductWithStock;
  quantity: number;
  isDiscounted: boolean;
  discountedPrice: number | null;
}
