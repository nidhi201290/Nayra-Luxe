"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toPng } from "html-to-image";
import { fetchProductsWithStock, createInvoice, currentSellingPrice } from "@/lib/inventory/api";
import { DraftLineItem, PaymentMode, ProductWithStock } from "@/lib/inventory/types";
import InvoiceReceipt from "@/components/inventory/InvoiceReceipt";
import FitToWidth from "@/components/inventory/FitToWidth";

const currency = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(n);

const paymentModes: PaymentMode[] = ["UPI", "Cash", "Card", "Bank Transfer", "Other"];

export default function NewInvoicePage() {
  const router = useRouter();
  const receiptRef = useRef<HTMLDivElement>(null);

  const [products, setProducts] = useState<ProductWithStock[]>([]);
  const [lineItems, setLineItems] = useState<DraftLineItem[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [paymentMode, setPaymentMode] = useState<PaymentMode>("UPI");
  const [paymentStatus, setPaymentStatus] = useState<"Paid" | "Pending">("Pending");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdInvoice, setCreatedInvoice] = useState<{ invoiceNumber: string; date: string } | null>(null);

  useEffect(() => {
    fetchProductsWithStock().then((p) => setProducts(p.filter((x) => x.total_remaining > 0)));
  }, []);

  function addLineItem(productId: string) {
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    if (lineItems.some((li) => li.product.id === productId)) return;
    setLineItems([
      ...lineItems,
      { product, quantity: 1, isDiscounted: false, discountedPrice: null },
    ]);
  }

  function updateLineItem(index: number, updates: Partial<DraftLineItem>) {
    setLineItems((items) => items.map((li, i) => (i === index ? { ...li, ...updates } : li)));
  }

  function removeLineItem(index: number) {
    setLineItems((items) => items.filter((_, i) => i !== index));
  }

  const grandTotal = lineItems.reduce((sum, item) => {
    const price = item.isDiscounted ? item.discountedPrice ?? 0 : currentSellingPrice(item.product);
    return sum + price * item.quantity;
  }, 0);

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);
    try {
      if (!customerName.trim()) throw new Error("Enter a customer name.");
      if (lineItems.length === 0) throw new Error("Add at least one product.");
      for (const item of lineItems) {
        if (item.quantity < 1 || item.quantity > item.product.total_remaining) {
          throw new Error(`${item.product.name}: quantity must be between 1 and ${item.product.total_remaining}.`);
        }
        if (item.isDiscounted && (item.discountedPrice === null || item.discountedPrice < 0)) {
          throw new Error(`${item.product.name}: enter a valid discounted price.`);
        }
      }

      const invoice = await createInvoice({
        customerName: customerName.trim(),
        paymentMode,
        paymentStatus,
        lineItems,
      });

      setCreatedInvoice({
        invoiceNumber: invoice.invoice_number,
        date: new Date(invoice.created_at).toLocaleString("en-IN"),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDownload() {
    if (!receiptRef.current) return;
    const dataUrl = await toPng(receiptRef.current, { pixelRatio: 2 });
    const link = document.createElement("a");
    link.download = `${createdInvoice?.invoiceNumber ?? "invoice"}.png`;
    link.href = dataUrl;
    link.click();
  }

  if (createdInvoice) {
    return (
      <div className="max-w-lg mx-auto space-y-6">
        <div className="text-center">
          <h1 className="font-display text-2xl text-ink">Invoice created</h1>
          <p className="text-charcoal-muted mt-1">{createdInvoice.invoiceNumber}</p>
        </div>
        <FitToWidth width={480}>
          <InvoiceReceipt
            ref={receiptRef}
            invoiceNumber={createdInvoice.invoiceNumber}
            customerName={customerName}
            date={createdInvoice.date}
            paymentMode={paymentMode}
            paymentStatus={paymentStatus}
            lineItems={lineItems}
          />
        </FitToWidth>
        <div className="flex flex-col sm:flex-row gap-3 sm:justify-center">
          <button onClick={handleDownload} className="btn-primary">
            Download as Image
          </button>
          <button onClick={() => router.push("/invoices")} className="btn-secondary">
            View All Invoices
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-3xl text-ink">New Invoice</h1>
        <p className="text-charcoal-muted mt-1">Add products, apply discounts if needed, and record payment.</p>
      </div>

      <div className="card p-6 space-y-5">
        <div>
          <label className="label-text">Customer name</label>
          <input
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="input-field"
            placeholder="e.g. Ananya Sharma"
          />
        </div>

        <div>
          <label className="label-text">Add a product</label>
          <select
            onChange={(e) => {
              if (e.target.value) addLineItem(e.target.value);
              e.target.value = "";
            }}
            className="input-field"
            defaultValue=""
          >
            <option value="" disabled>
              Select a product…
            </option>
            {products.map((p) => (
              <option key={p.id} value={p.id} disabled={lineItems.some((li) => li.product.id === p.id)}>
                {p.name} ({p.category}) — {p.total_remaining} in stock
              </option>
            ))}
          </select>
        </div>

        {lineItems.length > 0 && (
          <div className="space-y-4">
            {lineItems.map((item, i) => (
              <div key={item.product.id} className="border border-border rounded-md p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-ink">{item.product.name}</p>
                  <button onClick={() => removeLineItem(i)} className="text-error text-sm hover:underline">
                    Remove
                  </button>
                </div>

                <div className="flex items-center gap-4 flex-wrap">
                  <div>
                    <label className="label-text">Quantity</label>
                    <input
                      type="number"
                      min={1}
                      max={item.product.total_remaining}
                      value={item.quantity}
                      onChange={(e) =>
                        updateLineItem(i, { quantity: parseInt(e.target.value || "1", 10) })
                      }
                      className="input-field w-24"
                    />
                  </div>
                  <div className="text-sm text-charcoal-muted">
                    Selling price: {currency(currentSellingPrice(item.product))}
                  </div>
                </div>

                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={item.isDiscounted}
                    onChange={(e) =>
                      updateLineItem(i, {
                        isDiscounted: e.target.checked,
                        discountedPrice: e.target.checked ? currentSellingPrice(item.product) : null,
                      })
                    }
                  />
                  Sell at a discounted price?
                </label>

                {item.isDiscounted && (
                  <div>
                    <label className="label-text">Discounted price per unit (₹)</label>
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      value={item.discountedPrice ?? ""}
                      onChange={(e) =>
                        updateLineItem(i, { discountedPrice: parseFloat(e.target.value || "0") })
                      }
                      className="input-field w-32"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label-text">Payment mode</label>
            <select
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value as PaymentMode)}
              className="input-field"
            >
              {paymentModes.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label-text">Payment status</label>
            <select
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value as "Paid" | "Pending")}
              className="input-field"
            >
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border">
          <span className="text-charcoal-muted">Grand total</span>
          <span className="font-display text-2xl text-ink">{currency(grandTotal)}</span>
        </div>

        {error && <p className="text-error text-sm">{error}</p>}

        <button onClick={handleSubmit} disabled={submitting} className="btn-primary w-full">
          {submitting ? "Creating…" : "Create Invoice"}
        </button>
      </div>
    </div>
  );
}
