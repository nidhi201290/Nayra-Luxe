import { createHmac, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// Server-side admin auth for the inventory/invoice tool.
//
// The old gate checked the password in the browser, which meant the password
// shipped in the client bundle and the /api/inventory/* routes — which use the
// service-role client and bypass RLS — were reachable by anyone. Auth now lives
// here: the password is only ever compared on the server, and the browser gets
// an httpOnly cookie holding an HMAC it cannot forge.

export const ADMIN_COOKIE = 'nayra_admin_session';

const SESSION_TTL_SECONDS = 60 * 60 * 12; // 12 hours

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD;
  if (!secret) {
    throw new Error('ADMIN_PASSWORD (or ADMIN_SESSION_SECRET) is not configured on the server.');
  }
  return secret;
}

function sign(expiresAt: number): string {
  return createHmac('sha256', getSecret()).update(String(expiresAt)).digest('hex');
}

/** Constant-time string compare that never throws on length mismatch. */
function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export function verifyPassword(candidate: unknown): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || typeof candidate !== 'string') return false;
  return safeEqual(candidate, expected);
}

export function createSessionToken(): { token: string; maxAge: number } {
  const expiresAt = Date.now() + SESSION_TTL_SECONDS * 1000;
  return { token: `${expiresAt}.${sign(expiresAt)}`, maxAge: SESSION_TTL_SECONDS };
}

export function isValidSessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const [expiresRaw, signature] = token.split('.');
  const expiresAt = Number(expiresRaw);
  if (!expiresRaw || !signature || !Number.isFinite(expiresAt)) return false;
  if (Date.now() > expiresAt) return false;
  return safeEqual(signature, sign(expiresAt));
}

export function isAuthenticated(): boolean {
  return isValidSessionToken(cookies().get(ADMIN_COOKIE)?.value);
}

/**
 * Guard for admin-only route handlers. Returns a 401 response to return early
 * when the caller isn't authenticated, or null when the request may proceed.
 */
export function requireAdmin(): NextResponse | null {
  if (isAuthenticated()) return null;
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
