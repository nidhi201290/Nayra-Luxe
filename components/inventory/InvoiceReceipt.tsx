import { forwardRef } from "react";
import { DraftLineItem } from "@/lib/inventory/types";
import { currentSellingPrice } from "@/lib/inventory/batches";

const currency = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(n);

interface Props {
  invoiceNumber: string;
  customerName: string;
  date: string;
  paymentMode: string;
  paymentStatus: string;
  lineItems: DraftLineItem[];
}

const InvoiceReceipt = forwardRef<HTMLDivElement, Props>(function InvoiceReceipt(
  { invoiceNumber, customerName, date, paymentMode, paymentStatus, lineItems },
  ref
) {
  const grandTotal = lineItems.reduce((sum, item) => {
    const price = item.isDiscounted ? item.discountedPrice ?? 0 : currentSellingPrice(item.product);
    return sum + price * item.quantity;
  }, 0);

  return (
    <div
      ref={ref}
      className="w-[480px] bg-ivory p-8 font-body text-charcoal"
      style={{ border: "1px solid #E7DFD1" }}
    >
      <div className="flex justify-center mb-6">
        {/* Plain <img> (not next/image) so html-to-image can embed it in the downloaded PNG */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo.png"
          alt="Nayra Luxe"
          style={{ height: 80, width: "auto" }}
        />
      </div>

      <div className="flex justify-between text-sm mb-6">
        <div>
          <p className="text-charcoal-muted">Billed to</p>
          <p className="font-medium text-ink">{customerName}</p>
        </div>
        <div className="text-right">
          <p className="text-charcoal-muted">Invoice</p>
          <p className="font-medium text-ink">{invoiceNumber}</p>
          <p className="text-charcoal-muted text-xs mt-1">{date}</p>
        </div>
      </div>

      <table className="w-full text-sm mb-4">
        <thead>
          <tr className="text-left text-charcoal-muted border-b border-border">
            <th className="font-normal pb-2">Item</th>
            <th className="font-normal pb-2 text-center">Qty</th>
            <th className="font-normal pb-2 text-right">Price</th>
            <th className="font-normal pb-2 text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {lineItems.map((item, i) => {
            const price = item.isDiscounted
              ? item.discountedPrice ?? 0
              : currentSellingPrice(item.product);
            return (
              <tr key={i} className="border-b border-border/60">
                <td className="py-2">
                  {item.product.name}
                  {item.isDiscounted && (
                    <span className="text-gold text-xs ml-1">(discounted)</span>
                  )}
                </td>
                <td className="py-2 text-center">{item.quantity}</td>
                <td className="py-2 text-right">{currency(price)}</td>
                <td className="py-2 text-right">{currency(price * item.quantity)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="flex justify-end">
        <div className="w-40 space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-charcoal-muted">Total</span>
            <span className="font-display text-lg text-ink">{currency(grandTotal)}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-border flex justify-between text-xs text-charcoal-muted">
        <span>{paymentMode}</span>
        <span>{paymentStatus}</span>
      </div>
    </div>
  );
});

export default InvoiceReceipt;
