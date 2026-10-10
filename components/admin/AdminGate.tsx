'use client';

import { useEffect, useState } from 'react';
import { useAdminAuthStore } from '@/lib/admin-store';
import Logo from '../Logo';

export default function AdminGate({ children }: { children: React.ReactNode }) {
  const isAdmin = useAdminAuthStore((s) => s.isAdmin);
  const isCheckingSession = useAdminAuthStore((s) => s.isCheckingSession);
  const login = useAdminAuthStore((s) => s.login);
  const checkSession = useAdminAuthStore((s) => s.checkSession);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Restore the session from the httpOnly cookie on load.
  useEffect(() => {
    checkSession();
  }, [checkSession]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    const ok = await login(password);
    if (!ok) setError('Incorrect password');
    setPassword('');
    setSubmitting(false);
  }

  if (isCheckingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ivory">
        <p className="text-caption text-charcoal-muted">Checking session…</p>
      </div>
    );
  }

  if (isAdmin) return <>{children}</>;

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
          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? 'Signing in…' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
