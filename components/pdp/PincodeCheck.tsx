'use client';

import { useState } from 'react';
import { MapPin, CheckCircle2, XCircle } from 'lucide-react';

export default function PincodeCheck() {
  const [pincode, setPincode] = useState('');
  const [status, setStatus] = useState<'idle' | 'checking' | 'available' | 'unavailable'>('idle');

  function checkPincode(e: React.FormEvent) {
    e.preventDefault();
    if (pincode.length !== 6) return;
    setStatus('checking');
    setTimeout(() => {
      setStatus(/^[1-9][0-9]{5}$/.test(pincode) ? 'available' : 'unavailable');
    }, 700);
  }

  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 5);

  return (
    <div className="rounded-md border border-border p-4">
      <form onSubmit={checkPincode} className="flex items-center gap-2">
        <MapPin className="h-4 w-4 flex-none text-charcoal-muted" />
        <input
          value={pincode}
          onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
          placeholder="Enter pincode"
          className="flex-1 bg-transparent text-body text-charcoal outline-none placeholder:text-charcoal-muted"
        />
        <button type="submit" className="btn-text text-caption">
          Check
        </button>
      </form>
      {status === 'checking' && <p className="mt-2 text-caption text-charcoal-muted">Checking availability…</p>}
      {status === 'available' && (
        <p className="mt-2 flex items-center gap-1 text-caption text-success">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Delivery available. Estimated by{' '}
          {deliveryDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}.
        </p>
      )}
      {status === 'unavailable' && (
        <p className="mt-2 flex items-center gap-1 text-caption text-error">
          <XCircle className="h-3.5 w-3.5" />
          Enter a valid 6-digit pincode.
        </p>
      )}
    </div>
  );
}
