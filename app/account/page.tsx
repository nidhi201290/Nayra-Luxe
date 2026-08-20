'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2 } from 'lucide-react';
import { useAddressStore, useAuthStore } from '@/lib/store';
import { Address } from '@/lib/types';
import AccountNav from '@/components/account/AccountNav';

export default function AccountPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const phone = useAuthStore((s) => s.phone);
  const name = useAuthStore((s) => s.name);
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const { addresses, addAddress, removeAddress } = useAddressStore();

  const [displayName, setDisplayName] = useState(name || '');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [form, setForm] = useState({ fullName: '', phone: '', line1: '', city: '', state: '', pincode: '' });

  useEffect(() => {
    if (!isAuthenticated) router.replace('/login');
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  function saveAddress(e: React.FormEvent) {
    e.preventDefault();
    const address: Address = {
      id: `addr-${Date.now()}`,
      ...form,
      isDefault: addresses.length === 0,
    };
    addAddress(address);
    setForm({ fullName: '', phone: '', line1: '', city: '', state: '', pincode: '' });
    setShowAddressForm(false);
  }

  return (
    <div className="section section-y flex flex-col gap-8 md:flex-row">
      <AccountNav />
      <div className="flex-1 space-y-10">
        <section>
          <h1 className="mb-4 text-h2">My Profile</h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              updateProfile({ name: displayName });
            }}
            className="max-w-sm space-y-4"
          >
            <div>
              <label className="mb-1 block text-body text-charcoal">Name</label>
              <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="input-field" placeholder="Your name" />
            </div>
            <div>
              <label className="mb-1 block text-body text-charcoal">Phone</label>
              <input value={phone || ''} disabled className="input-field bg-ivory" />
            </div>
            <button type="submit" className="btn-primary">Save Changes</button>
          </form>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-h2">Saved Addresses</h2>
            <button onClick={() => setShowAddressForm((v) => !v)} className="btn-text flex items-center gap-1">
              <Plus className="h-4 w-4" /> Add Address
            </button>
          </div>

          {showAddressForm && (
            <form onSubmit={saveAddress} className="mb-6 grid grid-cols-1 gap-4 rounded-md border border-border p-4 md:grid-cols-2">
              <input required placeholder="Full name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className="input-field md:col-span-2" />
              <input required placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-field" />
              <input required placeholder="Pincode" value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} className="input-field" />
              <input required placeholder="Address Line 1" value={form.line1} onChange={(e) => setForm({ ...form, line1: e.target.value })} className="input-field md:col-span-2" />
              <input required placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="input-field" />
              <input required placeholder="State" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} className="input-field" />
              <button type="submit" className="btn-primary md:col-span-2">Save Address</button>
            </form>
          )}

          {addresses.length === 0 ? (
            <p className="text-body text-charcoal-muted">No saved addresses yet.</p>
          ) : (
            <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {addresses.map((a) => (
                <li key={a.id} className="rounded-md border border-border p-4">
                  <div className="mb-2 flex items-start justify-between">
                    <p className="font-medium text-charcoal">{a.fullName} {a.isDefault && <span className="pill ml-2 bg-blush text-caption text-gold-primary">Default</span>}</p>
                    <button aria-label="Remove address" onClick={() => removeAddress(a.id)}>
                      <Trash2 className="h-4 w-4 text-charcoal-muted" />
                    </button>
                  </div>
                  <p className="text-body text-charcoal-muted">
                    {a.line1}, {a.city}, {a.state} - {a.pincode}<br />
                    Phone: {a.phone}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
