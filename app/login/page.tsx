'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store';

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(30);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) router.replace('/account');
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (step !== 'otp' || timer === 0) return;
    const t = setTimeout(() => setTimer((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [step, timer]);

  function sendOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError('Enter a valid 10-digit phone number');
      return;
    }
    setError('');
    setStep('otp');
    setTimer(30);
  }

  function verifyOtp(e: React.FormEvent) {
    e.preventDefault();
    if (otp.length !== 6) {
      setError('Enter the 6-digit OTP');
      return;
    }
    login(phone);
    router.push('/account');
  }

  return (
    <div className="section section-y flex justify-center">
      <div className="w-full max-w-sm">
        <h1 className="mb-2 text-center text-h1">Login</h1>
        <p className="mb-8 text-center text-body text-charcoal-muted">
          Login with your phone number to track orders and save your details.
        </p>

        {step === 'phone' ? (
          <form onSubmit={sendOtp} className="space-y-4">
            <div>
              <label className="mb-1 block text-body text-charcoal">Phone Number</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="10-digit mobile number"
                className="input-field"
              />
            </div>
            {error && <p className="text-caption text-error">{error}</p>}
            <button type="submit" className="btn-primary w-full">Send OTP</button>
          </form>
        ) : (
          <form onSubmit={verifyOtp} className="space-y-4">
            <p className="text-caption text-charcoal-muted">OTP sent to +91 {phone}. (Demo: enter any 6 digits)</p>
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="6-digit OTP"
              className="input-field tracking-[0.5em]"
            />
            {error && <p className="text-caption text-error">{error}</p>}
            <button type="submit" className="btn-primary w-full">Verify &amp; Continue</button>
            <button
              type="button"
              disabled={timer > 0}
              onClick={() => setTimer(30)}
              className="btn-text mx-auto block text-caption disabled:cursor-not-allowed disabled:opacity-50"
            >
              {timer > 0 ? `Resend OTP in ${timer}s` : 'Resend OTP'}
            </button>
          </form>
        )}

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-caption text-charcoal-muted">or</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <button type="button" className="btn-secondary w-full">Continue with Google</button>

        <p className="mt-6 text-center text-caption text-charcoal-muted">
          Just browsing?{' '}
          <Link href="/shop" className="text-gold-primary hover:underline">Continue as guest</Link>
        </p>
      </div>
    </div>
  );
}
