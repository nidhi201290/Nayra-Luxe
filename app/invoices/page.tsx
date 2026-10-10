"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { deleteInvoice, fetchInvoices, updatePaymentStatus } from "@/lib/inventory/api";
import { Invoice } from "@/lib/inventory/types";
import { Badge } from "@/components/inventory/Badge";

const currency = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(n);

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setInvoices(await fetchInvoices());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function togglePaymentStatus(inv: Invoice) {
    const next = inv.payment_status === "Paid" ? "Pending" : "Paid";
    await updatePaymentStatus(inv.id, next);
    load();
  }

  async function handleDelete(inv: Invoice) {
    // Spell out the stock side effect — it's the part that isn't obvious,
    // and it's not reversible once confirmed.
    const confirmed = confirm(
      `Delete invoice ${inv.invoice_number} for ${inv.customer_name}?\n\n` +
        `The items on it will be added back to stock. This can't be undone.`
    );
    if (!confirmed) return;

    setDeletingId(inv.id);
    setError(null);
    try {
      await deleteInvoice(inv.id);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't delete the invoice.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl text-ink">Invoices</h1>
          <p className="text-charcoal-muted mt-1">All invoices generated, newest first.</p>
        </div>
        <Link href="/invoices/new" className="btn-primary whitespace-nowrap">
          + New Invoice
        </Link>
      </div>

      {error && (
        <div className="rounded-md border border-error/30 bg-error/5 p-3 text-sm text-error">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-charcoal-muted">Loading…</p>
      ) : invoices.length === 0 ? (
        <div className="card p-10 text-center text-charcoal-muted">
          No invoices yet.
        </div>
      ) : (
        <>
        {/* Phones: one card per invoice */}
        <div className="md:hidden space-y-3">
          {invoices.map((inv) => (
            <div key={inv.id} className="card p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium text-ink break-all">{inv.invoice_number}</p>
                  <p className="text-sm text-charcoal mt-0.5 break-words">{inv.customer_name}</p>
                </div>
                <p className="font-display text-xl text-ink whitespace-nowrap">
                  {currency(Number(inv.grand_total))}
                </p>
              </div>
              <div className="mt-3 flex items-center justify-between gap-3 text-sm">
                <span className="text-charcoal-muted">
                  {new Date(inv.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  {" · "}
                  {inv.payment_mode}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => togglePaymentStatus(inv)}
                    aria-label={`Mark as ${inv.payment_status === "Paid" ? "pending" : "paid"}`}
                    className="-m-2 p-2"
                  >
                    <Badge tone={inv.payment_status === "Paid" ? "success" : "warning"}>
                      {inv.payment_status}
                    </Badge>
                  </button>
                  <button
                    onClick={() => handleDelete(inv)}
                    disabled={deletingId === inv.id}
                    className="px-2 py-1 text-error hover:underline disabled:opacity-50"
                  >
                    {deletingId === inv.id ? "Deleting…" : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tablets and up: table */}
        <div className="hidden md:block card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-charcoal-muted bg-ivory/60">
                <th className="font-normal px-4 py-3">Invoice #</th>
                <th className="font-normal px-4 py-3">Customer</th>
                <th className="font-normal px-4 py-3">Date</th>
                <th className="font-normal px-4 py-3">Payment</th>
                <th className="font-normal px-4 py-3">Status</th>
                <th className="font-normal px-4 py-3 text-right">Total</th>
                <th className="font-normal px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id} className="border-t border-border">
                  <td className="px-4 py-3 font-medium text-ink">{inv.invoice_number}</td>
                  <td className="px-4 py-3">{inv.customer_name}</td>
                  <td className="px-4 py-3 text-charcoal-muted">
                    {new Date(inv.created_at).toLocaleString("en-IN")}
                  </td>
                  <td className="px-4 py-3">{inv.payment_mode}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => togglePaymentStatus(inv)}>
                      <Badge tone={inv.payment_status === "Paid" ? "success" : "warning"}>
                        {inv.payment_status}
                      </Badge>
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right font-medium">
                    {currency(Number(inv.grand_total))}
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button
                      onClick={() => handleDelete(inv)}
                      disabled={deletingId === inv.id}
                      className="text-error hover:underline disabled:opacity-50"
                    >
                      {deletingId === inv.id ? "Deleting…" : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </>
      )}
    </div>
  );
}
