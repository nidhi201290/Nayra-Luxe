'use client';

import { useState } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import { useAdminCouponStore } from '@/lib/admin-store';
import { Coupon } from '@/lib/types';

export default function AdminCouponsPage() {
  const { coupons, addCoupon, deleteCoupon } = useAdminCouponStore();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    code: '',
    discountType: 'flat' as Coupon['discountType'],
    discountValue: '',
    minOrderValue: '',
    expiryDate: '',
    usageLimit: '100',
  });

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    addCoupon({
      code: form.code.toUpperCase(),
      discountType: form.discountType,
      discountValue: Number(form.discountValue),
      minOrderValue: Number(form.minOrderValue) || 0,
      expiryDate: form.expiryDate,
      usageLimit: Number(form.usageLimit),
      usedCount: 0,
    });
    setForm({ code: '', discountType: 'flat', discountValue: '', minOrderValue: '', expiryDate: '', usageLimit: '100' });
    setShowForm(false);
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-h1">Coupons</h1>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
          <Plus className="h-4 w-4" /> New Coupon
        </button>
      </div>

      <div className="overflow-x-auto rounded-md border border-border bg-white">
        <table className="w-full text-left text-body">
          <thead className="border-b border-border bg-ivory text-caption uppercase text-charcoal-muted">
            <tr>
              <th className="p-3">Code</th>
              <th className="p-3">Discount</th>
              <th className="p-3">Min Order</th>
              <th className="p-3">Expiry</th>
              <th className="p-3">Usage</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((c) => (
              <tr key={c.code} className="border-b border-border last:border-none">
                <td className="p-3 font-semibold text-charcoal">{c.code}</td>
                <td className="p-3 text-charcoal">{c.discountType === 'flat' ? `₹${c.discountValue}` : `${c.discountValue}%`}</td>
                <td className="p-3 text-charcoal-muted">₹{c.minOrderValue}</td>
                <td className="p-3 text-charcoal-muted">{c.expiryDate}</td>
                <td className="p-3 text-charcoal-muted">{c.usedCount} / {c.usageLimit}</td>
                <td className="p-3 text-right">
                  <button aria-label="Delete coupon" onClick={() => deleteCoupon(c.code)}>
                    <Trash2 className="h-4 w-4 text-charcoal-muted hover:text-error" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/40 p-4">
          <div className="w-full max-w-md rounded-md bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-body text-h4">New Coupon</h2>
              <button onClick={() => setShowForm(false)} aria-label="Close"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleAdd} className="space-y-4">
              <input required placeholder="Coupon code" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} className="input-field" />
              <div className="grid grid-cols-2 gap-3">
                <select value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value as Coupon['discountType'] })} className="input-field">
                  <option value="flat">Flat (₹)</option>
                  <option value="percent">Percent (%)</option>
                </select>
                <input required type="number" placeholder="Value" value={form.discountValue} onChange={(e) => setForm({ ...form, discountValue: e.target.value })} className="input-field" />
              </div>
              <input type="number" placeholder="Minimum order value" value={form.minOrderValue} onChange={(e) => setForm({ ...form, minOrderValue: e.target.value })} className="input-field" />
              <input type="date" value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} className="input-field" />
              <input type="number" placeholder="Usage limit" value={form.usageLimit} onChange={(e) => setForm({ ...form, usageLimit: e.target.value })} className="input-field" />
              <button type="submit" className="btn-primary w-full">Save Coupon</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
