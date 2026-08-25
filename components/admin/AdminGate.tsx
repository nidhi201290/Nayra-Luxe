'use client';

import { useState } from 'react';
import { useAdminAuthStore } from '@/lib/admin-store';
import Logo from '../Logo';

export default function AdminGate({ children }: { children: React.ReactNode }) {
  const isAdmin = useAdminAuthStore((s) => s.isAdmin);
  const login = useAdminAuthStore((s) => s.login);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (isAdmin) return <>{children}</>;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!login(password)) {
      setError('Incorrect password');
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ivory">
      <div className="w-full max-w-sm rounded-md bg-white p-8 shadow-md">
        <Logo className="mx-auto mb-6" />
        <h1 className="mb-1 text-center font-body text-h4">Admin Panel</h1>
        <p className="mb-6 text-center text-caption text-charcoal-muted">Authorized access only</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Admin password"
            className="input-field"
          />
          {error && <p className="text-caption text-error">{error}</p>}
          <button type="submit" className="btn-primary w-full">Login</button>
        </form>
      </div>
    </div>
  );
}
